import { NextResponse } from 'next/server';
import Course from '@/models/Course';
import { connectDB } from '@/lib/dbConnect';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { courseName, semester, description = '' } = body;

    if (!courseName || semester === undefined) {
      return NextResponse.json({ message: 'Course name and semester are required' }, { status: 400 });
    }

    const newCourse = new Course({
      courseName,
      semester: parseInt(semester, 10),
      description,
    });

    await newCourse.save();
    return NextResponse.json({ message: 'Course/Semester added successfully', course: newCourse }, { status: 201 });
  } catch (error) {
    console.error('Add Course Error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}