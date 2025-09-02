'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-4">
            NotesHub
          </h3>
          <p className="mb-4 text-sm text-gray-400 leading-relaxed">
            Empowering students with free, high-quality academic resources — one PDF at a time.
          </p>
          <p className="text-blue-300 text-sm font-medium">Made with ❤️ by Bhavy</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {['Home', 'Courses', 'PYQs', 'Videos', 'Admin'].map((link) => (
              <li key={link}>
                <a href={`/${link.toLowerCase().replace(' ', '')}`} className="hover:text-white transition">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
          <ul className="space-y-2 text-sm">
            {['About Us', 'Contact', 'Privacy Policy', 'Contribute', 'Report Issue'].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-white transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
          <div className="flex space-x-4 mb-4">
            {['𝕏', '📘', '📸', '▶️'].map((icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition"
              >
                {icon}
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Join 10K+ students already using NotesHub.
          </p>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} NotesHub. Crafted with passion by Bhavy Sharma. All rights reserved.
      </div>
    </footer>
  );
}