import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

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

    // Find user by email
    const existingUser = await User.findOne({ email }).select('+password');

    if (!existingUser) {
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
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid password',
        },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: existingUser._id.toString(),
        email: existingUser.email,
        username: existingUser.username,
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '6h' }
    );

    // Return user without password
    const userResponse = existingUser.toObject();
    delete (userResponse as any).password;

    return NextResponse.json(
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
