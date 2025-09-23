// app/api/debug/resources/route.js
import connectDB from '@/lib/dbConnect';
import Resource from '@/models/Resource';

export async function GET() {
  await connectDB();

  try {
    const allResources = await Resource.find({});
    return Response.json({
      count: allResources.length,
      data: allResources
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}