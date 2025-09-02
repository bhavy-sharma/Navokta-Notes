// app/admin/login/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and user
        localStorage.setItem('navokta_token', data.token);
        localStorage.setItem('navokta_user', JSON.stringify({
          ...data.user,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}&background=1e40af&color=fff`
        }));
        router.push('/admin/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden" style={{
      background: 'radial-gradient(circle at center, #0a0a0a, #000)',
    }}>
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute -top-32 left-1/3 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 text-transparent bg-clip-text">
            Admin Login
          </h1>
          <p className="text-gray-400 text-sm mt-2">Access restricted to authorized users</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-800 text-red-200 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/60 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-red-500"
                placeholder="admin@navoktanotes.com"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/60 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-red-500"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:shadow-xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Logging In...</span>
                </>
              ) : (
                <span>Login as Admin</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}