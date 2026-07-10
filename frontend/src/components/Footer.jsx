import React from 'react';

const Footer = () => {
  return (
    <>
      <hr className="footerline" style={{ margin: '0', borderColor: 'var(--light-border)', opacity: 0.15 }} />
      <footer style={{ background: 'var(--bg-footer, #0f172a)', color: 'var(--text-muted, #94a3b8)', padding: '60px 24px 30px 24px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', margin: '0' }}>
            <div style={{ flex: '1 1 300px' }}>
              <h3 style={{ color: '#ffffff', fontFamily: 'Outfit, sans-serif', fontSize: '24px', fontWeight: 800, margin: '0 0 15px 0' }}>
                🎓 CampusHub
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.7', opacity: 0.8, margin: '0 0 20px 0' }}>
                CampusHub is a responsive activities portal designed to centralize college event registrations, coordinate listings, schedule details, and facilitator outreach.
              </p>
              <div style={{ display: 'inline-block', background: 'rgba(79, 70, 229, 0.15)', color: '#a5b4fc', fontSize: '12px', fontWeight: '600', padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(79, 70, 229, 0.3)' }}>
                🚀 Production Portal
              </div>
            </div>
            
            <div style={{ flex: '1 1 200px' }}>
              <h4 style={{ color: '#ffffff', fontFamily: 'Outfit, sans-serif', fontSize: '16px', fontWeight: 700, margin: '0 0 15px 0' }}>
                Quick Links
              </h4>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <li><a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a></li>
                <li><a href="/#categories" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Browse Events</a></li>
                <li><a href="/registered-event" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Registered Event</a></li>
                <li><a href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About CampusHub</a></li>
              </ul>
            </div>

            <div style={{ flex: '1 1 250px' }}>
              <h4 style={{ color: '#ffffff', fontFamily: 'Outfit, sans-serif', fontSize: '16px', fontWeight: 700, margin: '0 0 15px 0' }}>
                Developers & Contact
              </h4>
              <p style={{ fontSize: '14px', lineHeight: '1.7', opacity: 0.8, margin: '0 0 10px 0' }}>
                Developed by: <strong>Himanshu Negi</strong>
              </p>
              <p style={{ fontSize: '13px', lineHeight: '1.6', opacity: 0.7, margin: '0 0 15px 0' }}>
                CampusHub Engineering Team<br />
                Bengaluru, India
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href="https://github.com">
                  <img src="/images/facebook.png" alt="GitHub" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', padding: '6px', margin: '0', filter: 'brightness(0) invert(1)' }} />
                </a>
                <a href="https://linkedin.com">
                  <img src="/images/instagram.png" alt="LinkedIn" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', padding: '6px', margin: '0', filter: 'brightness(0) invert(1)' }} />
                </a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '40px', paddingTop: '20px', textAlign: 'center', fontSize: '13px', opacity: 0.7 }}>
            © {new Date().getFullYear()} CampusHub. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
