// app/dashboard/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalDownloads: 0,
  });
  const [trendingCourses, setTrendingCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats(data);

        const trendingRes = await fetch('/api/dashboard/trending');
        if (!trendingRes.ok) throw new Error("Failed to fetch trending courses");
        const trendingData = await trendingRes.json();
        setTrendingCourses(trendingData);
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
    } catch (error) {
      console.error('Failed to parse user data');
      localStorage.removeItem('navokta_user');
      localStorage.removeItem('navokta_token');
      router.push('/auth/login');
    }
    fetchDashboardData();
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
      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= DASHBOARD CONTENT ================= */}
      <div className="pt-20 md:pt-24">
        {/* Header */}
        <div className="border-b border-gray-800 px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between max-w-6xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Dashboard
            </h1>
            <div className="text-sm text-gray-400 mt-1 sm:mt-0">
              Welcome back, <strong className="text-white">{user?.name}</strong>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
          {/* User Info Card */}
          <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-10">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Image
                src={
                  user?.avatar
                    ? user.avatar
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1e40af&color=ffffff`
                }
                alt="Profile"
                width={56}
                height={56}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-blue-500/50"
                unoptimized
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-semibold truncate">{user?.name}</h2>
                <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                <span className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                  user?.role === 'admin'
                    ? 'bg-red-900 text-red-200'
                    : 'bg-blue-900 text-blue-200'
                }`}>
                  {user?.role === 'admin' ? 'Admin' : 'Student'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Total Courses */}
            <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-4 sm:p-6 text-center transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/30 hover:scale-105 cursor-pointer">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400">
                {stats?.totalCourses?.toLocaleString() || 0}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm mt-1">📚 Total Courses</div>
            </div>

            {/* Total Downloads */}
            <div className="bg-gradient-to-br from-pink-600/20 to-red-600/20 border border-pink-500/30 rounded-xl p-4 sm:p-6 text-center transition-all duration-300 hover:shadow-xl hover:shadow-pink-400/30 hover:scale-105 cursor-pointer">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-400">
                {stats?.totalDownloads?.toLocaleString() || 0}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm mt-1">📥 Total Downloads</div>
            </div>
          </div>

          {/* Trending This Week */}
          <div className="mb-8 sm:mb-12 mt-8 sm:mt-10">
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mr-3"></span>
              🔥 Trending This Week
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {trendingCourses.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-8 text-sm sm:text-base">
                  No trending courses available right now.
                </div>
              ) : (
                trendingCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-800/50 rounded-xl p-4 sm:p-5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 cursor-pointer group"
                    onClick={() => router.push(`/courses/${course._id}`)}
                  >
                    <h4 className="font-medium text-white group-hover:text-blue-300 leading-tight text-sm sm:text-base">
                      {course.courseName}
                    </h4>
                    <div className="flex items-center justify-between mt-3 sm:mt-4">
                      <span className="text-xs text-gray-400">This Week</span>
                      <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-green-400 font-medium">
                        {course.downloadedCount?.toLocaleString() || 0} 📥
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-red-900/50 hover:bg-red-900/70 rounded-full text-sm text-red-200 font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20"
            >
              🔒 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}