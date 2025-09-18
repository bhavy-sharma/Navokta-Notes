"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError(err.message || 'Could not load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    router.push(`/semester?courseName=${encodeURIComponent(course.courseName)}&sem=${course.semester}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 animate-pulse">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-300">Loading your courses</p>
            <p className="text-sm text-gray-500">Just a moment while we prepare your learning journey...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900/20 via-slate-900 to-slate-900 text-white flex items-center justify-center p-6">
        <div className="text-center p-8 max-w-md bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-slate-700 shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-900/30 rounded-full flex items-center justify-center border border-red-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-400 mb-3">Oops! Something went wrong</h2>
          <p className="text-gray-300 text-sm leading-relaxed px-4">{error}</p>
          <button
            onClick={fetchCourses}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Floating Background Orbs (Decorative) */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-slate-900/60 border-b border-slate-700/50 px-6 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-purple-200 bg-clip-text text-transparent">
            Explore Courses
          </h1>
          <p className="text-gray-300 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            Choose a course to dive into its semester materials, guided by expert instructors.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {courses.length === 0 ? (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-800/50 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-medium text-gray-300 mb-2">No courses available yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We’re working hard to bring you exciting new courses. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleCourseSelect(course)}
                className="group relative overflow-hidden p-7 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/20 cursor-pointer transform hover:-translate-y-2"
                aria-label={`View ${course.courseName}, Semester ${course.semester}`}
              >
                {/* Glowing Edge on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:to-indigo-600/10 transition-all duration-500 rounded-2xl pointer-events-none"></div>

                {/* Semester Badge — Floating, Glassy, Modern */}
                <div
                  className="absolute top-5 right-5 w-14 h-14 bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm border border-purple-500/30 rounded-lg flex items-center justify-center rotate-12 origin-center shadow-lg"
                >
                  <span className="text-xs font-black text-purple-200 tracking-widest -rotate-12">
                    SEM {course.semester}
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors leading-tight">
                  {course.courseName}
                </h3>

                {/* NEW FIELD: Instructor — Elegant, Subtle, Professional */}
                {course.instructor && (
                  <div className="flex items-center mb-4">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300 font-medium">Instructor: <span className="text-indigo-300 font-semibold">{course.instructor}</span></span>
                  </div>
                )}

                {/* Description */}
                {course.description && (
                  <p className="text-gray-400 text-sm mb-5 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                )}

                {/* CTA Arrow — Subtle, Animated */}
                <div className="flex items-center text-purple-300 text-sm font-medium group-hover:gap-2 transition-all duration-300">
                  <span>Explore Materials</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>

                {/* Bottom Glowing Line on Hover */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}