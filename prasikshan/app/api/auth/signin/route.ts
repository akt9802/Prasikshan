import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getRedis } from '@/lib/redis';
import { checkRateLimit, recordFailedLogin, clearFailedLogin } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide email and password',
        },
        { status: 400 }
      );
    }

    // Check rate limit (IP & Account Lockout)
    const rateLimit = await checkRateLimit(req, email);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message: rateLimit.message,
        },
        { status: 429 }
      );
    }

    // Find user by email
    const existingUser = await User.findOne({ email }).select('+password');

    if (!existingUser) {
      await recordFailedLogin(email);
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    if (!existingUser.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please verify your email address. Check your inbox for the OTP.',
          requiresVerification: true,
        },
        { status: 403 }
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      await recordFailedLogin(email);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid password',
        },
        { status: 401 }
      );
    }

    // Clear failed login attempts on success
    await clearFailedLogin(email);

    // Generate Access Token (short-lived)
    const token = jwt.sign(
      {
        userId: existingUser._id.toString(),
        email: existingUser.email,
        username: existingUser.username,
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '15m' }
    );

    // Generate Refresh Token (long-lived)
    const refreshToken = jwt.sign(
      {
        userId: existingUser._id.toString(),
      },
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    // Save refresh token to Redis with 7-day TTL (auto-expires, no DB write needed)
    const redis = await getRedis();
    await redis.setEx(
      `refreshToken:${existingUser._id.toString()}`,
      7 * 24 * 60 * 60, // 7 days in seconds
      refreshToken
    );

    // Return user without password
    const userResponse = existingUser.toObject();
    delete (userResponse as any).password;
    delete (userResponse as any).refreshToken;

    const response = NextResponse.json(
      {
        success: true,
        message: 'Sign-in successful',
        token,
        user: {
          id: userResponse._id,
          username: userResponse.username,
          email: userResponse.email,
          fullName: userResponse.fullName,
          role: userResponse.role || 'user',
          isVerified: userResponse.isVerified,
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookie for refresh token
    // Production should use secure: process.env.NODE_ENV === 'production'
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // prevent CSRF while allowing proper navigation
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Error during user sign-in:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
