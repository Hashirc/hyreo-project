// Test order creation
const http = require('http');

// First login to get a token
function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[${options.method} ${options.path}] Status: ${res.statusCode}`);
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function test() {
  // 1. Login
  console.log('--- Step 1: Login ---');
  const loginResult = await makeRequest({
    hostname: 'localhost', port: 5000,
    path: '/api/auth/login', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ email: 'customer@olive.com', password: 'password123' }));
  
  console.log('Login result:', JSON.stringify(loginResult.body, null, 2));
  
  if (loginResult.status !== 200) {
    console.error('Login failed!');
    return;
  }
  
  const token = loginResult.body.token;
  console.log('Token:', token);
  
  // 2. Try to create an order
  console.log('\n--- Step 2: Create Order ---');
  const orderData = {
    items: [
      { productId: 'prod1', name: '17pro', price: 14675, quantity: 1, imageUrl: '/assets/mobiles and laptops/17pro.webp' }
    ],
    total: 14675,
    shippingAddress: {
      fullName: 'Test User',
      email: 'test@test.com',
      phone: '1234567890',
      address: '123 Test Street',
      city: 'TestCity',
      postalCode: '12345',
      country: 'India'
    },
    paymentRef: 'pay_mock_test123',
    couponCode: null
  };
  
  const orderResult = await makeRequest({
    hostname: 'localhost', port: 5000,
    path: '/api/orders', method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }, JSON.stringify(orderData));
  
  console.log('Order result:', JSON.stringify(orderResult.body, null, 2));
}

test().catch(console.error);
