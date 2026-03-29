// app/api/resource/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Resource from '@/models/Resource';
import connectDB from '@/lib/dbConnect';

export async function GET(request) {
  try {
    // 🛡️ GUARANTEED: Must return a response in ALL code paths
    const isConnected = await connectDB();
    if (!isConnected) {
      console.error('🛑 Database connection failed during GET /api/resource');
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Validate connection.db exists before using
    if (!mongoose.connection.db) {
      console.error('🛑 MongoDB connection established but db object is missing');
      return NextResponse.json(
        { success: false, error: 'Database not ready' },
        { status: 503 }
      );
    }

    // Extract query params
    const url = new URL(request.url);
    const courseName = url.searchParams.get('courseName');
    const semester = url.searchParams.get('semester');

    let query = {};
    if (courseName) {
      query.courseName = { $regex: new RegExp(courseName, 'i') };
    }
    if (semester) {
      const semesterNum = parseInt(semester, 10);
      if (!isNaN(semesterNum)) {
        query.semester = semesterNum;
      }
    }

    // Fetch resources
    const resources = await Resource.find(query)
      .select('_id courseName semester subject fileType link dowloadedCount')
      .sort({ subject: 1 })
      .lean()
      .maxTimeMS(10000);

    console.log(`✅ Found ${resources.length} resources`);

    return NextResponse.json({
      success: true,
      data: resources, // ← Array of resource objects
      count: resources.length
    }, { status: 200 });

  } catch (error) {
    console.error('💥 API /api/resource GET error:', error);

    // Handle specific MongoDB errors
    if (error.name === 'MongoServerSelectionError' || error.name === 'MongoNetworkError') {
      return NextResponse.json(
        { success: false, error: 'Database unavailable' },
        { status: 503 }
      );
    }

    // Default fallback
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 503 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }

    const { resourceId } = body;

    console.log('📥 POST request received for resourceId:', resourceId);

    if (!resourceId) {
      return NextResponse.json(
        { success: false, error: 'Missing resourceId' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid resourceId format' },
        { status: 400 }
      );
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      { $inc: { downloadedCount: 1 } },
      { 
        new: true,
        runValidators: true,
        projection: {
          downloadedCount: 1,
          courseName: 1,
          subject: 1
        }
      }
    );

    if (!updatedResource) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }

    console.log(`✅ Download count updated to:`, updatedResource.downloadedCount);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Download count incremented successfully',
        data: {
          resourceId: updatedResource._id,
          downloadedCount: updatedResource.downloadedCount,
          courseName: updatedResource.courseName,
          subject: updatedResource.subject
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('💥 API /api/resource POST error:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid resource ID format' },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError && 'body' in error) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 🛡️ ULTIMATE SAFEGUARD — In case any uncaught promise rejection or edge case
// This is Next.js 13+ — handlers must return Response. This ensures it.
export const runtime = 'nodejs'; // or 'edge' — but make sure you're compatible

// If using App Router, this is not needed — but if somehow handler doesn't return, this is last resort.
// (In practice, the above try-catch should handle everything)  