import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/models/Resource';

export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const resource = await Resource.findByIdAndUpdate(
      id,
      { $inc: { downloadedCount: 1 } },
      { new: true }
    );

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Download tracked successfully',
      downloadedCount: resource.downloadedCount
    });
  } catch (error) {
    console.error('Error tracking download:', error);
    return NextResponse.json(
      { error: 'Failed to track download' },
      { status: 500 }
    );
  }
}