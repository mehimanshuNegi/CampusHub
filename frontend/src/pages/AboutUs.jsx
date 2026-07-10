import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BookOpen } from 'lucide-react';

const AboutUs = () => {
  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flexGrow: 1, maxWidth: '900px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{
          background: 'var(--bg-card)',
          padding: '40px',
          borderRadius: '8px',
          border: '1px solid var(--light-border)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
            <BookOpen size={28} color="#4f46e5" />
            <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
              About CampusHub
            </h1>
          </div>
          
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.8' }}>
            CampusHub is a digital activities portal designed to bring student life, cultural fests, academic clubs, and athletic leagues into a single cohesive workspace. Our platform makes event management, coordinator outreach, and registration tracking smooth and transparent for both students and administration.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.8' }}>
            Designed as a high-performance event coordinator hub, CampusHub uses a decoupled MERN stack architecture containing structured schema bindings, sequential ID generators, and database-backed administrator portals to secure activity schedules.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.8', margin: 0 }}>
            Join the community, connect with coordinators, challenge your peers, and showcase your skills in technical hackathons, gaming tournaments, stage shows, or off-stage creative contests.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
