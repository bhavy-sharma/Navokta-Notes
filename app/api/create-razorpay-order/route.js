// app/api/create-razorpay-order/route.js
import { NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime for Buffer support
export const runtime = 'nodejs';

import Razorpay from 'razorpay';

export async function POST(request) {
  try {
    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials are missing in environment variables');
    }

    const { amount } = await request.json();

    if (!amount || amount < 1 || amount > 100000) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be between ₹1 and ₹1,00,000.' },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(amount * 100);

    // Initialize Razorpay SDK instance
    const instance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { description: 'Support Free Education for Students' }
    };

    const order = await instance.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID, // Frontend ko initialize karne ke liye
    });

  } catch (error) {
    console.error('Error in /api/create-razorpay-order:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}