export default function DashboardTab({ courses, notes, admins }) {
  const stats = [
    { label: 'Total Courses', value: courses.length, gradient: 'from-blue-400 to-cyan-400' },
    { label: 'Total Notes', value: notes.length, gradient: 'from-purple-400 to-pink-400' },
    { label: 'Total Admins', value: admins.length, gradient: 'from-green-400 to-teal-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Admin</span>
        </h2>
        <p className="text-gray-300 text-lg">Manage courses, upload resources, and add new administrators.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6">
            <div className="text-gray-400 text-sm font-medium mb-2">{stat.label}</div>
            <div className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}