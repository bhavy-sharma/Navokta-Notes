"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      if (res.ok) {
        setCourses(data);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    router.push(`/semester?courseName=${encodeURIComponent(course.courseName)}&sem=${course.semester}`);
  };

  // Ultra-Premium Skeleton Loader with Light Refraction
  const PremiumSkeleton = () => (
    <div className="relative overflow-hidden rounded-3xl border border-white/5 backdrop-blur-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/90">
      {/* Animated Light Beam */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-400/10 via-transparent to-transparent rotate-12 translate-x-[-20rem] animate-pulse"></div>
      </div>

      <div className="p-8 space-y-6">
        <div className="h-8 bg-slate-700/60 rounded-xl w-3/4 animate-pulse"></div>
        <div className="h-4 bg-slate-700/50 rounded-lg w-full animate-pulse"></div>
        <div className="h-4 bg-slate-700/40 rounded-lg w-5/6 animate-pulse"></div>
        <div className="h-10 bg-slate-700/50 rounded-2xl w-1/3 animate-pulse mt-6"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Cinematic Background: Deep Space Nebula with Soft Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full blur-xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                background: `radial-gradient(circle, rgba(139, 92, 246, ${Math.random() * 0.3 + 0.1}) 0%, transparent 70%)`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Light Orbs */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-64 h-64 rounded-full blur-3xl opacity-5"
            style={{
              left: `${[15, 85, 10, 90][i]}%`,
              top: `${[20, 70, 80, 30][i]}%`,
              background: `radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)`,
              animation: `pulse ${5 + i * 0.5}s ease-in-out infinite`,
              zIndex: -1,
            }}
          />
        ))}

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.1; }
            50% { transform: scale(1.1); opacity: 0.2; }
          }
        `}</style>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-32">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 border-2 border-purple-500/30 rounded-full bg-black/40 backdrop-blur-lg">
              <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-200 via-pink-200 to-red-200 text-transparent bg-clip-text leading-tight mb-4 tracking-tighter">
              Navokta Notes
            </h1>
            <p className="text-gray-400 text-lg font-light tracking-wide">
              Where Knowledge Becomes Luminescence
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
            {[...Array(6)].map((_, i) => (
              <PremiumSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Cosmic Background: Dynamic Gradient + Subtle Noise */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Organic Noise Overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.02) 0%, transparent 50%),
              radial-gradient(circle at 50% 90%, rgba(245, 158, 11, 0.02) 0%, transparent 50%)
            `,
          }}
        ></div>
        
        {/* Floating Light Particles (High-Fidelity) */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 1.5 + 0.5}px`,
              height: `${Math.random() * 1.5 + 0.5}px`,
              background: `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.02})`,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(147, 51, 234, 0.3)`,
              animation: `twinkle ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 5}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Header: Minimalist Monumental Typography */}
      <header className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-9xl font-black leading-none bg-gradient-to-r from-purple-200 via-pink-200 to-red-200 text-transparent bg-clip-text tracking-tight mb-6">
            Navokta Notes
          </h1>
          <p className="text-gray-400 text-xl md:text-2xl font-light tracking-wider leading-relaxed max-w-2xl mx-auto">
            Curated academic journeys, rendered with precision. Each course is a gateway — not just a link.
          </p>
        </div>
      </header>

      {/* Main Content: Gallery of Scholarly Artifacts */}
      <main className="relative z-10 px-6 pb-24">
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="w-20 h-20 mb-8 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-semibold text-gray-400 mb-4">No Courses Yet</h2>
            <p className="text-gray-500 text-lg max-w-md">
              The library is being prepared. New disciplines are being encoded into the system.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {courses.map((course, index) => (
              <div
                key={course._id}
                onClick={() => handleCourseSelect(course)}
                className="group cursor-pointer transform transition-all duration-700 hover:-translate-y-1 hover:scale-[1.01] perspective-1000"
              >
                {/* Card Container with Realistic Depth */}
                <div className="relative group-hover:shadow-2xl group-hover:shadow-purple-500/20 transition-shadow duration-700">
                  {/* Inner Card: Material Design 3.0 Surface */}
                  <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/95 border border-white/5 backdrop-blur-3xl rounded-3xl p-8 shadow-inner shadow-slate-800/40 overflow-hidden relative z-10">
                    
                    {/* Floating Light Source (Dynamic Glow) */}
                    <div
                      className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700"
                      style={{
                        background: `radial-gradient(circle, rgba(147, 51, 234, 0.12) 0%, transparent 70%)`,
                      }}
                    ></div>

                    {/* Semester Badge: Engraved Metal Style */}
                    <div className="absolute top-6 right-6 px-4 py-1.5 bg-gradient-to-r from-purple-700/90 to-pink-700/90 border border-purple-500/40 backdrop-blur-sm rounded-full text-xs font-semibold text-white shadow-lg shadow-purple-900/30">
                      SEMESTER {course.semester}
                    </div>

                    {/* Course Name: Handwritten Serif Font Feel (via CSS) */}
                    <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6 bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 text-transparent bg-clip-text tracking-tight">
                      {course.courseName}
                    </h2>

                    {/* Description: Elegant Line Height & Letter Spacing */}
                    <p className="text-gray-300 text-base leading-relaxed mb-8 font-light tracking-wide">
                      {course.description || "A meticulously designed curriculum for mastery, insight, and intellectual evolution."}
                    </p>

                    {/* Divider: Laser-etched Line */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8"></div>

                    {/* CTA Button: Titanium Metal with Micro-Texture */}
                    <button className="w-full px-7 py-4 bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-2xl shadow-lg shadow-purple-900/20 hover:shadow-purple-500/30 transition-all duration-500 transform hover:scale-102 border border-white/10 relative overflow-hidden group">
                      <span className="relative z-10 flex items-center justify-center space-x-3 font-medium text-sm tracking-wide uppercase">
                        <span>Enter Curriculum</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L11.586 9H5a1 1 0 110-2h6.586l-4.293-4.293a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>

                      {/* Hover Ripple Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                      {/* Micro Texture Overlay */}
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                      }}></div>
                    </button>

                    {/* Subtle Reflection */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-full blur-sm opacity-20"></div>
                  </div>

                  {/* Outer Glow Layer (Depth Illusion) */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-[-1]"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer: Silent Elegance */}
      <footer className="relative z-10 text-center py-12 px-6">
        <p className="text-gray-600 text-sm font-light tracking-wider italic">
          © Navokta Notes — Designed for those who seek depth, not just data.
        </p>
      </footer>

      {/* Global Animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.05; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}