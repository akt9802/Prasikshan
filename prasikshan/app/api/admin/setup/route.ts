import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

/**
 * POST /api/admin/setup
 * Sets a user as admin by email
 * 
 * Request body:
 * {
 *   adminEmail: string
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   message: string,
 *   user?: { email, role }
 * }
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { adminEmail } = await req.json();

    if (!adminEmail) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide an admin email',
        },
        { status: 400 }
      );
    }

    // Find and update user role to admin
    const updatedUser = await User.findOneAndUpdate(
      { email: adminEmail },
      { role: 'admin' },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found with this email',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `User ${adminEmail} has been set as admin`,
        user: {
          email: updatedUser.email,
          role: updatedUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error during admin setup:', error);

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
