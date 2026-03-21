import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import LecturetteQuestion from "@/models/LecturetteQuestion";

// ─── Auth helper ────────────────────────────────────────────────────────────
async function verifyAdmin(req: NextRequest): Promise<{ ok: boolean; error?: NextResponse }> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false, error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  }
  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) return { ok: false, error: NextResponse.json({ success: false, message: "Server misconfiguration" }, { status: 500 }) };

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    await connectDB();
    const user = await User.findById(decoded.userId).select("role");
    if (!user || user.role !== "admin") {
      return { ok: false, error: NextResponse.json({ success: false, message: "Forbidden — Admins only" }, { status: 403 }) };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 }) };
  }
}

// ─── GET: fetch all Lecturette Questions ──────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const question = await LecturetteQuestion.findById(id);
      if (!question) return NextResponse.json({ success: false, message: "Lecturette not found" }, { status: 404 });
      return NextResponse.json({ success: true, question }, { status: 200 });
    }

    const questions = await LecturetteQuestion.find({}).sort({ topic_id: 1 });
    return NextResponse.json({ success: true, questions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ─── POST: create a new Lecturette Question ──────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const body = await req.json();
    const { topic_id, topic, speech } = body;

    if (!topic || !speech) {
      return NextResponse.json({ success: false, message: "Topic and Standard Speech are required." }, { status: 400 });
    }

    let nextTopicId = topic_id;
    if (!nextTopicId) {
      const lastQ = await LecturetteQuestion.findOne().sort({ topic_id: -1 });
      nextTopicId = lastQ && lastQ.topic_id ? lastQ.topic_id + 1 : 1;
    }

    const newQuestion = await LecturetteQuestion.create({
      topic_id: nextTopicId,
      topic,
      speech,
    });
    return NextResponse.json({ success: true, message: "Lecturette topic saved successfully!", question: newQuestion }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ─── PUT: update an existing Lecturette Question ─────────────────────────────
export async function PUT(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Lecturette ID is required" }, { status: 400 });

    const body = await req.json();
    const { topic_id, topic, speech } = body;

    if (!topic || !speech) {
      return NextResponse.json({ success: false, message: "Topic and Standard Speech are required." }, { status: 400 });
    }

    const updated = await LecturetteQuestion.findByIdAndUpdate(
      id,
      { topic_id, topic, speech },
      { new: true, runValidators: true }
    );

    if (!updated) return NextResponse.json({ success: false, message: "Lecturette not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Lecturette updated successfully!", question: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ─── DELETE: remove a Lecturette Question by ID ──────────────────────────────
export async function DELETE(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Lecturette ID is required" }, { status: 400 });

    await LecturetteQuestion.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Lecturette deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
