// app/api/contact/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Query from '@/models/Query';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { status, reply } = body;

    const updateData = {};
    if (status) updateData.status = status;
    if (reply) {
      updateData.reply = reply;
      updateData.repliedAt = new Date();
    }

    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedQuery) {
      return NextResponse.json(
        { error: 'Query not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedQuery);
  } catch (error) {
    console.error('Error updating query:', error);
    return NextResponse.json(
      { error: 'Failed to update query' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedQuery = await Query.findByIdAndDelete(id);

    if (!deletedQuery) {
      return NextResponse.json(
        { error: 'Query not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Query deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting query:', error);
    return NextResponse.json(
      { error: 'Failed to delete query' },
      { status: 500 }
    );
  }
}