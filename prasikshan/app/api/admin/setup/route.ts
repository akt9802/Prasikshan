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
 * POST /api/admin/setup
 * Sets a user as admin by email — requires existing admin JWT token
 */
export async function POST(req: NextRequest) {
  const auth = await verifyAdmin(req);
  if (!auth.ok) return auth.error!;

  try {
    await connectDB();

    const { adminEmail } = await req.json();

    if (!adminEmail) {
      return NextResponse.json(
        { success: false, message: 'Please provide an admin email' },
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: adminEmail },
      { role: 'admin' },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found with this email' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `User ${adminEmail} has been set as admin`,
        user: { email: updatedUser.email, role: updatedUser.role },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error during admin setup:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
