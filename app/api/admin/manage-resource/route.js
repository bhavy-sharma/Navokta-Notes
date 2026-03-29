import { NextResponse } from "next/server";
import connectDB from "../../../../lib/dbConnect";
import Resource from "../../../../models/Resource";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req) {
  await connectDB();
  try {
    const { id, subject, courseName, semester, fileType, link } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      { subject, courseName, semester, fileType, link },
      { new: true }
    );

    if (!updatedResource) return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    return NextResponse.json({ message: "Resource updated successfully", resource: updatedResource });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const resource = await Resource.findById(id);
    if (!resource) return NextResponse.json({ error: "Resource not found" }, { status: 404 });

    // Attempt to delete from cloudinary if it's a PDF and has cloudinary path
    if (resource.fileType === 'PDF' && resource.link.includes('cloudinary.com')) {
      // Extract public_id: regex matching the portion after /upload/v<version>/ or /upload/
      const matches = resource.link.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
      if (matches && matches[1] && process.env.CLOUDINARY_API_KEY) {
        try {
          await cloudinary.uploader.destroy(matches[1]);
        } catch(cErr){
          console.error("Failed to delete from Cloudinary", cErr);
        }
      }
    }

    await Resource.findByIdAndDelete(id);
    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
