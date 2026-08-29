'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAdminData } from './hooks/useAdminData';
import Sidebar from './Sidebar';
import DashboardTab from './DashboardTab';
import NotesManagement from './NotesManagement/NotesManagement';
import CoursesManagement from './CoursesManagement/CoursesManagement';
import AdminsManagement from './AdminsManagement/AdminsManagement';

const ALLOWED_ADMIN_EMAIL = 'codershab@gmail.com';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  const {
    loading,
    courses,
    notes,
    admins,
    fetchCourses,
    fetchNotes,
    fetchAdmins,
    deleteNote,
    deleteCourse,
    deleteAdmin,
    uploadNote,
    addCourse,
    addAdmin,
    updateNote,
    updateCourse,
    updateAdmin,
    setCourses,
    setNotes,
    setAdmins
  } = useAdminData(ALLOWED_ADMIN_EMAIL, router);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col md:flex-row">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} router={router} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <DashboardTab courses={courses} notes={notes} admins={admins} />
        )}
        
        {activeTab === 'notes' && (
          <NotesManagement
            courses={courses}
            notes={notes}
            onUpload={uploadNote}
            onUpdate={updateNote}
            onDelete={deleteNote}
            refreshNotes={fetchNotes}
            setNotes={setNotes}
          />
        )}
        
        {activeTab === 'courses' && (
          <CoursesManagement
            courses={courses}
            onAdd={addCourse}
            onUpdate={updateCourse}
            onDelete={deleteCourse}
            refreshCourses={fetchCourses}
            setCourses={setCourses}
          />
        )}
        
        {activeTab === 'admins' && (
          <AdminsManagement
            admins={admins}
            onAdd={addAdmin}
            onUpdate={updateAdmin}
            onDelete={deleteAdmin}
            refreshAdmins={fetchAdmins}
            setAdmins={setAdmins}
            superAdminEmail={ALLOWED_ADMIN_EMAIL}
          />
        )}
      </main>
    </div>
  );
}

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <p className="text-gray-400 animate-pulse">Loading admin dashboard...</p>
    </div>
  );
}