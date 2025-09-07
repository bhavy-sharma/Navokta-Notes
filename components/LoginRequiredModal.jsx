'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function LoginRequiredModal({ isOpen, onClose }) {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-black/90 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Login Required</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-white/10"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-300 mb-4 text-center md:text-left">
            You need to be logged in to access this feature. Please log in to continue.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Link
              href="/auth/login"
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 text-center"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              onClick={onClose}
              className="flex-1 bg-transparent border border-gray-600 text-gray-300 py-2.5 px-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-4">
          <button
            onClick={onClose}
            className="w-full text-gray-400 hover:text-white transition text-sm py-2 rounded-lg hover:bg-white/5"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}