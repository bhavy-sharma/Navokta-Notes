import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { courseName, semester, description } = body;

    // Check if course already exists
    const existingCourse = await Course.findOne({ courseName });
    if (existingCourse) {
      return NextResponse.json(
        { message: 'Course already exists' },
        { status: 400 }
      );
    }

    const newCourse = await Course.create({
      courseName,
      semester,
      description: description || '',
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error adding course:', error);
    return NextResponse.json(
      { message: 'Failed to add course' },
      { status: 500 }
    );
  }
}