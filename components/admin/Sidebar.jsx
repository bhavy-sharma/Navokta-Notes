'use client';

import { useState } from 'react';

export default function Sidebar({ activeTab, setActiveTab, router }) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'notes', label: 'Notes', icon: '📝' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'admins', label: 'Admins', icon: '👥' },
    { id: 'users', label: 'Users', icon: '👤' }, // 👈 New Tab
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-3 left-3 z-50 p-2.5 bg-black/80 backdrop-blur-sm rounded-xl border border-purple-500/30 text-white hover:bg-purple-500/20 transition-all duration-200 shadow-lg"
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50
        w-72 sm:w-80 md:w-64
        h-full
        bg-black/95 md:bg-black/40 backdrop-blur-md
        border-r border-purple-500/20
        flex-shrink-0
        transition-all duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-purple-500/20 flex-shrink-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text">
            Admin Panel
          </h1>
          <p className="text-xs text-gray-500 mt-1 hidden sm:block">Control Panel</p>
        </div>

        {/* Navigation - Takes remaining space */}
        <nav className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1 sm:space-y-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`
                w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl 
                transition-all duration-200 
                text-sm sm:text-base
                ${activeTab === item.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <span className="text-lg sm:text-xl flex-shrink-0">{item.icon}</span>
              <span className="font-medium truncate">{item.label}</span>
              {activeTab === item.id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse flex-shrink-0"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="flex-shrink-0 border-t border-purple-500/20 bg-black/50 backdrop-blur-sm p-3 sm:p-4 space-y-2">
          <button
            onClick={() => {
              router.push('/');
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 sm:space-x-3 px-4 py-2.5 sm:py-3 rounded-xl text-blue-400 hover:bg-blue-500/10 transition-all duration-200 text-sm sm:text-base group"
          >
            <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">🏠</span>
            <span className="font-medium">Home</span>
          </button>
          <button
            onClick={() => {
              router.push('/');
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-center space-x-2 sm:space-x-3 px-4 py-2.5 sm:py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm sm:text-base group"
          >
            <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}