'use client';

import { useState, useMemo, useEffect } from 'react';
import AdminForm from './AdminForm';
import AdminsTable from './AdminsTable';
import SearchBar from '../SearchBar';
import toast from 'react-hot-toast';

export default function AdminsManagement({
  admins,
  onAdd,
  onUpdate,
  onDelete,
  refreshAdmins,
  superAdminEmail,
  searchQuery,
  setSearchQuery,
}) {
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter admins based on search query
  const filteredAdmins = useMemo(() => {
    if (!searchQuery.trim()) return admins;
    
    const query = searchQuery.toLowerCase().trim();
    return admins.filter((admin) => {
      return (
        admin.name?.toLowerCase().includes(query) ||
        admin.email?.toLowerCase().includes(query) ||
        admin.role?.toLowerCase().includes(query)
      );
    });
  }, [admins, searchQuery]);

  // Auto-refresh admins when component mounts
  useEffect(() => {
    refreshAdmins();
  }, []);

  const handleAddAdmin = async (adminData) => {
    setIsRefreshing(true);
    try {
      const result = await onAdd(adminData);
      if (result) {
        await refreshAdmins();
        toast.success('Admin added successfully!');
        return result;
      }
    } catch (error) {
      toast.error('Failed to add admin');
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUpdateAdmin = async (id, adminData) => {
    setIsRefreshing(true);
    try {
      const result = await onUpdate(id, adminData);
      if (result) {
        await refreshAdmins();
        toast.success('Admin updated successfully!');
        setEditingAdmin(null);
        return result;
      }
    } catch (error) {
      toast.error('Failed to update admin');
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    setIsRefreshing(true);
    try {
      const result = await onDelete(id);
      if (result) {
        await refreshAdmins();
        toast.success('Admin deleted successfully!');
        return result;
      }
    } catch (error) {
      toast.error('Failed to delete admin');
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Search Bar */}
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 w-full">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search admins by name, email, role..."
              totalItems={admins.length}
              filteredItems={filteredAdmins.length}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
            <span className="hidden sm:inline">👥</span>
            <span>Total: <span className="text-white font-medium">{admins.length}</span></span>
          </div>
        </div>
      </div>

      <AdminForm
        onAdd={handleAddAdmin}
        onUpdate={handleUpdateAdmin}
        editingAdmin={editingAdmin}
        setEditingAdmin={setEditingAdmin}
        isRefreshing={isRefreshing}
      />
      
      <AdminsTable
        admins={filteredAdmins}
        onDelete={handleDeleteAdmin}
        onEdit={setEditingAdmin}
        superAdminEmail={superAdminEmail}
        editingAdminId={editingAdmin?._id}
        isRefreshing={isRefreshing}
        onRefresh={refreshAdmins}
        searchQuery={searchQuery}
      />
    </div>
  );
}