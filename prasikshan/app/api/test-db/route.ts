import connectDB from '@/lib/db';
import User from '@/models/User';
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
    const conn = await connectDB();

    if (!conn) {
      return Response.json(
        { success: false, message: 'Failed to connect to database' },
        { status: 500 }
      );
    }

    const userCount = await User.countDocuments();

    return Response.json(
      {
        success: true,
        message: 'Database connection successful!',
        database: 'Connected to MongoDB',
        totalUsers: userCount,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Database connection error:', error);
    return Response.json(
      { success: false, message: 'Database connection failed', error: error.message || error },
      { status: 500 }
    );
  }
}
