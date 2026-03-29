import { NextResponse } from "next/server";
import connectDB from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

export async function GET(req) {
  await connectDB();
  try {
    const admins = await User.find({ role: 'admin' }).select("-password");
    return NextResponse.json(admins);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  await connectDB();
  try {
    const { id, name, email, password } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const updateData = { name, email };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedAdmin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    return NextResponse.json({ message: "Admin updated successfully", admin: updatedAdmin });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectDB();
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const deletedAdmin = await User.findByIdAndDelete(id);
    if (!deletedAdmin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    
    return NextResponse.json({ message: "Admin deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
