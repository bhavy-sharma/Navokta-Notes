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

    const body = await req.json();
    const { subject, courseName, semester, fileType, link } = body;

    if (!subject || !link || !fileType || !courseName || !semester) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    // Correct course lookup
    const course = await Course.findOne({ courseName });
    if (!course) {
      return new Response(JSON.stringify({ message: 'Course not found' }), { status: 404 });
    }

    // Prevent duplicate resource
    const exists = await Resource.findOne({ courseName, semester, subject });
    if (exists) {
      return new Response(JSON.stringify({ message: 'Resource already exists' }), { status: 409 });
    }

    // Save resource
    const resource = new Resource({
      subject,
      courseName,
      semester,
      fileType,
      link,
     // Initialize download count
    });

    const saved = await resource.save();

    return new Response(
      JSON.stringify({ message: 'Resource uploaded successfully', resource: saved }),
      { status: 201 }
    
    );

  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error', error: error.message }), { status: 500 });
  }
};
