'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [step, setStep] = useState('register'); // 'register' | 'verify'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);
  const router = useRouter();

  // Countdown timer for resending OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('OTP sent to your email!');
        setStep('verify');
        setTimer(60); // Start 60s resend timer
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Account verified successfully! Redirecting to login...');
        setTimeout(() => router.push('/auth/login'), 1500);
      } else {
        setError(data.message || 'Invalid or expired OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('New OTP sent to your email!');
        setTimer(60);
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden" style={{ background: 'radial-gradient(circle at center, #0a0a0a, #000)' }}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Floating Orbs */}
      <div className="absolute -top-32 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 right-1/3 w-96 h-96 bg-gradient-to-l from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-md bg-black/40 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 shadow-2xl">
        
        {/* STEP 1: Registration Form */}
        {step === 'register' && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Join Navokta Notes</h1>
              <p className="text-gray-400 text-sm mt-2">Create your free account</p>
            </div>

            {error && <div className="mb-4 p-3 bg-red-900/50 border border-red-800 text-red-200 text-sm rounded-lg">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-900/50 border border-green-800 text-green-200 text-sm rounded-lg">{success}</div>}

            <form onSubmit={handleRegisterSubmit}>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-black/60 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-black/60 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-black/60 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 placeholder-gray-500" placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2">
                  {loading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Creating Account...</span></>) : (<span>Create Account</span>)}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">Already have an account? <a href="/auth/login" className="text-blue-400 hover:underline font-medium">Login</a></p>
            </div>
          </>
        )}

        {/* STEP 2: OTP Verification Form */}
        {step === 'verify' && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">Verify Email</h1>
              <p className="text-gray-400 text-sm mt-2">We sent a 6-digit code to <span className="text-blue-400 font-medium">{formData.email}</span></p>
            </div>

            {error && <div className="mb-4 p-3 bg-red-900/50 border border-red-800 text-red-200 text-sm rounded-lg">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-900/50 border border-green-800 text-green-200 text-sm rounded-lg">{success}</div>}

            <form onSubmit={handleVerifySubmit}>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2 text-center">Enter OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-4 bg-black/60 border border-gray-700 rounded-xl text-white text-2xl tracking-[0.5em] text-center focus:outline-none focus:border-blue-500 placeholder-gray-600"
                    placeholder="000000"
                    autoFocus
                  />
                </div>

                <button type="submit" disabled={loading || otp.length !== 6} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2">
                  {loading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Verifying...</span></>) : (<span>Verify Account</span>)}
                </button>

                <div className="text-center">
                  <p className="text-gray-500 text-sm">
                    Didn't receive the code?{' '}
                    {timer > 0 ? (
                      <span className="text-gray-400 cursor-not-allowed">Resend in {timer}s</span>
                    ) : (
                      <button type="button" onClick={handleResendOtp} disabled={loading} className="text-blue-400 hover:underline font-medium disabled:opacity-50">Resend OTP</button>
                    )}
                  </p>
                </div>
                
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setStep('register')} className="text-gray-500 text-sm hover:text-gray-300 transition-colors">← Back to Registration</button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}