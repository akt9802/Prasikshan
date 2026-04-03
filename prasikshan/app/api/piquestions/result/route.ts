import connectDB from "@/lib/db";
import UserResult from "@/models/UserResult";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    // Verify JWT token
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "No authorization token provided" },
        { status: 401 }
      );
    }
    
    const token = authHeader.slice(7);

    let userId: string;
    try {
      const secret = process.env.JWT_SECRET || 'default_secret';
      const decoded = jwt.verify(token, secret) as {
        userId: string;
      };
      userId = decoded.userId;

      if (!userId) {
        return NextResponse.json(
          { success: false, error: "Invalid token payload" },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get request body
    const { testName, score, timeTaken, dateTaken } = await request.json();

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

    // Create test result object matching TAT/SRT
    const testData = {
      testName: testName || "PI",
      score,
      timeTaken,
      dateTaken,
      createdAt: new Date(),
    };

    // Add to pi array
    userResult.pi.push(testData);
    await userResult.save();

    return NextResponse.json({
      success: true,
      message: "PI test result saved successfully",
      data: testData,
    });
  } catch (error) {
    console.error("Error saving PI test result:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save PI test result",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
