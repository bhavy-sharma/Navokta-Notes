"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

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
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setError(err.message || "Could not load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    router.push(
      `/semester?courseName=${encodeURIComponent(
        course.courseName
      )}&sem=${course.semester}`
    );
  };

  const handleBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-700/50 animate-pulse">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-2 border-purple-500 border-t-transparent"></div>
          </div>
          <div className="space-y-2">
            <p className="text-base sm:text-lg font-medium text-gray-300">
              Loading your courses
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              Just a moment while we prepare your learning journey...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900/20 via-slate-900 to-slate-900 text-white flex items-center justify-center px-4 py-10">
        <div className="text-center p-6 sm:p-8 max-w-md bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-slate-700 shadow-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-red-400 mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">{error}</p>
          <button
            onClick={fetchCourses}
            className="mt-6 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg sm:rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative">
      {/* Floating Background Orbs */}
      <div className="absolute top-20 -left-20 w-40 h-40 sm:w-72 sm:h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -right-20 w-40 h-40 sm:w-72 sm:h-72 bg-indigo-600/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <Header />

      {/* ================= PAGE HEADER WITH BACK BUTTON ================= */}
      <header className="relative z-10 backdrop-blur-sm bg-slate-900/60 border-b border-slate-700/50 px-4 sm:px-6 pt-20 sm:pt-24 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="group flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-300 border border-gray-700/50 hover:border-gray-600"
                aria-label="Go back"
              >
                <svg
                  className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>


              {/* Refresh Button */}
              <button
                onClick={fetchCourses}
                className="group flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-300 border border-gray-700/50 hover:border-gray-600"
                aria-label="Refresh courses"
              >
                <svg
                  className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Course Count */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700/50">
                {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Available
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-purple-200 bg-clip-text text-transparent">
              Explore Courses
            </h1>
            <p className="text-gray-300 mt-3 sm:mt-4 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Choose a course to dive into its semester materials, guided by expert instructors.
            </p>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {courses.length === 0 ? (
          <div className="text-center py-20 sm:py-32">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-slate-800/50 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-2xl font-medium text-gray-300 mb-2">
              No courses available yet
            </h3>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              We're working hard to bring you exciting new courses. Check back soon!
            </p>
            <button
              onClick={handleGoHome}
              className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
            >
              ← Go Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleCourseSelect(course)}
                className="group relative overflow-hidden p-5 sm:p-7 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/20 cursor-pointer transform hover:-translate-y-1 sm:hover:-translate-y-2"
              >
                {/* Semester Badge */}
                <div className="absolute top-4 right-4 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-sm border border-purple-500/30 rounded-md flex items-center justify-center rotate-12 shadow">
                  <span className="text-[10px] sm:text-xs font-black text-purple-200 -rotate-12">
                    SEM {course.semester}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-purple-300 transition-colors leading-snug">
                  {course.courseName}
                </h3>

                {/* Instructor */}
                {course.instructor && (
                  <p className="text-xs sm:text-sm text-indigo-300 mb-3">
                    👨‍🏫 {course.instructor}
                  </p>
                )}

                {/* Description */}
                {course.description && (
                  <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                )}

                {/* CTA */}
                <div className="flex items-center text-purple-300 text-xs sm:text-sm font-medium group-hover:gap-2 transition-all duration-300">
                  <span>Explore Materials</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>

                {/* Bottom Border Animation */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ================= FLOATING BACK BUTTON (Mobile) ================= */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 sm:hidden">
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-gray-300 font-medium rounded-2xl border border-slate-600/50 shadow-xl hover:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300 flex items-center space-x-2 hover:scale-105 active:scale-95"
          aria-label="Go back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
      </div>
    </div>
  );
}