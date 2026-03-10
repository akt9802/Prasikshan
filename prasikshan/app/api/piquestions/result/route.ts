import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    // Verify JWT token
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
        userId: string;
      };
      userId = decoded.userId;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get request body
    const { questions, answers, timeTaken, dateTaken } =
      await request.json();

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Create test result object
    const testResult = {
      testName: "PI",
      timeTaken,
      dateTaken,
      questions,
      answers, // Array of user responses to PI questions
      createdAt: new Date(),
    };

    // Initialize testsTaken array if it doesn't exist
    if (!user.testsTaken) {
      (user as any).testsTaken = [];
    }

    // Add result to user's test history
    (user as any).testsTaken.push(testResult);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "PI test result saved successfully",
      data: testResult,
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
