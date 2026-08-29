// components/admin/QueriesManagement/QueryDetailModal.jsx
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: 'pending', label: '⏳ Pending' },
  { value: 'read', label: '👀 Read' },
  { value: 'replied', label: '💬 Replied' },
  { value: 'resolved', label: '✅ Resolved' },
];

export default function QueryDetailModal({ isOpen, onClose, query, onUpdateStatus, onRefresh }) {
  const [status, setStatus] = useState(query?.status || 'pending');
  const [updating, setUpdating] = useState(false);

  if (!isOpen || !query) return null;

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      await onUpdateStatus(query._id, status);
      onRefresh();
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (s) => {
    const colors = {
      pending: 'text-yellow-400',
      read: 'text-blue-400',
      replied: 'text-purple-400',
      resolved: 'text-green-400',
    };
    return colors[s] || 'text-gray-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-xl">
              📩
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Query Details</h3>
              <p className="text-xs text-gray-400">ID: {query._id?.slice(-6)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Sender Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="text-white font-medium">{query.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-white font-medium">{query.email}</p>
            </div>
          </div>

          {/* Subject */}
          <div>
            <p className="text-xs text-gray-500">Subject</p>
            <p className="text-white font-medium">{query.subject}</p>
          </div>

          {/* Message */}
          <div>
            <p className="text-xs text-gray-500">Message</p>
            <div className="bg-black/40 border border-gray-700 rounded-xl p-4 mt-1">
              <p className="text-gray-300 whitespace-pre-wrap text-sm">{query.message}</p>
            </div>
          </div>

          {/* Date */}
          <div>
            <p className="text-xs text-gray-500">Received</p>
            <p className="text-gray-400 text-sm">
              {new Date(query.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Status Update */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Status</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-black/60 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || status === query.status}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
            <p className={`mt-2 text-sm font-medium ${getStatusColor(status)}`}>
              Current Status: {statusOptions.find(s => s.value === status)?.label || status}
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-700/50">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}