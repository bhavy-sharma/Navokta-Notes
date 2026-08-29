// app/api/contact/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Query from '@/models/Query';
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
    const { name, email, subject, message } = await request.json();

    // Validate
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Save to database
    const query = await Query.create({
      name,
      email,
      subject,
      message,
      status: 'pending',
    });

    // Send email to admin (bhavymay18@gmail.com)
    const adminEmail = 'bhavymay18@gmail.com';
    
    const mailOptions = {
      from: process.env.SMTP_FROM || '"Navokta Notes" <noreply@navokta.com>',
      to: adminEmail,
      subject: `📩 New Query: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a2e; color: #fff; border-radius: 10px;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #333;">
            <h1 style="font-size: 24px; background: linear-gradient(135deg, #8B5CF6, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">
              📩 New Query Received
            </h1>
          </div>
          <div style="padding: 20px 0;">
            <div style="margin-bottom: 15px;">
              <p style="color: #888; font-size: 12px; margin: 0;">Name</p>
              <p style="color: #fff; font-size: 16px; margin: 5px 0;">${name}</p>
            </div>
            <div style="margin-bottom: 15px;">
              <p style="color: #888; font-size: 12px; margin: 0;">Email</p>
              <p style="color: #fff; font-size: 16px; margin: 5px 0;">${email}</p>
            </div>
            <div style="margin-bottom: 15px;">
              <p style="color: #888; font-size: 12px; margin: 0;">Subject</p>
              <p style="color: #fff; font-size: 16px; margin: 5px 0;">${subject}</p>
            </div>
            <div style="margin-bottom: 15px;">
              <p style="color: #888; font-size: 12px; margin: 0;">Message</p>
              <p style="color: #ccc; font-size: 15px; margin: 5px 0; background: #2a2a3e; padding: 10px; border-radius: 8px; white-space: pre-wrap;">${message}</p>
            </div>
            <div style="margin-top: 15px;">
              <p style="color: #666; font-size: 12px;">Query ID: ${query._id}</p>
              <p style="color: #666; font-size: 12px;">Status: Pending</p>
            </div>
          </div>
          <div style="padding: 20px 0; border-top: 1px solid #333; text-align: center; color: #666; font-size: 12px;">
            <p>Manage queries in your Admin Panel → Query Management</p>
            <p>© ${new Date().getFullYear()} Navokta Notes. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Send email to admin
    await transporter.sendMail(mailOptions);

    // Send auto-reply to user
    const userMailOptions = {
      from: process.env.SMTP_FROM || '"Navokta Notes" <noreply@navokta.com>',
      to: email,
      subject: `✅ We've received your query: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a2e; color: #fff; border-radius: 10px;">
          <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #333;">
            <h1 style="font-size: 24px; background: linear-gradient(135deg, #34D399, #3B82F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0;">
              ✅ Query Received
            </h1>
          </div>
          <div style="padding: 20px 0;">
            <p style="color: #ccc; font-size: 16px; line-height: 1.6;">
              Dear ${name},
            </p>
            <p style="color: #ccc; font-size: 16px; line-height: 1.6;">
              Thank you for contacting Navokta Notes. We have received your query and will get back to you within 24-48 hours.
            </p>
            <div style="background: #2a2a3e; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="color: #888; font-size: 12px;">Your Query:</p>
              <p style="color: #fff; font-size: 14px;">${message}</p>
            </div>
            <p style="color: #666; font-size: 14px;">
              Query ID: <span style="color: #888;">${query._id}</span>
            </p>
          </div>
          <div style="padding: 20px 0; border-top: 1px solid #333; text-align: center; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Navokta Notes. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(userMailOptions);

    return NextResponse.json({
      message: 'Query submitted successfully',
      query,
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting query:', error);
    return NextResponse.json(
      { message: 'Failed to submit query: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const queries = await Query.find({}).sort({ createdAt: -1 });
    return NextResponse.json(queries);
  } catch (error) {
    console.error('Error fetching queries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queries' },
      { status: 500 }
    );
  }
}