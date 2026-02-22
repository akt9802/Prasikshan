import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔍 SRT API: Starting fetch...");
    const conn = await connectDB();
    console.log("✅ SRT API: Database connected");

    // Get the collection directly from the connection
    const db = conn.connection.db;
    const srtCollection = db.collection("SRT");
    
    // Count documents directly
    const totalCount = await srtCollection.countDocuments();
    console.log(`📊 SRT API: Total count from SRT collection: ${totalCount}`);

    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No SRT questions available. Please seed the database first by visiting /api/srtquestions/seed",
          data: [],
          count: 0,
        },
        { status: 424 }
      );
    }

    // Get 60 random SRT questions (or less if not enough in DB)
    const questions = await srtCollection
      .aggregate([{ $sample: { size: Math.min(60, totalCount) } }])
      .toArray();

    console.log(`✅ SRT API: Fetched ${questions.length} SRT questions`);

    return NextResponse.json({
      success: true,
      data: questions,
      count: questions.length,
    });
  } catch (error) {
    console.error("❌ SRT API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch SRT questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
