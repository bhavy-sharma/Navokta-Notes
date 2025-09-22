'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoginRequiredModal from './LoginRequiredModal';
import { toast } from 'react-hot-toast';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null); // null = loading, false = not logged in
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check auth status on mount
  useEffect(() => {
    const token = localStorage.getItem('navokta_token');
    const userData = localStorage.getItem('navokta_user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('navokta_token');
    localStorage.removeItem('navokta_user');
    setUser(false);
      // Show success toast
  toast.success('Logged out successfully!', {
    duration: 1500,
    icon: '👋',
  });

  // Redirect after a tiny delay to let toast appear
  setTimeout(() => {
    window.location.href = '/';
  }, 1000);
  };

  const handleCourseClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  return (
    <header className="relative">
      {/* Main Header Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-md border-b ${
          isScrolled
            ? 'bg-black/80 border-gray-800 shadow-lg'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className={`text-2xl font-black transition-all duration-300 ${
              isScrolled
                ? 'text-white'
                : 'text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text'
            }`}
          >
            Navokta Notes
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link
              href={user ? "/courses" : "#"}
              onClick={handleCourseClick}
              className={`font-medium transition cursor-pointer ${
                isScrolled
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-300 hover:text-white'
              } ${!user ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              Courses
            </Link>

            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className={`transition text-sm px-4 py-2 rounded hover:bg-white/10 ${
                    isScrolled
                      ? 'text-gray-300 hover:text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-5 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  Join Free
                </Link>
              </>
            ) : (
              // Profile Dropdown
              <div className="relative group">
                <button className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-white/20 transition-all duration-300">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=1e40af&color=fff`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-blue-500/50"
                  />
                  <span className="text-gray-200 text-sm font-medium">Hi, {user.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400 group-hover:text-white transition"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto py-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 border-b border-gray-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Your Profile
                  </Link>
                  <Link
                    href="/courses"
                    className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 border-b border-gray-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    My Courses
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden transition ${
              isScrolled ? 'text-gray-200 hover:text-white' : 'text-gray-300 hover:text-white'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-gray-800">
            <div className="px-6 py-4 flex flex-col space-y-4 text-sm">
              <Link
                href={user ? "/courses" : "#"}
                onClick={handleCourseClick}
                className={`transition cursor-pointer ${
                  !user ? 'opacity-60 cursor-not-allowed' : 'text-gray-300 hover:text-white'
                }`}
              >
                Courses
              </Link>

              {!user ? (
                <>
                  <Link
                    href="/auth/login"
                    className="text-gray-300 hover:text-white transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-full font-semibold text-center hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Join Free
                  </Link>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    className="flex items-center p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Your Profile
                  </Link>
                  <Link
                    href="/my-courses"
                    className="flex items-center p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    My Courses
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Login Required Modal */}
      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={closeModal} 
      />
    </header>
  );
}