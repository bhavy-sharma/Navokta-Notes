// app/api/admin/upload/route.js

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // 👈 adjust path to your DB connection
import Resource from "@/models/Resource"; // 👈 adjust path to your Mongoose model

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();

    const {
      subject,
      courseName,
      semester,
      fileType,
      link // 👈 This is the Appwrite file URL from frontend
    } = body;

    if (!subject || !courseName || !semester || !fileType || !link) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new resource in MongoDB
    const newResource = new Resource({
      subject,
      courseName,
      semester: Number(semester),
      fileType,
      link,
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