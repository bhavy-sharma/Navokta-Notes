'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AnnouncementModal({ 
  isOpen, 
  onClose, 
  onSend, 
  totalUsers = 0, 
  totalAdmins = 0 
}) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  // Get audience count with fallback
  const getAudienceCount = () => {
    if (audience === 'all') return (totalUsers || 0) + (totalAdmins || 0);
    if (audience === 'admins') return totalAdmins || 0;
    if (audience === 'users') return totalUsers || 0;
    return 0;
  };

  const getAudienceLabel = () => {
    const count = getAudienceCount();
    if (audience === 'all') return `All Users & Admins (${count} recipient${count !== 1 ? 's' : ''})`;
    if (audience === 'admins') return `Admins Only (${count} recipient${count !== 1 ? 's' : ''})`;
    if (audience === 'users') return `Users Only (${count} recipient${count !== 1 ? 's' : ''})`;
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const recipientCount = getAudienceCount();
    if (recipientCount === 0) {
      toast.error(`No ${audience === 'admins' ? 'admins' : audience === 'users' ? 'users' : 'recipients'} found to send announcement`);
      return;
    }

    setSending(true);
    try {
      await onSend({ 
        subject: subject.trim(), 
        message: message.trim(),
        audience: audience 
      });
      setSubject('');
      setMessage('');
      setAudience('all');
      onClose();
    } catch (error) {
      toast.error('Failed to send announcement');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-xl">
              📢
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Send Announcement</h3>
              <p className="text-xs text-gray-400">Choose your audience and send notification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            disabled={sending}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Audience Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Send to
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* All */}
              <button
                type="button"
                onClick={() => setAudience('all')}
                className={`
                  px-4 py-3 rounded-lg border-2 transition-all duration-200
                  flex items-center justify-center gap-2
                  ${audience === 'all'
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-gray-600 bg-black/40 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                  }
                `}
              >
                <span>👥</span>
                <div className="text-left">
                  <div className="text-sm font-medium">All</div>
                  <div className="text-xs opacity-70">{(totalUsers || 0) + (totalAdmins || 0)} recipients</div>
                </div>
              </button>

              {/* Admins */}
              <button
                type="button"
                onClick={() => setAudience('admins')}
                className={`
                  px-4 py-3 rounded-lg border-2 transition-all duration-200
                  flex items-center justify-center gap-2
                  ${audience === 'admins'
                    ? 'border-red-500 bg-red-500/20 text-red-300'
                    : 'border-gray-600 bg-black/40 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                  }
                `}
              >
                <span>🛡️</span>
                <div className="text-left">
                  <div className="text-sm font-medium">Admins</div>
                  <div className="text-xs opacity-70">{totalAdmins || 0} recipients</div>
                </div>
              </button>

              {/* Users */}
              <button
                type="button"
                onClick={() => setAudience('users')}
                className={`
                  px-4 py-3 rounded-lg border-2 transition-all duration-200
                  flex items-center justify-center gap-2
                  ${audience === 'users'
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                    : 'border-gray-600 bg-black/40 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                  }
                `}
              >
                <span>👤</span>
                <div className="text-left">
                  <div className="text-sm font-medium">Users</div>
                  <div className="text-xs opacity-70">{totalUsers || 0} recipients</div>
                </div>
              </button>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
            <input
              type="text"
              placeholder="e.g., Important Update: New Features Added!"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/60 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={sending}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
            <textarea
              placeholder="Write your announcement message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-4 py-2.5 bg-black/60 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
              disabled={sending}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{message.length} characters</span>
              <span>Max 5000 characters</span>
            </div>
          </div>

          {/* Audience Summary */}
          <div className={`
            rounded-lg p-3 border
            ${audience === 'all' ? 'bg-purple-500/10 border-purple-500/20' : ''}
            ${audience === 'admins' ? 'bg-red-500/10 border-red-500/20' : ''}
            ${audience === 'users' ? 'bg-blue-500/10 border-blue-500/20' : ''}
          `}>
            <div className="flex items-start gap-2 text-sm">
              <span className="mt-0.5">
                {audience === 'all' && '👥'}
                {audience === 'admins' && '🛡️'}
                {audience === 'users' && '👤'}
              </span>
              <span className={`
                ${audience === 'all' ? 'text-purple-300' : ''}
                ${audience === 'admins' ? 'text-red-300' : ''}
                ${audience === 'users' ? 'text-blue-300' : ''}
              `}>
                Sending to: <strong>{getAudienceLabel()}</strong>
              </span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2 text-xs text-blue-300">
              <span className="mt-0.5">ℹ️</span>
              <span>
                This announcement will be sent via email to the selected audience.
                Make sure your Nodemailer configuration is set up correctly.
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={sending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Announcement
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}