import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PpdtQuestion from "@/models/PpdtQuestion";

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

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const questions = await PpdtQuestion.find({}).sort({ _id: 1 });
    return NextResponse.json({ success: true, questions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    const data = await req.json();
    await connectDB();

    const { _id, image, stories } = data;

    if (!image) {
      return NextResponse.json({ success: false, message: "Image is required" }, { status: 400 });
    }

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
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

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
