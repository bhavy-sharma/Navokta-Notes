"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header"; // 👈 Your Header component

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
      {/* <div className="absolute bottom-20 -right-20 w-40 h-40 sm:w-72 sm:h-72 bg-indigo-600/10 rounded-full blur-3xl"></div> */}

      {/* 👇 Add Header — ensure it doesn't overlap */}
      <Header />

      {/* 👇 Add spacing below Header to prevent overlap */}
      <header className="relative z-10 backdrop-blur-sm bg-slate-900/60 border-b border-slate-700/50 px-4 sm:px-6 py-10 sm:py-12 mt-4">
        <div className="max-w-7xl mx-auto text-center mt-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-purple-200 bg-clip-text text-transparent">
            Explore Courses
          </h1>
          <p className="text-gray-300 mt-3 sm:mt-4 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Choose a course to dive into its semester materials, guided by expert instructors.
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {courses.length === 0 ? (
          <div className="text-center py-20 sm:py-32">
            <h3 className="text-lg sm:text-2xl font-medium text-gray-300 mb-2">
              No courses available yet
            </h3>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              We’re working hard to bring you exciting new courses. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
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
                    Instructor: {course.instructor}
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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}