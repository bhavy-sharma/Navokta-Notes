// /api/courses/trending.js
export default async function handler(req, res) {
  // Get courses sorted by downloads in last 7 days
  const trending = await Course.aggregate([
    { $match: { "stats.lastWeekDownloads": { $gt: 0 } } },
    { $sort: { "stats.lastWeekDownloads": -1 } },
    { $limit: 10 }
  ]);

  res.status(200).json(trending);
}