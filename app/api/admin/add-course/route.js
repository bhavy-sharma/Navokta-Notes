// app/api/admin/add-course/route.js
import { NextResponse } from 'next/server';
import Course from '@/models/Course';
import { connectDB } from '@/lib/dbConnect';

export async function POST(request) {
  try {
    await connectDB(); 

    // ✅ ALL AUTHENTICATION REMOVED — No token check

    const body = await request.json();
    const { courseName, semester, description = '' } = body;

    if (!courseName || semester === undefined) {
      return NextResponse.json(
        { message: 'Course name and semester are required' },
        { status: 400 }
      );
    }

    // Check for duplicate semester (since it's unique)
    const existing = await Course.findOne({ semester });
    if (existing) {
      return NextResponse.json(
        {
          message: `Semester ${semester} already exists for course: ${existing.courseName}`,
        },
        { status: 409 }
      );
    }

    const newCourse = new Course({
      courseName,
      semester: parseInt(semester, 10),
      description,
    });

    await newCourse.save();

    return NextResponse.json(
      { message: 'Course/Semester added successfully', course: newCourse },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add Course Error:', error);

    // Remove JWT-specific error handling
    // if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') { ... }

    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Duplicate semester entry' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}