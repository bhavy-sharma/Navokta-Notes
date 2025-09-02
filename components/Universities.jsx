'use client';

import { useState, useEffect } from 'react';

export default function Universities() {
  const [isVisible, setIsVisible] = useState(false);

  const universities = [
    "Chaudhary Charan Singh University (CCSU)",
    "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
    "Guru Gobind Singh Indraprastha University (IPU)",
    "Maharshi Dayanand University (MDU)",
  ];

  const colleges = [
    "Meerut Institute of Engineering & Technology (MIET)",
    "Institute of Engineering & Technology (IET)",
    "GLA University",
    "Sharda University",
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const el = document.getElementById('universities-section');
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section
      id="universities-section"
      className="py-24 relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, #0a0a0a, #000)',
      }}
    >
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
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Headline */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Trusted by Students Across
          </h2>
          <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            We align with real syllabi — not just generic content. <strong className="text-white">You're in good company.</strong>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Universities */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center justify-center md:justify-start space-x-3">
              <span className="text-3xl">🎓</span>
              <span className="bg-gradient-to-r from-blue-300 to-blue-100 text-transparent bg-clip-text text-2xl">
                Universities
              </span>
            </h3>

            <ul className="space-y-4">
              {universities.map((uni, idx) => (
                <li
                  key={idx}
                  className={`group relative bg-black/40 backdrop-blur-sm p-5 rounded-xl border-l-4 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 cursor-default ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    borderLeft: '4px solid transparent',
                    borderImage: 'linear-gradient(to bottom, #3b82f6, #8b5cf6) 1',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
                    transitionDelay: `${idx * 100}ms`,
                  }}
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 bg-gradient-to-r from-blue-500/30 to-purple-500/30 transition-opacity duration-500 pointer-events-none"></div>

                  {/* Dot */}
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mr-4 shadow-lg"></span>
                    <span className="text-gray-200 group-hover:text-white transition-colors text-sm md:text-base">
                      {uni}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Colleges */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center justify-center md:justify-start space-x-3">
              <span className="text-3xl">🏫</span>
              <span className="bg-gradient-to-r from-purple-300 to-pink-100 text-transparent bg-clip-text text-2xl">
                Partner Colleges
              </span>
            </h3>

            <ul className="space-y-4">
              {colleges.map((college, idx) => (
                <li
                  key={idx}
                  className={`group relative bg-black/40 backdrop-blur-sm p-5 rounded-xl border-l-4 transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 cursor-default ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{
                    borderLeft: '4px solid transparent',
                    borderImage: 'linear-gradient(to bottom, #a78bfa, #ec4899) 1',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
                    transitionDelay: `${idx * 100 + 300}ms`,
                  }}
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 bg-gradient-to-r from-purple-500/30 to-pink-500/30 transition-opacity duration-500 pointer-events-none"></div>

                  {/* Dot */}
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full mr-4 shadow-lg"></span>
                    <span className="text-gray-200 group-hover:text-white transition-colors text-sm md:text-base">
                      {college}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Badge */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-black/60 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-gray-300 text-sm">
              <strong className="text-white">+50+ Colleges</strong> using Navokta Notes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}