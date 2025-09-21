// app/api/dashboard/stats/route.js
import Course from "@/models/Course";
import Resource from "@/models/Resource";
import { connectDB } from "@/lib/dbConnect";

export async function GET() {
  try {
    await connectDB();

    // console.log("✅ DB Connected");

    const totalCourses = await Course.countDocuments();
    // console.log("📚 Total Courses:", totalCourses);

    // 👇 DEBUG: Check if any resources exist
    const sampleResource = await Resource.findOne().select('downloadedCount');
    // console.log("🔍 Sample Resource (downloadedCount):", sampleResource);

    // 👇 DEBUG: Count total resources
    const totalResources = await Resource.countDocuments();
    // console.log("📁 Total Resources in DB:", totalResources);

    // ✅ Fixed: using "downloadedCount" not "downloadCount"
    const totalDownloadsResult = await Resource.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $ifNull: ["$downloadedCount", 0] } } // ← यही ठीक किया!
        }
      }
    ]);

    // console.log("📊 Aggregation Result:", totalDownloadsResult);

    const totalDownloadsCount = totalDownloadsResult.length > 0 
      ? totalDownloadsResult[0].total 
      : 0;

    // console.log("✅ Final Total Downloads:", totalDownloadsCount);

    return new Response(
      JSON.stringify({ 
        totalCourses, 
        totalDownloads: totalDownloadsCount 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Stats API Error:", error);
    return new Response(
      JSON.stringify({ 
        message: "Server error", 
        error: error.message 
      }),
      { status: 500 }
    );
  }
}