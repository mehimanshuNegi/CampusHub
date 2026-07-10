import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [authStatus, setAuthStatus] = useState('checking'); // checking, verified, failed

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    const email = localStorage.getItem('email') || localStorage.getItem('adminEmail');

    if (!token || !email) {
      setAuthStatus('failed');
      return;
    }

    // Set authorization header globally for all axios requests
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    api.post('/auth/verify-session', { token })
      .then((res) => {
        if (res.data.authenticated) {
          const userRole = res.data.role;
          
          // Verify role permission
          if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
            setAuthStatus('failed');
          } else {
            // Keep role in sync inside client storage
            localStorage.setItem('role', userRole);
            setAuthStatus('verified');
          }
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          localStorage.removeItem('role');
          localStorage.removeItem('name');
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminEmail');
          setAuthStatus('failed');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        setAuthStatus('failed');
      });
  }, [allowedRoles]);

  if (authStatus === 'checking') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-base)',
        fontFamily: 'Inter, sans-serif',
        color: 'var(--text-dark)'
      }}>
        <div style={{
          border: '4px solid var(--light-border)',
          borderTop: '4px solid #4f46e5',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          marginBottom: '15px'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <span style={{ fontSize: '15px', fontWeight: '500' }}>Verifying session permissions...</span>
      </div>
    );
  }

  if (authStatus === 'failed') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
