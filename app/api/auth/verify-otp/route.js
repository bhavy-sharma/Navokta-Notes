import { NextResponse } from 'next/server';
import crypto from 'crypto';
// import User from '@/lib/models/User'; // Adjust path to your Mongoose model

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    // Hash the provided OTP to compare with the stored hashed OTP
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // const user = await User.findOne({ email });
    // if (!user) {
    //   return NextResponse.json({ message: 'User not found' }, { status: 404 });
    // }

    // if (user.otp !== hashedOtp) {
    //   return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
    // }

    // if (Date.now() > user.otpExpires) {
    //   return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
    // }

    // Update user to verified and clear OTP fields
    // user.isVerified = true;
    // user.otp = undefined;
    // user.otpExpires = undefined;
    // await user.save();

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}