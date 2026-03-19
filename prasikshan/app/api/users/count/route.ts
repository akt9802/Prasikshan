import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

// Force dynamic and optionally revalidate every 60 seconds to lighten DB load
export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    await connectDB();
    const count = await User.countDocuments();
    return NextResponse.json({ success: true, count }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, count: 5420 }, { status: 500 });
  }
}
