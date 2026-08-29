'use client';

import { useState, useEffect } from 'react';
import AdminForm from './AdminForm';
import AdminsTable from './AdminsTable';
import toast from 'react-hot-toast';

export default function AdminsManagement({
  admins,
  onAdd,
  onUpdate,
  onDelete,
  refreshAdmins,
  superAdminEmail,
}) {
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh admins when component mounts
  useEffect(() => {
    refreshAdmins();
  }, []);

  const handleAddAdmin = async (adminData) => {
    setIsRefreshing(true);
    try {
      const result = await onAdd(adminData);
      if (result) {
        // Force refresh after adding
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
      <AdminForm
        onAdd={handleAddAdmin}
        onUpdate={handleUpdateAdmin}
        editingAdmin={editingAdmin}
        setEditingAdmin={setEditingAdmin}
        isRefreshing={isRefreshing}
      />
      <AdminsTable
        admins={admins}
        onDelete={handleDeleteAdmin}
        onEdit={setEditingAdmin}
        superAdminEmail={superAdminEmail}
        editingAdminId={editingAdmin?._id}
        isRefreshing={isRefreshing}
        onRefresh={refreshAdmins}
      />
    </div>
  );
}