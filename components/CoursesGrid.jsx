'use client';

import Link from 'next/link';

export default function CoursesGrid() {
  const courses = [
    { name: 'BBA', color: 'from-orange-400 to-pink-500' },
    { name: 'BCA', color: 'from-blue-400 to-cyan-500' },
    { name: 'MCA', color: 'from-purple-400 to-indigo-500' },
    { name: 'MBA', color: 'from-green-400 to-teal-500' },
    { name: 'B.Tech', color: 'from-red-400 to-orange-500' },
    { name: 'B.Sc', color: 'from-indigo-400 to-purple-500' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Courses We Support</h2>
          <p className="text-xl text-gray-600">
            From commerce to tech — we’ve got your back.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <Link
              key={idx}
              href={`/courses/${course.name}`}
              className="group"
            >
              <div
                className={`p-10 rounded-3xl shadow-xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 group-hover:scale-[1.02] bg-gradient-to-br ${course.color} text-white text-center relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <h3 className="text-3xl font-extrabold mb-2">{course.name}</h3>
                  <p className="opacity-90">Full Notes • PYQs • Videos</p>
                </div>
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}