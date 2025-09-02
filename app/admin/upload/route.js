import { connectToDB } from '@/lib/dbConnect';
import Resource from '@/models/Resource';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'navokta-notes-admin-secret';

export const POST = async (req) => {
  try {
    await connectToDB();
    console.log('✅ Connected to DB');

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ message: 'No token provided' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ JWT Verified:', decoded);
    } catch (err) {
      return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 403 });
    }

    const body = await req.json();
    console.log('📥 Received Data:', body);

    const { title, type, youtubeUrl, fileUrl } = body;

    if (!title || !type) {
      return new Response(JSON.stringify({ message: 'Title and type are required' }), { status: 400 });
    }

    const resource = new Resource({
      title,
      type,
      youtubeUrl,
      fileUrl,
      uploadedBy: decoded.id,
    });

    try {
      const saved = await resource.save();
      console.log('✅ Resource saved to MongoDB:', saved);
      return new Response(
        JSON.stringify({ message: 'Uploaded successfully', resource: saved }),
        { status: 201 }
      );
    } catch (saveError) {
      console.error('❌ Save Error:', saveError);
      return new Response(
        JSON.stringify({ message: 'Failed to save to DB', error: saveError.message }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Server Error:', error);
    return new Response(
      JSON.stringify({ message: 'Server error', error: error.message }),
      { status: 500 }
    );
  }
};