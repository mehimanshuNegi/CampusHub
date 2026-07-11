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

    const res = await fetch(`${BASE_URL}/club-coordinators/requests`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const requests = await res.json();
    console.log('Pending requests on local server:', requests.filter(r => r.status === 'Pending').map(r => ({ id: r._id, name: r.name, email: r.email, status: r.status, role: r.role })));

    const usersRes = await fetch(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const users = await usersRes.json();
    console.log('Coordinators on local server:', users.filter(u => u.role === 'coordinator').map(u => ({ id: u.id, name: u.name, email: u.email, status: u.status, role: u.role })));
  } catch (err) {
    console.error(err);
  }
}

check();
