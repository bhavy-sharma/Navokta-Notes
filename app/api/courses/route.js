// app/api/courses/route.js
import { connectToDB } from '@/lib/dbConnect';
import Course from '@/models/Course';

// GET: List all courses
export const GET = async () => {
  try {
    await connectToDB();
    const courses = await Course.find({});
    return new Response(JSON.stringify(courses), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Server error', error: error.message }),
      { status: 500 }
    );
  }
};

// POST: Add new course
export const POST = async (req) => {
  try {
    await connectToDB();
    const { name, code } = await req.json();

    if (!name || !code) {
      return new Response(
        JSON.stringify({ message: 'Name and code are required' }),
        { status: 400 }
      );
    }

    const exists = await Course.findOne({ $or: [{ name }, { code }] });
    if (exists) {
      return new Response(
        JSON.stringify({ message: 'Course already exists' }),
        { status: 409 }
      );
    }

    const course = new Course({ name, code: code.toLowerCase() });
    const saved = await course.save();

    return new Response(
      JSON.stringify(saved),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Server error', error: error.message }),
      { status: 500 }
    );
  }
};