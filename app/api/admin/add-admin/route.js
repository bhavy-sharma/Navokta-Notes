// app/api/admin/add-admin/route.js
import { connectToDB } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'navokta-notes-admin-secret';
import jwt from 'jsonwebtoken';
{/*hii  */}
export const POST = async (req) => {
  try {
    await connectToDB();

    // Verify admin JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ message: 'Token required' }), { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 403 });
    }

    if (decoded.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Access denied. Admins only.' }), { status: 403 });
    }

    // Parse body
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: 'Name, email, and password are required' }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User with this email already exists' }),
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    const savedAdmin = await admin.save();

    return new Response(
      JSON.stringify({
        message: 'Admin created successfully',
        user: { name: savedAdmin.name, email: savedAdmin.email, role: savedAdmin.role },
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Server error', error: error.message }),
      { status: 500 }
    );
  }
};