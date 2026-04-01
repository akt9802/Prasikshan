import connectDB from "@/lib/db";
import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    console.log("=== PPDT Result API Called ===");
    
    // Verify JWT token
    const authHeader = request.headers.get("authorization");
    console.log("Auth Header:", authHeader);
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("No valid authorization header");
      return NextResponse.json(
        { success: false, error: "No authorization token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    console.log("Token extracted");

    let userId: string;
    try {
      const secret = process.env.JWT_SECRET || 'default_secret';
      
      const decoded = jwt.verify(token, secret) as {
        userId: string;
      };
      userId = decoded.userId;
      console.log("User ID from token:", userId);
      
      if (!userId) {
        console.error("No userId in token payload");
        return NextResponse.json(
          { success: false, error: "Invalid token payload: no user id" },
          { status: 403 }
        );
      }
    } catch (error: any) {
      console.error("Token verification error:", error.name, error.message);
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 403 }
      );
    }

    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected");

    // Get request body
    const body = await request.json();
    const { testName, score, timeTaken, dateTaken, responses } = body;
    console.log("Request body:", { testName, score, timeTaken, dateTaken, responsesCount: responses?.length });

    // Find user
    console.log("Finding user with ID:", userId);
    const user = await User.findById(userId);
    console.log("User found:", user ? "Yes" : "No");
    
    if (!user) {
      console.error("User not found in database");
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
      responses,
      createdAt: new Date(),
    };

    console.log("Test result object created:", { testName, score });

    // Initialize testsTaken array if it doesn't exist
    if (!user.testsTaken) {
      console.log("Initializing testsTaken array");
      user.testsTaken = [];
    }

    console.log("Current testsTaken count:", user.testsTaken.length);

    // Add result to user's test history
    user.testsTaken.push(testResult);
    console.log("Result added to testsTaken, new count:", user.testsTaken.length);

    // Save user
    console.log("Saving user...");
    const savedUser = await user.save();
    console.log("User saved successfully");
    console.log("Saved testsTaken count:", savedUser.testsTaken?.length);

    return NextResponse.json({
      success: true,
      message: "PPDT test result saved successfully",
      data: testResult,
    });
  } catch (error) {
    console.error("Error saving PPDT test result:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "");
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save PPDT test result",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}