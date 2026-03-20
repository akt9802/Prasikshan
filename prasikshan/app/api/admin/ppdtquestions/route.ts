import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PpdtQuestion from "@/models/PpdtQuestion";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const questions = await PpdtQuestion.find({}).sort({ _id: 1 });
    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await connectDB();

    const { _id, image, stories } = data;

    if (!image) {
      return NextResponse.json({ success: false, message: "Image is required" }, { status: 400 });
    }

    // Determine the ID: Use max existing ID + 1 if _id is a timestamp or empty
    let newId = _id;
    if (!newId || newId > 100000) {
      const highestQ = await PpdtQuestion.findOne().sort({ _id: -1 });
      newId = highestQ && highestQ._id ? highestQ._id + 1 : 1;
    }

    const newQuestion = await PpdtQuestion.findOneAndUpdate(
      { _id: newId },
      { image, stories: stories || [] },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, question: newQuestion });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    await connectDB();
    await PpdtQuestion.deleteOne({ _id: Number(id) });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
