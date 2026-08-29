'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useFileUpload } from '../hooks/useFileUpload';

export default function NoteForm({ 
  courses, 
  onSubmit, 
  onUpdate, 
  editingNote, 
  setEditingNote,
  onCancelEdit 
}) {
  const [uploadData, setUploadData] = useState({
    subject: '',
    courseName: '',
    semester: '',
    fileType: 'PDF',
    link: '',
  });
  const [semesterOptions, setSemesterOptions] = useState([]);
  const { file, uploading, uploadedUrl, handleFileChange, uploadFile, resetUpload, setUploadedUrl } = useFileUpload();

  const isEditing = !!editingNote;
  const currentData = isEditing ? editingNote : uploadData;

  useEffect(() => {
    if (!isEditing) {
      resetUpload();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!currentData.courseName) {
      setSemesterOptions([]);
      return;
    }
    const course = courses.find((item) => item.courseName === currentData.courseName);
    if (course) {
      setSemesterOptions(Array.from({ length: course.semester }, (_, i) => i + 1));
    } else {
      setSemesterOptions([]);
    }
  }, [currentData.courseName, courses]);

  const updateData = (field, value) => {
    if (isEditing) {
      setEditingNote({ ...editingNote, [field]: value });
    } else {
      setUploadData({ ...uploadData, [field]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalLink = currentData.link;
    
    if (currentData.fileType === 'PDF') {
      if (!file && !isEditing) {
        toast.error('Please select a PDF file!');
        return;
      }
      if (file) {
        const uploadedUrlResult = await uploadFile(file);
        if (!uploadedUrlResult) return;
        finalLink = uploadedUrlResult;
      } else if (isEditing && editingNote.link) {
        finalLink = editingNote.link;
      }
    }

    if (!finalLink) {
      toast.error('Please provide a valid link or upload a file.');
      return;
    }

    const payload = {
      subject: currentData.subject,
      courseName: currentData.courseName,
      semester: parseInt(currentData.semester, 10),
      fileType: currentData.fileType,
      link: finalLink,
    };

    let result;
    if (isEditing) {
      result = await onUpdate(editingNote._id, payload);
      if (result) {
        toast.success('Resource updated successfully!');
        setEditingNote(null);
        resetUpload();
        setUploadData({ subject: '', courseName: '', semester: '', fileType: 'PDF', link: '' });
      }
    } else {
      result = await onSubmit(payload);
      if (result) {
        toast.success('Resource uploaded successfully!');
        setUploadData({ subject: '', courseName: '', semester: '', fileType: 'PDF', link: '' });
        resetUpload();
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      }
    }
  };

  const handleCancel = () => {
    setEditingNote(null);
    resetUpload();
    setUploadData({ subject: '', courseName: '', semester: '', fileType: 'PDF', link: '' });
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div className="note-form-container bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
        <span className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${isEditing ? 'from-amber-500 to-orange-500' : 'from-purple-500 to-pink-500'} rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm flex-shrink-0`}>
          {isEditing ? '✏️' : '📤'}
        </span>
        <span className="truncate">{isEditing ? 'Update Resource' : 'Upload New Resource'}</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Subject Input */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Subject</label>
          <input
            type="text"
            placeholder="e.g., Database Management Systems"
            value={currentData.subject || ''}
            onChange={(e) => updateData('subject', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/60 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Course and Semester Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Course</label>
            <select
              value={currentData.courseName || ''}
              onChange={(e) => updateData('courseName', e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/60 border border-gray-600 rounded-lg sm:rounded-xl text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course.courseName}>
                  {course.courseName} (Sem {course.semester})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Semester</label>
            <select
              value={currentData.semester || ''}
              onChange={(e) => updateData('semester', parseInt(e.target.value, 10))}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/60 border border-gray-600 rounded-lg sm:rounded-xl text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Semester</option>
              {semesterOptions.map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Resource Type */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Resource Type</label>
          <select
            value={currentData.fileType || 'PDF'}
            onChange={(e) => {
              updateData('fileType', e.target.value);
              updateData('link', '');
            }}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/60 border border-gray-600 rounded-lg sm:rounded-xl text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="PDF">PDF Notes</option>
            <option value="YouTubeLink">YouTube Video</option>
            <option value="ExternalLink">External Link</option>
          </select>
        </div>

        {/* File Upload for PDF */}
        {currentData.fileType === 'PDF' && (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
              {isEditing ? 'Replace PDF File (Optional)' : 'Upload PDF File'}
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-2.5 bg-black/60 border border-gray-600 rounded-lg sm:rounded-xl text-white file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-purple-500 file:text-white hover:file:bg-purple-600"
              required={!isEditing}
            />
            {uploading && (
              <div className="flex items-center mt-2 text-blue-400 text-xs sm:text-sm">
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </div>
            )}
            {uploadedUrl && (
              <div className="flex items-center mt-2 text-green-400 text-xs sm:text-sm">
                ✅ File uploaded successfully!
              </div>
            )}
            {isEditing && editingNote.link && !uploadedUrl && (
              <div className="flex items-center mt-2 text-gray-400 text-xs sm:text-sm truncate">
                📄 Current: {editingNote.link.split('/').pop() || 'PDF file'}
              </div>
            )}
          </div>
        )}

        {/* Link Input for non-PDF */}
        {currentData.fileType !== 'PDF' && (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
              {currentData.fileType === 'YouTubeLink' ? 'YouTube URL' : 'External Link'}
            </label>
            <input
              type="url"
              placeholder={currentData.fileType === 'YouTubeLink' ? 'https://youtube.com/watch?v=...' : 'https://example.com/resource'}
              value={currentData.link || ''}
              onChange={(e) => updateData('link', e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/60 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        )}

        {/* Submit/Cancel Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            type="submit"
            disabled={uploading}
            className={`w-full sm:flex-1 text-white py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base ${
              isEditing
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/25'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-purple-500/25'
            }`}
          >
            {uploading ? 'Processing...' : (isEditing ? 'Update Resource' : 'Upload Resource')}
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