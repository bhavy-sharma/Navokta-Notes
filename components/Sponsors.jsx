export default function Sponsors() {
  return (
    <section className="py-16 bg-white border-t">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Proudly Supported By</h2>
        <p className="text-gray-600 mb-8">Students, educators, and open-source lovers like you.</p>

        <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 hover:opacity-100 transition">
          {['Devfolio', 'GitHub', 'Vercel', 'MongoDB', 'Cloudinary'].map((sponsor, idx) => (
            <span
              key={idx}
              className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition"
            >
              {sponsor}
            </span>
          ))}
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Want to support the mission?{' '}
          <a href="mailto:bhavy@noteshub.dev" className="text-blue-600 hover:underline">
            Sponsor NotesHub
          </a>
        </p>
      </div>
    </section>
  );
}