// /app/semester/SemesterContent.js
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import Header from "@/components/Header"; // 👈 Your Header component

export default function SemesterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseName = searchParams.get("courseName")
  const semesterCount = parseInt(searchParams.get("sem") || "1")

  // ✅ useEffect component ke andar — condition se pehle
  useEffect(() => {
    const header = document.querySelector('.semester-header')
    if (header) {
      header.classList.add('animate-gradient-x')
    }
  }, [])

  // Guard against invalid input
  if (!courseName || semesterCount < 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900/20 via-slate-900 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center p-8 max-w-md bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-slate-700 shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-900/30 rounded-full flex items-center justify-center border border-red-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-400 mb-3">Invalid Selection</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            The course or semester data is missing or invalid.
          </p>
          <button
            onClick={() => router.push('/courses')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
          >
            ← Go Back to Courses
          </button>
        </div>
      </div>
    )
  }

  const handleSemesterSelect = (semester) => {
    router.push(`/subject?courseName=${encodeURIComponent(courseName)}&semester=${semester}`)
  }

  const handleBack = () => {
    router.push('/courses')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-24 -left-32 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-32 -right-32 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl"></div>


      {/* 👇 Add Header — ensure it doesn't overlap */}
      <Header />

      {/* Header — Hero Style with Gradient Animation */}
      <header className="semester-header relative z-10 px-6 py-16 bg-gradient-to-r from-slate-900 via-purple-900/30 to-slate-900 border-b border-slate-700/50 backdrop-blur-sm ">
        <div className="max-w-4xl mx-auto text-center mt-6">
          <div className="inline-flex items-center px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-full mb-4">
            <span className="text-purple-300 text-xs font-bold tracking-wider">COURSE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-purple-200 bg-clip-text text-transparent animate-gradient">
            {courseName}
          </h1>
          <p className="text-gray-300 mt-4 text-lg max-w-2xl mx-auto">
            Select a semester to unlock course materials, assignments, and resources.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-200 mb-2 text-center">Choose Your Semester</h2>
        <p className="text-gray-400 text-center mb-10">Progress through your academic journey, one semester at a time.</p>

        {semesterCount === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">No semesters available</h3>
            <p className="text-gray-500">Check back later as new semesters are added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: semesterCount }, (_, i) => i + 1).map((semester) => (
              <div
                key={semester}
                onClick={() => handleSemesterSelect(semester)}
                className="group relative overflow-hidden p-7 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/20 cursor-pointer transform hover:-translate-y-2"
                role="button"
                tabIndex={0}
                aria-label={`Select Semester ${semester}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSemesterSelect(semester)
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:to-indigo-600/10 transition-all duration-500 rounded-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      Semester {semester}
                    </span>
                    <p className="text-sm text-gray-400 mt-2">Access lectures, notes & assignments</p>
                  </div>
                  <div className="transform transition-transform duration-300 group-hover:translate-x-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500 group-hover:text-purple-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={handleBack}
          className="px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-gray-300 font-medium rounded-2xl border border-slate-600/50 shadow-xl hover:shadow-purple-900/20 backdrop-blur-sm transition-all duration-300 flex items-center space-x-2 hover:scale-105 active:scale-95"
          aria-label="Back to Courses"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Courses</span>
        </button>
      </footer>

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
        .animate-gradient-x {
          animation: gradient-x 8s ease infinite;
        }
      `}</style>
    </div>
  )
}