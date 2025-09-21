// /api/courses/trending.js
import { connectDB } from "@/lib/dbConnect";
import Resource from "@/models/Resource";
export async function GET() {
  try {
    await connectDB();
    // Simulate fetching trending courses from MongoDB
    const trandingCourse=await Resource.find().sort({downloadCount:-1}).limit(4);
    if(!trandingCourse){
      return new Response(
        JSON.stringify({ message: "No trending courses found", trendingCourses: [] }),
        { status: 200 }
      );
    }
    const trendingCourses = trandingCourse.map(course => ({
      _id: course._id,
      courseName: course.courseName,
      downloadedCount: course.downloadedCount,
      color: "from-blue-900/30 to-cyan-900/30", 
      border: "border-blue-800/50"
    }));
    return new Response(
      JSON.stringify(trendingCourses),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}