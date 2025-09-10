// app/api/courses/route.js
import { NextResponse } from 'next/server'; // ✅ Use NextResponse in App Router
import { connectDB } from '@/lib/dbConnect'; // ✅ Fixed: Use connectDB (not connectToDB)
import Course from '@/models/Course';

// GET: List all courses
export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find({}).sort({ semester: 1 }); // ✅ Sort for better UX
    return NextResponse.json(courses); // ✅ Clean response
  } catch (error) {
    console.error('GET Courses Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch courses', error: error.message },
      { status: 500 }
    );
  }
}

// POST: Add new course
export async function POST(request) { // ✅ 'request' not 'req, res'
  try {
    await connectDB();

    const body = await request.json(); // ✅ Parse body from request
    const { courseName, semester, description = '' } = body;

    if (!courseName || semester === undefined) {
      return NextResponse.json(
        { message: 'Course name and semester are required' },
        { status: 400 }
      );
    }

    // Check for duplicate courseName + semester combo or unique semester
    const exists = await Course.findOne({ semester }); // Since semester is unique per schema
    if (exists) {
      return NextResponse.json(
        {
          message: `Semester ${semester} already exists for course: ${exists.courseName}`,
        },
        { status: 409 }
      );
    }

    const newCourse = await Course.create({
      courseName,
      semester: parseInt(semester, 10),
      description,
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('POST Course Error:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'Duplicate entry detected' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}