import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserPlus, User, Mail, Phone, BookOpen, ShieldAlert, Award, FileText } from 'lucide-react';

const BecomeCoordinator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    clubName: '',
    department: '',
    description: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

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
      const res = await axios.post('/api/club-coordinators/request', formData);
      alert(res.data.message || 'Application submitted successfully!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting coordinator request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flexGrow: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{
            background: 'rgba(79, 70, 229, 0.1)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <UserPlus size={30} color="#4f46e5" />
          </div>
          <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0' }}>
            Become a Club Coordinator
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>
            Submit your credentials to lead and manage campus club activities
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ margin: '0', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', borderRadius: '12px', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  <User size={16} color="#4f46e5" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  <Mail size={16} color="#4f46e5" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  <Phone size={16} color="#4f46e5" />
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  <Award size={16} color="#4f46e5" />
                  Club Name
                </label>
                <input
                  type="text"
                  name="clubName"
                  className="form-control"
                  placeholder="e.g. Coding Club / Dance Society"
                  value={formData.clubName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  <BookOpen size={16} color="#4f46e5" />
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  placeholder="e.g. CSE / ISE / ME"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  <ShieldAlert size={16} color="#4f46e5" />
                  Portal Password (min 6 chars)
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter login password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
                <FileText size={16} color="#4f46e5" />
                Description / Application Statement
              </label>
              <textarea
                name="description"
                className="form-control"
                placeholder="State your experience or motivation to coordinate club activities"
                value={formData.description}
                onChange={handleChange}
                required
                style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginTop: '15px' }}>
              <button type="submit" className="btn-default" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading}>
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default BecomeCoordinator;
