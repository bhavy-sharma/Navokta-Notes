'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import UsersTable from './UsersTable';
import UserForm from './UserForm';
import AnnouncementModal from './AnnouncementModal';
import SearchBar from '../SearchBar';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        console.log('Fetched users:', data); // Debug log
        console.log('Admins:', data.filter(u => u.role === 'admin')); // Debug log
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase().trim();
    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query)
      );
    });
  }, [users, searchQuery]);

  // Count users and admins
  const userCount = useMemo(() => {
    return users.filter(u => u.role === 'user' || !u.role).length;
  }, [users]);

  const adminCount = useMemo(() => {
    return users.filter(u => u.role === 'admin').length;
  }, [users]);

  // CRUD Operations
  const handleAddUser = useCallback(async (userData) => {
    try {
      const res = await fetch('/api/admin/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('User added successfully!');
        await fetchUsers();
        return data;
      } else {
        toast.error(data.message || 'Failed to add user');
        return null;
      }
    } catch (error) {
      toast.error('Network error');
      return null;
    }
  }, [fetchUsers]);

  const handleUpdateUser = useCallback(async (id, userData) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('User updated successfully!');
        await fetchUsers();
        setEditingUser(null);
        return data;
      } else {
        toast.error(data.error || 'Failed to update user');
        return null;
      }
    } catch (error) {
      toast.error('Network error');
      return null;
    }
  }, [fetchUsers]);

  const handleDeleteUser = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('User deleted successfully!');
        await fetchUsers();
        return true;
      } else {
        toast.error(data.error || 'Failed to delete user');
        return false;
      }
    } catch (error) {
      toast.error('Network error');
      return false;
    }
  }, [fetchUsers]);

  // Handle announcement
  const handleSendAnnouncement = useCallback(async (announcementData) => {
    try {
      const res = await fetch('/api/admin/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Announcement sent to ${data.sentCount || 0} recipients!`);
        setIsAnnouncementModalOpen(false);
        return data;
      } else {
        toast.error(data.error || 'Failed to send announcement');
        return null;
      }
    } catch (error) {
      toast.error('Network error');
      return null;
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Announcement Bar */}
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 w-full">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search users by name, email, role..."
              totalItems={users.length}
              filteredItems={filteredUsers.length}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Announcement
            </button>
            <span className="text-xs text-gray-500 whitespace-nowrap hidden sm:block">
              Total: <span className="text-white font-medium">{users.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* User Form */}
      <UserForm
        key={editingUser?._id || 'new-user'}
        onAdd={handleAddUser}
        onUpdate={handleUpdateUser}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
      />

      {/* Users Table */}
      <UsersTable
        key="users-table"
        users={filteredUsers}
        onDelete={handleDeleteUser}
        onEdit={setEditingUser}
        editingUserId={editingUser?._id}
        searchQuery={searchQuery}
        onRefresh={fetchUsers}
      />

      {/* Announcement Modal - Pass correct counts */}
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSend={handleSendAnnouncement}
        totalUsers={userCount}
        totalAdmins={adminCount}
      />
    </div>
  );
}