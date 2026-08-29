'use client';

import { useState } from 'react';
import CourseForm from './CourseForm';
import CoursesTable from './CoursesTable';

export default function CoursesManagement({
  courses,
  onAdd,
  onUpdate,
  onDelete,
  refreshCourses,
}) {
  const [editingCourse, setEditingCourse] = useState(null);

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <CourseForm
        onAdd={onAdd}
        onUpdate={onUpdate}
        editingCourse={editingCourse}
        setEditingCourse={setEditingCourse}
      />
      <CoursesTable
        courses={courses}
        onDelete={onDelete}
        onEdit={setEditingCourse}
        editingCourseId={editingCourse?._id}
      />
    </div>
  );
}