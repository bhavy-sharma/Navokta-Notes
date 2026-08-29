'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function AdminForm({ 
  onAdd, 
  onUpdate, 
  editingAdmin, 
  setEditingAdmin,
  isRefreshing 
}) {
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!editingAdmin;
  const currentData = isEditing ? editingAdmin : newAdmin;

  // Reset form when editing is cancelled
  useEffect(() => {
    if (!editingAdmin) {
      setNewAdmin({ name: '', email: '', password: '' });
    }
  }, [editingAdmin]);

  const updateData = (field, value) => {
    if (isEditing) {
      setEditingAdmin({ ...editingAdmin, [field]: value });
    } else {
      setNewAdmin({ ...newAdmin, [field]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!currentData.name?.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!currentData.email?.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!isEditing && !currentData.password?.trim()) {
      toast.error('Password is required for new admin');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: currentData.name.trim(),
        email: currentData.email.trim().toLowerCase(),
      };

      // Only include password if provided
      if (currentData.password && currentData.password.trim() !== '') {
        payload.password = currentData.password;
      }

      let result;
      if (isEditing) {
        result = await onUpdate(editingAdmin._id, payload);
        if (result) {
          toast.success('Admin updated successfully!');
          setEditingAdmin(null);
          setNewAdmin({ name: '', email: '', password: '' });
        }
      } else {
        result = await onAdd(payload);
        if (result) {
          toast.success('Admin added successfully!');
          setNewAdmin({ name: '', email: '', password: '' });
          // Clear form
          const form = e.target;
          if (form) form.reset();
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingAdmin(null);
    setNewAdmin({ name: '', email: '', password: '' });
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
        <span className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${isEditing ? 'from-amber-500 to-orange-500' : 'from-green-500 to-teal-500'} rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm flex-shrink-0`}>
          {isEditing ? '✏️' : '🛡️'}
        </span>
        <span className="truncate">{isEditing ? 'Update Admin' : 'Add New Admin'}</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-full sm:max-w-2xl">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Name</label>
          <input
            type="text"
            placeholder="Full name"
            value={currentData.name || ''}
            onChange={(e) => updateData('name', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/60 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={isSubmitting || isRefreshing}
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Email</label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={currentData.email || ''}
            onChange={(e) => updateData('email', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/60 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            disabled={isSubmitting || isRefreshing}
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
            Password {isEditing && <span className="text-gray-500 text-xs font-normal">(Leave blank to keep current)</span>}
          </label>
          <input
            type="password"
            placeholder={isEditing ? 'Optional - New password' : 'Password'}
            value={currentData.password || ''}
            onChange={(e) => updateData('password', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-black/60 border border-gray-600 rounded-lg sm:rounded-xl text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
            required={!isEditing}
            disabled={isSubmitting || isRefreshing}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            type="submit"
            disabled={isSubmitting || isRefreshing}
            className={`w-full sm:flex-none sm:px-8 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:shadow-lg transition-all duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
              isEditing
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/25'
                : 'bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-green-500/25'
            }`}
          >
            {isSubmitting || isRefreshing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              isEditing ? 'Update Admin' : 'Add Admin'
            )}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting || isRefreshing}
              className="w-full sm:flex-none sm:px-6 py-2.5 sm:py-3 bg-gray-600 text-white rounded-lg sm:rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}