import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

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

/**
 * POST /api/admin/migrate-roles
 * Adds 'role' field to all existing users that don't have it (sets to 'user')
 * This is a one-time migration to handle users created before role field was added
 */
export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();

    const result = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user' } }
    );

    return NextResponse.json(
      {
        success: true,
        message: `Migration completed. Updated ${result.modifiedCount} users.`,
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error during migration:', error);
    return NextResponse.json(
      { success: false, message: 'Migration failed', error: error.message },
      { status: 500 }
    );
  }
}
