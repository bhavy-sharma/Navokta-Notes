import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    const admins = await User.find({ role: 'admin' })
      .select('-password') // Exclude password
      .sort({ createdAt: -1 });
    
    return NextResponse.json(admins, { status: 200 });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
}