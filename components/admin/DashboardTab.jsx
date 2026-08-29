'use client';

import { useState, useEffect, useMemo } from 'react';
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
import SearchBar from './SearchBar';

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

export default function DashboardTab({ courses, notes, admins }) {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedChart, setSelectedChart] = useState('all');

  // ============ COMPUTED STATS ============
  const stats = useMemo(() => {
    // Total downloads
    const totalDownloads = notes.reduce((sum, note) => sum + (note.downloadedCount || 0), 0);
    
    // Course distribution
    const courseDistribution = {};
    notes.forEach(note => {
      courseDistribution[note.courseName] = (courseDistribution[note.courseName] || 0) + 1;
    });
    
    // Semester distribution
    const semesterDistribution = {};
    notes.forEach(note => {
      semesterDistribution[`Sem ${note.semester}`] = (semesterDistribution[`Sem ${note.semester}`] || 0) + 1;
    });
    
    // File type distribution
    const fileTypeDistribution = {};
    notes.forEach(note => {
      fileTypeDistribution[note.fileType] = (fileTypeDistribution[note.fileType] || 0) + 1;
    });
    
    // Popular subjects (top 5)
    const subjectCount = {};
    notes.forEach(note => {
      subjectCount[note.subject] = (subjectCount[note.subject] || 0) + 1;
    });
    const popularSubjects = Object.entries(subjectCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Recent activity (last 7 days)
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    
    const dailyActivity = last7Days.map(date => {
      return notes.filter(note => {
        const noteDate = new Date(note.createdAt).toISOString().split('T')[0];
        return noteDate === date;
      }).length;
    });
    
    // Total unique courses with notes
    const coursesWithNotes = new Set(notes.map(n => n.courseName)).size;
    
    // Most downloaded notes (top 5)
    const mostDownloaded = [...notes]
      .sort((a, b) => (b.downloadedCount || 0) - (a.downloadedCount || 0))
      .slice(0, 5);

    return {
      totalDownloads,
      courseDistribution,
      semesterDistribution,
      fileTypeDistribution,
      popularSubjects,
      dailyActivity,
      coursesWithNotes,
      mostDownloaded,
      totalNotes: notes.length,
      totalCourses: courses.length,
      totalAdmins: admins.length,
      avgDownloadsPerNote: notes.length > 0 ? (totalDownloads / notes.length).toFixed(1) : 0,
    };
  }, [notes, courses, admins]);

  // ============ CHART CONFIGURATIONS ============

  // Pie Chart - Course Distribution
  const coursePieData = {
    labels: Object.keys(stats.courseDistribution),
    datasets: [
      {
        data: Object.values(stats.courseDistribution),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#FFB1C1', '#9AD0F5'
        ],
        borderWidth: 2,
        borderColor: '#1a1a2e',
      },
    ],
  };

  // Doughnut Chart - Semester Distribution
  const semesterDoughnutData = {
    labels: Object.keys(stats.semesterDistribution),
    datasets: [
      {
        data: Object.values(stats.semesterDistribution),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FFB1C1', '#9AD0F5'
        ],
        borderWidth: 2,
        borderColor: '#1a1a2e',
      },
    ],
  };

  // Bar Chart - File Type Distribution
  const fileTypeBarData = {
    labels: Object.keys(stats.fileTypeDistribution).map(type => {
      if (type === 'PDF') return '📄 PDF';
      if (type === 'YouTubeLink') return '▶️ YouTube';
      if (type === 'ExternalLink') return '🔗 External';
      return type;
    }),
    datasets: [
      {
        label: 'Resources by Type',
        data: Object.values(stats.fileTypeDistribution),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Line Chart - Daily Activity
  const activityLineData = {
    labels: stats.dailyActivity.map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'New Resources Added',
        data: stats.dailyActivity,
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

  // Polar Area Chart - Popular Subjects
  const polarAreaData = {
    labels: stats.popularSubjects.map(([subject]) => subject),
    datasets: [
      {
        data: stats.popularSubjects.map(([, count]) => count),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ],
        borderWidth: 2,
        borderColor: '#1a1a2e',
      },
    ],
  };

  // Bar Chart - Top Downloads
  const topDownloadsData = {
    labels: stats.mostDownloaded.map(note => 
      note.subject.length > 15 ? note.subject.substring(0, 15) + '...' : note.subject
    ),
    datasets: [
      {
        label: 'Downloads',
        data: stats.mostDownloaded.map(note => note.downloadedCount || 0),
        backgroundColor: ['#34D399', '#60A5FA', '#F472B6', '#FBBF24', '#A78BFA'],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // ============ CHART OPTIONS ============

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF',
          font: { size: 12 },
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
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: '📚',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/20',
      description: `${stats.coursesWithNotes} have resources`,
    },
    {
      title: 'Total Resources',
      value: stats.totalNotes,
      icon: '📝',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
      description: `${Object.keys(stats.fileTypeDistribution).length} types available`,
    },
    {
      title: 'Total Downloads',
      value: stats.totalDownloads,
      icon: '📥',
      gradient: 'from-green-500 to-teal-500',
      bgGradient: 'from-green-500/20 to-teal-500/20',
      description: `Avg ${stats.avgDownloadsPerNote} downloads per note`,
    },
    {
      title: 'Total Admins',
      value: stats.totalAdmins,
      icon: '👥',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/20 to-red-500/20',
      description: `${admins.filter(a => a.role === 'admin').length} active admins`,
    },
    {
      title: 'Course Coverage',
      value: `${Math.round((stats.coursesWithNotes / (stats.totalCourses || 1)) * 100)}%`,
      icon: '🎯',
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/20 to-orange-500/20',
      description: `${stats.coursesWithNotes} of ${stats.totalCourses} courses have notes`,
    },
    {
      title: 'Engagement Rate',
      value: stats.totalNotes > 0 ? `${Math.round((stats.totalDownloads / stats.totalNotes) * 10) / 10}x` : '0x',
      icon: '⚡',
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-500/20 to-pink-500/20',
      description: `Downloads per resource`,
    },
  ];

  // ============ CHART SECTIONS ============

  const chartSections = [
    {
      id: 'pie',
      title: 'Course Distribution',
      icon: '📊',
      component: <Pie data={coursePieData} options={chartOptions} />,
    },
    {
      id: 'doughnut',
      title: 'Semester Distribution',
      icon: '🎯',
      component: <Doughnut data={semesterDoughnutData} options={chartOptions} />,
    },
    {
      id: 'bar',
      title: 'Resource Types',
      icon: '📊',
      component: <Bar data={fileTypeBarData} options={barOptions} />,
    },
    {
      id: 'line',
      title: 'Activity (Last 7 Days)',
      icon: '📈',
      component: <Line data={activityLineData} options={lineOptions} />,
    },
    {
      id: 'polar',
      title: 'Popular Subjects',
      icon: '⭐',
      component: <PolarArea data={polarAreaData} options={chartOptions} />,
    },
    {
      id: 'downloads',
      title: 'Top Downloads',
      icon: '🏆',
      component: <Bar data={topDownloadsData} options={barOptions} />,
    },
  ];

  // ============ RENDER ============

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Welcome Card with Stats */}
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Admin</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-300">Here's what's happening with your platform</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-black/40 px-3 py-2 rounded-xl border border-purple-500/20">
            <span>🔄</span>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400">
          <span className="px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">
            📚 {stats.coursesWithNotes} courses with notes
          </span>
          <span className="px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">
            📝 {stats.totalNotes} total resources
          </span>
          <span className="px-2 py-1 bg-purple-500/10 rounded-lg border border-purple-500/20">
            📥 {stats.totalDownloads} total downloads
          </span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className={`bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm border border-purple-500/20 rounded-xl p-3 sm:p-4 hover:scale-105 transition-all duration-300 hover:border-purple-500/40`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg sm:text-xl">{stat.icon}</span>
              <div className={`text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}>
                {stat.value}
              </div>
            </div>
            <div className="text-xs text-gray-400 font-medium truncate">{stat.title}</div>
            <div className="text-[10px] text-gray-500 mt-0.5 truncate">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Chart Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedChart('all')}
          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all ${
            selectedChart === 'all'
              ? 'bg-purple-500/30 text-purple-300 border border-purple-500/30'
              : 'bg-black/40 text-gray-400 hover:bg-white/5 border border-transparent'
          }`}
        >
          All Charts
        </button>
        {chartSections.map((chart) => (
          <button
            key={chart.id}
            onClick={() => setSelectedChart(chart.id)}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all ${
              selectedChart === chart.id
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/30'
                : 'bg-black/40 text-gray-400 hover:bg-white/5 border border-transparent'
            }`}
          >
            {chart.icon} {chart.title}
          </button>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {chartSections
          .filter((chart) => selectedChart === 'all' || selectedChart === chart.id)
          .map((chart) => (
            <div
              key={chart.id}
              className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                  <span>{chart.icon}</span>
                  {chart.title}
                </h3>
                <span className="text-xs text-gray-500">
                  {chart.id === 'pie' && `${Object.keys(stats.courseDistribution).length} courses`}
                  {chart.id === 'doughnut' && `${Object.keys(stats.semesterDistribution).length} semesters`}
                  {chart.id === 'bar' && `${Object.keys(stats.fileTypeDistribution).length} types`}
                  {chart.id === 'line' && 'Last 7 days'}
                  {chart.id === 'polar' && `${stats.popularSubjects.length} subjects`}
                  {chart.id === 'downloads' && `Top ${stats.mostDownloaded.length}`}
                </span>
              </div>
              <div className="h-48 sm:h-56 md:h-64 w-full">
                {chart.component}
              </div>
            </div>
          ))}
      </div>

      {/* Most Downloaded Notes List */}
      {stats.mostDownloaded.length > 0 && (
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span>🏆</span>
            Most Downloaded Resources
          </h3>
          <div className="space-y-2">
            {stats.mostDownloaded.map((note, index) => (
              <div
                key={note._id}
                className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-gray-500 w-5">
                    #{index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm text-white truncate">{note.subject}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {note.courseName} • Sem {note.semester}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-400 whitespace-nowrap ml-2">
                  <span>📥</span>
                  <span className="font-medium">{note.downloadedCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-3 text-center">
          <div className="text-xs text-gray-400">Total Notes</div>
          <div className="text-xl font-bold text-purple-400">{stats.totalNotes}</div>
        </div>
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-3 text-center">
          <div className="text-xs text-gray-400">Total Downloads</div>
          <div className="text-xl font-bold text-green-400">{stats.totalDownloads}</div>
        </div>
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-3 text-center">
          <div className="text-xs text-gray-400">Courses</div>
          <div className="text-xl font-bold text-blue-400">{stats.totalCourses}</div>
        </div>
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-3 text-center">
          <div className="text-xs text-gray-400">Admins</div>
          <div className="text-xl font-bold text-orange-400">{stats.totalAdmins}</div>
        </div>
      </div>
    </div>
  );
}