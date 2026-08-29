import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password, role } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'user',
    });

    // Return user without password
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userResponse 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding user:', error);
    return NextResponse.json(
      { message: 'Failed to add user: ' + error.message },
      { status: 500 }
    );
  }
}