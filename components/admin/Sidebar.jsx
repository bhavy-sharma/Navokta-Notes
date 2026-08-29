export default function Sidebar({ activeTab, setActiveTab, router }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'notes', label: 'Notes Management', icon: '📝' },
    { id: 'courses', label: 'Course Management', icon: '📚' },
    { id: 'admins', label: 'Admin Management', icon: '👥' },
  ];

  return (
    <aside className="w-full md:w-64 bg-black/40 backdrop-blur-sm border-b md:border-b-0 md:border-r border-purple-500/20 flex-shrink-0">
      <div className="p-4 md:p-6 border-b border-purple-500/20">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text">
          Admin Panel
        </h1>
      </div>
      
      <nav className="flex md:flex-col p-2 md:p-4 space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center space-x-3 px-4 py-2 md:py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="hidden md:block p-4 border-t border-purple-500/20 mt-auto">
        <button
          onClick={() => router.push('/')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <span>🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}