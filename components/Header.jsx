'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative">
      <div className="fixed top-0 left-0 right-0 backdrop-blur-md bg-white/70 border-b border-gray-200 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            NotesHub
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/courses" className="text-gray-700 hover:text-blue-600 font-medium transition">Courses</Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium transition">Login</Link>
            <Link href="/auth/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition transform hover:-translate-y-0.5">
              Sign Up
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-6 py-4 flex flex-col space-y-3">
              <Link href="/courses" className="text-gray-700">Courses</Link>
              <Link href="/auth/login" className="text-gray-700">Login</Link>
              <Link href="/auth/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 rounded-full font-semibold">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}