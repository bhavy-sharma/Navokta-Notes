// components/admin/QueriesManagement/QueriesManagement.jsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import QueriesTable from './QueriesTable';
import QueryDetailModal from './QueryDetailModal';
import SearchBar from '../SearchBar';

export default function QueriesManagement() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchQueries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        setQueries(data);
      } else {
        toast.error('Failed to fetch queries');
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  const filteredQueries = useMemo(() => {
    if (!searchQuery.trim()) return queries;
    const query = searchQuery.toLowerCase().trim();
    return queries.filter((q) => {
      return (
        q.name?.toLowerCase().includes(query) ||
        q.email?.toLowerCase().includes(query) ||
        q.subject?.toLowerCase().includes(query) ||
        q.message?.toLowerCase().includes(query) ||
        q.status?.toLowerCase().includes(query)
      );
    });
  }, [queries, searchQuery]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success('Status updated successfully');
        fetchQueries();
        return true;
      } else {
        toast.error('Failed to update status');
        return false;
      }
    } catch (error) {
      toast.error('Network error');
      return false;
    }
  };

  const handleDeleteQuery = async (id) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Query deleted successfully');
        fetchQueries();
        return true;
      } else {
        toast.error('Failed to delete query');
        return false;
      }
    } catch (error) {
      toast.error('Network error');
      return false;
    }
  };

  const handleViewDetails = (query) => {
    setSelectedQuery(query);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-400">Loading queries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search Bar */}
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 w-full">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search queries by name, email, subject..."
              totalItems={queries.length}
              filteredItems={filteredQueries.length}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchQueries}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              Total: <span className="text-white font-medium">{queries.length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Queries Table */}
      <QueriesTable
        queries={filteredQueries}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDeleteQuery}
        searchQuery={searchQuery}
        onRefresh={fetchQueries}
      />

      {/* Query Detail Modal */}
      <QueryDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        query={selectedQuery}
        onUpdateStatus={handleUpdateStatus}
        onRefresh={fetchQueries}
      />
    </div>
  );
}