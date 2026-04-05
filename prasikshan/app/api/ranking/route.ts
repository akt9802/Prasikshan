import { NextResponse, NextRequest } from 'next/server';
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
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

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
        username: u.username,
        fullName: u.fullName,
        email: u.email,
        testsTakenCount,
        totalScore,
      };
    });

    mapped.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.testsTakenCount !== a.testsTakenCount) return b.testsTakenCount - a.testsTakenCount;
      const nameA = a.username || a.fullName || a.email || '';
      const nameB = b.username || b.fullName || b.email || '';
      return nameA.localeCompare(nameB);
    });

    const ranked = mapped.map((u, idx) => ({
      ...u,
      name: u.username || u.fullName || u.email.split('@')[0],
      rank: idx + 1,
    }));

    const totalItems = ranked.length;
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;
    const paginatedData = ranked.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: paginatedData,
      meta: { totalItems, totalPages, currentPage: page, hasMore: page < totalPages },
    });
  } catch (err: any) {
    console.error('Error in /api/ranking:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
