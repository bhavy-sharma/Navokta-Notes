import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: 'study_resources',
          resource_type: 'raw',
          format: 'pdf',
          public_id: `${Date.now()}_${file.name.replace('.pdf', '')}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Write buffer to stream
      const { Readable } = require('stream');
      const readableStream = Readable.from(buffer);
      readableStream.pipe(uploadStream);
    });

    return NextResponse.json(
      { 
        url: result.secure_url,
        public_id: result.public_id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed: ' + error.message },
      { status: 500 }
    );
  }
}

// Optional: Increase payload size limit
export const config = {
  api: {
    bodyParser: false,
  },
};