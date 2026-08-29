import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/models/Resource';

export async function GET() {
  try {
    await connectDB();
    const resources = await Resource.find({}).sort({ createdAt: -1 });
    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}