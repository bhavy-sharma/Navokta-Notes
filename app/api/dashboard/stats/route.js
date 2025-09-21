// /api/stats.js
// app/api/dashboard/stats/route.js
import Course from "@/models/Course";
import { connectDB } from "@/lib/dbConnect";
import Resource from "@/models/Resource";

export async function GET() {
  try {
    await connectDB();

    const totalCourses = await Course.countDocuments();
    const totalDownloads=await Resource.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$downloadCount" }
        }
      }
    ]);

    
    const totalDownloadsCount = totalDownloads.length > 0 ? totalDownloads[0].total : 0;


    if (totalCourses === 0) {
      return new Response(
        JSON.stringify({ message: "No courses found", totalCourses: 0 }),
        { status: 200 } 
      );
    }

   
    return new Response(
      JSON.stringify({ totalCourses, totalDownloads: totalDownloadsCount }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}
