import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, User, Mail, Phone, BookOpen, GraduationCap, ShieldAlert, CreditCard, Hash } from 'lucide-react';

const RegisterStudent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    sem: '',
    email: '',
    phone: '',
    college: '',
    registration_password: '',
    event_id: eventId,
    transactionId: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        // silent
      }
    };
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const isPaid = event && Number(event.event_price) > 0;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.registration_password.length < 4 || formData.registration_password.length > 6) {
      alert('Password must be between 4 and 6 characters long.');
      return;
    }
    if (isPaid && !formData.transactionId.trim()) {
      alert('Please enter your Transaction ID to complete registration for this paid event.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        branch: formData.branch,
        sem: formData.sem,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        registration_password: formData.registration_password,
        event_id: formData.event_id,
        transactionId: isPaid ? formData.transactionId.trim() : undefined
      };
      const res = await axios.post('/api/participants', payload);
      alert(res.data.message || 'Registered Successfully!');
      navigate(`/success/${res.data.registration_id}`, {
        state: {
          name: res.data.name,
          event_title: res.data.event_title,
          paymentStatus: res.data.paymentStatus
        }
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flexGrow: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' }}>
          <Link to={`/events/${eventId}`} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--light-border)',
            color: 'var(--text-dark)',
            padding: '10px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            textDecoration: 'none'
          }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0', textAlign: 'left' }}>
              Register for Event
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#4f46e5', fontSize: '16px', fontWeight: '700' }}>
              📝 {event ? event.event_title : eventId}
              {isPaid && (
                <span style={{ marginLeft: '10px', background: 'rgba(79,70,229,0.1)', color: '#4f46e5', fontSize: '13px', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  Entry Fee: ₹{event.event_price}
                </span>
              )}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ margin: '0', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', borderRadius: '12px', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
                  <Phone size={16} color="#4f46e5" />
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="Enter contact number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
                  <BookOpen size={16} color="#4f46e5" />
                  College Name
                </label>
                <input
                  type="text"
                  name="college"
                  className="form-control"
                  placeholder="Enter your college name"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
                  <GraduationCap size={16} color="#4f46e5" />
                  Branch
                </label>
                <input
                  type="text"
                  name="branch"
                  className="form-control"
                  placeholder="e.g. CSE / ISE"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
                  <GraduationCap size={16} color="#4f46e5" />
                  Semester
                </label>
                <input
                  type="number"
                  name="sem"
                  className="form-control"
                  placeholder="e.g. 5"
                  value={formData.sem}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
                <ShieldAlert size={16} color="#4f46e5" />
                Cancellation Password (4-6 chars)
              </label>
              <input
                type="password"
                name="registration_password"
                className="form-control"
                placeholder="Create a simple password to cancel or manage this registration"
                value={formData.registration_password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Payment Section — only shown for paid events */}
            {isPaid && (
              <div style={{
                border: '1px solid rgba(79, 70, 229, 0.25)',
                borderRadius: '10px',
                padding: '20px',
                background: 'rgba(79, 70, 229, 0.04)',
                marginTop: '4px'
              }}>
                {/* Payment Instructions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <CreditCard size={18} color="#4f46e5" />
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#4f46e5' }}>
                    Payment Instructions
                  </h3>
                </div>

                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--light-border)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: 'var(--text-dark)'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>
                    Please pay <strong style={{ color: '#4f46e5' }}>₹{event.event_price}</strong> using UPI before submitting registration.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <span>📱 <strong>UPI ID:</strong> campushub@upi</span>
                    <span>🏦 <strong>Account Name:</strong> CampusHub Events</span>
                    <span style={{ marginTop: '6px', color: 'var(--text-dark)', fontSize: '12px', fontStyle: 'italic' }}>
                      After payment, enter the Transaction ID shown in your UPI app receipt below.
                    </span>
                  </div>
                </div>

                {/* Transaction ID input */}
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '6px' }}>
                    <Hash size={16} color="#4f46e5" />
                    UPI Transaction ID <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="transactionId"
                    className="form-control"
                    placeholder="e.g. TXN12345678"
                    value={formData.transactionId}
                    onChange={handleChange}
                    required={isPaid}
                    style={{ fontFamily: 'Outfit, monospace', fontWeight: '600' }}
                  />
                  <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                    ⚠️ Your registration will remain <strong>Pending</strong> until the admin verifies your transaction ID.
                  </p>
                </div>
              </div>
            )}

            <div style={{ marginTop: '15px', display: 'flex', gap: '15px' }}>
              <button type="submit" className="btn-default" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading}>
                {loading ? 'Processing Registration...' : 'Confirm Registration'}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterStudent;
