import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    // Return user without password
    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;

    return NextResponse.json(
      { 
        message: 'Admin created successfully',
        user: adminResponse 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding admin:', error);
    return NextResponse.json(
      { message: 'Failed to add admin' },
      { status: 500 }
    );
  }
}