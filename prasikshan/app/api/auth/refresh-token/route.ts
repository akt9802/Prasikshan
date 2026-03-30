import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import redis from '@/lib/redis';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'No refresh token provided' },
        { status: 401 }
      );
    }

    const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || 'default_secret';

    // Verify the refresh token signature
    let decoded: { userId: string };
    try {
      decoded = jwt.verify(refreshToken, secret) as { userId: string };
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired refresh token' },
        { status: 403 }
      );
    }

    // Check token against Redis (replaces MongoDB lookup)
    const stored = await redis.get(`refreshToken:${decoded.userId}`);

    if (!stored || stored !== refreshToken) {
      // Token mismatch — possible theft. Nuke from Redis instantly.
      await redis.del(`refreshToken:${decoded.userId}`);
      return NextResponse.json(
        { success: false, message: 'Refresh token reuse detected. Please log in again.' },
        { status: 403 }
      );
    }

    // Fetch user from MongoDB only for access token payload (email, username)
    await connectDB();
    const user = await User.findById(decoded.userId).select('email username');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '15m' }
    );

    // Generate new refresh token (rotation)
    const newRefreshToken = jwt.sign(
      { userId: user._id.toString() },
      secret,
      { expiresIn: '7d' }
    );

    // Save new refresh token to Redis — TTL resets to 7 days
    await redis.setEx(
      `refreshToken:${decoded.userId}`,
      7 * 24 * 60 * 60, // 7 days
      newRefreshToken
    );

    const response = NextResponse.json(
      { success: true, token: newAccessToken },
      { status: 200 }
    );

    // Update the HTTP-only cookie with the new refresh token
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Error in refresh token route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
