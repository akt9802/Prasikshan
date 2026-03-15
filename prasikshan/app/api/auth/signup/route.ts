import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendVerificationOTP } from '@/lib/mailer';

// Helper to generate 6 digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { username, email, password, fullName } = await req.json();

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide username, email, and password',
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: 'User already exists with this email or username',
          },
          { status: 409 }
        );
      } else {
        // We will just overwrite the unverified user details
        await User.deleteOne({ _id: existingUser._id });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName: fullName || username,
      isVerified: false,
      verifyOtp: otp,
      verifyOtpExpiry: otpExpiry,
      role: 'user',
    });

    // Send OTP via email
    await sendVerificationOTP(email, otp);

    // Don't return password or OTP
    const userResponse = newUser.toObject();
    delete (userResponse as any).password;
    delete (userResponse as any).verifyOtp;
    delete (userResponse as any).verifyOtpExpiry;

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully. Please check your email for the verification OTP.',
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error during user signup:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', ');
      return NextResponse.json(
        {
          success: false,
          message: `Validation error: ${messages}`,
        },
        { status: 400 }
      );
    }

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
