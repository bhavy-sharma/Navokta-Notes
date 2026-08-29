'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function UserForm({ onAdd, onUpdate, editingUser, setEditingUser }) {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const isEditing = !!editingUser;
  const currentData = isEditing ? editingUser : newUser;

  useEffect(() => {
    if (!editingUser) {
      setNewUser({ name: '', email: '', password: '', role: 'user' });
    }
  }, [editingUser]);

  const updateData = (field, value) => {
    if (isEditing) {
      setEditingUser({ ...editingUser, [field]: value });
    } else {
      setNewUser({ ...newUser, [field]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentData.name?.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!currentData.email?.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!isEditing && !currentData.password?.trim()) {
      toast.error('Password is required for new user');
      return;
    }

    const payload = {
      name: currentData.name.trim(),
      email: currentData.email.trim().toLowerCase(),
      role: currentData.role || 'user',
    };

    if (currentData.password && currentData.password.trim() !== '') {
      payload.password = currentData.password;
    }

    let result;
    if (isEditing) {
      result = await onUpdate(editingUser._id, payload);
      if (result) {
        setEditingUser(null);
      }
    } else {
      result = await onAdd(payload);
      if (result) {
        setNewUser({ name: '', email: '', password: '', role: 'user' });
      }
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setNewUser({ name: '', email: '', password: '', role: 'user' });
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center">
        <span className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${
          isEditing ? 'from-amber-500 to-orange-500' : 'from-green-500 to-teal-500'
        } rounded-lg flex items-center justify-center mr-2 sm:mr-3 text-xs sm:text-sm flex-shrink-0`}>
          {isEditing ? '✏️' : '👤'}
        </span>
        <span className="truncate">{isEditing ? 'Update User' : 'Add New User'}</span>
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              placeholder="Full name"
              value={currentData.name || ''}
              onChange={(e) => updateData('name', e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 bg-black/60 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="user@example.com"
              value={currentData.email || ''}
              onChange={(e) => updateData('email', e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 bg-black/60 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
              Password {isEditing && <span className="text-gray-500 text-xs font-normal">(Optional)</span>}
            </label>
            <input
              type="password"
              placeholder={isEditing ? 'New password (optional)' : 'Password'}
              value={currentData.password || ''}
              onChange={(e) => updateData('password', e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 bg-black/60 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              required={!isEditing}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Role</label>
            <select
              value={currentData.role || 'user'}
              onChange={(e) => updateData('role', e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 bg-black/60 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            type="submit"
            className={`w-full sm:flex-none sm:px-8 text-white py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-200 text-sm ${
              isEditing
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/25'
                : 'bg-gradient-to-r from-green-500 to-teal-500 hover:shadow-green-500/25'
            }`}
          >
            {isEditing ? 'Update User' : 'Add User'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:flex-none sm:px-6 py-2.5 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}