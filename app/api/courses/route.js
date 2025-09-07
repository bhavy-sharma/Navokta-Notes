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
export const POST = async (req,res) => {
  try {
    await connectToDB();
    const { courseName,semester } = await req.json();

    // if (!name || !code) {
    //   return new Response(
    //     JSON.stringify({ message: 'Name and code are required' }),
    //     { status: 400 }
    //   );
    // }
    if(!courseName || !semester) {
      return res.status(400).json({ message: 'Course name and semester are required' });
    }

    const exists = await Course.findOne({ $or: [{ courseName }, { semester }] });
    // if (exists) {
    //   return new Response(
    //     JSON.stringify({ message: 'Course already exists' }),
    //     { status: 409 }
    //   );
    // }

    if(exists){
      return res.status(409).json({ message: 'Course already exists' });
    }

    // const course = new Course({ name, code: code.toLowerCase() });
    // const saved = await course.save();

    const Course= await Course.create({courseName, semester})

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