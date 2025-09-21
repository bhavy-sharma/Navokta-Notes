// app/api/admin/add-course/route.js
import { NextResponse } from 'next/server';
import Course from '@/models/Course';
import { connectDB } from '@/lib/dbConnect';

export async function POST(request) {
  try {
    await connectDB();

    // ✅ AUTHENTICATION REMOVED — as requested

    const body = await request.json();
    const { courseName, semester, description = '' } = body;

    // Validate required fields
    if (!courseName || semester === undefined) {
      return NextResponse.json(
        { message: 'Course name and semester are required' },
        { status: 400 }
      );
    }

    // ✅ DUPLICATE SEMESTER CHECK REMOVED — allowing duplicates

    const newCourse = new Course({
      courseName,
      semester: parseInt(semester, 10), // Ensure it's a number
      description,
    });

    await newCourse.save();

    return NextResponse.json(
      { message: 'Course/Semester added successfully', course: newCourse },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add Course Error:', error);

    // Generic error handling — no JWT or duplicate key specifics
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}