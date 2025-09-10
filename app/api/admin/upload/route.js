// app/api/admin/upload/route.js
import { connectDB } from '@/lib/dbConnect';
import Resource from '@/models/Resource';
import jwt from 'jsonwebtoken';

// Use environment variable or fallback
const JWT_SECRET = process.env.JWT_SECRET || 'navokta-notes-admin-secret';

export const POST = async (req) => {
  try {
    // 1. Connect to DB
    await connectDB();
    console.log('✅ API: Connected to database');

    // 2. Get Authorization header
    // const authHeader = req.headers.get('authorization');
    // if (!authHeader) {
    //   return new Response(
    //     JSON.stringify({ message: 'Authorization header missing' }),
    //     { status: 401 }
    //   );
    // }

    // const token = authHeader.split(' ')[1];
    // if (!token) {
    //   return new Response(
    //     JSON.stringify({ message: 'Token missing' }),
    //     { status: 401 }
    //   );
    // }

    // 3. Verify JWT
    // let decoded;
    // try {
    //   decoded = jwt.verify(token, JWT_SECRET);
    //   console.log('✅ JWT Verified:', decoded);
    // } catch (err) {
    //   return new Response(
    //     JSON.stringify({ message: 'Invalid or expired token' }),
    //     { status: 403 }
    //   );
    // }

    // 4. Check if user is admin
    // if (decoded.role !== 'admin') {
    //   return new Response(
    //     JSON.stringify({ message: 'Access denied. Admins only.' }),
    //     { status: 403 }
    //   );
    // }

    // 5. Parse request body
    const body = await req.json();
    console.log('📥 Received payload:', body);

    const {  courseName, semester, subject, fileType, link } = body;

    // 6. Validate required fields
    if (!subject || !link||!fileType ||!courseName ||!semester) {
      return new Response(
        JSON.stringify({ message: 'Title and type are required' }),
        { status: 400 }
      );
    }

    // 7. Create new resource
    // const resource = new Resource({
    //   courseName,
    //  semester,
    //   subject,
    //   fileType: ['PDF', 'YouTubeLink', 'ExternalLink'].includes(type) ? fileUrl : undefined,
    //   link,
    // });

    // 8. Save to MongoDB
    let savedResource;
    try {
      // savedResource = await resource.save();
      savedResource = await Resource.create({
        courseName,
        semester,
        subject,
        fileType,
        link,
      });
      console.log('✅ Resource saved to MongoDB:', savedResource);
    } catch (saveError) {
      console.error('❌ DB Save Error:', saveError);
      return new Response(
        JSON.stringify({
          message: 'Failed to save resource to database',
          error: saveError.message,
        }),
        { status: 500 }
      );
    }

    // 9. Return success
    return new Response(
      JSON.stringify({
        message: 'Resource uploaded successfully',
        resource: savedResource,
      }),
      { status: 201 }
    );
  } catch (error) {
    // 10. Catch any unexpected server errors
    console.error('❌ Unexpected Server Error:', error);
    return new Response(
      JSON.stringify({
        message: 'Internal Server Error',
        error: error.message,
      }),
      { status: 500 }
    );
  }
};