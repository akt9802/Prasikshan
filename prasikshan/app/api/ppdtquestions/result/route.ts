import connectDB from "@/lib/db";
import UserResult from "@/models/UserResult";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    console.log("=== PPDT Result API Called ===");
    
    // Verify JWT token
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("No valid authorization header");
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
    } catch (error: any) {
      console.error("Token verification error:", error.name, error.message);
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get request body
    const body = await request.json();
    const { testName, score, timeTaken, dateTaken, responses } = body;

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

    // Create test result object
    const testData = {
      testName: testName || "PPDT",
      score,
      timeTaken,
      dateTaken,
      responses,
      createdAt: new Date(),
    };

    // Add to ppdt array
    userResult.ppdt.push(testData);
    await userResult.save();

    console.log("PPDT result saved successfully in UserResult for user", userId);

    return NextResponse.json({
      success: true,
      message: "PPDT test result saved successfully",
      data: testData,
    });
  } catch (error) {
    console.error("Error saving PPDT test result:", error);
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