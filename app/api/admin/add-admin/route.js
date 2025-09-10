// app/api/admin/add-admin/route.js
import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'navokta-notes-admin-secret';

export const POST = async (req) => {
  try {
    await connectDB();

    // Get authorization header
    const authHeader = req.headers.get('authorization');
    console.log('Authorization Header:', authHeader);
    
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        message: 'Unauthorized: No authorization header',
        error: 'no_auth_header'
      }), { status: 401 });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return new Response(JSON.stringify({ 
        message: 'Invalid authorization header format',
        error: 'invalid_auth_format'
      }), { status: 401 });
    }

    const token = tokenParts[1];
    if (!token) {
      return new Response(JSON.stringify({ 
        message: 'Token required',
        error: 'no_token'
      }), { status: 401 });
    }

    console.log('Token received:', token.substring(0, 30) + '...');

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded token:', decoded);
    } catch (err) {
      console.error('JWT verification error:', err.message);
      return new Response(JSON.stringify({ 
        message: 'Invalid or expired token',
        error: 'invalid_token',
        details: err.message
      }), { status: 403 });
    }

    // Check if user has admin role
    if (!decoded || !decoded.role || decoded.role !== 'admin') {
      return new Response(JSON.stringify({ 
        message: 'Access denied. Admins only.',
        error: 'insufficient_permissions',
        userRole: decoded?.role,
        userId: decoded?.id
      }), { status: 403 });
    }

    // Parse body
    const body = await req.json();
    console.log('Received admin add request body:', body);
    
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ 
          message: 'Name, email, and password are required',
          error: 'missing_fields'
        }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          message: 'User with this email already exists',
          error: 'user_exists'
        }),
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
    console.log('Admin created:', admin);

    const savedAdmin = await admin.save();

    return new Response(
      JSON.stringify({
        message: 'Admin created successfully',
        user: { 
          id: savedAdmin._id,
          name: savedAdmin.name, 
          email: savedAdmin.email, 
          role: savedAdmin.role 
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in add-admin route:', error);
    return new Response(
      JSON.stringify({ 
        message: 'Server error', 
        error: error.message
      }),
      { status: 500 }
    );
  }
};