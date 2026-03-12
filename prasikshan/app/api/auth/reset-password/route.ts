import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, otp, newPassword } = await req.json();

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ success: false, message: 'Email, OTP, and new password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
        }

        if (user.resetPasswordOtp !== otp) {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }

        if (user.resetPasswordOtpExpiry && user.resetPasswordOtpExpiry < new Date()) {
            return NextResponse.json({ success: false, message: 'OTP has expired' }, { status: 400 });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Clear reset OTP fields
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpiry = undefined;

        await user.save();

        return NextResponse.json({ success: true, message: 'Password has been reset successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Error in reset password:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
