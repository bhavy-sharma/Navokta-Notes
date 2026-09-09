import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const POST = async (req) => {
  try {
    // 1. Critical Environment Variable Checks
    if (!process.env.MONGODB_URI) {
      console.error('❌ CRITICAL: MONGODB_URI is missing in .env.local');
      return new Response(JSON.stringify({ message: 'Database configuration error' }), { status: 500 });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ CRITICAL: JWT_SECRET is missing in .env.local');
      return new Response(JSON.stringify({ message: 'Server configuration error' }), { status: 500 });
    }

    await connectDB();
    
    // 2. Safely parse JSON
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error('❌ JSON Parse Error: The request body was not valid JSON.');
      return new Response(JSON.stringify({ message: 'Invalid request payload' }), { status: 400 });
    }

    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    // 3. Find user (ensure password is selected if your model excludes it by default)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    
    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
    }

    // 4. Safety check: Ensure the user actually has a password in the database
    if (!user.password) {
      console.error(`❌ User found but password is missing in database for: ${email}`);
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
    }

    // 5. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
    }

    // 6. Generate JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role || 'user', // Fallback to 'user' if role is undefined
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        token,
        user: { 
          id: user._id,
          name: user.name, 
          email: user.email, 
          role: user.role || 'user',
          avatar: user.avatar || null 
        }
      }),
      { status: 200 }
    );

  } catch (error) {
    // 🚨 THIS WILL PRINT THE EXACT ERROR TO YOUR TERMINAL 🚨
    console.error('=== 🔥 LOGIN API CRASHED 🔥 ===');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Full Stack:', error.stack);
    console.error('===============================');
    
    return new Response(
      JSON.stringify({ 
        message: 'Internal Server Error', 
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong during login' 
      }),
      { status: 500 }
    );
  }
};