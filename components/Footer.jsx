'use client';

import { useState } from 'react'; // 👈 Add this
import LoginRequiredModal from './LoginRequiredModal'; // 👈 Import modal

export default function Footer() {
  const [showLoginModal, setShowLoginModal] = useState(false); // 👈 Modal state

  // 👇 Handle Courses Click with Auth Check
  const handleCoursesClick = (e) => {
    const token = localStorage.getItem('navokta_token');
    const userData = localStorage.getItem('navokta_user');

    if (!token || !userData) {
      e.preventDefault();
      setShowLoginModal(true);
    }
    // If logged in, allow natural navigation (no need to redirect manually)
  };

  const closeModal = () => {
    setShowLoginModal(false);
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
        {/* ✅ Changed to 3 columns */}
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
              <span className="font-medium text-white">Bhavy Sharma</span>
              <span>- The One-Man Army</span>
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
            <h4 className="text-lg font-bold text-white mb-5">Connect With Me</h4>
            <div className="flex space-x-3 mb-6">
              {[
                { name: 'Twitter', icon: '𝕏', href: 'https://x.com/bhavy__sharma__/', color: 'hover:bg-blue-500' },
                { name: 'LinkedIn', icon: '📘', href: 'https://linkedin.com/in/bhavy-sharma', color: 'hover:bg-blue-600' },
                { name: 'Instagram', icon: '📸', href: 'https://instagram.com/navokta', color: 'hover:bg-pink-600' },
                { name: 'YouTube', icon: '▶️', href: 'https://www.youtube.com/@bhavy__sharma__', color: 'hover:bg-red-600' },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm transition-transform duration-300 hover:scale-110 ${social.color}`}
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
            Made in India • For Students, By a Student
          </p>
        </div>
      </div>

      {/* ✅ Login Modal */}
      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={closeModal} 
      />
    </footer>
  );
}