export default function QuoteSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-800 to-pink-700"></div>
      <div className="absolute inset-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <blockquote className="text-3xl md:text-5xl font-light italic text-white leading-relaxed max-w-4xl mx-auto">
          “Hard work pays off — but smart work pays off faster. <br />
          And you’re smart enough to use <span className="font-bold drop-shadow">NotesHub</span>.”
        </blockquote>
        <p className="mt-8 text-xl text-blue-100">
          — Bhavy Sharma, Founder
        </p>
      </div>
    </section>
  );
}