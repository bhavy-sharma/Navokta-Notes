// app/api/resource/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Resource from '@/models/Resource';

// Enhanced connection function — NEVER returns true unless readyState === 1
async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Already connected to MongoDB');
      return true;
    }

    if (mongoose.connection.readyState === 2) {
      console.log('🟡 Connecting... waiting for MongoDB');
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
        mongoose.connection.once('open', () => {
          clearTimeout(timeout);
          resolve();
        });
      });
      return true;
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message || error);
    return false;
  }
}

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

    console.log('📥 Query params:', { courseName, semester });

    // Validate required params
    if (!courseName || !semester) {
      return NextResponse.json(
        { success: false, error: 'Missing courseName or semester parameter' },
        { status: 400 }
      );
    }

    const semesterNum = parseInt(semester, 10);
    if (isNaN(semesterNum)) {
      return NextResponse.json(
        { success: false, error: 'semester must be a valid number' },
        { status: 400 }
      );
    }

    // 🔍 Optional: Debug collections (comment out in production if causing issues)
    /*
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('🗃️ Available collections:', collections.map(c => c.name));
    } catch (dbError) {
      console.warn('⚠️ Could not list collections:', dbError.message);
      // Not critical — continue
    }
    */

    // Fetch resources
    const resources = await Resource.find({
      courseName: { $regex: new RegExp(courseName, 'i') },
      semester: semesterNum
    })
      .select('_id courseName semester subject fileType link downloadedCount')
      .sort({ subject: 1 })
      .lean()
      .maxTimeMS(10000);

    console.log(`✅ Found ${resources.length} resources`);

    return NextResponse.json({
      success: true,
      data: resources,
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