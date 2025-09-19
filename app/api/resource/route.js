// app/api/resource/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Resource from '@/models/Resource';

// Enhanced connection function with better error handling
async function connectDB() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      return true;
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    return false;
  }
}

export async function GET(request) {
  try {
    // Connect to database with error handling
    const isConnected = await connectDB();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 503 }
      );
    }

    // Extract query params
    const url = new URL(request.url);
    const courseName = url.searchParams.get('courseName');
    const semester = url.searchParams.get('semester');

    console.log('Query params:', { courseName, semester });

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

    // Debug: Check if collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Fetch resources with case-insensitive search and better error handling
    const resources = await Resource.find({
      courseName: { $regex: new RegExp(courseName, 'i') }, // Case-insensitive
      semester: semesterNum
    })
      .select('_id courseName semester subject fileType link downloadedCount')
      .sort({ subject: 1 })
      .lean()
      .maxTimeMS(10000); // Add timeout

    console.log('Found resources:', resources.length);
    console.log('Sample resource:', resources[0]);

    return NextResponse.json({
      success: true,
      data: resources,
      count: resources.length
    }, { status: 200 });

  } catch (error) {
    console.error('API /api/resource GET error:', error);
    
    // More specific error handling
    if (error.name === 'MongoServerSelectionError') {
      return NextResponse.json(
        { success: false, error: 'Database connection timeout' },
        { status: 503 }
      );
    }
    
    if (error.name === 'MongoNetworkError') {
      return NextResponse.json(
        { success: false, error: 'Network error connecting to database' },
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
    const isConnected = await connectDB();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: 'Database connection failed' },
        { status: 503 }
      );
    }

    const { resourceId } = await request.json();
    console.log('POST request received for resourceId:', resourceId);

    if (!resourceId || !mongoose.Types.ObjectId.isValid(resourceId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing resourceId' },
        { status: 400 }
      );
    }
    
    // Use atomic update
    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      { $inc: { downloadedCount: 1 } },
      { new: true, runValidators: true }
    );

    if (!updatedResource) {
      return NextResponse.json(
        { success: false, error: 'Resource not found' },
        { status: 404 }
      );
    }

    console.log('Updated download count:', updatedResource.downloadedCount);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Download count updated', 
        downloadedCount: updatedResource.downloadedCount 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('API /api/resource POST error:', error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid resource ID format' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to update download count' },
      { status: 500 }
    );
  }
}