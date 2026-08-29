import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/models/Resource';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { subject, courseName, semester, fileType, link } = body;

    // Validate required fields
    if (!subject || !courseName || !semester || !fileType || !link) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    const newResource = await Resource.create({
      subject,
      courseName,
      semester,
      fileType,
      link,
      downloadedCount: 0
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error('Error uploading resource:', error);
    return NextResponse.json(
      { message: 'Failed to upload resource' },
      { status: 500 }
    );
  }
}