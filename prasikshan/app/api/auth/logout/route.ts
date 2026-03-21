import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    
    // Clear the HTTP-only cookie
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );
    
    // Expire cookie to remove it
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0), // Set to past date to expire immediately
      path: '/',
    });

    if (refreshToken) {
      const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || 'default_secret';
      try {
        const decoded = jwt.verify(refreshToken, secret) as { userId: string };
        await connectDB();
        
        // Remove token from database to prevent reuse
        await User.findByIdAndUpdate(decoded.userId, {
          $unset: { refreshToken: 1 }
        });
      } catch (e) {
        // If token verification fails, still log out on the client side
        console.warn('Logout token verification failed, continuing logout.', e);
      }
    }

    return response;
  } catch (error: any) {
    console.error('Error in logout route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}
