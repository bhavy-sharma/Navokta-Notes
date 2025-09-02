'use client';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-pink-300 to-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-6 text-center z-10 relative">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
            Smart Notes.
          </span>
          <br />
          <span className="text-gray-800">Zero Stress.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Free, high-quality notes, PYQs, and video resources for BBA, BCA, MCA, MBA, B.Tech, B.Sc — tailored for CCSU, AKTU & more.
        </p>

        <div className="inline-block bg-white/80 backdrop-blur-sm border border-gray-200 px-8 py-4 rounded-2xl shadow-lg mb-8">
          <p className="font-semibold text-lg">
            Crafted by{' '}
            <span className="text-transparent bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text font-bold">
              Mr. Bhavy Sharma
            </span>
            {' '}– The One-Man Army who codes visions into reality.
          </p>
        </div>

        <button
          onClick={() => window.location.href = '/courses'}
          className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-10 py-4 rounded-full text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          Explore Courses
        </button>
      </div>
    </section>
  );
}