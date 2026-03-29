const fs = require('fs');

async function test() {
  const envRaw = fs.readFileSync('.env.local', 'utf-8');
  const env = {};
  envRaw.split('\n').forEach(line => {
    if (line && line.includes('=')) {
      const parts = line.split('=');
      env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });

  const KEY_ID = env['NEXT_PUBLIC_RAZORPAY_KEY_ID'];
  const KEY_SECRET = env['RAZORPAY_KEY_SECRET'];

  console.log('Testing with Key:', KEY_ID);
  console.log('Testing with Secret length:', KEY_SECRET ? KEY_SECRET.length : 0);

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64'),
    },
    body: JSON.stringify({
      amount: 50 * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    }),
  });

  const body = await response.json();
  console.log('Razorpay response:', response.status, body);
}

test();
