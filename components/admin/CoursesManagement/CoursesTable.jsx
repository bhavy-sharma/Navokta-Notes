'use client';

import toast from 'react-hot-toast';

export default function CoursesTable({ 
  courses, 
  onDelete, 
  onEdit, 
  editingCourseId,
  searchQuery 
}) {
  const handleDelete = (courseId) => {
    toast((t) => (
      <div className="bg-gray-800 text-white p-4 sm:p-6 rounded-lg shadow-xl max-w-xs sm:max-w-sm mx-4">
        <p className="font-medium text-sm sm:text-base mb-3">Are you sure you want to delete this course?</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onDelete(courseId);
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: 0,
      },
    });
  };

  // Empty state
  if (courses.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {searchQuery ? 'No matching courses found' : 'No courses available'}
          </h3>
          <p className="text-gray-400 text-sm">
            {searchQuery 
              ? `Try adjusting your search "${searchQuery}"`
              : 'Add your first course using the form above'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-3 sm:mb-4">
        Courses
        {searchQuery && (
          <span className="ml-2 text-sm text-gray-400 font-normal">
            ({courses.length} results)
          </span>
        )}
      </h3>
      
      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        {courses.map((course) => (
          <div
            key={course._id}
            className={`bg-black/40 border border-purple-500/20 rounded-xl p-4 ${
              editingCourseId === course._id ? 'border-amber-500/50 bg-amber-500/10' : ''
            }`}
          >
            <div className="font-medium text-white text-sm mb-1">{course.courseName}</div>
            <div className="text-xs text-gray-400 mb-1">Semesters: {course.semester}</div>
            <div className="text-xs text-gray-500 mb-3 truncate">{course.description || 'No description'}</div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(course)}
                className="flex-1 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-3 py-1.5 rounded-lg transition-colors text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(course._id)}
                className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-gray-300 text-sm md:text-base">
          <thead className="text-gray-400 border-b border-purple-500/20">
            <tr>
              <th className="pb-3 text-xs md:text-sm">Course Name</th>
              <th className="pb-3 text-xs md:text-sm">Semesters</th>
              <th className="pb-3 text-xs md:text-sm hidden md:table-cell">Description</th>
              <th className="pb-3 text-right text-xs md:text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {courses.map((course) => (
              <tr
                key={course._id}
                className={`hover:bg-white/5 transition-colors ${
                  editingCourseId === course._id ? 'bg-amber-500/20' : ''
                }`}
              >
                <td className="py-3 text-xs md:text-sm font-medium text-white">{course.courseName}</td>
                <td className="py-3 text-xs md:text-sm">{course.semester}</td>
                <td className="py-3 text-xs md:text-sm text-gray-400 max-w-xs truncate hidden md:table-cell">
                  {course.description || 'N/A'}
                </td>
                <td className="py-3 text-right space-x-1 sm:space-x-2">
                  <button
                    onClick={() => onEdit(course)}
                    className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-2 sm:px-3 py-1 rounded-lg transition-colors text-xs sm:text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 sm:px-3 py-1 rounded-lg transition-colors text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}