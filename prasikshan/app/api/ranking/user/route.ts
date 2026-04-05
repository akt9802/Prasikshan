import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import UserResult from '@/models/UserResult';

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
    await connectDB();
    const { searchParams } = new URL(req.url);
    const nameQuery = searchParams.get('name');

    if (!nameQuery) {
      return NextResponse.json({ success: false, message: 'Name parameter required' }, { status: 400 });
    }

    const users = await User.find({}, 'username fullName email').lean();
    const userResults = await UserResult.find({}).lean();

    const resultDict: any = {};
    for (const res of userResults) {
      resultDict[(res as any).userId.toString()] = res;
    }

    const mapped = users.map(u => {
      const result = resultDict[(u as any)._id.toString()];
      let totalScore = 0;
      let testsTakenCount = 0;
      if (result) {
        const arrays = ['oir', 'ppdt', 'tat', 'wat', 'srt', 'lecturette', 'pi'];
        for (const arr of arrays) {
          if (Array.isArray(result[arr])) {
            testsTakenCount += result[arr].length;
            for (const test of result[arr]) {
              totalScore += (test.score || 0);
            }
          }
        }
      }
      totalScore = Math.round(totalScore * 100) / 100;

      return {
        _id: u._id,
        username: u.username,
        fullName: u.fullName,
        email: u.email,
        testsTakenCount,
        totalScore,
        name: u.username || u.fullName || u.email.split('@')[0],
      };
    });

    mapped.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.testsTakenCount !== a.testsTakenCount) return b.testsTakenCount - a.testsTakenCount;
      const nameA = a.name || '';
      const nameB = b.name || '';
      return nameA.localeCompare(nameB);
    });

    const targetUser = mapped.find(u => u.name === nameQuery);

    if (!targetUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const rank = mapped.indexOf(targetUser) + 1;

    const detailedResult = await UserResult.findOne({ userId: targetUser._id }).lean();

    const testsTaken = detailedResult ? [
      ...(detailedResult.oir || []).map((t: any) => ({ ...t, testName: t.testName || 'OIR' })),
      ...(detailedResult.ppdt || []).map((t: any) => ({ ...t, testName: t.testName || 'PPDT' })),
      ...(detailedResult.tat || []).map((t: any) => ({ ...t, testName: t.testName || 'TAT' })),
      ...(detailedResult.wat || []).map((t: any) => ({ ...t, testName: t.testName || 'WAT' })),
      ...(detailedResult.srt || []).map((t: any) => ({ ...t, testName: t.testName || 'SRT' })),
      ...(detailedResult.lecturette || []).map((t: any) => ({ ...t, testName: t.testName || 'LECTURETTE' })),
      ...(detailedResult.pi || []).map((t: any) => ({ ...t, testName: t.testName || 'PI' })),
    ].sort((a, b) => new Date(a.dateTaken).getTime() - new Date(b.dateTaken).getTime()) : [];

    return NextResponse.json({
      success: true,
      user: { ...targetUser, rank, testsTaken },
    });
  } catch (error: any) {
    console.error('Error in /api/ranking/user:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
