// app/api/admin/add-course/route.js
import { NextResponse } from 'next/server';
import Course from '@/models/Course';
import { connectDB } from '@/lib/dbConnect';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectDB(); 

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'invalid_token', message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Verify admin role if stored in token
    // if (decoded.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'insufficient_permissions', message: 'Admin access required' },
    //     { status: 403 }
    //   );
    // }

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

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'invalid_token', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

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