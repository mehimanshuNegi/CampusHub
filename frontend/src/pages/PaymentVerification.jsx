import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';
import CoordinatorNavbar from '../components/CoordinatorNavbar';
import Footer from '../components/Footer';
import { CreditCard, CheckCircle, XCircle, Clock, ArrowLeft, IndianRupee, Hash, User, CalendarRange } from 'lucide-react';

const PaymentStatusBadge = ({ status }) => {
  const styles = {
    Pending:  { bg: 'rgba(245, 158, 11, 0.12)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.3)', icon: Clock },
    Verified: { bg: 'rgba(16, 185, 129, 0.12)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.3)', icon: CheckCircle },
    Rejected: { bg: 'rgba(239, 68, 68, 0.12)',  color: '#dc2626', border: '1px solid rgba(239, 68, 68, 0.3)',  icon: XCircle }
  };
  const s = styles[status] || styles.Pending;
  const Icon = s.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      background: s.bg, color: s.color, border: s.border,
      fontSize: '12px', fontWeight: '700', padding: '4px 10px',
      borderRadius: '50px', textTransform: 'uppercase', whiteSpace: 'nowrap'
    }}>
      <Icon size={12} />
      {status}
    </span>
  );
};

const PaymentVerification = () => {
  const role = localStorage.getItem('role') || 'admin';
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [actionLoading, setActionLoading] = useState(null); // registration_id being processed

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/participants/payments');
      setPayments(res.data);
    } catch (err) {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleUpdateStatus = async (registration_id, paymentStatus) => {
    setActionLoading(registration_id + paymentStatus);
    try {
      await axios.put(`/api/participants/payments/${registration_id}/status`, { paymentStatus });
      // Update local state immediately for snappy UI
      setPayments(prev =>
        prev.map(p => p.registration_id === registration_id ? { ...p, paymentStatus } : p)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payment status');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredPayments = filter === 'All'
    ? payments
    : payments.filter(p => p.paymentStatus === filter);

  const pendingCount   = payments.filter(p => p.paymentStatus === 'Pending').length;
  const verifiedCount  = payments.filter(p => p.paymentStatus === 'Verified').length;
  const rejectedCount  = payments.filter(p => p.paymentStatus === 'Rejected').length;

  const backLink = role === 'admin' ? '/admin' : '/coordinator/dashboard';

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {role === 'admin' ? <AdminNavbar /> : <CoordinatorNavbar />}

      <div style={{ flexGrow: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' }}>
          <Link to={backLink} style={{
            background: 'var(--bg-card)', border: '1px solid var(--light-border)', color: 'var(--text-dark)',
            padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: 'var(--shadow-sm)', textDecoration: 'none'
          }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 4px 0' }}>
              Payment Verification
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '15px' }}>
              {role === 'admin' ? 'Verify or reject student payments for all events' : 'Verify payments for your own events'}
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '30px' }}>
          {[
            { label: 'Pending',  count: pendingCount,  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  status: 'Pending' },
            { label: 'Verified', count: verifiedCount, color: '#10b981', bg: 'rgba(16,185,129,0.1)',  status: 'Verified' },
            { label: 'Rejected', count: rejectedCount, color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   status: 'Rejected' },
            { label: 'Total',    count: payments.length, color: '#4f46e5', bg: 'rgba(79,70,229,0.1)', status: 'All' }
          ].map(({ label, count, color, bg, status }) => (
            <button
              key={label}
              onClick={() => setFilter(status)}
              style={{
                background: filter === status ? bg : 'var(--bg-card)',
                border: filter === status ? `1.5px solid ${color}` : '1px solid var(--light-border)',
                borderRadius: '8px', padding: '18px', textAlign: 'left', cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s'
              }}
            >
              <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '6px' }}>{label}</span>
              <strong style={{ fontSize: '28px', color }}>{count}</strong>
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <CreditCard size={20} color="#4f46e5" />
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
              {filter === 'All' ? 'All Paid Registrations' : `${filter} Payments`}
            </h2>
            <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>
              {filteredPayments.length} record{filteredPayments.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Loading payment records...</p>
          ) : filteredPayments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <CreditCard size={40} color="#94a3b8" style={{ marginBottom: '12px' }} />
              <h3 style={{ color: 'var(--text-dark)', margin: '0 0 8px 0' }}>No {filter !== 'All' ? filter.toLowerCase() + ' ' : ''}payments found</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                {filter === 'Pending' ? 'All payments have been reviewed.' : 'No records matching this filter.'}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-hover" style={{ margin: 0, border: 'none', boxShadow: 'none', width: '100%', minWidth: '700px' }}>
                <thead>
                  <tr>
                    <th>Reg. ID</th>
                    <th>Student</th>
                    <th>Event</th>
                    <th>Entry Fee</th>
                    <th>Transaction ID</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => (
                    <tr key={p.registration_id}>
                      <td>
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '700', color: '#4f46e5' }}>
                          {p.registration_id}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={14} color="#94a3b8" />
                          <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{p.name}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.email}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{p.event_title}</span>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: '700', color: '#059669' }}>
                          ₹{p.event_price}
                        </span>
                      </td>
                      <td>
                        {p.transactionId ? (
                          <span style={{
                            fontFamily: 'Outfit, monospace', fontSize: '13px', fontWeight: '600',
                            background: 'var(--bg-base)', border: '1px solid var(--light-border)',
                            padding: '3px 8px', borderRadius: '4px', color: 'var(--text-dark)'
                          }}>
                            {p.transactionId}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>—</span>
                        )}
                      </td>
                      <td>
                        <PaymentStatusBadge status={p.paymentStatus} />
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleUpdateStatus(p.registration_id, 'Verified')}
                            disabled={p.paymentStatus === 'Verified' || actionLoading === p.registration_id + 'Verified'}
                            style={{
                              background: p.paymentStatus === 'Verified' ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.1)',
                              border: '1px solid rgba(16,185,129,0.4)', color: '#059669',
                              padding: '5px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '12px',
                              cursor: p.paymentStatus === 'Verified' ? 'not-allowed' : 'pointer',
                              opacity: p.paymentStatus === 'Verified' ? 0.5 : 1,
                              transition: 'all 0.2s', whiteSpace: 'nowrap'
                            }}
                            title="Mark as Verified"
                          >
                            ✓ Verify
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(p.registration_id, 'Rejected')}
                            disabled={p.paymentStatus === 'Rejected' || actionLoading === p.registration_id + 'Rejected'}
                            style={{
                              background: p.paymentStatus === 'Rejected' ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.4)', color: '#dc2626',
                              padding: '5px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '12px',
                              cursor: p.paymentStatus === 'Rejected' ? 'not-allowed' : 'pointer',
                              opacity: p.paymentStatus === 'Rejected' ? 0.5 : 1,
                              transition: 'all 0.2s', whiteSpace: 'nowrap'
                            }}
                            title="Mark as Rejected"
                          >
                            ✗ Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentVerification;
