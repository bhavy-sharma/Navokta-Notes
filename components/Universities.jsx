export default function Universities() {
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

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Trusted by Students Across</h2>
          <p className="text-lg text-gray-600">
            We align with real syllabi — not just generic content.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Universities */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">🎓</span>
              Universities
            </h3>
            <ul className="space-y-4">
              {universities.map((uni, idx) => (
                <li
                  key={idx}
                  className="flex items-center p-4 bg-white rounded-xl shadow hover:shadow-md transition border-l-4 border-blue-500"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-4"></span>
                  {uni}
                </li>
              ))}
            </ul>
          </div>

          {/* Colleges */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="mr-3">🏫</span>
              Partner Colleges
            </h3>
            <ul className="space-y-4">
              {colleges.map((college, idx) => (
                <li
                  key={idx}
                  className="flex items-center p-4 bg-white rounded-xl shadow hover:shadow-md transition border-l-4 border-purple-500"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-4"></span>
                  {college}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}