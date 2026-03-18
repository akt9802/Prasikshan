import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import OirSet from '@/models/OirSet';

// ─── Auth helper ────────────────────────────────────────────────────────────
async function verifyAdmin(req: NextRequest): Promise<{ ok: boolean; error?: NextResponse }> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { ok: false, error: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }) };
  }
  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) return { ok: false, error: NextResponse.json({ success: false, message: 'Server misconfiguration' }, { status: 500 }) };

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    await connectDB();
    const user = await User.findById(decoded.userId).select('role');
    if (!user || user.role !== 'admin') {
      return { ok: false, error: NextResponse.json({ success: false, message: 'Forbidden — Admins only' }, { status: 403 }) };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: NextResponse.json({ success: false, message: 'Invalid token' }, { status: 403 }) };
  }
}

// ─── GET: fetch all OIR sets (or a single set by ID for editing) ─────────────
export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // Fetch a single full set with all questions (for editing)
      const set = await OirSet.findById(id);
      if (!set) return NextResponse.json({ success: false, message: 'Set not found' }, { status: 404 });
      return NextResponse.json({ success: true, set }, { status: 200 });
    }

    // Fetch all sets (name + date only for the list)
    const sets = await OirSet.find({}).select('setName createdAt').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, sets }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ─── POST: create a new OIR set ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const body = await req.json();
    const { setName, questions } = body;

    if (!setName || !questions || questions.length !== 40) {
      return NextResponse.json(
        { success: false, message: `A set must have exactly 40 questions. You provided ${questions?.length ?? 0}.` },
        { status: 400 }
      );
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question?.trim() || !q.options || q.options.length < 2 || !q.answer?.trim()) {
        return NextResponse.json(
          { success: false, message: `Question ${i + 1} is incomplete. Each question needs: question text, at least 2 options, and a correct answer.` },
          { status: 400 }
        );
      }
    }

    const newSet = await OirSet.create({ setName, questions });
    return NextResponse.json({ success: true, message: `"${setName}" created successfully!`, set: newSet }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ─── PUT: update an existing OIR set ────────────────────────────────────────
export async function PUT(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'Set ID is required' }, { status: 400 });

    const body = await req.json();
    const { setName, questions } = body;

    if (!setName || !questions || questions.length !== 40) {
      return NextResponse.json(
        { success: false, message: `A set must have exactly 40 questions. You provided ${questions?.length ?? 0}.` },
        { status: 400 }
      );
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question?.trim() || !q.options || q.options.length < 2 || !q.answer?.trim()) {
        return NextResponse.json(
          { success: false, message: `Question ${i + 1} is incomplete. Fill all questions before saving.` },
          { status: 400 }
        );
      }
    }

    const updated = await OirSet.findByIdAndUpdate(
      id,
      { setName, questions },
      { new: true, runValidators: true }
    );

    if (!updated) return NextResponse.json({ success: false, message: 'Set not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: `"${setName}" updated successfully!`, set: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ─── DELETE: remove an OIR set by ID ────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'Set ID is required' }, { status: 400 });

    await OirSet.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Set deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
