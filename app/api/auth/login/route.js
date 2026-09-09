// ... (imports remain the same)

export const POST = async (req) => {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ message: 'Email and password are required' }), { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
    }

    // ✅ REMOVED: The if (!user.isVerified) block is gone. 
    // Users can now log in regardless of verification status.

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'dev-fallback-secret-do-not-use-in-prod',
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
          role: user.role,
          avatar: user.avatar || null 
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    const isDev = process.env.NODE_ENV === 'development';
    return new Response(
      JSON.stringify({ message: 'Internal Server Error', error: isDev ? error.message : 'Something went wrong' }),
      { status: 500 }
    );
  }
};