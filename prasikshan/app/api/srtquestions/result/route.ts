import connectDB from "@/lib/db";
import UserResult from "@/models/UserResult";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface SRTTestRequest {
  testName: string;
  score: number;
  timeTaken: number;
  dateTaken: string;
  responses?: {
    situation_id: number;
    response: string;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    // Get token from authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "No authorization token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify and decode JWT
    let userId: string;
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET not configured");
      }

      const decoded = jwt.verify(token, secret) as { userId: string };
      userId = decoded.userId;

      if (!userId) {
        return NextResponse.json(
          { success: false, error: "Invalid token payload" },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 403 }
      );
    }

    const body: SRTTestRequest = await request.json();
    const { testName, score, timeTaken, dateTaken, responses = [] } = body;

    // Connect to database
    await connectDB();

    // Find or create UserResult
    let userResult = await UserResult.findOne({ userId });
    
    if (!userResult) {
      userResult = new UserResult({
        userId,
        oir: [],
        ppdt: [],
        tat: [],
        wat: [],
        srt: [],
        lecturette: [],
        pi: [],
      });
    }

    // Create test result
    const testData = {
      testName: testName || "SRT",
      score,
      timeTaken,
      dateTaken: new Date(dateTaken),
      responses,
      createdAt: new Date(),
    };

    // Add to srt array
    userResult.srt.push(testData);
    await userResult.save();

    console.log(`✅ SRT Result saved in UserResult for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "SRT test result saved successfully",
      data: testData,
    });
  } catch (error) {
    console.error("❌ SRT Result Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save SRT test result",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
