import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import UserResult from '@/models/UserResult';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ success: false, message: 'Email and OTP are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ success: false, message: 'User is already verified' }, { status: 400 });
        }

        if (user.verifyOtp !== otp) {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }

        if (user.verifyOtpExpiry && user.verifyOtpExpiry < new Date()) {
            return NextResponse.json({ success: false, message: 'OTP has expired' }, { status: 400 });
        }

        // Mark as verified and clear OTP
        user.isVerified = true;
        user.verifyOtp = undefined;
        user.verifyOtpExpiry = undefined;
        await user.save();

        // Initialize UserResult document if it doesn't exist
        const existingResult = await UserResult.findOne({ userId: user._id });
        if (!existingResult) {
            await UserResult.create({
                userId: user._id,
                oir: [],
                ppdt: [],
                tat: [],
                wat: [],
                srt: [],
                lecturette: [],
                pi: [],
            });
        }

        return NextResponse.json({ success: true, message: 'Email verified successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error during email verification:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
