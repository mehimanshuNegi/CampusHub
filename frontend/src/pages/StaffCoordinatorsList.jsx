import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import { ShieldAlert, Edit3 } from 'lucide-react';

const StaffCoordinatorsList = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  const fetchCoordinators = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coordinators/staff');
      setCoordinators(res.data);
    } catch (error) {
      console.error('Error fetching staff coordinators:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      const res = await api.get('/club-coordinators/requests');
      setRequests(res.data.filter(r => r.role === 'staff_coordinator' && r.status === 'Pending'));
    } catch (error) {
      console.error('Error fetching staff coordinator requests:', error);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordinators();
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this request? This will activate their Staff Coordinator profile.')) {
      try {
        const res = await api.post(`/club-coordinators/requests/${id}/approve`);
        alert(res.data.message || 'Request Approved!');
        fetchCoordinators();
        fetchRequests();
      } catch (error) {
        alert(error.response?.data?.message || 'Error approving request.');
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        const res = await api.post(`/club-coordinators/requests/${id}/reject`);
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

      <div style={{ flexGrow: 1, maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 4px 0', textAlign: 'left' }}>
            Staff Coordinators
          </h1>
          <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '15px' }}>
            View and manage department mentors for all campus activities
          </p>
        </div>

        {/* Staff Coordinator Requests Section */}
        {requests.length > 0 && (
          <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', padding: '30px', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} color="#4f46e5" />
              Pending Staff Coordinator Requests
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--light-border)', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    <th style={{ padding: '8px 12px' }}>Applicant</th>
                    <th style={{ padding: '8px 12px' }}>Requested Club</th>
                    <th style={{ padding: '8px 12px' }}>Dept</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((row) => (
                    <tr key={row._id} style={{ borderBottom: '1px solid var(--light-border)', fontSize: '13px', color: 'var(--text-dark)' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: '600' }}>{row.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.email} | {row.phone}</div>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: '600', color: '#4f46e5' }}>{row.clubName}</td>
                      <td style={{ padding: '10px 12px' }}>{row.department}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleApprove(row._id || row.id)}
                            style={{ padding: '6px 12px', fontSize: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(row._id || row.id)}
                            style={{ padding: '6px 12px', fontSize: '12px', background: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', padding: '30px' }}>
          <h2 style={{ fontSize: '20px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} color="#4f46e5" />
            Staff Mentors
          </h2>

          {loading ? (
            <h3 style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Loading staff coordinators...</h3>
          ) : coordinators.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-hover" style={{ margin: '0', border: 'none', boxShadow: 'none', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Mentor Name</th>
                    <th>Contact Phone</th>
                    <th>Assigned Event</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coordinators.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '600', color: '#4f46e5' }}>{row.name}</td>
                      <td>{row.phone || <em style={{ color: '#94a3b8' }}>None provided</em>}</td>
                      <td style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{row.event_title}</td>
                      <td style={{ textAlign: 'center' }}>
                        <Link to={`/admin/coordinators/staff/update?id=${row.event_id}`} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          textDecoration: 'none',
                          color: '#4f46e5',
                          fontWeight: '600',
                          fontSize: '13px'
                        }}>
                          <Edit3 size={15} />
                          Update
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <h3>No staff coordinator records found</h3>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StaffCoordinatorsList;
