// app/api/admin/upload/route.js
import { connectDB } from '@/lib/dbConnect';
import Resource from '@/models/Resource';
import Course from '@/models/Course';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'navokta-notes-admin-secret';

export const POST = async (req) => {
  try {
    await connectDB();

    // Verify JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    const token = authHeader.split(' ')[1];
    if (!token) return new Response(JSON.stringify({ message: 'Token required' }), { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return new Response(JSON.stringify({ message: 'Invalid token' }), { status: 403 });
    }

    if (decoded.role !== 'admin') {
      return new Response(JSON.stringify({ message: 'Access denied' }), { status: 403 });
    }

    // Parse body
    const body = await req.json();
    const { title, courseCode, type, youtubeUrl, fileUrl } = body;

    if (!title || !courseCode || !type) {
      return new Response(
        JSON.stringify({ message: 'Title, course, and type are required' }),
        { status: 400 }
      );
    }

    // Find course by code
    const course = await Course.findOne({ code: courseCode.toLowerCase() });
    if (!course) {
      return new Response(
        JSON.stringify({ message: 'Course not found' }),
        { status: 404 }
      );
    }

    // Create resource
    const resource = new Resource({
      title,
      type,
      youtubeUrl,
      fileUrl,
      course: course._id,
      uploadedBy: decoded.id,
    });

    const saved = await resource.save();

    return new Response(
      JSON.stringify({ 
        message: 'Resource uploaded successfully', 
        resource: saved 
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