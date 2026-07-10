import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, User } from 'lucide-react';

const ContactUs = () => {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flexGrow: 1, maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 4px 0', textAlign: 'left' }}>
            Get in Touch
          </h1>
          <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '15px' }}>
            Contact the CampusHub portal developers and student leads
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginTop: '20px', justifyContent: 'center' }}>
          {/* Contact Card 1 */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--light-border)',
            boxShadow: 'var(--shadow-md)',
            padding: '30px',
            maxWidth: '450px',
            margin: '0 auto',
            width: '100%'
          }}>
            <h2 style={{ fontSize: '22px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="#4f46e5" />
              Himanshu Negi
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)', fontSize: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#94a3b8" />
                <span>himanshu@campushub.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#94a3b8" />
                <span>Mobile: +91 9999999999</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="#94a3b8" />
                <span>Bengaluru, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactUs;
