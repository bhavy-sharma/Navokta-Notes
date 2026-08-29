import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Resource from "@/models/Resource";

export async function GET() {
  await connectDB();
  try {
    const notes = await Resource.find({}).sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}                    