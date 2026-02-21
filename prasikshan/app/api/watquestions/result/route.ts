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
    const { testName, score, timeTaken, dateTaken, responses } =
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
      testName,
      score,
      timeTaken,
      dateTaken,
      responses, // Array of {word, response} pairs
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
      message: "WAT test result saved successfully",
      data: testResult,
    });
  } catch (error) {
    console.error("Error saving WAT test result:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save WAT test result",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
