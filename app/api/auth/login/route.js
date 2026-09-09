import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Ensure JWT_SECRET is defined, fallback is only for local development
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('CRITICAL: JWT_SECRET is not defined in environment variables');
}

export const POST = async (req) => {
  try {
    await connectDB();
    
    const body = await req.json();
    const { email, password } = body;

    // 1. Validate Input
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required' }),
        { status: 400 }
      );
    }

    // 2. Find user (explicitly select fields we need, exclude sensitive ones if any)
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      // Use generic message to prevent email enumeration attacks
      return new Response(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    // 3. Check if the user has verified their email
    if (!user.isVerified) {
      return new Response(
        JSON.stringify({ 
          message: 'Please verify your email address before logging in',
          requiresVerification: true 
        }),
        { status: 403 }
      );
    }

    // 4. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: 'Invalid email or password' }),
        { status: 401 }
      );
    }

    // 5. Generate JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role,
        name: user.name 
      },
      JWT_SECRET || 'dev-fallback-secret-do-not-use-in-prod',
      { expiresIn: '7d' }
    );

    // 6. Return success response
    return new Response(
      JSON.stringify({
        message: 'Login successful',
        token,
        user: { 
          id: user._id,
          name: user.name, 
          email: user.email, 
          role: user.role,
          avatar: user.avatar || null // Fallback to null if avatar is undefined
        }
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    
    // Mask internal error details in production for security
    const isDev = process.env.NODE_ENV === 'development';
    return new Response(
      JSON.stringify({ 
        message: 'Internal Server Error', 
        error: isDev ? error.message : 'Something went wrong during login' 
      }),
      { status: 500 }
    );
  }
};