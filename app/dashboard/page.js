// app/dashboard/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
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
        <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-blue-500/50"
            />
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
              <span className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                user.role === 'admin'
                  ? 'bg-red-900 text-red-200'
                  : 'bg-blue-900 text-blue-200'
              }`}>
                {user.role === 'admin' ? 'Admin' : 'Student'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-800/50 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-blue-500/10 transition">
            <div className="text-2xl font-bold">12</div>
            <div className="text-gray-400 text-sm">Courses Enrolled</div>
          </div>

          <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 border border-green-800/50 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-green-500/10 transition">
            <div className="text-2xl font-bold">47</div>
            <div className="text-gray-400 text-sm">Notes Downloaded</div>
          </div>

          <div className="bg-gradient-to-br from-pink-900/40 to-red-900/40 border border-pink-800/50 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-pink-500/10 transition">
            <div className="text-2xl font-bold">8</div>
            <div className="text-gray-400 text-sm">PYQs Accessed</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            {[
              'Downloaded BCA - DBMS Notes',
              'Watched Python OOPs Video',
              'Viewed MBA - Marketing PYQs',
              'Enrolled in B.Tech - DSA Course',
            ].map((activity, idx) => (
              <li key={idx} className="text-gray-300 text-sm py-2 border-b border-gray-800/50 last:border-0">
                {activity}
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => alert('Profile view coming soon!')}
            className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition"
          >
            View Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-900/50 hover:bg-red-900/70 rounded-full text-sm text-red-200 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}