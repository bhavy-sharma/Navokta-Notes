"use client";

import { useEffect, useState } from 'react';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [notes, setNotes] = useState([]);

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

  const fetchNotesByCourseAndSemester = async (courseCode, semester) => {
    try {
      const res = await fetch(`/api/notes?courseCode=${courseCode}&semester=${semester}`);
      const data = await res.json();
      if (res.ok) {
        setNotes(data);
      }
    } catch (err) {
      console.error('Failed to load notes:', err);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedSemester('');
    setNotes([]);
  };

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
    if (selectedCourse) {
      fetchNotesByCourseAndSemester(selectedCourse.code, semester);
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setSelectedSemester('');
    setNotes([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mb-4"></div>
          <p className="text-gray-300">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-purple-500/30 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text">
            {selectedCourse ? selectedCourse.name : 'Browse Courses'}
          </h1>
          {selectedCourse && (
            <p className="text-gray-400 mt-2">
              Select a semester to view available resources
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!selectedCourse ? (
          /* Courses Grid */
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No courses available</h3>
                  <p className="text-gray-500">Check back later for new courses</p>
                </div>
              ) : (
                courses.map((course) => (
                  <div
                    key={course.code}
                    className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 hover:transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleCourseSelect(course)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="text-purple-400 text-sm font-medium px-3 py-1 bg-purple-500/20 rounded-full">
                        {course.code.toUpperCase()}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {course.name}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      Explore comprehensive study materials and resources for {course.name}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Click to view semesters</span>
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Semester Selection and Notes View */
          <div>
            {/* Course Header */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-6 mb-8 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedCourse.name}</h2>
                  <p className="text-gray-400">Course Code: <span className="text-purple-300 font-mono">{selectedCourse.code}</span></p>
                </div>
                <button
                  onClick={handleBackToCourses}
                  className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl hover:bg-purple-500/30 transition-colors border border-purple-500/30 flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back</span>
                </button>
              </div>
            </div>

            {!selectedSemester ? (
              /* Semester Selection Grid */
              <div>
                <h3 className="text-xl font-semibold text-white mb-6">Select Semester</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((semester) => (
                    <button
                      key={semester}
                      onClick={() => handleSemesterSelect(semester)}
                      className="bg-black/40 backdrop-blur-sm border border-gray-600 rounded-2xl p-6 hover:border-purple-500/50 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-lg">S{semester}</span>
                      </div>
                      <p className="text-center text-gray-300 font-medium">Semester {semester}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Notes List for Selected Semester */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Semester {selectedSemester} Resources
                  </h3>
                  <button
                    onClick={() => setSelectedSemester('')}
                    className="text-sm text-purple-300 hover:text-purple-200 flex items-center space-x-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Change Semester</span>
                  </button>
                </div>

                {notes.length === 0 ? (
                  <div className="text-center py-12 bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No resources available</h3>
                    <p className="text-gray-500">Check back later for new study materials</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                      <div
                        key={note._id}
                        className="bg-black/40 backdrop-blur-sm border border-gray-600 rounded-3xl p-6 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            {note.type === 'pdf' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            )}
                            {note.type === 'pyq' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            )}
                            {note.type === 'video' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {note.type === 'link' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            note.type === 'pdf' ? 'bg-blue-500/20 text-blue-300' :
                            note.type === 'pyq' ? 'bg-green-500/20 text-green-300' :
                            note.type === 'video' ? 'bg-red-500/20 text-red-300' :
                            'bg-purple-500/20 text-purple-300'
                          }`}>
                            {note.type === 'pdf' ? 'PDF' :
                             note.type === 'pyq' ? 'PYQ' :
                             note.type === 'video' ? 'Video' : 'Link'}
                          </span>
                        </div>
                        
                        <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                          {note.title}
                        </h4>
                        
                        <p className="text-gray-400 text-sm mb-4">
                          Semester {note.semester} • {selectedCourse.name}
                        </p>
                        
                        <a
                          href={note.type === 'video' ? note.youtubeUrl : note.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium group/link"
                        >
                          <span>Open Resource</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}