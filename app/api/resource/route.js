// app/api/resource/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Resource from '@/models/Resource';

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

export async function GET(request) {
  try {
    await connectDB();

    // Extract query params
    const url = new URL(request.url);
    const courseName = url.searchParams.get('courseName');
    const semester = url.searchParams.get('semester');

    // Validate required params
    if (!courseName || !semester) {
      return NextResponse.json(
        { success: false, error: 'Missing courseName or semester parameter' },
        { status: 400 }
      );
    }

    const semesterNum = parseInt(semester);
    if (isNaN(semesterNum)) {
      return NextResponse.json(
        { success: false, error: 'semester must be a valid number' },
        { status: 400 }
      );
    }

    // Fetch resources matching courseName and semester
    const resources = await Resource.find({
      courseName: courseName,
      semester: semesterNum
    })
      .select('_id courseName semester subject fileType link dowloadedCount')
      .sort({ subject: 1 })
      .lean(); // Faster JSON serialization

    return NextResponse.json({
      success: true,
      data: resources, // ← Array of resource objects
      count: resources.length
    }, { status: 200 });

  } catch (error) {
    console.error('API /api/resource error:', error);

    if (error.message.includes('Failed to connect')) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { resourceId } = await request.json();

    if (!resourceId || !mongoose.Types.ObjectId.isValid(resourceId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing resourceId' },
        { status: 400 }
      );
    }
    
    const resource = await Resource.findById(resourceId);
    console.log('Resource found:', resource);
    if (!resource) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }
    
    resource.dowloadedCount = (resource.dowloadedCount || 0) + 1;
      console.log('Updated download count:', resource.dowloadedCount);
    await resource.save();
    return NextResponse.json(
      { success: true, message: 'Download count updated', downloadedCount: resource.dowloadedCount },
      { status: 200 }
    );
  }
  catch (error) {
    console.error('API /api/resource POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update download count' },
      { status: 500 }
    );
  }
}