import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import { UserCheck, Check, X, Calendar, ClipboardList } from 'lucide-react';

const CoordinatorRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/club-coordinators/requests');
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching coordinator requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this request? This will activate their Club Coordinator profile.')) {
      try {
        const res = await axios.post(`/api/club-coordinators/requests/${id}/approve`);
        alert(res.data.message || 'Request Approved!');
        fetchRequests();
      } catch (error) {
        alert(error.response?.data?.message || 'Error approving request.');
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        const res = await axios.post(`/api/club-coordinators/requests/${id}/reject`);
        alert(res.data.message || 'Request Rejected successfully.');
        fetchRequests();
      } catch (error) {
        alert(error.response?.data?.message || 'Error rejecting request.');
      }
    }
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminNavbar />
      
      <div style={{ flexGrow: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 4px 0', textAlign: 'left' }}>
            Coordinator Requests
          </h1>
          <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '15px' }}>
            Inspect and approve or reject submissions from applicants
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', padding: '30px' }}>
          <h2 style={{ fontSize: '20px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={20} color="#4f46e5" />
            Applications Log
          </h2>

          {loading ? (
            <h3 style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Loading requests...</h3>
          ) : requests.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-hover" style={{ margin: '0', border: 'none', boxShadow: 'none', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Requested Club</th>
                    <th>Department</th>
                    <th>Statement</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((row) => (
                    <tr key={row._id}>
                      <td style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{row.name}</td>
                      <td>{row.email}</td>
                      <td>{row.phone}</td>
                      <td style={{ fontWeight: '600', color: '#4f46e5' }}>{row.clubName}</td>
                      <td>{row.department}</td>
                      <td style={{ fontSize: '13px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.description}>
                        {row.description}
                      </td>
                      <td>{new Date(row.createdAt).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '50px',
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          background: row.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : (row.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'),
                          color: row.status === 'Pending' ? '#d97706' : (row.status === 'Approved' ? '#059669' : '#dc2626')
                        }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {row.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleApprove(row._id)}
                              style={{
                                background: '#10b981',
                                border: 'none',
                                color: '#ffffff',
                                padding: '5px 8px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                              title="Approve Coordinator"
                            >
                              <Check size={14} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(row._id)}
                              style={{
                                background: '#ef4444',
                                border: 'none',
                                color: '#ffffff',
                                padding: '5px 8px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                              title="Reject Request"
                            >
                              <X size={14} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <h3>No coordinator requests found</h3>
              <p>Applications submitted by candidates will list here.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoordinatorRequestsList;
