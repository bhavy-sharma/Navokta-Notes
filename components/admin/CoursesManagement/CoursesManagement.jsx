'use client';

import { useState, useMemo } from 'react';
import CourseForm from './CourseForm';
import CoursesTable from './CoursesTable';
import SearchBar from '../SearchBar';

export default function CoursesManagement({
  courses,
  onAdd,
  onUpdate,
  onDelete,
  refreshCourses,
  searchQuery,
  setSearchQuery,
}) {
  const [editingCourse, setEditingCourse] = useState(null);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    
    const query = searchQuery.toLowerCase().trim();
    return courses.filter((course) => {
      return (
        course.courseName?.toLowerCase().includes(query) ||
        course.semester?.toString().includes(query) ||
        course.description?.toLowerCase().includes(query)
      );
    });
  }, [courses, searchQuery]);

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Search Bar */}
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 w-full">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search courses by name, semester, description..."
              totalItems={courses.length}
              filteredItems={filteredCourses.length}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
            <span className="hidden sm:inline">📚</span>
            <span>Total: <span className="text-white font-medium">{courses.length}</span></span>
          </div>
        </div>
      </div>

      <CourseForm
        onAdd={onAdd}
        onUpdate={onUpdate}
        editingCourse={editingCourse}
        setEditingCourse={setEditingCourse}
      />
      
      <CoursesTable
        courses={filteredCourses}
        onDelete={onDelete}
        onEdit={setEditingCourse}
        editingCourseId={editingCourse?._id}
        searchQuery={searchQuery}
      />
    </div>
  );
}