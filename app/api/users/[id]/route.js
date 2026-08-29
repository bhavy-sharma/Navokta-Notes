import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// UPDATE User
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { name, email, password, role } = body;

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and already exists
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: id } });
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
    }

    const updateData = { 
      name: name || existingUser.name,
      email: email || existingUser.email,
      role: role || existingUser.role || 'user',
    };

    // Only update password if provided
    if (password && password.trim() !== '') {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE User
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last admin' },
          { status: 400 }
        );
      }
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}