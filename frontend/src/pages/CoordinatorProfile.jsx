import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CoordinatorNavbar from '../components/CoordinatorNavbar';
import Footer from '../components/Footer';
import { User, Phone, Award, BookOpen, Key, FileText, Save, Shield } from 'lucide-react';

const CoordinatorProfile = () => {
  const [staticData, setStaticData] = useState({
    clubName: '',
    department: '',
    description: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/club-coordinators/profile');
        setStaticData({
          clubName: res.data.clubName || '',
          department: res.data.department || '',
          description: res.data.description || ''
        });
        setFormData({
          name: res.data.name || '',
          phone: res.data.phone || '',
          password: '' // Keep password empty initially
        });
      } catch (error) {
        console.error('Error fetching coordinator profile details:', error);
        alert('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone
      };
      
      // Omit password parameter if not modified
      if (formData.password) {
        payload.password = formData.password;
      }
      
      const res = await axios.put('/api/club-coordinators/profile', payload);
      alert(res.data.message || 'Profile updated successfully!');
      
      // Update local storage in case name changed
      localStorage.setItem('name', formData.name);
      
      setFormData(prev => ({ ...prev, password: '' })); // Reset password field
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating profile details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CoordinatorNavbar />
      
      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '12px',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Shield size={26} color="#10b981" />
            </div>
            <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0' }}>
              Profile Settings
            </h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>
              Update your contact information and login credentials
            </p>
          </div>

          {loading ? (
            <h3 style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Loading profile...</h3>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Static Assigned Club Information Card */}
              <div style={{
                background: 'rgba(79, 70, 229, 0.05)',
                border: '1px solid rgba(79, 70, 229, 0.15)',
                borderRadius: '12px',
                padding: '20px',
                color: 'var(--text-dark)',
                fontSize: '14px'
              }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '700', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={18} />
                  Assigned Club Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>Assigned Club: <strong style={{ color: 'var(--text-dark)' }}>{staticData.clubName}</strong></div>
                  <div>Department: <strong style={{ color: 'var(--text-dark)' }}>{staticData.department}</strong></div>
                  <div style={{ borderTop: '1px solid rgba(79, 70, 229, 0.1)', paddingTop: '8px', marginTop: '4px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    {staticData.description}
                  </div>
                </div>
              </div>

              {/* Editable Form */}
              <form onSubmit={handleSubmit} style={{ margin: '0', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', borderRadius: '12px', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
                      <User size={16} color="#4f46e5" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Enter name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
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

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
                      <Key size={16} color="#4f46e5" />
                      Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <button type="submit" className="btn-default" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={saving}>
                      <Save size={18} />
                      {saving ? 'Updating Profile...' : 'Save Profile Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CoordinatorProfile;
