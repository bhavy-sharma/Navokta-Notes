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

  // State to hold the selected PDF URL for inline viewing
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    fetchSubject();
  }, [course, semesterNumber]);

  const fetchSubject = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/resource?courseName=${encodeURIComponent(course || '')}&semester=${semesterNumber || ''}`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setSubject(data.data);
      } else {
        throw new Error('Invalid response format: expected { success: true, data: [] }');
      }
    } catch (error) {
      console.error('Failed to load subjects:', error instanceof Error ? error.message : String(error));
      setSubject([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = (item) => {
    setSelectedPdf(item.link);
  };

  const handleBack = () => {
    router.push('/courses');
  };

  // Helper: Safely extract filename from URL
  const getFileNameFromUrl = (url) => {
    if (!url || typeof url !== 'string') return 'Loading PDF...';
    const lastSlashIndex = url.lastIndexOf('/');
    return lastSlashIndex === -1 ? url : url.substring(lastSlashIndex + 1);
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

      {/* Subject Grid */}
      {subject.length === 0 ? (
        <p className="text-red-400 text-xl">No subjects found for this semester.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl px-4 mb-12">
          {subject.map((item) => (
            <div
              key={item._id}
              className="w-full h-40 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg
                         flex items-center justify-center text-xl font-semibold cursor-pointer
                         transform transition-all duration-300 hover:scale-110 hover:from-green-500 hover:to-green-400"
              onClick={() => handleSubjectClick(item)}
              aria-label={`View ${item.subject} PDF`}
            >
              {item.subject}
            </div>
          ))}
        </div>
      )}

      {/* Inline PDF Viewer (only if a PDF is selected) */}
      {selectedPdf && (
        <div className="w-full max-w-5xl mt-8 px-4">
          {/* Safe filename display */}
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Viewing: {getFileNameFromUrl(selectedPdf)}
          </h2>

          {/* PDF Embed */}
          <div className="border-2 border-gray-700 rounded-xl overflow-hidden shadow-2xl relative h-[800px]">
            <iframe
              src={selectedPdf}
              width="100%"
              height="100%"
              frameborder="0"
              title="PDF Document Viewer"
              aria-label="Embedded PDF document"
              className="bg-slate-800"
              onError={() => setSelectedPdf(null)} // Optional: Clear on load failure
            />

            {/* Loading spinner while PDF loads */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10 pointer-events-none">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
            </div>
          </div>

          {/* Optional: Open in New Tab Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => window.open(selectedPdf, '_blank')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg text-white font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-md"
            >
              Open in New Tab
            </button>
          </div>
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