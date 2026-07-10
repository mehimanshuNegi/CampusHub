import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Lock, Shield, Eye, EyeOff, Mail } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });

      const { token, email: resEmail, role, name } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('email', resEmail);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
      // Legacy compatibility keys
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminEmail', resEmail);

      // Set authorization header globally for all axios requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/coordinator/dashboard');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Invalid credentials');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              background: 'rgba(79, 70, 229, 0.1)',
              borderRadius: '12px',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Shield size={26} color="#4f46e5" />
            </div>
            <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 8px 0' }}>
              Portal Login
            </h1>
            <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '15px' }}>
              Authorized credentials required to access the portals
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ margin: '0', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', borderRadius: '12px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
                  <Mail size={16} color="#4f46e5" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
                  <Lock size={16} color="#4f46e5" />
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    style={{ paddingRight: '45px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '10px' }}>
                <button type="submit" className="btn-default" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading}>
                  <Lock size={18} />
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;
