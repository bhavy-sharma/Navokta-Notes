import { NextResponse } from "next/server";
import connectDB from "../../../../lib/dbConnect";
import Course from "../../../../models/Course";

export async function PUT(req) {
  await connectDB();
  try {
    const { id, courseName, semester, description } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { courseName, semester, description },
      { new: true }
    );

    if (!updatedCourse) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    return NextResponse.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) return NextResponse.json({ error: "Course not found" }, { status: 404 });
    
    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
