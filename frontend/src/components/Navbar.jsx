import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Info, LogIn, Menu, X, ClipboardList, Phone, Sun, Moon, UserPlus } from 'lucide-react';

const Navbar = () => {
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
    { to: '/', label: 'Home', icon: Home },
    { to: '/#categories', label: 'Events', icon: Calendar },
    { to: '/registered-event', label: 'Registered Event', icon: ClipboardList },
    { to: '/become-coordinator', label: 'Become Coordinator', icon: UserPlus },
    { to: '/about', label: 'About Us', icon: Info },
    { to: '/contact', label: 'Contact Us', icon: Phone }
  ];

  const handleNavClick = (to) => {
    setIsOpen(false);
    if (to.startsWith('/#')) {
      const id = to.split('#')[1];
      if (location.pathname === '/') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.location.href = '/' + to.substring(1);
      }
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
          background: var(--bg-card);
          border-bottom: 1px solid var(--light-border);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: all 0.25s ease;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 24px;
        }
        .logo-text {
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: #4f46e5;
          text-decoration: none !important;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .logo-text:hover {
          color: #4338ca;
        }
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 8px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-item-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-dark) !important;
          opacity: 0.8;
          font-weight: 600;
          font-size: 14px;
          padding: 8px 14px;
          border-radius: 6px;
          text-decoration: none !important;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .nav-item-link:hover, .nav-item-link.active {
          color: #4f46e5 !important;
          opacity: 1;
          background: rgba(79, 70, 229, 0.08);
        }
        .nav-login-btn {
          background: #4f46e5 !important;
          color: #ffffff !important;
          border-radius: 6px;
          padding: 8px 18px !important;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none !important;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .nav-login-btn:hover {
          background: #4338ca !important;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
          transform: translateY(-1px);
        }
        .theme-toggle-btn {
          background: transparent;
          border: 1px solid var(--light-border);
          color: var(--text-dark);
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .theme-toggle-btn:hover {
          background: rgba(79, 70, 229, 0.08);
          color: #4f46e5;
          border-color: #4f46e5;
        }
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-dark);
          cursor: pointer;
        }
        .mobile-menu {
          display: none;
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          background: var(--bg-card);
          border-bottom: 1px solid var(--light-border);
          padding: 20px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
          z-index: 999;
          flex-direction: column;
          gap: 12px;
        }
        @media (max-width: 1024px) {
          .nav-menu {
            display: none;
          }
          .mobile-menu-toggle {
            display: block;
          }
          .mobile-menu.open {
            display: flex;
          }
        }
      `}</style>
      <nav className="custom-navbar">
        <div className="nav-container">
          <Link to="/" className="logo-text">
            <span>🎓 CampusHub</span>
          </Link>

          <ul className="nav-menu">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isAnchor = link.to.startsWith('/#');
              return (
                <li key={link.to}>
                  {isAnchor ? (
                    <span
                      onClick={() => handleNavClick(link.to)}
                      className={`nav-item-link ${location.pathname === '/' && location.hash === link.to.substring(1) ? 'active' : ''}`}
                    >
                      <Icon size={16} />
                      {link.label}
                    </span>
                  ) : (
                    <Link
                      to={link.to}
                      className={`nav-item-link ${location.pathname === link.to ? 'active' : ''}`}
                    >
                      <Icon size={16} />
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
            <li>
              <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </li>
            <li>
              <Link to="/login" className="nav-login-btn">
                <LogIn size={16} />
                Admin Login
              </Link>
            </li>
          </ul>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }} className="mobile-menu-toggle">
            <button onClick={toggleTheme} className="theme-toggle-btn" title="Toggle Theme">
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isAnchor = link.to.startsWith('/#');
            return isAnchor ? (
              <span
                key={link.to}
                onClick={() => handleNavClick(link.to)}
                className={`nav-item-link ${location.pathname === '/' && location.hash === link.to.substring(1) ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <Icon size={18} />
                {link.label}
              </span>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-item-link ${location.pathname === link.to ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
          <Link to="/login" className="nav-login-btn" style={{ justifyContent: 'center' }} onClick={() => setIsOpen(false)}>
            <LogIn size={18} />
            Admin Login
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
