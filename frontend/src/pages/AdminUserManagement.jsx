import React, { useEffect, useState } from 'react';
import api from '../api';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import { Search, UserCheck, ShieldAlert, User, Trash2, Edit2, Ban, CheckCircle, GraduationCap, X } from 'lucide-react';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Edit modal states
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    semester: '',
    clubName: '',
    description: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      alert('Failed to fetch users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusToggle = async (user) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    const confirmMsg = `Are you sure you want to ${newStatus === 'Suspended' ? 'suspend' : 'activate'} ${user.name}?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await api.put(`/admin/users/${user.role}/${user.id}/status`, { status: newStatus });
      alert(res.data.message || 'Status updated successfully!');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleDelete = async (user) => {
    const confirmMsg = `WARNING: Are you sure you want to delete user ${user.name}? This action cannot be undone.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await api.delete(`/admin/users/${user.role}/${user.id}`);
      alert(res.data.message || 'User deleted successfully!');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      department: user.department || '',
      semester: user.semester || '',
      clubName: user.clubName || '',
      description: user.description || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/admin/users/${editingUser.role}/${editingUser.id}`, editForm);
      alert(res.data.message || 'User details updated successfully!');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user details.');
    }
  };

  // Filter and search logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm)) ||
      (user.registration_id && user.registration_id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeStyle = (role) => {
    const styles = {
      admin: { background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.2)' },
      coordinator: { background: 'rgba(139, 92, 246, 0.1)', color: '#7c3aed', border: '1px solid rgba(139, 92, 246, 0.2)' },
      student: { background: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', border: '1px solid rgba(59, 130, 246, 0.2)' }
    };
    return styles[role] || styles.student;
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminNavbar />

      <div style={{ flexGrow: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{ marginBottom: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 4px 0', textAlign: 'left' }}>
              User Management
            </h1>
            <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '15px' }}>
              Manage registered accounts: view, edit, suspend, activate, and delete system users
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          marginBottom: '25px',
          background: 'var(--bg-card)',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid var(--light-border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Search */}
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, email, phone or student ID..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '38px', width: '100%', background: 'var(--bg-base)', color: 'var(--text-dark)' }}
            />
          </div>

          {/* Role Filter */}
          <div style={{ width: '180px' }}>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="form-control"
              style={{ width: '100%', background: 'var(--bg-base)', color: 'var(--text-dark)' }}
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="coordinator">Coordinator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Users Table Card */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', padding: '24px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3 style={{ color: 'var(--text-muted)' }}>Loading user accounts...</h3>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3 style={{ color: 'var(--text-muted)' }}>No matching users found</h3>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--light-border)', color: 'var(--text-muted)', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    <th style={{ padding: '12px 16px' }}>Name / Email</th>
                    <th style={{ padding: '12px 16px' }}>Role</th>
                    <th style={{ padding: '12px 16px' }}>Phone</th>
                    <th style={{ padding: '12px 16px' }}>Dept / Sem</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={`${user.role}-${user.id}`} style={{ borderBottom: '1px solid var(--light-border)', fontSize: '14px', color: 'var(--text-dark)' }}>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '700' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user.email}</div>
                        {user.registration_id && (
                          <div style={{ fontSize: '11px', color: '#3b82f6', marginTop: '2px', fontWeight: 'bold' }}>
                            ID: {user.registration_id}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          ...getRoleBadgeStyle(user.role)
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>{user.phone || 'N/A'}</td>
                      <td style={{ padding: '16px' }}>
                        {user.department ? user.department : 'N/A'}
                        {user.semester ? ` / Sem ${user.semester}` : ''}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          fontWeight: '700',
                          color: user.status === 'Active' ? '#10b981' : '#ef4444'
                        }}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleEditClick(user)}
                            style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '4px' }}
                            title="Edit Details"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleStatusToggle(user)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: user.status === 'Active' ? '#f59e0b' : '#10b981',
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                            title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                          >
                            {user.status === 'Active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            title="Delete User"
                          >
                            <Trash2 size={16} />
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

      {/* Edit Details Modal */}
      {editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--light-border)',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
            width: '100%',
            maxWidth: '500px',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              borderBottom: '1px solid var(--light-border)',
              background: '#0f172a',
              color: '#ffffff'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', textTransform: 'capitalize' }}>
                Edit {editingUser.role} Details
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ padding: '24px', margin: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Name */}
                <div>
                  <label style={{ fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Email</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>

                {/* Role Specific Fields */}
                {editingUser.role !== 'admin' && (
                  <div>
                    <label style={{ fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Phone</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                )}

                {editingUser.role === 'coordinator' && (
                  <>
                    <div>
                      <label style={{ fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Assigned Club</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={editForm.clubName}
                        onChange={(e) => setEditForm({ ...editForm, clubName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Department</label>
                      <input
                        type="text"
                        required
                        className="form-control"
                        value={editForm.department}
                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Description</label>
                      <textarea
                        className="form-control"
                        style={{ minHeight: '80px', width: '100%' }}
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      />
                    </div>
                  </>
                )}

                {editingUser.role === 'student' && (
                  <>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Branch / Dept</label>
                        <input
                          type="text"
                          required
                          className="form-control"
                          value={editForm.department}
                          onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Semester</label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="8"
                          className="form-control"
                          value={editForm.semester}
                          onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div style={{ borderTop: '1px solid var(--light-border)', marginTop: '24px', paddingTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-default"
                  onClick={() => setEditingUser(null)}
                  style={{ background: 'var(--bg-base)', border: '1px solid var(--light-border)', color: 'var(--text-dark)' }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-default">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminUserManagement;
