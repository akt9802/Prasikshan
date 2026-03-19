import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import WatSet from '@/models/WatSet';

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

const SET_SIZE = 60;

// ─── GET: fetch all WAT sets (or a single set by ID for editing) ─────────────
export async function GET(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const set = await WatSet.findById(id);
      if (!set) return NextResponse.json({ success: false, message: 'Set not found' }, { status: 404 });
      return NextResponse.json({ success: true, set }, { status: 200 });
    }

    const sets = await WatSet.find({}).select('setName createdAt').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, sets }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ─── POST: create a new WAT set ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const body = await req.json();
    const { setName, questions } = body;

    if (!setName || !questions || questions.length !== SET_SIZE) {
      return NextResponse.json(
        { success: false, message: `A WAT set must have exactly ${SET_SIZE} questions. You provided ${questions?.length ?? 0}.` },
        { status: 400 }
      );
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.word?.trim() || !q.sentences || q.sentences.filter((s: string) => s.trim()).length === 0) {
        return NextResponse.json(
          { success: false, message: `Question ${i + 1} is incomplete. Each entry needs a word and at least one sentence.` },
          { status: 400 }
        );
      }
    }

    const newSet = await WatSet.create({ setName, questions });
    return NextResponse.json({ success: true, message: `"${setName}" created successfully!`, set: newSet }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ─── PUT: update an existing WAT set ────────────────────────────────────────
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

    if (!setName || !questions || questions.length !== SET_SIZE) {
      return NextResponse.json(
        { success: false, message: `A WAT set must have exactly ${SET_SIZE} questions. You provided ${questions?.length ?? 0}.` },
        { status: 400 }
      );
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.word?.trim() || !q.sentences || q.sentences.filter((s: string) => s.trim()).length === 0) {
        return NextResponse.json(
          { success: false, message: `Question ${i + 1} is incomplete. Fill all words before saving.` },
          { status: 400 }
        );
      }
    }

    const updated = await WatSet.findByIdAndUpdate(
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

// ─── DELETE: remove a WAT set by ID ────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'Set ID is required' }, { status: 400 });

    await WatSet.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Set deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
