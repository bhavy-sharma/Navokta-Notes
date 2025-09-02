export default function Features() {
  const features = [
    {
      title: "📚 Smart Notes",
      desc: "Crisp, well-structured PDFs designed for quick revision and deep understanding.",
    },
    {
      title: "🎥 Video Guides",
      desc: "Curated YouTube playlists for every subject — learn visually, learn faster.",
    },
    {
      title: "🎯 PYQs & Solutions",
      desc: "Previous Year Questions with answers to crack your semester exams.",
    },
    {
      title: "🎓 University-Aligned",
      desc: "Tailored for CCSU, AKTU, IP University, and more — syllabus perfect.",
    },
  ];

  return (
    <section className="py-24 bg-gray-50 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Why Students Love Us
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            We don’t just share notes — we build learning ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-100"
            >
              <div className="text-4xl mb-4">{feat.title}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{feat.title.split(' ')[1]}</h3>
              <p className="text-gray-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}