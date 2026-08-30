import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const POST = async (req) => {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP via SHA-256 before storage (Security Best Practice)
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      isVerified: false,
      otp: hashedOtp,
      otpExpires,
    });

    await newUser.save();

    // Send professional verification email
    const mailOptions = {
      from: `"Navokta Notes" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Verify Your Email - Navokta Notes',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #111827; text-align: center; font-size: 24px; font-weight: 700; margin-bottom: 10px;">Welcome to Navokta Notes!</h2>
          <p style="color: #4b5563; font-size: 16px; text-align: center; margin-bottom: 30px;">Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="display: inline-block; padding: 16px 32px; font-size: 28px; font-weight: 800; color: #ffffff; background: linear-gradient(90deg, #2563eb, #9333ea); border-radius: 10px; letter-spacing: 4px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
              ${otp}
            </span>
          </div>
          <p style="color: #6b7280; font-size: 14px; text-align: center;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
          <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 30px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: 'OTP sent successfully to your email' }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }), 
      { status: 500 }
    );
  }
};