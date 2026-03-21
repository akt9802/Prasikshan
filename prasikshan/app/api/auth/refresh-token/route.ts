import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

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

    // Verify the refresh token
    let decoded: { userId: string };
    try {
      decoded = jwt.verify(refreshToken, secret) as { userId: string };
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired refresh token' },
        { status: 403 }
      );
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check token family / rotation: ensure the token matches the DB
    if (user.refreshToken !== refreshToken) {
      // Possible token theft, invalidate all tokens by clearing from DB
      await User.findByIdAndUpdate(
        user._id,
        { $unset: { refreshToken: "" } },
        { strict: false }
      );
      return NextResponse.json(
        { success: false, message: 'Refresh token reuse detected. Please log in again.' },
        { status: 403 }
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
      { expiresIn: '15m' } // Short-lived access token
    );

    // Generate new refresh token to implement rotating refresh tokens
    const newRefreshToken = jwt.sign(
      {
        userId: user._id.toString(),
      },
      secret,
      { expiresIn: '7d' } // Long-lived refresh token
    );

    // Save new refresh token in DB
    await User.findByIdAndUpdate(
      user._id,
      { $set: { refreshToken: newRefreshToken } },
      { strict: false }
    );

    const response = NextResponse.json(
      {
        success: true,
        token: newAccessToken,
      },
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
