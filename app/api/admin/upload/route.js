import { NextResponse } from "next/server";
import connectDB from "../../../../lib/dbConnect";
import Resource from "../../../../models/Resource";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  await connectDB();

  try {
    const formData = await req.formData();
    
    const subject = formData.get("subject");
    const courseName = formData.get("courseName");
    const semester = formData.get("semester");
    const fileType = formData.get("fileType");
    let link = formData.get("link");
    
    // Check if there is a file in the form data
    const file = formData.get("file");

    if (!subject || !courseName || !semester || !fileType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // If it's a PDF and there's a file, upload to Cloudinary
    if (fileType === 'PDF' && file && typeof file === 'object') {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // We use upload_stream since we are reading from memory
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "navokta_resources" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Error:", error);
              return reject(error);
            }
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
      
      link = uploadResult.secure_url;
    }

    if (!link) {
        return NextResponse.json({ error: "A valid link or file is strictly required" }, { status: 400 });
    }

    // Create new resource in MongoDB
    const newResource = new Resource({
      subject,
      courseName,
      semester: Number(semester),
      fileType,
      link,
      DownloadCount: 0,
      uploadedAt: new Date()
    });

    await newResource.save();

    return NextResponse.json(
      { message: "Resource uploaded successfully", resource: newResource },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving resource:", error);
    return NextResponse.json(
      { error: "Failed to save resource", details: error.message },
      { status: 500 }
    );
  }
}