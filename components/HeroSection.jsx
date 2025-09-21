"use client";

import { useEffect, useRef, useState } from "react"; // 👈 Added useState
import LoginRequiredModal from "./LoginRequiredModal"; // 👈 Import your modal

export default function HeroSection() {
  const canvasRef = useRef(null);
  const [showLoginModal, setShowLoginModal] = useState(false); // 👈 Add state

  // Check auth status and handle course click
  const handleCourseClick = () => {
    const token = localStorage.getItem('navokta_token');
    const userData = localStorage.getItem('navokta_user');

    if (!token || !userData) {
      setShowLoginModal(true); // Show modal if not logged in
    } else {
      window.location.href = "/courses"; // Redirect if logged in
    }
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  // ... rest of your existing useEffect for canvas animation ...

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const particles = [];
    const colors = ["#818cf8", "#a78bfa", "#c084fc", "#e879f9"];

    for (let i = 0; i < 8; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.floor(p.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: "radial-gradient(circle at 50% 50%, #0a0a0a, #000)",
        }}
      />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-pink-600/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 text-center lg:text-left py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left: Text */}
          <div className="flex-1 space-y-8 max-w-2xl mx-auto lg:mx-0">
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                Navokta
              </span>
              <br />
              <span className="text-white font-light tracking-wide">Notes</span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              Where <strong className="text-white">smart study</strong> meets{" "}
              <strong className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                zero stress
              </strong>
              . Free, high-quality resources for{" "}
              <strong>BBA, BCA, MCA, BTech, MBA, B.Sc</strong> — aligned with{" "}
              <em className="text-purple-300">CCSU, AKTU, IPU</em> & more.
            </p>

            <div className="flex items-center justify-center lg:justify-start space-x-2 text-sm text-gray-400 border-l-2 border-gradient-to-b from-blue-500 to-purple-500 pl-4">
              <span>⚡</span>
              <span>
                Built by <strong className="text-white">Bhavy Sharma</strong> —
                the one-man army who codes visions
              </span>
            </div>

            {/* ✅ Updated CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mt-8">
              <button
                onClick={handleCourseClick} // 👈 Use the new handler
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-10 py-4 rounded-full text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
              >
                📚 Explore Courses
                <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition"></span>
              </button>
              <p className="text-gray-500 text-sm text-center lg:text-left">
                Trusted by <strong className="text-white">10,000+</strong>{" "}
                students across India
              </p>
            </div>
          </div>

          {/* Right: Abstract Neon Paper */}
          <div className="flex-1 flex justify-center lg:justify-end mt-10 lg:mt-0">
            <div className="relative w-64 h-80 perspective-1000">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 w-64 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl backdrop-blur-sm shadow-2xl"
                  style={{
                    transform: `rotateX(0deg) rotateY(${
                      40 - i * 4
                    }deg) translateZ(${i * 20}px)`,
                    zIndex: 6 - i,
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    boxShadow: "0 10px 30px -5px rgba(30, 64, 175, 0.2)",
                  }}
                >
                  <div
                    className="absolute inset-4 border border-dashed border-blue-300/20 rounded-lg"
                    style={{
                      background: `linear-gradient(0deg, transparent, rgba(59, 130, 246, ${
                        0.05 * (6 - i)
                      }))`,
                    }}
                  />
                </div>
              ))}

              <div
                className="absolute -bottom-8 -right-8 bg-black/80 backdrop-blur-sm border border-blue-500/30 px-3 py-1.5 rounded-full text-xs font-bold text-green-400 shadow-lg flex items-center space-x-1"
                style={{
                  transform: "translateZ(1px)",
                  zIndex: 10,
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  boxShadow: "0 4px 12px -2px rgba(59, 130, 246, 0.3)",
                }}
              >
                <span className="text-xs">✦</span>
                <span className="text-xs">FREE & VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 opacity-60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      {/* ✅ Login Modal */}
      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={closeModal} 
      />
    </section>
  );
}