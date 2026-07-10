import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, Calendar, User, MapPin, ClipboardList, CheckCircle, AlertTriangle, Key, Hash, XCircle, CreditCard, Clock } from 'lucide-react';

const RegisteredEvent = () => {
  const [step, setStep] = useState(1); // 1: Query Form, 2: Receipt View
  const [formData, setFormData] = useState({
    registration_id: '',
    registration_password: ''
  });
  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState('Active'); // Active, Cancelled
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/api/participants/verify', formData);
      setDetails(res.data);
      setStatus('Active');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Registration ID or Password.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      setLoading(true);
      setError('');
      try {
        const res = await axios.post('/api/participants/cancel', formData);
        alert(res.data.message || 'Registration cancelled successfully.');
        setStatus('Cancelled');
      } catch (err) {
        setError(err.response?.data?.message || 'Error cancelling registration. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          
          {step === 1 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{
                  background: 'rgba(79, 70, 229, 0.1)',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}>
                  <Search size={24} color="#4f46e5" />
                </div>
                <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 8px 0' }}>
                  Registered Event
                </h1>
                <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '15px' }}>
                  Enter your credentials to check event details or cancel slot
                </p>
              </div>

              {error && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fee2e2',
                  color: '#b91c1c',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '20px',
                  fontWeight: '600'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleLookup} style={{ margin: '0', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', borderRadius: '12px', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
                      <Hash size={16} color="#4f46e5" />
                      Registration ID
                    </label>
                    <input
                      type="text"
                      name="registration_id"
                      className="form-control"
                      placeholder="e.g. CH-0001"
                      value={formData.registration_id}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: 'var(--text-dark)' }}>
                      <Key size={16} color="#4f46e5" />
                      Registration Password
                    </label>
                    <input
                      type="password"
                      name="registration_password"
                      className="form-control"
                      placeholder="Enter registration password"
                      value={formData.registration_password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <button type="submit" className="btn-default" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={loading}>
                      {loading ? 'Verifying...' : 'View Registration Details'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {step === 2 && details && (
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--light-border)',
              boxShadow: 'var(--shadow-md)',
              padding: '40px 30px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  background: status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}>
                  {status === 'Active' ? <CheckCircle size={26} color="#10b981" /> : <XCircle size={26} color="#ef4444" />}
                </div>
                <h2 style={{ fontSize: '26px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0' }}>
                  Registration Details
                </h2>
                <span style={{
                  display: 'inline-block',
                  background: status === 'Active' ? '#d1fae5' : '#fee2e2',
                  color: status === 'Active' ? '#065f46' : '#991b1b',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '50px',
                  textTransform: 'uppercase',
                  marginTop: '8px'
                }}>
                  Status: {status}
                </span>
              </div>

              {error && (
                <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '15px', fontWeight: '600', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              {/* Receipt Grid */}
              <div style={{
                border: '1px solid var(--light-border)',
                borderRadius: '8px',
                background: 'var(--bg-base)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '30px'
              }}>
                <div style={{ borderBottom: '1px dashed var(--light-border)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Registration ID:</span>
                  <strong style={{ fontSize: '15px', color: '#4f46e5', fontFamily: 'Outfit, sans-serif' }}>{details.registration_id}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Student Name:</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{details.name}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Event Name:</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{details.event_title}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Event Date:</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{details.event_date}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Event Venue:</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{details.event_venue}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Registration Date:</span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{details.createdAt}</strong>
                </div>

                {/* Payment Status */}
                {details.event_price > 0 && (
                  <>
                    {details.transactionId && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CreditCard size={13} />
                          Transaction ID:
                        </span>
                        <strong style={{ fontSize: '13px', color: 'var(--text-dark)', fontFamily: 'Outfit, monospace' }}>{details.transactionId}</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--light-border)', paddingTop: '10px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Payment Status:</span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        background: details.paymentStatus === 'Verified' ? 'rgba(16,185,129,0.12)'
                                  : details.paymentStatus === 'Rejected' ? 'rgba(239,68,68,0.12)'
                                  : 'rgba(245,158,11,0.12)',
                        color: details.paymentStatus === 'Verified' ? '#059669'
                             : details.paymentStatus === 'Rejected' ? '#dc2626'
                             : '#d97706',
                        border: details.paymentStatus === 'Verified' ? '1px solid rgba(16,185,129,0.3)'
                              : details.paymentStatus === 'Rejected' ? '1px solid rgba(239,68,68,0.3)'
                              : '1px solid rgba(245,158,11,0.3)',
                        fontSize: '12px', fontWeight: '700', padding: '3px 10px',
                        borderRadius: '50px', textTransform: 'uppercase'
                      }}>
                        {details.paymentStatus === 'Verified' ? <CheckCircle size={12} />
                          : details.paymentStatus === 'Rejected' ? <XCircle size={12} />
                          : <Clock size={12} />}
                        {details.paymentStatus || 'Verified'}
                      </span>
                    </div>
                    {details.paymentStatus === 'Pending' && (
                      <p style={{ margin: '0', fontSize: '12px', color: '#d97706', fontStyle: 'italic' }}>
                        ⏳ Your payment is pending verification. Please allow 24 hours for review.
                      </p>
                    )}
                    {details.paymentStatus === 'Rejected' && (
                      <p style={{ margin: '0', fontSize: '12px', color: '#dc2626', fontStyle: 'italic' }}>
                        ❌ Your payment was rejected. Please contact the event coordinator.
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Success Cancellation Notice */}
              {status === 'Cancelled' && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fee2e2',
                  color: '#b91c1c',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  marginBottom: '30px',
                  display: 'flex',
                  gap: '8px',
                  textAlign: 'left'
                }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    This slot has been cancelled. The participant counts have been updated. You can safely close this page.
                  </span>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--light-border)',
                    color: 'var(--text-dark)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                {status === 'Active' && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={loading}
                    style={{
                      flex: 1,
                      background: '#ef4444',
                      border: 'none',
                      color: '#ffffff',
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = '#dc2626'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = '#ef4444'; }}
                  >
                    {loading ? 'Processing...' : 'Cancel Registration'}
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisteredEvent;
