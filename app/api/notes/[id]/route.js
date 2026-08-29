import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Resource from '@/models/Resource';

// UPDATE Resource
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { subject, courseName, semester, fileType, link } = body;

    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      { subject, courseName, semester, fileType, link },
      { new: true, runValidators: true }
    );

    if (!updatedResource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedResource, { status: 200 });
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

// DELETE Resource
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedResource = await Resource.findByIdAndDelete(id);

    if (!deletedResource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Resource deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}