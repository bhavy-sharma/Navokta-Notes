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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-xs mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 animate-pulse mx-auto">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium text-gray-300">Loading your courses</p>
            <p className="text-xs text-gray-500 px-1">Just a moment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900/20 via-slate-900 to-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center p-6 max-w-xs bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-slate-700 shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-900/30 rounded-full flex items-center justify-center border border-red-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-red-400 mb-2">Oops!</h2>
          <p className="text-gray-300 text-xs leading-relaxed px-1">{error}</p>
          <button
            onClick={fetchCourses}
            className="mt-4 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl text-xs shadow transition-all duration-300 transform hover:scale-105"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    /* 🚫 CRITICAL: Prevent ANY horizontal overflow */
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-x-hidden">
      {/* ✅ Background Orbs — Now safely contained within screen using clip & responsive sizing */}
      <div className="absolute top-10 left-0 w-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -left-10 top-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute -right-10 bottom-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl opacity-70"></div>
      </div>

      {/* Header — Full width, safe padding */}
      <header className="relative z-10 backdrop-blur-sm bg-slate-900/60 border-b border-slate-700/50 w-full px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl lg:max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            Explore Courses
          </h1>
          <p className="text-gray-300 mt-3 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Choose a course to dive into its semester materials, guided by expert instructors.
          </p>
        </div>
      </header>

      {/* 🔥 MAIN FIX: No side padding on mobile. Grid takes full width. No overflow. */}
      <main className="relative z-10 w-full max-w-6xl lg:max-w-7xl mx-auto py-8 sm:py-12 px-0">
        {courses.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">No courses available yet</h3>
            <p className="text-gray-500 max-w-xs mx-auto text-sm px-2">
              We’re working hard to bring you exciting new courses. Check back soon!
            </p>
          </div>
        ) : (
          /* ✅ Grid: Full width, no overflow, safe gaps */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0 w-full box-border">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleCourseSelect(course)}
                className="group relative overflow-hidden w-full bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-xl hover:shadow-purple-900/20 cursor-pointer transform hover:-translate-y-1 sm:hover:-translate-y-2 p-4 sm:p-6 box-border"
                aria-label={`View ${course.courseName}, Semester ${course.semester}`}
              >
                {/* Glowing Edge */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:to-indigo-600/10 transition-all duration-500 rounded-xl sm:rounded-2xl pointer-events-none"></div>

                {/* Semester Badge — tucked in safely */}
                <div
                  className="absolute top-3 right-3 sm:top-4 sm:right-5 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm border border-purple-500/30 rounded-md flex items-center justify-center rotate-12 origin-center shadow"
                >
                  <span className="text-[9px] sm:text-xs font-black text-purple-200 tracking-wider -rotate-12">
                    SEM {course.semester}
                  </span>
                </div>

                {/* Course Title — prevent overflow */}
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors leading-tight min-w-0 truncate">
                  {course.courseName}
                </h3>

                {/* Instructor */}
                {course.instructor && (
                  <div className="flex items-center mb-2 sm:mb-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-300 font-medium">
                      <span className="text-indigo-300 font-semibold">{course.instructor}</span>
                    </span>
                  </div>
                )}

                {/* Description — controlled height */}
                {course.description && (
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-3 min-h-[3rem]">
                    {course.description}
                  </p>
                )}

                {/* CTA */}
                <div className="flex items-center text-purple-300 text-xs font-medium group-hover:gap-1 transition-all duration-300">
                  <span>Explore</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-3.5 sm:w-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>

                {/* Bottom Glowing Line */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}