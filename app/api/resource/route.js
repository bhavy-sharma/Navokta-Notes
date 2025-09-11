// app/api/courses/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Resource from '@/models/Resource'; 

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

export async function GET() {
  try {
    await connectDB();

    const courses = await Resource.aggregate([
      {
        $group: {
          _id: '$courseName',
          semester: { $first: '$semester' },
          subject: { $first: '$subject' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          courseName: '$_id',
          semester: 1,
          description: '$subject' 
        }
      },
      {
        $sort: { courseName: 1 } 
      }
    ]);


    return NextResponse.json({
      success: true,
      data: courses,
      count: courses.length
    }, { status: 200 });

  } catch (error) {
    console.error('API /courses error:', error);

    if (error.message.includes('Failed to connect')) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}