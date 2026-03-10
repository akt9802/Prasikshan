import connectDB from "@/lib/db";
import PpdtQuestion from "@/models/PpdtQuestion";
import { NextResponse } from "next/server";

// Global variables to maintain state across API calls
let currentId = 1;
const MAX_ID = 15; // Total PPDT questions available

export async function GET() {
  try {
    console.log("🔍 PPDT API: Starting fetch...");
    const conn = await connectDB();
    console.log("✅ PPDT API: Database connected");
    console.log(`📊 PPDT API: Fetching question with ID: ${currentId}`);

    // Fetch question by current ID
    const question = await PpdtQuestion.findOne({ _id: currentId });

    if (!question) {
      console.warn(`PPDT question with id ${currentId} not found`);
      return NextResponse.json(
        {
          success: false,
          error: `PPDT question with id ${currentId} not found`,
          data: null,
        },
        { status: 404 }
      );
    }

    // Prepare the response with fixed image URL
    const fixedQuestion = {
      ...question.toObject(),
      image: question.image, // Keep as-is (GitHub link or other URL)
    };

    // Prepare for next call - cycle through IDs 1-15
    currentId++;
    if (currentId > MAX_ID) {
      currentId = 1;
    }

    console.log(`✅ PPDT API: Successfully fetched question ${fixedQuestion._id}`);
    console.log(`📋 PPDT API: Next question ID will be: ${currentId}`);

    return NextResponse.json({
      success: true,
      data: fixedQuestion,
      nextQuestionId: currentId,
    });
  } catch (error) {
    console.error("❌ PPDT API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch PPDT question",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}