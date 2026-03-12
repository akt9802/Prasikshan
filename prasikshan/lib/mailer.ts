import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const fromEmail = process.env.SMTP_FROM_EMAIL || 'no-reply@akt9802.in';
        const fromName = process.env.SMTP_FROM_NAME || 'Prasikshan Team';

        const info = await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to,
            subject,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};

export const sendVerificationOTP = async (to: string, otp: string) => {
    const subject = 'Verify your email for Prasikshan';
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #2563eb; text-align: center;">Welcome to Prasikshan!</h2>
      <p style="font-size: 16px; color: #333;">Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address. This OTP is valid for 10 minutes.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #666;">If you didn't request this code, you can safely ignore this email.</p>
      <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 12px; color: #999;">
        <p>&copy; ${new Date().getFullYear()} Prasikshan. All rights reserved.</p>
      </div>
    </div>
  `;
    return sendEmail(to, subject, html);
};

export const sendPasswordResetOTP = async (to: string, otp: string) => {
    const subject = 'Password Reset Request - Prasikshan';
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #ea580c; text-align: center;">Password Reset Request</h2>
      <p style="font-size: 16px; color: #333;">We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed. This OTP is valid for 10 minutes.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #666;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; font-size: 12px; color: #999;">
        <p>&copy; ${new Date().getFullYear()} Prasikshan. All rights reserved.</p>
      </div>
    </div>
  `;
    return sendEmail(to, subject, html);
};
