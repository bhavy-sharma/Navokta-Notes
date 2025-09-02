'use client';

import { useState, useEffect } from 'react';

export default function Features() {
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: "📚",
      title: "Smart Notes",
      desc: "Crisp, well-structured PDFs designed for quick revision and deep understanding — no fluff, only value.",
    },
    {
      icon: "🎥",
      title: "Video Guides",
      desc: "Curated YouTube playlists for every subject — learn visually, learn faster, retain longer.",
    },
    {
      icon: "🎯",
      title: "PYQs & Solutions",
      desc: "Previous Year Questions with expert solutions — your secret weapon for acing exams.",
    },
    {
      icon: "🎓",
      title: "University-Aligned",
      desc: "Tailored for CCSU, AKTU, IPU, and more — syllabus-perfect, exam-ready content.",
    },
  ];

  // Trigger animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const el = document.getElementById('features-section');
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section
      id="features-section"
      className="py-24 relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at top right, #0f172a, #000)',
      }}
    >
      {/* Background Grid (Subtle Paper Texture) */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      ></div>

      {/* Floating Orbs */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-l from-pink-600/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Headline */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Why Students Love Us
          </h2>
          <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            We don’t just share notes — we build <strong className="text-white">learning ecosystems</strong> that make success inevitable.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`group relative bg-black/40 backdrop-blur-sm p-7 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 cursor-default ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.4)',
                background: 'radial-gradient(circle at top left, rgba(59, 130, 246, 0.05), transparent 40%), #0a0a0a',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                transitionDelay: `${idx * 100}ms`,
              }} 
            >
              {/* Icon */}
              <div className="text-5xl mb-5 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                {feat.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                {feat.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">
                {feat.desc}
              </p>

              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${['#3b82f6', '#8b5cf6', '#ec4899', '#f97316'][idx]}40, transparent 60%)`,
                  transform: 'scale(0.95)',
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}