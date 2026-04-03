import connectDB from "@/lib/db";
import User from "@/models/User";
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
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get request body
    const body = await request.json();
    const { testName, score, timeTaken, dateTaken } = body;

    // Find user
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Create test result object - only storing score as requested
    const testResult = {
      testName: testName || "OIR",
      score,
      timeTaken,
      dateTaken,
      createdAt: new Date(),
    };

    // Initialize testsTaken array if it doesn't exist
    if (!user.testsTaken) {
      user.testsTaken = [];
    }

    // Add result to user's test history
    user.testsTaken.push(testResult);

    // Save user
    await user.save();

    return NextResponse.json({
      success: true,
      message: "OIR test result saved successfully",
      data: testResult,
    });
  } catch (error) {
    console.error("Error saving OIR test result:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save OIR test result",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
