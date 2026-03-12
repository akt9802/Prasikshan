import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendPasswordResetOTP } from '@/lib/mailer';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if user exists or not for security, just return success
            return NextResponse.json({ success: true, message: 'If the email exists, a password reset OTP has been sent.' }, { status: 200 });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpiry = otpExpiry;
        await user.save();

        await sendPasswordResetOTP(email, otp);

        return NextResponse.json({ success: true, message: 'If the email exists, a password reset OTP has been sent.' }, { status: 200 });
    } catch (error: any) {
        console.error('Error in forgot password:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
