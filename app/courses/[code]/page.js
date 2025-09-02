'use client';

import { useState, useEffect, use } from 'react';

export default function CoursePage({ params }) {
  const { code } = use(params);
  const [course, setCourse] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      try {
        // Fetch course by code (e.g., 'bca', 'bba')
        const courseRes = await fetch(`/api/courses?code=${code}`);
        const courseData = await courseRes.json();

        if (!courseRes.ok || !courseData) {
          throw new Error('Course not found');
        }

        setCourse(courseData);

        // Fetch resources for this course
        const resRes = await fetch(`/api/resources?courseId=${courseData._id}`);
        const resData = await resRes.json();
        setResources(resData);
      } catch (err) {
        console.error(err);
        setCourse(null);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    if (code) loadCourse();
  }, [code]);

  if (loading) return <div className="text-white p-6">Loading course...</div>;
  if (!course) return <div className="text-red-400 p-6">Course not found</div>;

  return (
    <div className="min-h-screen bg-black text-white" style={{
      background: 'radial-gradient(circle at center, #0a0a0a, #000)',
    }}>
      <div className="container mx-auto px-6 py-12">
        {/* Course Name */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
          {course.name}
        </h1>
        <p className="text-gray-400 mb-8">Free notes, PYQs, and video resources</p>

        {/* Resources List */}
        {resources.length === 0 ? (
          <p className="text-gray-500">No resources uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div
                key={res._id}
                className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition"
              >
                {/* PDF Title */}
                <h3 className="text-lg font-semibold text-white">{res.title}</h3>
                <p className="text-sm text-gray-400 capitalize mb-3">Type: {res.type}</p>

                {/* PDF */}
                {res.type === 'pdf' && res.fileUrl && (
                  <a
                    href={res.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 bg-blue-900/50 hover:bg-blue-900/80 text-blue-200 text-xs rounded-full"
                  >
                    📄 View PDF
                  </a>
                )}

                {/* PYQ */}
                {res.type === 'pyq' && res.fileUrl && (
                  <a
                    href={res.fileUrl}
                    download
                    className="inline-flex items-center px-3 py-1.5 bg-green-900/50 hover:bg-green-900/80 text-green-200 text-xs rounded-full"
                  >
                    📂 Download PYQ
                  </a>
                )}

                {/* Video */}
                {res.type === 'video' && res.youtubeUrl && (
                  <a
                    href={res.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 bg-red-900/50 hover:bg-red-900/80 text-red-200 text-xs rounded-full"
                  >
                    ▶️ Watch Video
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}