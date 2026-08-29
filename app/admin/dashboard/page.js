'use client';

import dynamic from 'next/dynamic';

// Dynamically import the AdminDashboard component with no SSR
// This prevents hydration issues with the client-side only features
const AdminDashboard = dynamic(
  () => import('@/components/admin/AdminDashboard'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400 animate-pulse">Loading admin dashboard...</p>
        </div>
      </div>
    ),
  }
);

export default function AdminPage() {
  return <AdminDashboard />;
}