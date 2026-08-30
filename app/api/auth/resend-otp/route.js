import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
// import User from '@/lib/models/User'; // Adjust path to your Mongoose model

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    const mailOptions = {
      from: `"Navokta Notes" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'New Verification Code - Navokta Notes',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #111827; text-align: center; font-size: 24px; font-weight: 700; margin-bottom: 10px;">Your New Verification Code</h2>
          <p style="color: #4b5563; font-size: 16px; text-align: center; margin-bottom: 30px;">Here is your new One-Time Password (OTP) to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 16px 32px; font-size: 28px; font-weight: 800; color: #ffffff; background: linear-gradient(90deg, #2563eb, #9333ea); border-radius: 10px; letter-spacing: 4px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
              ${otp}
            </span>
          </div>
          <p style="color: #6b7280; font-size: 14px; text-align: center;">This OTP is valid for 10 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'New OTP sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}