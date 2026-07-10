import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import { Shield, Mail, Key, Save } from 'lucide-react';

const AdminSettings = () => {
  const currentEmail = localStorage.getItem('adminEmail') || 'admin@campushub.com';
  const [formData, setFormData] = useState({
    email: currentEmail,
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.put('/api/auth/settings', {
        currentEmail,
        email: formData.email,
        password: formData.password
      });
      alert(res.data.message || 'Settings updated successfully!');
      localStorage.setItem('adminEmail', formData.email);
      navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminNavbar />
      
      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
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
              Account Settings
            </h1>
            <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '15px' }}>
              Update admin login email and password in the database
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ margin: '0', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', borderRadius: '12px', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
                  <Mail size={16} color="#4f46e5" />
                  New Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="admin@campushub.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
                  <Key size={16} color="#4f46e5" />
                  New Admin Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter a new strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ marginTop: '10px' }}>
                <button type="submit" className="btn-default" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading}>
                  <Save size={18} />
                  {loading ? 'Saving Settings...' : 'Save Settings'}
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

export default AdminSettings;
