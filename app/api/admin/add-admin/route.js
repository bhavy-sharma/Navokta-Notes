import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const POST = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: 'Name, email, and password are required', error: 'missing_fields' }), { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User with this email already exists', error: 'user_exists' }), { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new User({ name, email, password: hashedPassword, role: 'admin' });
    const savedAdmin = await admin.save();

    return new Response(JSON.stringify({
      message: 'Admin created successfully',
      user: { id: savedAdmin._id, name: savedAdmin.name, email: savedAdmin.email, role: savedAdmin.role },
    }), { status: 201 });
  } catch (error) {
    console.error('Error in add-admin route:', error);
    return new Response(JSON.stringify({ message: 'Server error', error: error.message }), { status: 500 });
  }
};