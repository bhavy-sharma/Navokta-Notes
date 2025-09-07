'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, X } from 'lucide-react';

export default function LoginRequiredModal({ isOpen, onClose, title = "Login Required", message = "You need to be logged in to access this feature. Please log in to continue.", actionText = "Continue to Login" }) {
  const [isVisible, setIsVisible] = useState(false);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      // Delay the animation slightly for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`; // Prevent layout shift
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
        document.body.style.paddingRight = '0';
      };
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in slide-in-from-bottom-4 duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(147, 51, 234, 0.1)'
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30">
              <Lock className="h-6 w-6 text-blue-400" />
            </div>
            <h3 id="modal-title" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {title}
            </h3>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-white/10 hover:rotate-90"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="mb-8">
          <p className="text-gray-300 mb-6 text-center sm:text-left leading-relaxed">
            {message}
          </p>
          
          <div className="space-y-4">
            <Link
              href="/auth/login"
              onClick={handleClose}
              className="group flex items-center justify-center w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 text-center relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center space-x-2">
                <span>{actionText}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1"></div>
              <span className="text-gray-500 text-sm font-medium">or</span>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1"></div>
            </div>
            
            <Link
              href="/auth/register"
              onClick={handleClose}
              className="flex items-center justify-center w-full bg-transparent border border-gray-600 text-gray-300 py-3.5 px-6 rounded-xl font-semibold hover:bg-white/5 hover:border-gray-500 transition-all duration-300 text-center group"
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-blue-400 transition-all duration-300">
                Create a Free Account
              </span>
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-12 h-12 bg-purple-600/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-blue-600/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
}