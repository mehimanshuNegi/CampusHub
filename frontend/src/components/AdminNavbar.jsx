import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import { LayoutDashboard, Users, GraduationCap, ShieldAlert, LogOut, Menu, X, Settings, Sun, Moon, UserCheck, CreditCard, ClipboardList } from 'lucide-react';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const navLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/coordinators', label: 'Coordinator Management', icon: UserCheck },
    { to: '/admin/payments', label: 'Payment Verification', icon: CreditCard },
    { to: '/admin/students', label: 'Registered Students', icon: GraduationCap },
    { to: '/admin/settings', label: 'Account Settings', icon: Settings }
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
      window.location.href = '/';
    }
  };

  return (
    <>
      <style>{`
        .custom-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: #0f172a;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
          padding: 10px 0;
          transition: all 0.3s ease;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 24px;
        }
        .logo-text-admin {
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #ffffff !important;
          text-decoration: none !important;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logo-badge {
          background: #4f46e5;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 6px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-item-link-admin {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8 !important;
          font-weight: 600;
          font-size: 14px;
          padding: 10px 16px;
          border-radius: 8px;
          text-decoration: none !important;
          transition: all 0.25s ease;
        }
        .nav-item-link-admin:hover, .nav-item-link-admin.active {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.06);
        }
        .theme-toggle-admin-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #94a3b8;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
        }
        .theme-toggle-admin-btn:hover {
          color: #ffffff;
          border-color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }
        .nav-logout-btn {
          background: transparent !important;
          color: #f87171 !important;
          border: 1px solid rgba(248, 113, 113, 0.4) !important;
          border-radius: 8px;
          padding: 8px 16px !important;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none !important;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .nav-logout-btn:hover {
          background: #ef4444 !important;
          color: #ffffff !important;
          border-color: #ef4444 !important;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
          transform: translateY(-1px);
        }
        .mobile-menu-toggle-admin {
          display: none;
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
        }
        .mobile-menu-admin {
          display: none;
          position: fixed;
          top: 65px;
          left: 0;
          right: 0;
          background: #0f172a;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 20px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
          z-index: 999;
          flex-direction: column;
          gap: 12px;
        }
        @media (max-width: 1024px) {
          .nav-menu {
            display: none;
          }
          .mobile-menu-toggle-admin {
            display: block;
          }
          .mobile-menu-admin.open {
            display: flex;
          }
        }
      `}</style>
      <nav className="custom-navbar">
        <div className="nav-container">
          <Link to="/admin" className="logo-text-admin">
            <span>🎓 CampusHub</span>
            <span className="logo-badge">Admin</span>
          </Link>

          <ul className="nav-menu">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`nav-item-link-admin ${location.pathname === link.to ? 'active' : ''}`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button onClick={toggleTheme} className="theme-toggle-admin-btn" title="Toggle Theme" style={{ marginRight: '10px' }}>
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="nav-logout-btn" style={{ border: '1px solid rgba(248, 113, 113, 0.4)' }}>
                <LogOut size={16} />
                Logout
              </button>
            </li>
          </ul>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }} className="mobile-menu-toggle-admin">
            <button onClick={toggleTheme} className="theme-toggle-admin-btn" title="Toggle Theme">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div className={`mobile-menu-admin ${isOpen ? 'open' : ''}`}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-item-link-admin ${location.pathname === link.to ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
          <button onClick={(e) => { setIsOpen(false); handleLogout(e); }} className="nav-logout-btn" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;
