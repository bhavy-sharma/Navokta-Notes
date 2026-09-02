// /app/subject/SubjectContent.js
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Header from "@/components/Header"

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function SubjectContent() {
  const searchParams = useSearchParams()
  const course = searchParams.get('courseName')
  const semesterNumber = searchParams.get('semester')
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const fetchSubject = useCallback(async () => {
    setLoading(true)

    try {
      const res = await fetch(`/api/resource?courseName=${encodeURIComponent(course)}&semester=${semesterNumber}`)

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()

      if (data.success && Array.isArray(data.data)) {
        setSubjects(data.data)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Failed to load subjects:', error.message)
      setSubjects([])
    } finally {
      setLoading(false)
    }
  }, [course, semesterNumber])

  useEffect(() => {
    if (course && semesterNumber) {
      fetchSubject()
    }
  }, [course, semesterNumber, fetchSubject])

  // Filter subjects based on search query
  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects
    const query = searchQuery.toLowerCase().trim()
    return subjects.filter((item) => {
      return (
        item.subject?.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.fileType?.toLowerCase().includes(query)
      )
    })
  }, [subjects, searchQuery])

  const handleDownload = async (item) => {
    window.open(item.link, '_blank')

    try {
      const res = await fetch('/api/resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: item._id })
      })

      if (!res.ok) throw new Error('Failed to update download count')
      console.log('Download count updated for:', item.subject)
    } catch (err) {
      console.error('Failed to update download count:', err)
      toast.error('Failed to update download count')
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleGoCourses = () => {
    router.push('/courses')
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden pt-20 sm:pt-24">
          <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 -right-20 w-72 h-72 bg-green-600/10 rounded-full blur-3xl"></div>

          <div className="text-center space-y-6 z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-700/50 animate-pulse">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-medium text-gray-300">Loading Subjects</h3>
              <p className="text-gray-500">Preparing your semester materials...</p>
            </div>
            <div className="flex space-x-3 justify-center mt-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-20 h-28 bg-slate-800/50 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-24 -left-32 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 -right-32 w-96 h-96 bg-green-600/5 rounded-full blur-3xl"></div>

        {/* ================= HEADER WITH BACK BUTTON ================= */}
        <header className="relative z-10 px-4 sm:px-6 pt-20 sm:pt-24 pb-6 sm:pb-8 bg-gradient-to-r from-slate-900 via-blue-900/20 to-slate-900 border-b border-slate-700/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            {/* Back Button Row */}
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

                {/* Courses Button */}
                <button
                  onClick={handleGoCourses}
                  className="group flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-300 border border-gray-700/50 hover:border-gray-600"
                >
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="hidden sm:inline">Courses</span>
                </button>

                {/* Home Button */}
                <button
                  onClick={handleGoHome}
                  className="group flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 hover:text-white transition-all duration-300 border border-gray-700/50 hover:border-gray-600"
                >
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1-1h-3m-6 0V5a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 00-1-1H9a1 1 0 00-1 1z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Home</span>
                </button>
              </div>

              {/* Semester Info */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center px-3 py-1.5 bg-blue-900/30 border border-blue-500/30 rounded-full">
                  <span className="text-blue-300 text-xs font-bold tracking-wider">
                    SEMESTER {semesterNumber}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {filteredSubjects.length} subjects
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-blue-200 bg-clip-text text-transparent">
                {course || "Course"}
              </h1>
              <p className="text-gray-300 mt-2 text-base max-w-2xl mx-auto">
                Access all subjects, materials, and resources for this semester.
              </p>
            </div>
          </div>
        </header>

        {/* ================= MAIN CONTENT ================= */}
        <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          
          {/* ================= SEARCH BAR ================= */}
          <div className="mb-6 sm:mb-8">
            <div className="relative max-w-md mx-auto">
              <div className="relative">
                {/* Search Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Search Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subjects, types, descriptions..."
                  className="w-full pl-10 pr-10 py-3 bg-black/60 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                
                {/* Clear Button */}
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Search Stats */}
              {searchQuery && (
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-400">
                    Found <span className="text-blue-400 font-medium">{filteredSubjects.length}</span> result{filteredSubjects.length !== 1 ? 's' : ''} 
                    {filteredSubjects.length !== subjects.length && (
                      <span className="text-gray-500"> out of {subjects.length}</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ================= SUBJECTS GRID ================= */}
          {filteredSubjects.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-800/50 rounded-full mb-6">
                {searchQuery ? (
                  <svg className="h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
              </div>
              <h3 className="text-2xl font-medium text-gray-300 mb-2">
                {searchQuery ? 'No matching subjects found' : 'No subjects available'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchQuery 
                  ? `Try adjusting your search "${searchQuery}"`
                  : 'Materials for this semester are being prepared. Check back soon!'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors text-sm"
                >
                  Clear Search
                </button>
              )}
              {!searchQuery && (
                <button
                  onClick={handleBack}
                  className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                >
                  ← Back to Courses
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {filteredSubjects.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleDownload(item)}
                  className="group relative overflow-hidden p-5 sm:p-7 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/20 cursor-pointer transform hover:-translate-y-2"
                  role="button"
                  tabIndex={0}
                  aria-label={`Download ${item.subject}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleDownload(item)
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:to-green-600/10 transition-all duration-500 rounded-2xl pointer-events-none"></div>

                  {item.type && (
                    <div className="absolute top-4 right-4 px-2.5 py-1 bg-blue-900/60 backdrop-blur-sm border border-blue-500/30 rounded-full">
                      <span className="text-xs font-bold text-blue-200 uppercase tracking-wide">{item.type}</span>
                    </div>
                  )}

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {item.subject}
                  </h3>

                  {item.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-400">
                        {item.downloadCount ? `${item.downloadCount} downloads` : 'Download'}
                      </span>
                    </div>

                    <div className="transform transition-transform duration-300 group-hover:translate-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* ================= FLOATING BACK BUTTON (Mobile) ================= */}
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50 sm:hidden">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-gray-300 font-medium rounded-2xl border border-slate-600/50 shadow-xl hover:shadow-blue-900/20 backdrop-blur-sm transition-all duration-300 flex items-center space-x-2 hover:scale-105 active:scale-95"
            aria-label="Back to Courses"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
        </div>

        <style jsx global>{`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient-x 6s ease infinite;
          }
        `}</style>
      </div>
    </>
  )
}