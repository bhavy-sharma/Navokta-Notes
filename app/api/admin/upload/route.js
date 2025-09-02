import { connectToDB } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import Resource from '@/models/Resource';
import User from '@/models/User';
import Course from '@/models/Course';
import { NextResponse } from 'next/server';
import multer from 'multer';
import { Readable } from 'stream';

const upload = multer();

export const POST = async (req) => {
  await connectToDB();

  const token = req.headers.get('Authorization')?.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const title = formData.get('title');
  const type = formData.get('type');
  const courseCode = formData.get('course');
  const youtubeUrl = formData.get('youtubeUrl');
  const file = formData.get('file');

  const course = await Course.findOne({ code: courseCode });
  if (!course) return NextResponse.json({ message: 'Course not found' }, { status: 404 });

  let fileUrl = null;

  if (file && (type === 'pdf' || type === 'pyq')) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    fileUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'raw', folder: 'notes-platform' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      stream.pipe(uploadStream);
    });
  }

  const resource = new Resource({
    title,
    type,
    fileUrl,
    youtubeUrl,
    course: course._id,
    uploadedBy: decoded.id,
  });

  await resource.save();
  return NextResponse.json({ message: 'Uploaded successfully', resource });
};