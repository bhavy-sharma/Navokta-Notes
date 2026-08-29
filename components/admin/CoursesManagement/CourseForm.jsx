'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CourseForm({ onAdd, onUpdate, editingCourse, setEditingCourse }) {
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    semester: '',
    description: '',
  });

  const isEditing = !!editingCourse;
  const currentData = isEditing ? editingCourse : newCourse;

  const updateData = (field, value) => {
    if (isEditing) {
      setEditingCourse({ ...editingCourse, [field]: value });
    } else {
      setNewCourse({ ...newCourse, [field]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentData.courseName || !currentData.semester) {
      toast.error('Please fill in all required fields');
      return;
    }

    const payload = {
      courseName: currentData.courseName,
      semester: parseInt(currentData.semester, 10),
      description: currentData.description || '',
    };

    let result;
    if (isEditing) {
      result = await onUpdate(editingCourse._id, payload);
      if (result) {
        toast.success('Course updated successfully!');
        setEditingCourse(null);
      }
    } else {
      result = await onAdd(payload);
      if (result) {
        toast.success('Course added successfully!');
        setNewCourse({ courseName: '', semester: '', description: '' });
      }
    }
  };

  const handleCancel = () => {
    setEditingCourse(null);
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
        <span className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${isEditing ? 'from-amber-500 to-orange-500' : 'from-blue-500 to-cyan-500'} rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm flex-shrink-0`}>
          {isEditing ? '✏️' : '➕'}
        </span>
        <span className="truncate">{isEditing ? 'Update Course/Semester' : 'Add New Course/Semester'}</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-full sm:max-w-2xl">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Course Name</label>
          <input
            type="text"
            placeholder="e.g., BCA"
            value={currentData.courseName || ''}
            onChange={(e) => updateData('courseName', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/60 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Total Semesters</label>
          <input
            type="number"
            min="1"
            max="10"
            placeholder="e.g., 6"
            value={currentData.semester || ''}
            onChange={(e) => updateData('semester', parseInt(e.target.value, 10) || '')}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/60 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Description (Optional)</label>
          <textarea
            placeholder="Brief description..."
            value={currentData.description || ''}
            onChange={(e) => updateData('description', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/60 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows="3"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            type="submit"
            className={`w-full sm:flex-none sm:px-8 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:shadow-lg transition-all duration-200 text-sm sm:text-base ${
              isEditing
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/25'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-blue-500/25'
            }`}
          >
            {isEditing ? 'Update Course' : 'Add Course'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:flex-none sm:px-6 py-2.5 sm:py-3 bg-gray-600 text-white rounded-lg sm:rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 text-sm sm:text-base"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}