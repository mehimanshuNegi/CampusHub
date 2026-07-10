import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, AlertCircle, Calendar, User, Hash, Clock, XCircle } from 'lucide-react';

const RegistrationSuccess = () => {
  const { regId } = useParams();
  const location = useLocation();
  // Name and event title passed via navigation state from RegisterStudent
  const stateData = location.state || {};
  const [loading] = useState(false);
  const paymentStatus = stateData.paymentStatus;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--light-border)',
            boxShadow: 'var(--shadow-md)',
            padding: '40px 30px',
            textAlign: 'center'
          }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <CheckCircle size={32} color="#10b981" />
            </div>

            <h1 style={{ fontSize: '28px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 8px 0' }}>
              Registration Confirmed!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '30px' }}>
              Your slot has been secured. Save the receipt details below:
            </p>

            {paymentStatus && paymentStatus !== 'Verified' && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: paymentStatus === 'Pending' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                color: paymentStatus === 'Pending' ? '#d97706' : '#dc2626',
                border: paymentStatus === 'Pending' ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(239,68,68,0.3)',
                fontSize: '13px', fontWeight: '700', padding: '6px 14px',
                borderRadius: '50px', marginBottom: '20px'
              }}>
                {paymentStatus === 'Pending' ? <Clock size={14} /> : <XCircle size={14} />}
                Payment {paymentStatus} — please wait for admin verification
              </div>
            )}

            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading receipt details...</p>
            ) : (
              <div style={{
                border: '1px solid var(--light-border)',
                borderRadius: '8px',
                background: 'var(--bg-base)',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--light-border)', paddingBottom: '8px' }}>
                  <Hash size={16} color="#4f46e5" style={{ marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Registration ID</span>
                    <strong style={{ fontSize: '16px', color: '#4f46e5', fontFamily: 'Outfit, sans-serif' }}>{regId}</strong>
                  </div>
                </div>

                {stateData.event_title && (
                  <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--light-border)', paddingBottom: '8px' }}>
                    <Calendar size={16} color="#4f46e5" style={{ marginTop: '2px' }} />
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Registered Event</span>
                      <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{stateData.event_title}</strong>
                    </div>
                  </div>
                )}

                {stateData.name && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <User size={16} color="#4f46e5" style={{ marginTop: '2px' }} />
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Student Name</span>
                      <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>{stateData.name}</strong>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security Note */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              color: 'var(--text-dark)',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '30px',
              display: 'flex',
              gap: '8px',
              textAlign: 'left'
            }}>
              <AlertCircle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                Please write down your <strong>Registration ID</strong> and created password. You will need them to check your details or cancel your slot later.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <Link to="/registered-event" className="btn-default" style={{ textDecoration: 'none', background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', flex: 1 }}>
                Check Details
              </Link>
              <Link to="/" className="btn-default" style={{ textDecoration: 'none', flex: 1 }}>
                Return Home
              </Link>
            </div>
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegistrationSuccess;
