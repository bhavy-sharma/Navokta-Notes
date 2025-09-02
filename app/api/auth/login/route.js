// app/api/auth/login/route.js
import { connectToDB } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const POST = async (req) => {
  try {
    await connectToDB();

    const { email, password } = await req.json();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User not found. Please register first.' }),
        { status: 404 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }),
        { status: 401 }
      );
    }

    // You can generate JWT here if needed
    return new Response(
      JSON.stringify({ 
        message: 'Login successful',
        user: { name: user.name, email: user.email, role: user.role }
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
};