import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getRedis } from '@/lib/redis';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    // Clear the HTTP-only cookie immediately
    const response = NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    );

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    });

    // Delete refresh token from Redis (instant revocation, no DB needed)
    if (refreshToken) {
      const secret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || 'default_secret';
      try {
        const decoded = jwt.verify(refreshToken, secret) as { userId: string };
        const redis = await getRedis();
        await redis.del(`refreshToken:${decoded.userId}`);
      } catch (e) {
        // Token already invalid/expired — nothing to delete, still log out cleanly
        console.warn('Logout: token verification failed, skipping Redis cleanup.');
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
