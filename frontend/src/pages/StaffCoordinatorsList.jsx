import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import { ShieldAlert, Edit3 } from 'lucide-react';

const StaffCoordinatorsList = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const res = await api.get('/coordinators/staff');
        setCoordinators(res.data);
      } catch (error) {
        console.error('Error fetching staff coordinators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinators();
  }, []);

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
