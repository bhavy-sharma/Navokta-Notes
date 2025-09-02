'use client';

import { useState, useEffect } from 'react';

export default function Sponsors() {
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => console.log('Razorpay SDK loaded');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleDonate = () => {
    const finalAmount = customAmount ? parseInt(customAmount) : amount;

    if (!finalAmount || finalAmount < 1) {
      alert('Please enter a valid amount (minimum ₹1)');
      return;
    }

    if (finalAmount > 100000) {
      alert('Maximum donation is ₹1,00,000');
      return;
    }

    setLoading(true);

    const options = {
      key: 'rzp_live_N9mbth8Ttc6K2i', // 🔥 Replace with your Razorpay Key
      amount: finalAmount * 100, // in paise
      currency: 'INR',
      name: 'Navokta Notes',
      description: 'Support Free Education for Students',
      image: '/logo.png', // Add your logo in public/logo.png
      handler: function (response) {
        alert(
          `🎉 Thank you for your support!\n\nTransaction ID: ${response.razorpay_payment_id}\nAmount: ₹${finalAmount}\n\nYou're powering free education.`
        );
        setLoading(false);
      },
      prefill: {
        name: 'Supporter',
        email: '',
        contact: '',
      },
      theme: {
        color: '#f59e0b', // Amber (matches Navokta Notes)
      },
      modal: {
        escape: false,
        backdropclose: false,
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert('Payment failed: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <section className="relative py-16 text-center" style={{
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

      <div className="container mx-auto px-6 relative z-10">
        {/* Headline */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text mb-3">
          Support the Mission
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Keep Navokta Notes free forever.  
          Your contribution fuels quality education for thousands.
        </p>

        {/* Quick Donate Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {[50, 100, 200].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => {
                setAmount(amt);
                setCustomAmount('');
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !customAmount && amount === amt
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="flex justify-center mb-6 max-w-xs mx-auto">
          <input
            type="number"
            placeholder="Other ₹"
            value={customAmount}
            onChange={(e) => {
              const value = e.target.value;
              setCustomAmount(value);
              if (value) setAmount(0); // Reset fixed amount
            }}
            className="w-full px-4 py-3 bg-black/50 border border-gray-600 rounded-l-full text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 text-sm"
            min="1"
            max="100000"
          />
          <button
            type="button"
            onClick={() => setCustomAmount('')}
            className="px-3 py-3 bg-gray-700 text-gray-300 rounded-r-full hover:bg-gray-600 transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* Donate Button */}
        <button
          onClick={handleDonate}
          disabled={loading}
          className="group bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-8 py-3 rounded-full text-base hover:shadow-lg hover:shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 mx-auto disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>❤️</span>
              <span>Donate ₹{customAmount || amount}</span>
            </>
          )}
        </button>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-600 flex items-center justify-center gap-1">
          <span>✅</span>
          <span>
            Secure payments via{' '}
            <a
              href="https://razorpay.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Razorpay
            </a>
          </span>
        </p>
      </div>
    </section>
  );
}