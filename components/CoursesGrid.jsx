'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Login Requirement Modal Component
const LoginRequirementModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Login Required</h3>
          <p className="text-gray-400">Please login to access course materials</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <button
          onClick={onLogin}
          className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
        >
          Login
        </button>
        
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function CoursesGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This should come from your auth context in a real app
  const [showLoginModal, setShowLoginModal] = useState(false);
  const containerRef = useRef(null);

  const courses = [
    { name: 'BBA', color: 'from-orange-500 via-pink-500 to-rose-500', glow: 'shadow-2xl shadow-orange-500/20' },
    { name: 'BCA', color: 'from-blue-500 via-cyan-400 to-teal-400', glow: 'shadow-2xl shadow-blue-500/20' },
    { name: 'MCA', color: 'from-purple-500 via-fuchsia-500 to-pink-500', glow: 'shadow-2xl shadow-purple-500/20' },
    { name: 'MBA', color: 'from-emerald-500 via-green-500 to-teal-400', glow: 'shadow-2xl shadow-emerald-500/20' },
    { name: 'B.Tech', color: 'from-red-500 via-orange-500 to-yellow-500', glow: 'shadow-2xl shadow-red-500/20' },
    { name: 'B.Sc', color: 'from-indigo-500 via-purple-500 to-pink-500', glow: 'shadow-2xl shadow-indigo-500/20' },
  ];

  // Intersection Observer for reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const current = containerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  // 3D Tilt Effect (Light-based)
  const handleMouseMove = (e) => {
    if (!isLoggedIn) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = (x - centerX) / 10;
    const rotateX = (centerY - y) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const resetTransform = (e) => {
    if (!isLoggedIn) return;
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const handleCourseClick = (e, courseName) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  const handleLogin = () => {
    // In a real app, this would handle actual login logic
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  return (
    <section
      ref={containerRef}
      className="py-24 relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, #0a0a0a, #000)',
      }}
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-l from-pink-600/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Headline */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Courses We Support
          </h2>
          <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            From commerce to tech — we've got your back with <strong className="text-white">exam-ready resources</strong>.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course, idx) => (
            <Link
              key={idx}
              href={`/courses/${course.name}`}
              className={`group block transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div
                className={`relative p-8 md:p-10 rounded-3xl text-white text-center overflow-hidden cursor-pointer transition-all duration-500 transform-gpu ${course.glow} ${!isLoggedIn ? 'blur-sm' : ''}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={resetTransform}
                onClick={(e) => handleCourseClick(e, course.name)}
                style={{
                  background: `linear-gradient(135deg, ${course.color})`,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Shine Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-tr from-transparent via-white/30 to-transparent transition-opacity duration-300 pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-extrabold mb-3">{course.name}</h3>
                  <p className="text-white/90 text-sm md:text-base">
                    Full Notes • PYQs • Video Guides
                  </p>
                </div>

                {/* Glow Layer */}
                <div
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, ${course.color.split(' ')[0]}, transparent 70%)`,
                    zIndex: 0,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Login Requirement Modal */}
      <LoginRequirementModal 
        isOpen={showLoginModal} 
        onClose={closeModal} 
        onLogin={handleLogin} 
      />

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}