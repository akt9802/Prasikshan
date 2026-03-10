import connectDB from "@/lib/db";
import PiQuestion from "@/models/PiQuestion";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔍 PI API: Starting fetch...");
    const conn = await connectDB();
    console.log("✅ PI API: Database connected");

    // Get the collection directly from the connection
    const db = conn.connection.db;
    const piCollection = db.collection("PI");
    
    // Count documents directly
    const totalCount = await piCollection.countDocuments();
    console.log(`📊 PI API: Total count from PI collection: ${totalCount}`);

    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No PI questions available. Please seed the database first.",
          data: [],
          count: 0,
        },
        { status: 424 }
      );
    }

    // Get all PI questions sorted by question_id
    const questions = await piCollection
      .find({})
      .sort({ question_id: 1 })
      .toArray();

    console.log(`✅ PI API: Fetched ${questions.length} PI questions`);

    return NextResponse.json({
      success: true,
      data: questions,
      count: questions.length,
    });
  } catch (error) {
    console.error("❌ PI API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch PI questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
