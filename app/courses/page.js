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
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-slate-500 border-t-transparent mb-4"></div>
          <p className="text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-900/30 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-red-400 mb-2">Something went wrong</h2>
          <p className="text-gray-400 text-sm">{error}</p>
          <button
            onClick={fetchCourses}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700 rounded-lg text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-100">Browse Courses</h1>
          <p className="text-gray-400 mt-1">Select a course to explore semesters</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {courses.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No courses available yet.
            <p className="text-sm mt-2">New courses are added regularly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <button
                key={course._id}
                onClick={() => handleCourseSelect(course)}
                className="group relative overflow-hidden p-6 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-slate-700/20 text-left cursor-pointer"
                aria-label={`View ${course.courseName}, Semester ${course.semester}`}
              >
                {/* Embedded Semester Badge — Slanted, Subtle, Integrated */}
                <div
                  className="absolute top-4 right-4 w-16 h-16 bg-slate-900/40 border border-slate-700/50 rotate-12 origin-bottom-right shadow-lg"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)',
                  }}
                >
                  <span className="absolute -rotate-12 top-1 left-1 text-xs font-bold text-slate-300 tracking-wider leading-none">
                    {course.semester}
                  </span>
                </div>

                {/* Course Name — Centered, Clean, Typographic Focus */}
                <h3 className="text-lg font-medium text-white leading-tight mb-1 group-hover:text-purple-200 transition-colors">
                  {course.courseName}
                </h3>

                {/* Optional Description — Faint, Non-Distracting */}
                {course.description && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                )}

                {/* Subtle Hover Line — Only appears on interaction */}
                <div className="absolute bottom-4 left-0 w-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent group-hover:w-full transition-all duration-500"></div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}