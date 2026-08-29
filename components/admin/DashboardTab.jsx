export default function DashboardTab({ courses, notes, admins }) {
  const stats = [
    { label: 'Total Courses', value: courses.length, gradient: 'from-blue-400 to-cyan-400', icon: '📚' },
    { label: 'Total Notes', value: notes.length, gradient: 'from-purple-400 to-pink-400', icon: '📝' },
    { label: 'Total Admins', value: admins.length, gradient: 'from-green-400 to-teal-400', icon: '👥' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-sm">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Admin</span>
        </h2>
        <p className="text-sm sm:text-base text-gray-300">Manage courses, upload resources, and add new administrators.</p>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl sm:text-3xl">{stat.icon}</div>
              <div className={`text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}>
                {stat.value}
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}