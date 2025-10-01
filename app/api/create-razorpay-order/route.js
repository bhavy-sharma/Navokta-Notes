// app/api/create-razorpay-order/route.js
import { NextRequest, NextResponse } from 'next/server';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay credentials are missing in environment variables');
}

export async function POST(request) {
  try {
    const { amount } = await request.json();

    if (!amount || amount < 1 || amount > 100000) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be between ₹1 and ₹1,00,000.' },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(amount * 100);

    // Create order via Razorpay API
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' +
          Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64'),
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          description: 'Support Free Education for Students',
        },
      }),
    });

    const order = await response.json();

    if (!response.ok) {
      console.error('Razorpay order creation failed:', order);
      return NextResponse.json(
        { error: 'Failed to create Razorpay order' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error in /api/create-razorpay-order:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}