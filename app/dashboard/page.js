// app/dashboard/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalDownloads: 0,
  });
  const [trendingCourses, setTrendingCourses] = useState([]); // 👈 For MongoDB trending
  const router = useRouter();

  // 👇 Simulate fetching stats + trending courses from MongoDB
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // ⚠️ REPLACE THESE WITH REAL API CALLS LATER
        // Example:
        // const statsRes = await fetch('/api/stats');
        // const statsData = await statsRes.json();
        // const trendingRes = await fetch('/api/courses/trending');
        // const trendingData = await trendingRes.json();

        const [statsRes, trendingRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/dashboard/trending')
        ]);

        const statsData = await statsRes.json();
        const trendingData = await trendingRes.json();

        setStats(statsData);
        setTrendingCourses(trendingData.map(course => ({
          _id: course._id,
          title: course.title,
          weeklyDownloads: course.stats.lastWeekDownloads,
          color: "from-blue-900/30 to-cyan-900/30", // or map based on category
          border: "border-blue-800/50"
        })));
        
      } catch (error) {
        console.error("Failed to load dashboard data");
      }
    };

    // Auth check
    const userData = localStorage.getItem('navokta_user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      setLoading(false);
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to parse user data');
      localStorage.removeItem('navokta_user');
      localStorage.removeItem('navokta_token');
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('navokta_token');
    localStorage.removeItem('navokta_user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{
      background: 'radial-gradient(circle at center, #0a0a0a, #000)',
    }}>
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Dashboard
          </h1>
          <div className="text-sm text-gray-400 mt-2 md:mt-0">
            Welcome back, <strong className="text-white">{user.name}</strong>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-6xl">

        {/* User Info Card */}
        <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-10">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1e40af&color=fff`}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-blue-500/50"
            />
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
              <span className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${user.role === 'admin'
                  ? 'bg-red-900 text-red-200'
                  : 'bg-blue-900 text-blue-200'
                }`}>
                {user.role === 'admin' ? 'Admin' : 'Student'}
              </span>
            </div>
          </div>
        </div>

        {/* 📊 Simplified Stats Grid — Only 2 Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Total Courses on Platform */}
          <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-800/50 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-yellow-500/10 transition">
            <div className="text-3xl md:text-4xl font-bold">{stats.totalCourses.toLocaleString()}</div>
            <div className="text-gray-400 text-sm mt-1">📚 Total Courses</div>
          </div>

          {/* Total Downloads (Platform-wide) */}
          <div className="bg-gradient-to-br from-pink-900/40 to-red-900/40 border border-pink-800/50 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-pink-500/10 transition">
            <div className="text-3xl md:text-4xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
            <div className="text-gray-400 text-sm mt-1">📥 Total Downloads</div>
          </div>
        </div>

        {/* 🚀 Trending This Week — Fetched & Sorted by Downloads */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-5 flex items-center">
            <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mr-3"></span>
            🔥 Trending This Week
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {trendingCourses.map((course) => (
              <div
                key={course._id}
                className={`bg-gradient-to-br ${course.color} border ${course.border} rounded-xl p-5 hover:scale-105 transition transform cursor-pointer group`}
              >
                <h4 className="font-medium text-white group-hover:text-blue-300 leading-tight">
                  {course.title}
                </h4>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-gray-400">This Week</span>
                  <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-green-400 font-medium">
                    {course.weeklyDownloads.toLocaleString()} 📥
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button Only */}
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-red-900/50 hover:bg-red-900/70 rounded-full text-sm text-red-200 font-medium transition transform hover:scale-105"
          >
            🔒 Logout
          </button>
        </div>
      </div>
    </div>
  );
}