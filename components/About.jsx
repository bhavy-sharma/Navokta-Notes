// components/AboutSection.jsx

'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <div className="relative py-16 bg-gray-900">
      {/* Grid background with proper fallback */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Solid dark background fallback */}
        <div className="absolute inset-0 bg-gray-900"></div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(67,94,218,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_50%,rgba(218,67,193,0.15)_0%,transparent_50%)]"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 0 0 L 0 40 M 0 0 L 40 0" stroke="#ffffff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Photo */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-50"></div>
            <Image
              src="/bhai.jpg"
              alt="Navokta Notes Founders"
              width={800}
              height={500}
              className="relative rounded-lg shadow-2xl border border-gray-700 max-w-full h-auto"
              quality={90}
            />
          </div>
        </div>

        {/* Text content */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
            Meet the Brains Behind Navokta Notes 
          </h2>

          <p className="text-lg leading-relaxed text-gray-200">
            <strong className="text-white">Bhai 1:</strong> Bhavy Sharma — The one-man army who codes visions. From scratch to scale, he built this entire platform — front-end, back-end, design, content, everything. His mission? Make quality education free and stress-free for every student in India.
          </p>

          <p className="text-lg leading-relaxed text-gray-200">
            <strong className="text-white">Bhai 2:</strong> Anant Pratap Singh — The backbone of the backend! From designing robust APIs to implementing core logic, bhai ne project ke server-side structure ko majboot banaya. His clean code and problem-solving mindset ensure that everything you see on Navokta Notes runs smoothly under the hood.
          </p>

          <p className="text-lg italic text-gray-300 border-l-4 border-blue-500 pl-4 max-w-2xl mx-auto">
            "We're not here to sell courses. We're here to empower students." — Bhai Team
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a5 5 0 01-10 0V9z" />
              <path d="M12 22v-4" />
            </svg>
            Read More About Us
          </Link>
        </div>
      </div>
    </div>
  );
}