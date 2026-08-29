import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import nodemailer from 'nodemailer';

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request) {
  try {
    await connectDB();
    const { subject, message, audience } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Build query based on audience
    let query = {};
    if (audience === 'admins') {
      query = { role: 'admin' };
    } else if (audience === 'users') {
      query = { role: 'user' };
    }
    // 'all' means no filter - get all users

    // Get users based on audience
    const users = await User.find(query);
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: `No ${audience === 'admins' ? 'admins' : audience === 'users' ? 'users' : 'users'} found to send announcement` },
        { status: 400 }
      );
    }

    const emails = users.map(user => user.email);
    const recipientLabel = audience === 'all' ? 'All Users' : audience === 'admins' ? 'Admins' : 'Users';

    // Send email
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Navokta Notes" <noreply@navokta.com>',
      to: emails.join(', '),
      subject: `📢 ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a2e; color: #fff; border-radius: 10px;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #333;">
            <h1 style="font-size: 24px; background: linear-gradient(135deg, #8B5CF6, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">
              📢 Announcement
            </h1>
            <p style="color: #666; font-size: 12px; margin-top: 8px;">
              Sent to: ${recipientLabel} (${emails.length} recipients)
            </p>
          </div>
          <div style="padding: 20px 0;">
            <h2 style="color: #fff; font-size: 20px; margin-bottom: 16px;">${subject}</h2>
            <div style="color: #ccc; line-height: 1.6; font-size: 16px; white-space: pre-wrap;">
              ${message}
            </div>
          </div>
          <div style="padding: 20px 0; border-top: 1px solid #333; text-align: center; color: #666; font-size: 12px;">
            <p>You are receiving this email because you are registered on Navokta Notes.</p>
            <p>© ${new Date().getFullYear()} Navokta Notes. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: 'Announcement sent successfully',
      sentCount: emails.length,
      totalUsers: users.length,
      audience: audience || 'all',
      recipientLabel,
    });

  } catch (error) {
    console.error('Error sending announcement:', error);
    return NextResponse.json(
      { error: 'Failed to send announcement: ' + error.message },
      { status: 500 }
    );
  }
}