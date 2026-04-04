import connectDB from "@/lib/db";
import UserResult from "@/models/UserResult";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

    const token = authHeader.slice(7);

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

    const { topic, score, duration, topic_id } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Missing required field: topic" },
        { status: 400 }
      );
    }

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
      testName: "LECTURETTE",
      setName: topic_id?.toString(),
      topic,
      score: score || 0,
      duration: duration || 0,
      dateTaken: new Date(),
      createdAt: new Date(),
    };

    // Add to lecturette array
    userResult.lecturette.push(testData);
    await userResult.save();

    console.log(`✅ Lecturette Result saved in UserResult for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Lecturette test result saved successfully",
      data: testData,
    });
  } catch (error) {
    console.error("Error saving lecturette result:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error submitting result",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
