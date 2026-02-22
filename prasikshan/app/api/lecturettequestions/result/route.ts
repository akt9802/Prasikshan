import connectDB from "@/lib/db";
import User from "@/models/User";
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

    const { topic, transcript, score, duration } = await request.json();

    if (!topic || !transcript) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (topic and transcript)" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Create test result
    const testResult = {
      testName: "LECTURETTE",
      topic,
      transcript,
      score: score || 0,
      duration: duration || 0,
      dateTaken: new Date(),
    };

    // Save to user's test history
    user.testsTaken.push(testResult);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Lecturette test result saved successfully",
      data: testResult,
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
