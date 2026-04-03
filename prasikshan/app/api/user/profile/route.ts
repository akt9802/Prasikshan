import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import UserResult from '@/models/UserResult';

export async function GET(req: NextRequest) {
  try {
    // 1. Extract the Bearer token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not configured');

    // 2. Verify token
    let decoded: { userId: string };
    try {
      decoded = jwt.verify(token, secret) as { userId: string };
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 403 }
      );
    }

    // 3. Fetch full user data including testsTaken
    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role || 'user',
          isVerified: user.isVerified,
          testsTaken: await (async () => {
            const userResult = await UserResult.findOne({ userId: user._id }).lean();
            if (!userResult) return [];
            
            // Standardize and combine all test arrays
            return [
              ...(userResult.oir || []).map((t: any) => ({ ...t, testName: t.testName || "OIR" })),
              ...(userResult.ppdt || []).map((t: any) => ({ ...t, testName: t.testName || "PPDT" })),
              ...(userResult.tat || []).map((t: any) => ({ ...t, testName: t.testName || "TAT" })),
              ...(userResult.wat || []).map((t: any) => ({ ...t, testName: t.testName || "WAT" })),
              ...(userResult.srt || []).map((t: any) => ({ ...t, testName: t.testName || "SRT" })),
              ...(userResult.lecturette || []).map((t: any) => ({ ...t, testName: t.testName || "LECTURETTE" })),
              ...(userResult.pi || []).map((t: any) => ({ ...t, testName: t.testName || "PI" })),
            ].sort((a, b) => new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime());
          })(),
          // Also provide specific results object
          results: await UserResult.findOne({ userId: user._id }).lean() || {},
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
