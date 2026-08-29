import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET() {
  await connectDB();
  try {
    const admins = await User.find({ role: 'admin' }).select("-password").sort({ createdAt: -1 });
    return NextResponse.json(admins);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}