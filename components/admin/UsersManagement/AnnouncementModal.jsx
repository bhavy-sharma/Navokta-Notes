'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

export default function NewsletterModal({ 
  isOpen, 
  onClose, 
  onSend, 
  totalUsers = 0, 
  totalAdmins = 0 
}) {
  const [subject, setSubject] = useState('');
  const [preheader, setPreheader] = useState(''); // Snippet text shown next to subject in inbox
  const [bannerUrl, setBannerUrl] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');
  const [sending, setSending] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  
  const textareaRef = useRef(null);

  if (!isOpen) return null;

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

  // Insert dynamic variables at the current cursor position
  const insertVariable = (variable) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = message;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    
    setMessage(before + variable + after);
    
    // Restore focus and move cursor after the inserted variable
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length, start + variable.length);
    }, 0);
  };

  // Generate HTML preview with mock data replacing dynamic variables
  const getPreviewHtml = () => {
    if (!message.trim()) {
      return '<p class="text-gray-400 italic text-center py-8">Start typing your message to see the preview...</p>';
    }
    
    return message
      .replace(/{{name}}/g, '<span class="text-blue-600 font-semibold bg-blue-100 px-1.5 py-0.5 rounded">Alex Johnson</span>')
      .replace(/{{email}}/g, '<span class="text-purple-600 font-semibold bg-purple-100 px-1.5 py-0.5 rounded">alex@example.com</span>')
      .replace(/{{role}}/g, '<span class="text-green-600 font-semibold bg-green-100 px-1.5 py-0.5 rounded">Premium User</span>')
      .replace(/\n/g, '<br />');
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
      toast.error(`No recipients found for the selected audience`);
      return;
    }

    setSending(true);
    try {
      await onSend({ 
        subject: subject.trim(), 
        preheader: preheader.trim(),
        bannerUrl: bannerUrl.trim(),
        message: message.trim(),
        audience: audience 
      });
      
      // Reset form
      setSubject('');
      setPreheader('');
      setBannerUrl('');
      setMessage('');
      setAudience('all');
      setIsPreview(false);
      onClose();
      toast.success('Newsletter sent successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send newsletter');
    } finally {
      setSending(false);
    }
  };

  const dynamicVariables = [
    { label: 'First Name', value: '{{name}}', color: 'blue' },
    { label: 'Email', value: '{{email}}', color: 'purple' },
    { label: 'Role', value: '{{role}}', color: 'green' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
              ✉️
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Create Newsletter</h3>
              <p className="text-xs text-gray-400">Compose and preview your email campaign</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-50"
            disabled={sending}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700/50 shrink-0">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              !isPreview ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            ✏️ Compose
            {!isPreview && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
              isPreview ? 'text-blue-400' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            👁️ Live Preview
            {isPreview && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* COMPOSE MODE */}
          {!isPreview && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Audience Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['all', 'admins', 'users'].map((type) => {
                    const count = type === 'all' ? (totalUsers || 0) + (totalAdmins || 0) : type === 'admins' ? (totalAdmins || 0) : (totalUsers || 0);
                    const isActive = audience === type;
                    const colors = {
                      all: isActive ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-gray-700 bg-black/40 text-gray-400 hover:border-gray-500',
                      admins: isActive ? 'border-red-500 bg-red-500/20 text-red-300' : 'border-gray-700 bg-black/40 text-gray-400 hover:border-gray-500',
                      users: isActive ? 'border-blue-500 bg-blue-500/20 text-blue-300' : 'border-gray-700 bg-black/40 text-gray-400 hover:border-gray-500',
                    };
                    const icons = { all: '👥', admins: '🛡️', users: '👤' };
                    const labels = { all: 'Everyone', admins: 'Admins Only', users: 'Users Only' };

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAudience(type)}
                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${colors[type]}`}
                      >
                        <span className="text-xl">{icons[type]}</span>
                        <div className="text-left">
                          <div className="text-sm font-semibold">{labels[type]}</div>
                          <div className="text-xs opacity-70">{count} recipients</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject & Preheader */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Subject Line</label>
                  <input
                    type="text"
                    placeholder="e.g., Important Update: New Features Added!"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black/60 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={sending}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Preheader Text</label>
                  <input
                    type="text"
                    placeholder="Snippet shown in inbox..."
                    value={preheader}
                    onChange={(e) => setPreheader(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black/60 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    disabled={sending}
                  />
                </div>
              </div>

              {/* Banner URL (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Header Banner Image URL <span className="text-gray-500 font-normal">(Optional)</span></label>
                <input
                  type="url"
                  placeholder="https://example.com/banner.jpg"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  disabled={sending}
                />
              </div>

              {/* Message & Dynamic Variables */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-300">Message Body</label>
                  <span className="text-xs text-gray-500">{message.length} / 5000 chars</span>
                </div>
                
                {/* Variable Insertion Toolbar */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs text-gray-500 self-center mr-1">Insert:</span>
                  {dynamicVariables.map((v) => (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => insertVariable(v.value)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-all hover:scale-105 active:scale-95 flex items-center gap-1
                        ${v.color === 'blue' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20' : ''}
                        ${v.color === 'purple' ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20' : ''}
                        ${v.color === 'green' ? 'bg-green-500/10 border-green-500/30 text-green-300 hover:bg-green-500/20' : ''}
                      `}
                    >
                      <span>+</span> {v.label}
                    </button>
                  ))}
                </div>

                <textarea
                  ref={textareaRef}
                  placeholder="Hi {{name}},&#10;&#10;We are excited to announce..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-black/60 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all font-mono text-sm"
                  disabled={sending}
                  maxLength={5000}
                />
              </div>

              {/* Audience Summary */}
              <div className={`rounded-lg p-3 border ${
                audience === 'all' ? 'bg-purple-500/10 border-purple-500/20' : 
                audience === 'admins' ? 'bg-red-500/10 border-red-500/20' : 
                'bg-blue-500/10 border-blue-500/20'
              }`}>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-lg">
                    {audience === 'all' ? '👥' : audience === 'admins' ? '🛡️' : '👤'}
                  </span>
                  <span className={
                    audience === 'all' ? 'text-purple-300' : 
                    audience === 'admins' ? 'text-red-300' : 'text-blue-300'
                  }>
                    Ready to send to: <strong>{getAudienceLabel()}</strong>
                  </span>
                </div>
              </div>
            </form>
          )}

          {/* PREVIEW MODE */}
          {isPreview && (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-xl p-4 sm:p-6 border border-gray-200 shadow-inner">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-2xl mx-auto">
                  {/* Optional Banner */}
                  {bannerUrl ? (
                    <div 
                      className="h-40 bg-gray-200 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${bannerUrl})` }}
                    />
                  ) : (
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-cyan-600" />
                  )}

                  {/* Email Header Mock */}
                  <div className="bg-gray-50 border-b border-gray-200 p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        N
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Navokta Notes</div>
                        <div className="text-xs text-gray-500">to: {getAudienceLabel()}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      {subject || <span className="text-gray-400 italic">(No Subject)</span>}
                    </div>
                    {preheader && (
                      <div className="text-sm text-gray-500 italic border-l-2 border-gray-300 pl-3 mt-2">
                        {preheader}
                      </div>
                    )}
                  </div>
                  
                  {/* Email Body Mock */}
                  <div className="p-6 sm:p-8 text-gray-800 leading-relaxed text-sm sm:text-base">
                    <div dangerouslySetInnerHTML={{ __html: getPreviewHtml() }} />
                  </div>

                  {/* Email Footer Mock */}
                  <div className="bg-gray-50 border-t border-gray-200 p-4 sm:p-6 text-center">
                    <p className="text-xs text-gray-500 font-medium">© {new Date().getFullYear()} Navokta Notes. All rights reserved.</p>
                    <p className="text-xs text-gray-400 mt-1">You are receiving this email because you are a registered user.</p>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500">
                * Variables like <span className="text-blue-400 font-mono">{'{{name}}'}</span> will be dynamically replaced with actual user data when sent.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-gray-700/50 shrink-0 bg-slate-900/50 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            {!isPreview ? (
              <>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={sending}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Newsletter...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Newsletter
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={sending}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors border border-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsPreview(false)}
                className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors border border-gray-700 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Back to Compose
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}