import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PiQuestion from "@/models/PiQuestion";

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

// ─── GET: fetch all PI Questions ──────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const questionData = await PiQuestion.findById(id);
      if (!questionData) return NextResponse.json({ success: false, message: "PI Question not found" }, { status: 404 });
      return NextResponse.json({ success: true, question: questionData }, { status: 200 });
    }

    const questions = await PiQuestion.find({}).sort({ question_id: 1 });
    return NextResponse.json({ success: true, questions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ─── POST: create a new PI Question ──────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const body = await req.json();
    const { question_id, question, expectation } = body;

    if (!question || !expectation) {
      return NextResponse.json({ success: false, message: "Question and Expectation are required." }, { status: 400 });
    }

    let nextQuestionId = question_id;
    if (!nextQuestionId) {
      const lastQ = await PiQuestion.findOne().sort({ question_id: -1 });
      nextQuestionId = lastQ && lastQ.question_id ? lastQ.question_id + 1 : 1;
    }

    const newQuestion = await PiQuestion.create({
      question_id: nextQuestionId,
      question,
      expectation,
    });
    return NextResponse.json({ success: true, message: "PI Question saved successfully!", question: newQuestion }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "A question with this ID already exists. Please delete it or leave ID blank to auto-increment." }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ─── PUT: update an existing PI Question ─────────────────────────────────────
export async function PUT(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Question ID is required" }, { status: 400 });

    const body = await req.json();
    const { question_id, question, expectation } = body;

    if (!question || !expectation) {
      return NextResponse.json({ success: false, message: "Question and Expectation are required." }, { status: 400 });
    }

    const updated = await PiQuestion.findByIdAndUpdate(
      id,
      { question_id, question, expectation },
      { new: true, runValidators: true }
    );

    if (!updated) return NextResponse.json({ success: false, message: "PI Question not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "PI Question updated successfully!", question: updated }, { status: 200 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "A question with this ID already exists." }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ─── DELETE: remove a PI Question by ID ──────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Question ID is required" }, { status: 400 });

    await PiQuestion.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "PI Question deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
