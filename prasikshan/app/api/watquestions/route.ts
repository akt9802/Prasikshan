import connectDB from "@/lib/db";
import WatQuestion from "@/models/WatQuestion";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔍 WAT API: Starting fetch...");
    const conn = await connectDB();
    console.log("✅ WAT API: Database connected");

    // Get the collection directly from the connection
    const db = conn.connection.db;
    const watCollection = db.collection("WAT");
    
    // Count documents directly
    const totalCount = await watCollection.countDocuments();
    console.log(`📊 WAT API: Total count from WAT collection: ${totalCount}`);

    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No WAT questions available. Please seed the database first by visiting /api/watquestions/seed",
          data: [],
          count: 0,
        },
        { status: 424 }
      );
    }

    // Get 60 random WAT questions (or less if not enough in DB)
    const questions = await watCollection
      .aggregate([{ $sample: { size: Math.min(60, totalCount) } }])
      .toArray();

    console.log(`✅ WAT API: Fetched ${questions.length} WAT questions`);

    return NextResponse.json({
      success: true,
      data: questions,
      count: questions.length,
    });
  } catch (error) {
    console.error("❌ WAT API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch WAT questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
