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
    
    // Destructure all fields from the new frontend modal
    const { subject, preheader, bannerUrl, message, audience } = await request.json();

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

    // Get users based on audience (only fetch needed fields for security/performance)
    const users = await User.find(query).select('name email role');
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: `No recipients found for the selected audience` },
        { status: 400 }
      );
    }

    const recipientLabel = audience === 'all' ? 'All Users & Admins' : audience === 'admins' ? 'Admins' : 'Users';

    // Create an array of email sending promises for personalized delivery
    const emailPromises = users.map(async (user) => {
      // Replace dynamic variables with actual user data (case-insensitive)
      const personalizedMessage = message
        .replace(/{{name}}/gi, user.name || 'User')
        .replace(/{{email}}/gi, user.email)
        .replace(/{{role}}/gi, user.role || 'User');

      const mailOptions = {
        from: process.env.SMTP_FROM || '"Navokta Notes" <noreply@navokta.com>',
        to: user.email, // Send individually to allow personalization
        subject: subject,
        // Optional: Preheader text (shows up next to subject in inbox)
        headers: preheader ? { 'X-Preheader': preheader } : {},
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                background-color: #f3f4f6;
                color: #1f2937;
              }
              .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              }
              .banner {
                width: 100%;
                height: 180px;
                background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .banner img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              .banner-text {
                color: white;
                font-size: 24px;
                font-weight: 700;
                letter-spacing: 0.5px;
              }
              .content {
                padding: 32px;
              }
              .preheader {
                font-size: 14px;
                color: #6b7280;
                font-style: italic;
                margin-bottom: 16px;
                padding-left: 12px;
                border-left: 3px solid #e5e7eb;
              }
              .subject {
                font-size: 22px;
                font-weight: 700;
                color: #111827;
                margin-bottom: 20px;
                line-height: 1.3;
              }
              .message {
                font-size: 16px;
                line-height: 1.7;
                color: #374151;
                white-space: pre-wrap;
              }
              .message a {
                color: #8B5CF6;
                text-decoration: underline;
                font-weight: 500;
              }
              .footer {
                background-color: #f9fafb;
                padding: 24px 32px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
              }
              .footer p {
                margin: 6px 0;
                font-size: 13px;
                color: #6b7280;
              }
              .footer .brand {
                font-weight: 600;
                color: #4b5563;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              ${bannerUrl ? `
                <div class="banner">
                  <img src="${bannerUrl}" alt="Newsletter Banner" />
                </div>
              ` : `
                <div class="banner">
                  <span class="banner-text">Navokta Notes</span>
                </div>
              `}
              
              <div class="content">
                ${preheader ? `<div class="preheader">${preheader}</div>` : ''}
                
                <div class="subject">${subject}</div>
                
                <div class="message">${personalizedMessage}</div>
              </div>
              
              <div class="footer">
                <p class="brand">Navokta Notes</p>
                <p>You are receiving this email because you are registered on our platform.</p>
                <p>© ${new Date().getFullYear()} Navokta Notes. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      return transporter.sendMail(mailOptions);
    });

    // Wait for all personalized emails to be sent
    await Promise.all(emailPromises);

    return NextResponse.json({
      message: 'Newsletter sent successfully',
      sentCount: users.length,
      audience: audience || 'all',
      recipientLabel,
    });

  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter: ' + error.message },
      { status: 500 }
    );
  }
}