// /api/stats.js
export default async function handler(req, res) {
  // Aggregate total courses and total downloads
  const totalCourses = await Course.countDocuments();
  const totalDownloads = await DownloadLog.countDocuments(); // or sum from course.downloads

  res.status(200).json({ totalCourses, totalDownloads });
}