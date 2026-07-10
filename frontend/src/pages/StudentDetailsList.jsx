import React, { useEffect, useState } from 'react';
import api from '../api';
import AdminNavbar from '../components/AdminNavbar';
import CoordinatorNavbar from '../components/CoordinatorNavbar';
import Footer from '../components/Footer';
import { GraduationCap } from 'lucide-react';

const StudentDetailsList = () => {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role') || 'admin';

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const res = await api.get('/participants/details');
        setDetails(res.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {role === 'admin' ? <AdminNavbar /> : <CoordinatorNavbar />}

      <div style={{ flexGrow: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 4px 0', textAlign: 'left' }}>
            Registered Student Details
          </h1>
          <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '15px' }}>
            View registration IDs and matching event selections
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', padding: '30px' }}>
          <h2 style={{ fontSize: '20px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GraduationCap size={20} color="#4f46e5" />
            Registered Profiles
          </h2>

          {loading ? (
            <h3 style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Loading students...</h3>
          ) : details.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-hover" style={{ margin: '0', border: 'none', boxShadow: 'none', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Registration ID</th>
                    <th>Name</th>
                    <th>Branch</th>
                    <th>Sem</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>College</th>
                    <th>Registered Event</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: '600', color: '#4f46e5' }}>{row.registration_id}</td>
                      <td style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{row.name}</td>
                      <td>{row.branch}</td>
                      <td>{row.sem}</td>
                      <td>{row.email}</td>
                      <td>{row.phone}</td>
                      <td>{row.college}</td>
                      <td style={{ fontWeight: '600', color: '#10b981' }}>{row.event_title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <h3>No student records found</h3>
              <p>Registered students will appear in this list.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentDetailsList;
