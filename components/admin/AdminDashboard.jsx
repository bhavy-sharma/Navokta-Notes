'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminData } from './hooks/useAdminData';
import Sidebar from './Sidebar';
import DashboardTab from './DashboardTab';
import NotesManagement from './NotesManagement/NotesManagement';
import CoursesManagement from './CoursesManagement/CoursesManagement';
import AdminsManagement from './AdminsManagement/AdminsManagement';
import UsersManagement from './UsersManagement/UsersManagement'; // 👈 New import
// Add import
import QueriesManagement from './QueriesManagement/QueriesManagement';

const ALLOWED_ADMIN_EMAIL = 'codershab@gmail.com';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
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
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        router={router}
      />

      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto w-full max-w-full">
        <div className="w-full max-w-7xl mx-auto">
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
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
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
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
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
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {/* 👈 New User Management Tab */}
          {activeTab === 'users' && (
            <UsersManagement />
          )}
          // Add to switch/case
          {activeTab === 'queries' && (
            <QueriesManagement />
          )}

        </div>
      </main>
    </div>
  );
}

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-gray-400 animate-pulse text-sm sm:text-base">Loading admin dashboard...</p>
      </div>
    </div>
  );
}