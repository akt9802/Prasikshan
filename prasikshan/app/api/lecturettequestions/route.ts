import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const conn = await connectDB();
    const db = conn.connection.db;
    const lecturetteCollection = db.collection("lecturette");

    // Get total count
    const totalCount = await lecturetteCollection.countDocuments();
    
    if (totalCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No lecturette questions available. Please seed the database first.",
        },
        { status: 424 }
      );
    }

    // Get single random question
    const questions = await lecturetteCollection
      .aggregate([{ $sample: { size: 1 } }])
      .toArray();

    return NextResponse.json({
      success: true,
      data: questions[0],
    });
  } catch (error) {
    console.error("Error fetching lecturette question:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching question" },
      { status: 500 }
    );
  }
}
