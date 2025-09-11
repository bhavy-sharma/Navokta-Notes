"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

export default function Semester() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseName = searchParams.get("courseName");
  const semesterCount = parseInt(searchParams.get("sem") || "1");

  // Ensure valid semester count
  const semesters = Array.from({ length: Math.max(1, semesterCount) }, (_, i) => i + 1);

  const [hoveredSemester, setHoveredSemester] = useState(null);

  const handleSemesterSelect = (semester) => {
    router.push(`/semester/${encodeURIComponent(courseName)}/${semester}`);
  };

  const handleBackToCourses = () => {
    router.push('/courses');
  };

  // Animate entrance on mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Cosmic Background: Deep Space Nebula with Soft Glow */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              background: `radial-gradient(circle, rgba(${[139, 92, 246], [236, 72, 153], [245, 158, 11]}[Math.floor(Math.random() * 3)].join(','), ${Math.random() * 0.2 + 0.05}) 0%, transparent 70%)`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}

        {/* Floating Light Orbs (Depth Layers) */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl opacity-10"
            style={{
              left: `${[15, 85, 10, 90, 50][i]}%`,
              top: `${[25, 70, 85, 30, 60][i]}%`,
              width: `${120 + i * 30}px`,
              height: `${120 + i * 30}px`,
              background: `radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, transparent 70%)`,
              animation: `pulse ${5 + i * 0.5}s ease-in-out infinite`,
              zIndex: -1,
            }}
          />
        ))}
      </div>

      {/* Header: Floating Title with Subtle Glow */}
      <header className="relative z-10 pt-20 pb-12 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black leading-tight bg-gradient-to-r from-purple-200 via-pink-200 to-red-200 text-transparent bg-clip-text tracking-tighter mb-4 drop-shadow-lg">
          LUMEN
        </h1>
        <p className="text-gray-400 text-xl font-light tracking-wider max-w-2xl mx-auto">
          You stand before the gateway of <span className="font-semibold text-purple-300">{courseName}</span>
        </p>
      </header>

      {/* Main Content: Holographic Semester Cards */}
      <main className="relative z-10 flex flex-col items-center px-6 pb-24">
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-400 text-transparent bg-clip-text">
            Choose Your Academic Passage
          </h2>

          {semesters.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-500">No semesters configured for this course.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {semesters.map((semester) => (
                <div
                  key={semester}
                  className="group cursor-pointer transform transition-all duration-700 hover:-translate-y-2 hover:scale-105 perspective-1000"
                  onMouseEnter={() => setHoveredSemester(semester)}
                  onMouseLeave={() => setHoveredSemester(null)}
                >
                  {/* Outer Glow Layer (Depth Illusion) */}
                  <div
                    className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl opacity-0 transition-opacity duration-700 ${
                      hoveredSemester === semester ? 'opacity-100' : ''
                    }`}
                    style={{
                      filter: `blur(${hoveredSemester === semester ? '24px' : '0px'})`,
                    }}
                  ></div>

                  {/* Holographic Card */}
                  <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-950/95 border border-white/5 backdrop-blur-3xl rounded-3xl p-8 shadow-inner shadow-slate-800/30 overflow-hidden z-10">
                    
                    {/* Animated Inner Glow */}
                    <div
                      className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-xl opacity-0 transition-opacity duration-700 ${
                        hoveredSemester === semester ? 'opacity-20' : ''
                      }`}
                      style={{
                        background: `radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%)`,
                      }}
                    ></div>

                    {/* Semester Number: Engraved Metal Style */}
                    <div className="mb-6 flex items-center justify-center">
                      <span className="text-6xl md:text-8xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 text-transparent bg-clip-text tracking-tight leading-none">
                        {semester}
                      </span>
                    </div>

                    {/* Label */}
                    <h3 className="text-center text-gray-300 text-lg font-medium mb-4">
                      Semester {semester}
                    </h3>

                    {/* Divider: Laser-Etched Line */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6"></div>

                    {/* CTA Button: Titanium Hologram */}
                    <button
                      onClick={() => handleSemesterSelect(semester)}
                      className="w-full px-8 py-4 bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-2xl shadow-lg shadow-purple-900/20 hover:shadow-purple-500/30 transition-all duration-500 transform hover:scale-102 border border-white/10 relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-3 font-medium text-sm tracking-wide uppercase">
                        <span>Enter Passage</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H15a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>

                      {/* Hover Ripple Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                      {/* Micro Texture Overlay: Carbon Fiber */}
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
                        }}
                      ></div>
                    </button>

                    {/* Subtle Reflection */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full blur-sm opacity-15"></div>
                  </div>

                  {/* Floating Particle Animation on Hover */}
                  {hoveredSemester === semester && (
                    <div className="absolute -top-4 -left-4 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-60"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Back Button: Minimalist Elegance */}
      <footer className="relative z-10 mt-auto px-6 pb-16 text-center">
        <button
          onClick={handleBackToCourses}
          className="inline-flex items-center px-8 py-4 bg-transparent border border-white/20 rounded-2xl text-gray-300 font-medium hover:bg-white/5 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 backdrop-blur-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H15a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Return to Courses
        </button>
      </footer>

      {/* Global Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.05); opacity: 0.2; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}