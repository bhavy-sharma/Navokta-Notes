'use client';

import { useEffect, useState } from 'react';

export default function QuoteSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const fullText = `Hard work pays off — but smart work pays off faster. And you’re smart enough to use Navokta Notes.`;

  // Typing effect
  useEffect(() => {
    setIsLoaded(true);
    let index = 0;
    const timeout = setTimeout(() => {
      const type = () => {
        if (index < fullText.length) {
          setDisplayedText(fullText.slice(0, index + 1));
          index++;
          setTimeout(type, 30);
        }
      };
      type();
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-black to-purple-950 transition-all duration-1000"
          style={{
            background: 'radial-gradient(circle at 40% 50%, #1e1b4b, #000), radial-gradient(circle at 80% 20%, #370666, transparent)'
          }}
        ></div>

        {/* Animated Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10 animate-pulse"
          style={{
            background: `
              linear-gradient(90deg, rgba(130, 90, 255, 0.1) 1px, transparent 1px),
              linear-gradient(0deg, rgba(130, 90, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating Orbs */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-l from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <blockquote
          className={`text-3xl md:text-5xl lg:text-6xl font-light italic text-gray-100 leading-relaxed max-w-5xl mx-auto transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {displayedText ? (
            displayedText.split(' ').map((word, i) => {
              if (word === 'Navokta') {
                return (
                  <span
                    key={i}
                    className="inline-block font-bold text-transparent bg-clip-text mx-1"
                    style={{
                      background: 'linear-gradient(to right, #4338ca, #9333ea, #ec4899)',
                      textShadow: '0 0 15px rgba(236, 72, 153, 0.3)',
                    }}
                  >
                    {word}
                  </span>
                );
              }
              if (word === 'Notes.') {
                return (
                  <span
                    key={i}
                    className="inline-block font-bold text-transparent bg-clip-text"
                    style={{
                      background: 'linear-gradient(to right, #4338ca, #9333ea, #ec4899)',
                      textShadow: '0 0 15px rgba(236, 72, 153, 0.3)',
                    }}
                  >
                    {word}
                  </span>
                );
              }
              return <span key={i}> {word} </span>;
            })
          ) : (
            <span className="invisible">{fullText}</span>
          )}
        </blockquote>

        {/* Founder Line */}
        <p
          className={`mt-12 text-2xl md:text-3xl text-gray-300 transition-all duration-1000 delay-700 ${
            displayedText === fullText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } animate-pulse-slow`}
          style={{
            background: 'linear-gradient(to right, #93c5fd, #c4b5fd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          — Bhavy Sharma, Founder
        </p>

        {/* Signature Line */}
        <div
          className={`mt-6 h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto transition-all duration-700 ${
            displayedText === fullText ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Subtle Floating Animation */}
      <style jsx>{`
        .animate-pulse-slow {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </section>
  );
}