"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export default function Semester() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseName = searchParams.get("courseName");
  const semesterCount = parseInt(searchParams.get("sem") || "1");

  // Guard against invalid input
  if (!courseName || semesterCount < 1) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-red-400 mb-2">Invalid course or semester data</h2>
          <p className="text-gray-400">Please return to the courses page.</p>
        </div>
      </div>
    );
  }

  const handleSemesterSelect = (semester) => {
    router.push(`/semester/${encodeURIComponent(courseName)}/${semester}`);
  };

  const handleBack = () => {
    router.push('/courses');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-100">
            {courseName}
          </h1>
          <p className="text-gray-400 mt-1">Select a semester to continue</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-xl font-medium text-gray-300 mb-8">
          Choose Your Semester
        </h2>

        {semesterCount === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No semesters available for this course.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: semesterCount }, (_, i) => i + 1).map((semester) => (
              <button
                key={semester}
                onClick={() => handleSemesterSelect(semester)}
                className="flex items-center justify-between p-6 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-colors duration-200 text-left group"
              >
                <div>
                  <span className="text-lg font-medium text-white">Semester {semester}</span>
                  <p className="text-sm text-gray-400 mt-1">Click to enter</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 group-hover:text-gray-300 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Back Button — Fixed at bottom for easy access */}
      <footer className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleBack}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700 rounded-xl font-medium transition-colors duration-200 shadow-lg"
        >
          ← Back to Courses
        </button>
      </footer>
    </div>
  );
}