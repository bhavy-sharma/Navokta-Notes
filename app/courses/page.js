"use client";

import { useContext, useEffect, useState } from 'react';
import { useSemester } from '../layout';
import Link from 'next/link';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const {setSemester,semester}=useContext(useSemester)


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

  // const fetchNotesByCourseAndSemester = async (courseCode, semester) => {
  //   try {
  //     const res = await fetch(`/api/notes?courseCode=${courseCode}&semester=${semester}`);
  //     const data = await res.json();
  //     if (res.ok) {
  //       setNotes(data);
  //     }
  //   } catch (err) {
  //     console.error('Failed to load notes:', err);
  //   }
  // };

  const handleCourseSelect = (course) => {
      setSemester(course);
       window.location.href = `/semester`;
  };

  // const handleSemesterSelect = (semester) => {
  //   setSelectedSemester(semester);
  //   if (selectedCourse) {
  //     fetchNotesByCourseAndSemester(selectedCourse.code, semester);
  //   }
  // };

  // const handleBackToCourses = () => {
  //   setSelectedCourse(null);
  //   setSelectedSemester('');
  //   setNotes([]);
  // };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
  {courses.length === 0 ? (
    <p className="text-center text-lg py-20 text-gray-300">No courses found.</p>
  ) : (
    <div>
      
      <div className="border-b border-purple-500/30 bg-black/30 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text drop-shadow-md">
            Browse Courses
          </h1>
          <p className="text-gray-400 mt-2">Choose your course and explore semesters</p>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-gradient-to-tr from-slate-800 via-slate-900 to-black border border-purple-500/20 shadow-lg rounded-2xl p-6 hover:scale-105 transition-transform duration-300 hover:shadow-purple-500/40"
             onClick={()=>handleCourseSelect(course)}
            >
              <h2 className="text-2xl font-semibold text-purple-300 mb-2">
                {course.name}
              </h2>
              <p className="text-gray-400 mb-4">{course.description}</p>
              <p className="text-sm text-gray-300">
                📚 Total Semesters:{" "}
                <span className="font-bold text-pink-400">{course.semester}</span>
              </p>
              <button className="mt-4 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md shadow-purple-500/30 transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
</div>

  );
}