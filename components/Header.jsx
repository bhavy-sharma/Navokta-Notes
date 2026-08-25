"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LoginRequiredModal from "./LoginRequiredModal";
import { toast } from "react-hot-toast";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // null = loading, false = not logged in, object = logged in
  const [user, setUser] = useState(null);

  const [showLoginModal, setShowLoginModal] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Check authentication
  useEffect(() => {
    try {
      const token = localStorage.getItem("navokta_token");
      const userData = localStorage.getItem("navokta_user");

      if (token && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(false);
      }
    } catch (error) {
      console.error("Failed to read user data:", error);

      localStorage.removeItem("navokta_token");
      localStorage.removeItem("navokta_user");

      setUser(false);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeModal = () => {
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("navokta_token");
    localStorage.removeItem("navokta_user");

    setUser(false);
    setIsMenuOpen(false);

    toast.success("Logged out successfully!", {
      duration: 1500,
      icon: "👋",
    });

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  // Avatar fallback
  const avatarUrl = user
    ? user.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.name || "User"
      )}&background=1e40af&color=fff`
    : "";

  return (
    <header className="relative">
      {/* ================= DESKTOP / MAIN HEADER ================= */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-md border-b ${
          isScrolled
            ? "bg-black/80 border-gray-800 shadow-lg"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className={`text-2xl font-black transition-all duration-300 ${
              isScrolled
                ? "text-white"
                : "text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text"
            }`}
          >
            Navokta Notes
          </Link>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden md:flex items-center gap-3">
            {/* About */}
            <Link
              href="/about"
              className="group flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              <svg
                className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span>About</span>
            </Link>

            {/* ================= AUTH ================= */}
            {user === null ? (
              // Loading
              <div className="w-24 h-10 rounded-full bg-white/5 animate-pulse" />
            ) : !user ? (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-300 hover:text-white text-sm px-4 py-2 rounded-full font-medium hover:bg-white/10 transition"
                >
                  Login
                </Link>

                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm px-6 py-2.5 rounded-full font-semibold hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300"
                >
                  Join Free
                </Link>
              </>
            ) : (
              /* ================= PROFILE DROPDOWN ================= */
              <div className="relative group">
                <button
                  type="button"
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/10"
                >
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-blue-500/50 object-cover"
                  />

                  <span className="text-gray-200 text-sm font-medium">
                    Hi, {user.name}
                  </span>

                  <svg
                    className="h-4 w-4 text-gray-400 group-hover:text-white transition-transform group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-3 w-56 bg-black/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pointer-events-none group-hover:pointer-events-auto py-2 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-800/60">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Account
                    </p>
                  </div>

                  {/* Profile */}
                  <Link
                    href="/dashboard"
                    className="flex items-center px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    <svg
                      className="h-5 w-5 mr-3 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>

                    Profile
                  </Link>

                  {/* My Courses */}
                  <Link
                    href="/courses"
                    className="flex items-center px-5 py-3 text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    <svg
                      className="h-5 w-5 mr-3 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>

                    My Courses
                  </Link>

                  {/* Logout */}
                  <div className="px-4 py-3 border-t border-gray-800/60">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <svg
                        className="h-5 w-5 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>

                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            type="button"
            onClick={toggleMenu}
            className={`p-2 rounded-lg md:hidden transition-all duration-300 ${
              isScrolled
                ? "text-gray-200 hover:bg-white/10 hover:text-white"
                : "text-gray-300 hover:bg-gray-800/40 hover:text-white"
            }`}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-6 w-6 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                transform: isMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800/50">
            <div className="px-6 py-5 space-y-1">
              {/* Home */}
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
              >
                <svg
                  className="h-5 w-5 mr-3 text-indigo-400 group-hover:text-indigo-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1-1h-3m-6 0V5a1 1 0 011-1h2a1 1 0 011 1v14a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 00-1-1H9a1 1 0 00-1 1z"
                  />
                </svg>

                Home
              </Link>

              {/* About */}
              <Link
                href="/about"
                onClick={closeMenu}
                className="flex items-center p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
              >
                <svg
                  className="h-5 w-5 mr-3 text-purple-400 group-hover:text-purple-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                About
              </Link>

              {/* Loading */}
              {user === null && (
                <div className="mt-3 border-t border-gray-800/40 pt-4">
                  <div className="h-10 rounded-xl bg-white/5 animate-pulse" />
                </div>
              )}

              {/* ================= LOGGED IN ================= */}
              {user && (
                <>
                  <div className="my-3 border-t border-gray-800/40" />

                  {/* User info */}
                  <div className="flex items-center gap-3 p-3">
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border border-blue-500/50 object-cover"
                    />

                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-500 text-sm">Account</p>
                    </div>
                  </div>

                  {/* My Courses */}
                  <Link
                    href="/courses"
                    onClick={closeMenu}
                    className="flex items-center p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                  >
                    <svg
                      className="h-5 w-5 mr-3 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>

                    My Courses
                  </Link>

                  {/* Profile */}
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="flex items-center p-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                  >
                    <svg
                      className="h-5 w-5 mr-3 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7h14a7 7 0 00-7-7z"
                      />
                    </svg>

                    Profile
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center w-full text-left p-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200"
                  >
                    <svg
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>

                    Logout
                  </button>
                </>
              )}

              {/* ================= GUEST ================= */}
              {user === false && (
                <>
                  <div className="my-3 border-t border-gray-800/40" />

                  <Link
                    href="/auth/login"
                    onClick={closeMenu}
                    className="block w-full text-center py-2.5 text-gray-300 hover:text-white transition"
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/register"
                    onClick={closeMenu}
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-center hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    Join Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Login Required Modal */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={closeModal}
      />
    </header>
  );
}