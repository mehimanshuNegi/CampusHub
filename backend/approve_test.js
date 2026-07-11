const BASE_URL = 'http://localhost:5001/api';

async function check() {
  try {
    // Login as admin
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@campushub.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    console.log('Admin Token:', token);

    const approveRes = await fetch(`${BASE_URL}/club-coordinators/requests/6a52852d2685a21d2031cb2f/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const status = approveRes.status;
    const data = await approveRes.json();
    console.log('Approve Status:', status);
    console.log('Approve Data:', data);
  } catch (err) {
    console.error(err);
  }
}

check();
