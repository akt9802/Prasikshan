import connectDB from '@/lib/db';
import Question from '@/models/Question';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// ─── Auth helper ────────────────────────────────────────────────────────────
function verifyUser(req: NextRequest): { ok: boolean; error?: NextResponse } {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { ok: false, error: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }) };
  }
  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) return { ok: false, error: NextResponse.json({ success: false, message: 'Server misconfiguration' }, { status: 500 }) };

  try {
    jwt.verify(token, secret);
    return { ok: true };
  } catch {
    return { ok: false, error: NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 403 }) };
  }
}

export async function GET(req: NextRequest) {
  const auth = verifyUser(req);
  if (!auth.ok) return auth.error!;

  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    console.log('Fetching 10 random questions...');
    const questions = await Question.aggregate([{ $sample: { size: 10 } }]);
    console.log(`Successfully fetched ${questions.length} questions`);

    return NextResponse.json(
      { success: true, data: questions, count: questions.length },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching ten questions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch questions', error: error.message || error },
      { status: 500 }
    );
  }
}
