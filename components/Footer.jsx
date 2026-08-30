'use client';

import { useState } from 'react';
import LoginRequiredModal from './LoginRequiredModal';

export default function Footer() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCoursesClick = (e) => {
    const token = localStorage.getItem('navokta_token');
    const userData = localStorage.getItem('navokta_user');

    if (!token || !userData) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  // Professional SVG Icons for Social Platforms
  const socialIcons = {
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  };

  return (
    <footer className="relative overflow-hidden" style={{
      background: 'radial-gradient(circle at top center, #0a0a0a, #000)',
    }}>
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating Orbs */}
      <div className="absolute -top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-gradient-to-l from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="flex flex-col h-full">
            <h3 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
              Navokta Notes
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Empowering students with free, high-quality academic resources — one PDF at a time.
            </p>

            {/* Creator Badge */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 border-l-2 border-gradient-to-b from-blue-500 to-purple-500 pl-3 mt-auto">
              <span>⚡</span>
              <span className="font-medium text-white">Bhavy Sharma & Anant Pratap Singh</span>
              <span>- The Two-Man Army</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col h-full">
            <h4 className="text-lg font-bold text-white mb-5 flex items-center">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
              Quick Links
            </h4>
            <ul className="space-y-3 flex-1">
              {[
                { name: 'Home', href: '/' },
                { name: 'Courses', href: '/courses' },
                { name: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={link.name === 'Courses' ? handleCoursesClick : undefined}
                    className="text-gray-400 hover:text-blue-300 transition-all duration-300 hover:translate-x-1 block text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col h-full">
            <h4 className="text-lg font-bold text-white mb-5">Connect With Us</h4>
            <div className="flex space-x-3 mb-6">
              {[
                { name: 'Twitter', icon: socialIcons.twitter, href: 'https://x.com/bhavy__sharma__/', color: 'hover:bg-gray-900 hover:text-white' },
                { name: 'LinkedIn', icon: socialIcons.linkedin, href: 'https://linkedin.com/in/bhavy-sharma', color: 'hover:bg-blue-600 hover:text-white' },
                { name: 'Instagram', icon: socialIcons.instagram, href: 'https://instagram.com/navokta', color: 'hover:bg-pink-600 hover:text-white' },
                { name: 'YouTube', icon: socialIcons.youtube, href: 'https://www.youtube.com/@bhavy__sharma__', color: 'hover:bg-red-600 hover:text-white' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-gray-800/80 border border-gray-700 flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110 hover:border-transparent ${social.color}`}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Student Community */}
            <p className="text-xs text-gray-500 leading-relaxed mt-auto">
              Join <strong className="text-white">10,000+</strong> students learning smarter every day.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-16 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} <strong className="text-white">Navokta Notes</strong>. Crafted with{' '}
            <span className="text-red-500">❤️</span> by{' '}
            <span className="font-bold bg-gradient-to-r from-blue-400 to-pink-400 text-transparent bg-clip-text">
              Bhavy Sharma & Anant Pratap Singh
            </span>
            . All rights reserved.
          </p>

          {/* Subtle Tagline */}
          <p className="text-gray-600 text-xs mt-2">
            Made in India • For the Students, By a Students
          </p>
        </div>
      </div>

      {/* Login Modal */}
      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={closeModal} 
      />
    </footer>
  );
}