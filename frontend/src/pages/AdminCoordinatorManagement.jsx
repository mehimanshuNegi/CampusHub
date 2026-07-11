import React, { useEffect, useState } from 'react';
import api from '../api';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import { UserCheck, ShieldAlert, Users, Award, Trash2, Key, RefreshCw, BarChart2, BookOpen, AlertCircle, X, Check, ClipboardList, Search } from 'lucide-react';

const AdminCoordinatorManagement = () => {
  const [users, setUsers] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'pending'
  const [searchTerm, setSearchTerm] = useState('');

  // Promotion Form State
  const [promoteForm, setPromoteForm] = useState({
    studentEmail: '',
    clubName: '',
    department: '',
    description: '',
    isStaff: false
  });

  // Action Modals State
  const [metricsCoordinator, setMetricsCoordinator] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);

  const [passwordResetCoord, setPasswordResetCoord] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const [changeClubCoord, setChangeClubCoord] = useState(null);
  const [newClubName, setNewClubName] = useState('');

  const [transferCoord, setTransferCoord] = useState(null);
  const [transferForm, setTransferForm] = useState({
    event_id: '',
    newCoordinatorEmail: ''
  });
  const [coordEvents, setCoordEvents] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data);
      
      const coords = res.data.filter(u => u.role === 'coordinator');
      const studs = res.data.filter(u => u.role === 'student');
      setCoordinators(coords);
      setStudents(studs);

      // Fetch pending coordinator requests
      const reqsRes = await api.get('/club-coordinators/requests');
      setRequests(reqsRes.data);
    } catch (err) {
      console.error('Error fetching users/requests:', err);
      alert('Failed to load coordinators and requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePromote = async (e) => {
    e.preventDefault();
    if (!promoteForm.studentEmail) {
      alert('Please select a student.');
      return;
    }
    try {
      const res = await api.post('/admin/coordinators/promote', promoteForm);
      alert(res.data.message || 'Student promoted successfully!');
      setPromoteForm({
        studentEmail: '',
        clubName: '',
        department: '',
        description: '',
        isStaff: false
      });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to promote student.');
    }
  };

  const handleDemote = async (coord) => {
    const confirmMsg = `Are you sure you want to demote ${coord.name} back to Student status? They will lose access to the portal login.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await api.post('/admin/coordinators/demote', { coordinatorId: coord.id });
      alert(res.data.message || 'Coordinator demoted successfully!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to demote coordinator.');
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/admin/coordinators/${passwordResetCoord.id}/reset-password`, { newPassword });
      alert(res.data.message || 'Password reset successful!');
      setPasswordResetCoord(null);
      setNewPassword('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  const handleChangeClubSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/admin/users/coordinator/${changeClubCoord.id}`, { clubName: newClubName });
      alert(res.data.message || 'Assigned club updated successfully!');
      setChangeClubCoord(null);
      setNewClubName('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update club.');
    }
  };

  const handleViewMetrics = async (coord) => {
    setMetricsCoordinator(coord);
    setMetricsLoading(true);
    try {
      const res = await api.get(`/admin/coordinators/${coord.id}/activity`);
      setMetrics(res.data);
    } catch (err) {
      console.error('Error fetching activity metrics:', err);
      alert('Failed to load metrics.');
      setMetricsCoordinator(null);
    } finally {
      setMetricsLoading(false);
    }
  };

  const handleTransferClick = async (coord) => {
    setTransferCoord(coord);
    try {
      const res = await api.get('/events');
      const owned = res.data.filter(e => e.createdBy === coord.email);
      setCoordEvents(owned);
      setTransferForm({
        event_id: '',
        newCoordinatorEmail: ''
      });
    } catch (err) {
      console.error('Error fetching events:', err);
      alert('Failed to load coordinator events.');
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferForm.event_id || !transferForm.newCoordinatorEmail) {
      alert('Please select an event and a target coordinator.');
      return;
    }
    try {
      const res = await api.put(`/admin/events/${transferForm.event_id}/transfer`, { newCoordinatorEmail: transferForm.newCoordinatorEmail });
      alert(res.data.message || 'Event ownership transferred successfully!');
      setTransferCoord(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to transfer event ownership.');
    }
  };

  const handleApproveRequest = async (id) => {
    if (window.confirm('Are you sure you want to approve this request? This will activate their Coordinator profile.')) {
      try {
        const res = await api.post(`/club-coordinators/requests/${id}/approve`);
        alert(res.data.message || 'Request Approved!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error approving request.');
      }
    }
  };

  const handleRejectRequest = async (id) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        const res = await api.post(`/club-coordinators/requests/${id}/reject`);
        alert(res.data.message || 'Request Rejected successfully.');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error rejecting request.');
      }
    }
  };

  // Filter active coordinators
  const filteredCoordinators = coordinators.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.clubName && c.clubName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingRequests = requests.filter(r => r.status === 'Pending');

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminNavbar />

      <div style={{ flexGrow: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 4px 0', textAlign: 'left' }}>
            Coordinator Management
          </h1>
          <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '15px' }}>
            Promote students, approve pending requests, reassign event owners, reset passwords, and view activity metrics.
          </p>
        </div>

        {/* Tabs Control */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '1px solid var(--light-border)', paddingBottom: '10px' }}>
          <button
            onClick={() => setActiveTab('active')}
            style={{
              background: activeTab === 'active' ? '#4f46e5' : 'transparent',
              color: activeTab === 'active' ? '#ffffff' : 'var(--text-muted)',
              border: activeTab === 'active' ? '1px solid #4f46e5' : '1px solid var(--light-border)',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Active Coordinators ({coordinators.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              background: activeTab === 'pending' ? '#4f46e5' : 'transparent',
              color: activeTab === 'pending' ? '#ffffff' : 'var(--text-muted)',
              border: activeTab === 'pending' ? '1px solid #4f46e5' : '1px solid var(--light-border)',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Pending Requests ({pendingRequests.length})
          </button>
        </div>

        {/* TAB 1: ACTIVE COORDINATORS */}
        {activeTab === 'active' && (
          <>
            {/* Promotion Section inside active tab */}
            <div style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--light-border)',
              boxShadow: 'var(--shadow-sm)',
              padding: '24px',
              marginBottom: '35px'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-dark)', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} color="#4f46e5" />
                Promote Student to Coordinator
              </h2>
              <form onSubmit={handlePromote} style={{ margin: 0 }}>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>Select Student</label>
                    <select
                      required
                      value={promoteForm.studentEmail}
                      onChange={(e) => {
                        const selected = students.find(s => s.email === e.target.value);
                        setPromoteForm({
                          ...promoteForm,
                          studentEmail: e.target.value,
                          department: selected ? selected.department : ''
                        });
                      }}
                      className="form-control"
                      style={{ width: '100%', background: 'var(--bg-base)', color: 'var(--text-dark)' }}
                    >
                      <option value="">Choose student...</option>
                      {students.map(s => (
                        <option key={s.id} value={s.email}>{s.name} ({s.email})</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>Assign Club Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Coding Club"
                      value={promoteForm.clubName}
                      onChange={(e) => setPromoteForm({ ...promoteForm, clubName: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div style={{ flex: '1 1 120px' }}>
                    <label style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>Department</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CSE"
                      value={promoteForm.department}
                      onChange={(e) => setPromoteForm({ ...promoteForm, department: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div style={{ flex: '1 1 140px' }}>
                    <label style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>Coordinator Type</label>
                    <select
                      value={promoteForm.isStaff ? 'staff' : 'student'}
                      onChange={(e) => setPromoteForm({ ...promoteForm, isStaff: e.target.value === 'staff' })}
                      className="form-control"
                      style={{ width: '100%', background: 'var(--bg-base)', color: 'var(--text-dark)' }}
                    >
                      <option value="student">Student Coord</option>
                      <option value="staff">Staff/Faculty Coord</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '15px' }}>
                  <label style={{ fontWeight: '600', color: 'var(--text-dark)', fontSize: '14px', display: 'block', marginBottom: '6px' }}>Short Profile Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Code club lead helping organize technical events..."
                    value={promoteForm.description}
                    onChange={(e) => setPromoteForm({ ...promoteForm, description: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-start' }}>
                  <button type="submit" className="btn-default" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserCheck size={18} />
                    Promote to Coordinator
                  </button>
                </div>
              </form>
            </div>

            {/* Active Coordinators Search and List Table */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} color="#4f46e5" />
                  Active Club Coordinators
                </h2>

                <div style={{ position: 'relative', width: '280px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search by name, email, or club..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '32px', width: '100%', fontSize: '13px' }}
                  />
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <h3 style={{ color: 'var(--text-muted)' }}>Loading coordinators...</h3>
                </div>
              ) : filteredCoordinators.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <h3 style={{ color: 'var(--text-muted)' }}>No coordinators found</h3>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--light-border)', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        <th style={{ padding: '12px 16px' }}>Name</th>
                        <th style={{ padding: '12px 16px' }}>Email</th>
                        <th style={{ padding: '12px 16px' }}>Assigned Club</th>
                        <th style={{ padding: '12px 16px' }}>Events Managed</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCoordinators.map((coord) => (
                        <tr key={coord.id} style={{ borderBottom: '1px solid var(--light-border)', fontSize: '14px', color: 'var(--text-dark)' }}>
                          <td style={{ padding: '16px', fontWeight: '700' }}>{coord.name}</td>
                          <td style={{ padding: '16px' }}>{coord.email}</td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ fontWeight: '600' }}>{coord.clubName}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{coord.department}</div>
                          </td>
                          <td style={{ padding: '16px', fontWeight: '600', color: '#4f46e5' }}>{coord.eventsManaged || 0}</td>
                          <td style={{ padding: '16px' }}>
                            <span style={{ fontWeight: '700', color: coord.status === 'Active' ? '#10b981' : '#ef4444' }}>
                              {coord.status}
                            </span>
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => handleViewMetrics(coord)}
                                className="btn-default"
                                style={{ padding: '5px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(79, 70, 229, 0.08)', border: '1px solid rgba(79, 70, 229, 0.2)', color: '#4f46e5' }}
                              >
                                <BarChart2 size={13} /> Activity
                              </button>
                              <button
                                onClick={() => { setChangeClubCoord(coord); setNewClubName(coord.clubName); }}
                                className="btn-default"
                                style={{ padding: '5px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#2563eb' }}
                              >
                                <BookOpen size={13} /> Club
                              </button>
                              <button
                                onClick={() => handleTransferClick(coord)}
                                className="btn-default"
                                style={{ padding: '5px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#059669' }}
                              >
                                <RefreshCw size={13} /> Transfer
                              </button>
                              <button
                                onClick={() => setPasswordResetCoord(coord)}
                                className="btn-default"
                                style={{ padding: '5px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#d97706' }}
                              >
                                <Key size={13} /> Password
                              </button>
                              <button
                                onClick={() => handleDemote(coord)}
                                className="btn-default"
                                style={{ padding: '5px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                              >
                                <Trash2 size={13} /> Demote
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
          </>
        )}

        {/* TAB 2: PENDING REQUESTS */}
        {activeTab === 'pending' && (
          <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-dark)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClipboardList size={20} color="#4f46e5" />
              Pending Coordinator Applications
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <h3 style={{ color: 'var(--text-muted)' }}>Loading requests...</h3>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <h3>No pending coordinator requests</h3>
                <p>New request submissions will appear here automatically.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--light-border)', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                      <th style={{ padding: '12px 16px' }}>Name</th>
                      <th style={{ padding: '12px 16px' }}>Email</th>
                      <th style={{ padding: '12px 16px' }}>Department</th>
                      <th style={{ padding: '12px 16px' }}>Club</th>
                      <th style={{ padding: '12px 16px' }}>Applied Date</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((row) => (
                      <tr key={row._id} style={{ borderBottom: '1px solid var(--light-border)', fontSize: '14px', color: 'var(--text-dark)' }}>
                        <td style={{ padding: '16px', fontWeight: '700' }}>{row.name}</td>
                        <td style={{ padding: '16px' }}>{row.email}</td>
                        <td style={{ padding: '16px' }}>{row.department}</td>
                        <td style={{ padding: '16px', fontWeight: '600', color: '#4f46e5' }}>{row.clubName}</td>
                        <td style={{ padding: '16px' }}>{new Date(row.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 10px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#d97706'
                          }}>
                            {row.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleApproveRequest(row._id || row.id)}
                              className="btn-default"
                              style={{ padding: '6px 12px', fontSize: '12px', background: '#10b981', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectRequest(row._id || row.id)}
                              className="btn-default"
                              style={{ padding: '6px 12px', fontSize: '12px', background: '#ef4444', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <X size={14} /> Reject
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
        )}
      </div>

      {/* Metrics Activity Modal */}
      {metricsCoordinator && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--light-border)', borderRadius: '12px', width: '100%', maxWidth: '450px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--light-border)', background: '#0f172a', color: '#ffffff' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Coordinator Activity Metrics</h3>
              <button onClick={() => setMetricsCoordinator(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '24px' }}>
              {metricsLoading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Calculating activity data...</p>
              ) : metrics ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ borderBottom: '1px solid var(--light-border)', paddingBottom: '12px' }}>
                    <strong style={{ fontSize: '16px', color: 'var(--text-dark)' }}>{metrics.coordinatorDetails.name}</strong>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{metrics.coordinatorDetails.email}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ background: 'var(--bg-base)', padding: '15px', borderRadius: '8px', border: '1px solid var(--light-border)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Events Created</span>
                      <strong style={{ fontSize: '24px', color: '#4f46e5' }}>{metrics.eventsCount}</strong>
                    </div>
                    <div style={{ background: 'var(--bg-base)', padding: '15px', borderRadius: '8px', border: '1px solid var(--light-border)' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Registrations</span>
                      <strong style={{ fontSize: '24px', color: '#10b981' }}>{metrics.registrationsCount}</strong>
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-dark)' }}>
                    <div style={{ marginBottom: '8px' }}><strong>Assigned Club:</strong> {metrics.coordinatorDetails.clubName}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Department:</strong> {metrics.coordinatorDetails.department}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Current Status:</strong> <span style={{ color: metrics.status === 'Active' ? '#10b981' : '#ef4444', fontWeight: '700' }}>{metrics.status}</span></div>
                    <div><strong>Last Login:</strong> {metrics.lastLogin ? new Date(metrics.lastLogin).toLocaleString() : 'Never logged in'}</div>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#ef4444' }}>Error loading activity details.</p>
              )}
              <div style={{ borderTop: '1px solid var(--light-border)', marginTop: '20px', paddingTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-default" onClick={() => setMetricsCoordinator(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Club Modal */}
      {changeClubCoord && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--light-border)', borderRadius: '12px', width: '100%', maxWidth: '400px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--light-border)', background: '#0f172a', color: '#ffffff' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Change Assigned Club</h3>
              <button onClick={() => setChangeClubCoord(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleChangeClubSubmit} style={{ padding: '24px', margin: 0 }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Assigned Club for {changeClubCoord.name}</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={newClubName}
                  onChange={(e) => setNewClubName(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-default" style={{ background: 'var(--bg-base)', border: '1px solid var(--light-border)', color: 'var(--text-dark)' }} onClick={() => setChangeClubCoord(null)}>Cancel</button>
                <button type="submit" className="btn-default">Save Club</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {passwordResetCoord && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--light-border)', borderRadius: '12px', width: '100%', maxWidth: '400px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--light-border)', background: '#0f172a', color: '#ffffff' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Reset Coordinator Password</h3>
              <button onClick={() => setPasswordResetCoord(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handlePasswordResetSubmit} style={{ padding: '24px', margin: 0 }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>New Password (min 6 chars)</label>
                <input
                  type="password"
                  required
                  minLength="6"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-default" style={{ background: 'var(--bg-base)', border: '1px solid var(--light-border)', color: 'var(--text-dark)' }} onClick={() => setPasswordResetCoord(null)}>Cancel</button>
                <button type="submit" className="btn-default">Reset Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Ownership Modal */}
      {transferCoord && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--light-border)', borderRadius: '12px', width: '100%', maxWidth: '500px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--light-border)', background: '#0f172a', color: '#ffffff' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Transfer Event Ownership</h3>
              <button onClick={() => setTransferCoord(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleTransferSubmit} style={{ padding: '24px', margin: 0 }}>
              {coordEvents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <AlertCircle size={24} color="#f59e0b" style={{ marginBottom: '8px' }} />
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>This coordinator does not currently own any events.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Select Event to Transfer</label>
                    <select
                      required
                      value={transferForm.event_id}
                      onChange={(e) => setTransferForm({ ...transferForm, event_id: e.target.value })}
                      className="form-control"
                      style={{ width: '100%', background: 'var(--bg-base)', color: 'var(--text-dark)' }}
                    >
                      <option value="">Choose event...</option>
                      {coordEvents.map(e => (
                        <option key={e.event_id} value={e.event_id}>{e.event_title} ({e.event_id})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Select Target Coordinator</label>
                    <select
                      required
                      value={transferForm.newCoordinatorEmail}
                      onChange={(e) => setTransferForm({ ...transferForm, newCoordinatorEmail: e.target.value })}
                      className="form-control"
                      style={{ width: '100%', background: 'var(--bg-base)', color: 'var(--text-dark)' }}
                    >
                      <option value="">Choose target...</option>
                      {coordinators.filter(c => c.id !== transferCoord.id).map(c => (
                        <option key={c.id} value={c.email}>{c.name} ({c.clubName})</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--light-border)', marginTop: '24px', paddingTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-default" style={{ background: 'var(--bg-base)', border: '1px solid var(--light-border)', color: 'var(--text-dark)' }} onClick={() => setTransferCoord(null)}>Cancel</button>
                {coordEvents.length > 0 && <button type="submit" className="btn-default">Transfer Event</button>}
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminCoordinatorManagement;
