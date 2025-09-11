"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Subject() {
  const searchParams = useSearchParams();
  const course = searchParams.get('courseName');
  const semesterNumber = searchParams.get('semester');
  const [subject, setSubject] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSubject();
  }, [course, semesterNumber]);

  const fetchSubject = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/route`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();


      if (data.success && Array.isArray(data.data)) {
        setSubject(data.data);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Failed to load subjects:', error.message);
      setSubject([]); 
    } finally {
      setLoading(false);
    }
  };


  const handleDownload = (item) => {
    // 1. Trigger file download or open link
    window.open(item.link, '_blank');

    // 2. OPTIONAL: Increment download count via API
    // fetch('/api/download', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ resourceId: item._id })
    // })
    //   .then(res => res.json())
    //   .catch(err => console.error('Failed to update download count:', err));
  };

  const handleBack = () => {
    router.push('/courses');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent mb-4"></div>
          <p className="text-gray-400">Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white flex flex-col items-center py-10">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-10 tracking-wide">
        {course || "Course"} - {semesterNumber}th Semester
      </h1>

      {/* Content */}
      {subject.length === 0 ? (
        <p className="text-red-400 text-xl">No subjects found for this semester.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl px-4">
          {subject.map((item) => (
            <div
              key={item._id}
              className="w-full h-40 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg
                         flex items-center justify-center text-xl font-semibold cursor-pointer
                         transform transition-all duration-300 hover:scale-110 hover:from-green-500 hover:to-green-400"
              onClick={() => handleDownload(item)}
            >
              {item.subject}
            </div>
          ))}
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mt-12 px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-xl text-lg font-medium
                   shadow-md hover:from-red-700 hover:to-red-600 transform hover:scale-105 transition-all duration-300"
      >
        Back to Courses
      </button>
    </div>
  );
}