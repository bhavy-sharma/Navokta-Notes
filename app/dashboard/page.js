// app/dashboard/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  PointElement,
  LineElement,
  RadialLinearScale,
} from 'chart.js';
import { Pie, Bar, Line, Doughnut, PolarArea } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  PointElement,
  LineElement,
  RadialLinearScale
);

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalCourses: 0,
      totalNotes: 0,
      totalDownloads: 0,
      totalUsers: 0,
    },
    charts: {
      courseDistribution: [],
      semesterDistribution: [],
      fileTypeDistribution: [],
      weeklyActivity: [],
      popularSubjects: [],
      topDownloads: [],
    },
    trendingCourses: [],
    recentActivity: [],
  });
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, notesRes, coursesRes, usersRes] = await Promise.all([
          fetch('/api/dashboard/stats'),
          fetch('/api/notes'),
          fetch('/api/courses'),
          fetch('/api/users'),
        ]);

        const statsData = statsRes.ok ? await statsRes.json() : {};
        const notesData = notesRes.ok ? await notesRes.json() : [];
        const coursesData = coursesRes.ok ? await coursesRes.json() : [];
        const usersData = usersRes.ok ? await usersRes.json() : [];

        const totalDownloads = notesData.reduce((sum, note) => sum + (note.downloadedCount || 0), 0);
        const totalNotes = notesData.length;
        const totalCourses = coursesData.length;
        const totalUsers = usersData.length;

        const courseDistribution = {};
        notesData.forEach(note => {
          courseDistribution[note.courseName] = (courseDistribution[note.courseName] || 0) + 1;
        });

        const semesterDistribution = {};
        notesData.forEach(note => {
          semesterDistribution[`Sem ${note.semester}`] = (semesterDistribution[`Sem ${note.semester}`] || 0) + 1;
        });

        const fileTypeDistribution = {};
        notesData.forEach(note => {
          const type = note.fileType || 'Other';
          fileTypeDistribution[type] = (fileTypeDistribution[type] || 0) + 1;
        });

        const now = new Date();
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const weeklyActivity = last7Days.map(date => {
          return notesData.filter(note => {
            const noteDate = new Date(note.createdAt).toISOString().split('T')[0];
            return noteDate === date;
          }).length;
        });

        const subjectCount = {};
        notesData.forEach(note => {
          subjectCount[note.subject] = (subjectCount[note.subject] || 0) + 1;
        });
        const popularSubjects = Object.entries(subjectCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);

        const topDownloads = [...notesData]
          .sort((a, b) => (b.downloadedCount || 0) - (a.downloadedCount || 0))
          .slice(0, 5);

        const trendingCourses = coursesData.slice(0, 4).map(course => ({
          ...course,
          downloadedCount: Math.floor(Math.random() * 100) + 10,
        }));

        setDashboardData({
          stats: {
            totalCourses,
            totalNotes,
            totalDownloads,
            totalUsers,
          },
          charts: {
            courseDistribution: Object.entries(courseDistribution),
            semesterDistribution: Object.entries(semesterDistribution),
            fileTypeDistribution: Object.entries(fileTypeDistribution),
            weeklyActivity,
            popularSubjects,
            topDownloads,
          },
          trendingCourses,
          recentActivity: notesData.slice(0, 5),
        });

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    const userData = localStorage.getItem('navokta_user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
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

  // ============ CHART CONFIGURATIONS ============

  const coursePieData = {
    labels: dashboardData.charts.courseDistribution.map(([name]) => name),
    datasets: [
      {
        data: dashboardData.charts.courseDistribution.map(([, count]) => count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        borderWidth: 2,
        borderColor: '#1a1a2e',
      },
    ],
  };

  const semesterDoughnutData = {
    labels: dashboardData.charts.semesterDistribution.map(([name]) => name),
    datasets: [
      {
        data: dashboardData.charts.semesterDistribution.map(([, count]) => count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
        borderWidth: 2,
        borderColor: '#1a1a2e',
      },
    ],
  };

  const fileTypeBarData = {
    labels: dashboardData.charts.fileTypeDistribution.map(([type]) => {
      if (type === 'PDF') return '📄 PDF';
      if (type === 'YouTubeLink') return '▶️ YouTube';
      if (type === 'ExternalLink') return '🔗 External';
      return type;
    }),
    datasets: [
      {
        label: 'Resources by Type',
        data: dashboardData.charts.fileTypeDistribution.map(([, count]) => count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const activityLineData = {
    labels: dashboardData.charts.weeklyActivity.map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'New Resources Added',
        data: dashboardData.charts.weeklyActivity,
        borderColor: '#818CF8',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#818CF8',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const polarAreaData = {
    labels: dashboardData.charts.popularSubjects.map(([subject]) => subject),
    datasets: [
      {
        data: dashboardData.charts.popularSubjects.map(([, count]) => count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 2,
        borderColor: '#1a1a2e',
      },
    ],
  };

  const topDownloadsData = {
    labels: dashboardData.charts.topDownloads.map(note => 
      note.subject?.length > 15 ? note.subject.substring(0, 15) + '...' : note.subject
    ),
    datasets: [
      {
        label: 'Downloads',
        data: dashboardData.charts.topDownloads.map(note => note.downloadedCount || 0),
        backgroundColor: ['#34D399', '#60A5FA', '#F472B6', '#FBBF24', '#A78BFA'],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF',
          font: { size: 11 },
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#9CA3AF' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9CA3AF' },
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#9CA3AF' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9CA3AF' },
      },
    },
  };

  // ============ STATS CARDS ============
  const statCards = [
    {
      id: 'courses',
      title: 'Total Courses',
      value: dashboardData.stats.totalCourses,
      icon: '📚',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      id: 'notes',
      title: 'Total Notes',
      value: dashboardData.stats.totalNotes,
      icon: '📝',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
      id: 'downloads',
      title: 'Total Downloads',
      value: dashboardData.stats.totalDownloads,
      icon: '📥',
      gradient: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-500/20 to-teal-500/20',
    },
    {
      id: 'users',
      title: 'Total Users',
      value: dashboardData.stats.totalUsers,
      icon: '👥',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/20 to-red-500/20',
    },
  ];

  // ============ SIDEBAR NAVIGATION ============
  const sidebarTabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 text-white">
      <div className="flex min-h-screen">
        
        {/* ================= SIDEBAR ================= */}
        <aside className={`
          fixed md:relative z-40
          w-64 sm:w-72 md:w-56 lg:w-64
          h-full
          bg-black/60 backdrop-blur-xl
          border-r border-purple-500/20
          transition-all duration-300 ease-in-out
          flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* User Profile - Fixed Top */}
          <div className="flex-shrink-0 p-4 border-b border-purple-500/20">
            <div className="flex items-center gap-3">
              <Image
                src={
                  user?.avatar
                    ? user.avatar
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=1e40af&color=ffffff&size=64`
                }
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-purple-500/50 object-cover"
                unoptimized
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation - Scrollable Middle */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
                  transition-all duration-200 text-sm
                  ${activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions - Fixed Bottom */}
          <div className="flex-shrink-0 p-4 border-t border-purple-500/20 bg-black/30 space-y-1">
            {/* Home Button */}
            <Link
              href="/"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-200 text-sm"
            >
              <span className="text-lg">🏠</span>
              <span>Home</span>
            </Link>
            
            {/* Browse Courses */}
            <Link
              href="/courses"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm"
            >
              <span className="text-lg">📚</span>
              <span>Browse Courses</span>
            </Link>
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 text-sm"
            >
              <span className="text-lg">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ================= MOBILE SIDEBAR OVERLAY ================= */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 w-full max-w-full ml-0 md:ml-0">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-white/5 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-white">
              {sidebarTabs.find(t => t.id === activeTab)?.label || 'Overview'}
            </h2>
            <div className="w-8"></div>
          </div>

          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{user?.name?.split(' ')[0] || 'User'}</span>
                </h2>
                <p className="text-gray-400 text-sm mt-1">Here's what's happening with your platform</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 bg-purple-500/10 rounded-lg text-xs text-purple-300 border border-purple-500/20">
                    📚 {dashboardData.stats.totalCourses} courses
                  </span>
                  <span className="px-2 py-1 bg-purple-500/10 rounded-lg text-xs text-purple-300 border border-purple-500/20">
                    📝 {dashboardData.stats.totalNotes} notes
                  </span>
                  <span className="px-2 py-1 bg-purple-500/10 rounded-lg text-xs text-purple-300 border border-purple-500/20">
                    📥 {dashboardData.stats.totalDownloads} downloads
                  </span>
                  <span className="px-2 py-1 bg-purple-500/10 rounded-lg text-xs text-purple-300 border border-purple-500/20">
                    👥 {dashboardData.stats.totalUsers} users
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {statCards.map((stat) => (
                  <div
                    key={stat.id}
                    className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm border border-purple-500/20 rounded-xl p-3 hover:scale-105 transition-all duration-300 hover:border-purple-500/40`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{stat.icon}</span>
                      <div className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}>
                        {stat.value.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium truncate mt-1">{stat.title}</div>
                  </div>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span>📊</span> Course Distribution
                  </h4>
                  <div className="h-48">
                    <Pie data={coursePieData} options={chartOptions} />
                  </div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span>📈</span> Weekly Activity
                  </h4>
                  <div className="h-48">
                    <Line data={activityLineData} options={lineOptions} />
                  </div>
                </div>
              </div>

              {/* Trending & Recent */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span>🔥</span> Trending Courses
                  </h4>
                  <div className="space-y-2">
                    {dashboardData.trendingCourses.slice(0, 3).map((course, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="text-sm text-gray-300">{course.courseName}</span>
                        <span className="text-xs text-green-400">📥 {course.downloadedCount || 0}</span>
                      </div>
                    ))}
                    {dashboardData.trendingCourses.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">No trending courses</p>
                    )}
                  </div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span>🕐</span> Recent Activity
                  </h4>
                  <div className="space-y-2">
                    {dashboardData.recentActivity.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <span className="text-sm text-gray-300 truncate">{item.subject}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                    {dashboardData.recentActivity.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= COURSES TAB ================= */}
          {activeTab === 'courses' && (
            <div className="space-y-4">
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-white mb-4">All Courses</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dashboardData.charts.courseDistribution.map(([name, count]) => (
                    <Link
                      key={name}
                      href={`/semester?courseName=${encodeURIComponent(name)}&sem=1`}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-purple-500/20 hover:border-purple-500/30 transition-all duration-300 group border border-transparent"
                    >
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{name}</span>
                      <span className="text-sm text-purple-400 font-medium flex items-center gap-2">
                        {count} notes
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= NOTES TAB ================= */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span>📊</span> File Type Distribution
                  </h4>
                  <div className="h-48">
                    <Bar data={fileTypeBarData} options={barOptions} />
                  </div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span>🎯</span> Semester Distribution
                  </h4>
                  <div className="h-48">
                    <Doughnut data={semesterDoughnutData} options={chartOptions} />
                  </div>
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span>🏆</span> Top Downloaded Resources
                </h4>
                <div className="h-48">
                  <Bar data={topDownloadsData} options={barOptions} />
                </div>
              </div>
            </div>
          )}

          {/* ================= ANALYTICS TAB ================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span>⭐</span> Popular Subjects
                  </h4>
                  <div className="h-48">
                    <PolarArea data={polarAreaData} options={chartOptions} />
                  </div>
                </div>
                <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <span>📊</span> Course Distribution
                  </h4>
                  <div className="h-48">
                    <Pie data={coursePieData} options={chartOptions} />
                  </div>
                </div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <span>📈</span> Weekly Activity Trend
                </h4>
                <div className="h-48">
                  <Line data={activityLineData} options={lineOptions} />
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}