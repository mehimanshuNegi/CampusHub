import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, Clock, MapPin, Tag, User, Shield, ArrowLeft } from 'lucide-react';
import EventImage from '../components/EventImage';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await api.get(`/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        setError('Failed to load event details. Please verify the URL.');
      } finally {
        setLoading(false);
      }
    };
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const categoryLabels = { 1: 'Technical', 2: 'Gaming', 3: 'On-Stage', 4: 'Off-Stage' };
  const categoryColors = { 1: '#4f46e5', 2: '#10b981', 3: '#f59e0b', 4: '#ec4899' };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flexGrow: '1', maxWidth: '900px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <Link to={event ? `/events/type/${event.type_id}` : '/'} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--light-border)',
            color: 'var(--text-dark)',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            textDecoration: 'none'
          }}>
            <ArrowLeft size={16} />
          </Link>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Back to events</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Loading event details...</h3>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ color: '#ef4444', margin: '0 0 10px 0' }}>{error}</h3>
            <Link to="/" className="btn-default" style={{ textDecoration: 'none', marginTop: '15px', display: 'inline-block' }}>Go back home</Link>
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '12px',
            border: '1px solid var(--light-border)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
          }}>
            {/* Event Hero Banner */}
            <div style={{ height: '340px', overflow: 'hidden', position: 'relative' }}>
              <EventImage
                src={`/${event.img_link.trim()}`}
                alt={event.event_title}
                height={340}
              />
              <span style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: categoryColors[event.type_id] || '#4f46e5',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '700',
                padding: '5px 12px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}>
                {categoryLabels[event.type_id] || 'Category'} Event
              </span>
            </div>

            {/* Event Information Content */}
            <div style={{ padding: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                  {event.event_title}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '15px' }}>
                  <Tag size={16} />
                  <span>Entry Fee: ₹{event.event_price}</span>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '35px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 10px 0' }}>
                  Event Description
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
                  {event.description}
                </p>
              </div>

              {/* Event Logistics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '24px',
                padding: '24px',
                background: 'var(--bg-base)',
                borderRadius: '8px',
                border: '1px solid var(--light-border)',
                marginBottom: '35px'
              }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ background: 'rgba(79, 70, 229, 0.1)', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Calendar size={18} color="#4f46e5" />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Date</span>
                    <strong style={{ fontSize: '15px', color: 'var(--text-dark)' }}>{event.Date || 'TBA'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ background: 'rgba(79, 70, 229, 0.1)', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={18} color="#4f46e5" />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Time</span>
                    <strong style={{ fontSize: '15px', color: 'var(--text-dark)' }}>{event.time || 'TBA'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ background: 'rgba(79, 70, 229, 0.1)', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={18} color="#4f46e5" />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Venue</span>
                    <strong style={{ fontSize: '15px', color: 'var(--text-dark)' }}>{event.location || 'TBA'}</strong>
                  </div>
                </div>
              </div>

              {/* Coordinators Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                {/* Student Coordinator */}
                <div style={{ border: '1px solid var(--light-border)', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <User size={16} color="#4f46e5" />
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
                      Student Coordinator
                    </h4>
                  </div>
                  <strong style={{ display: 'block', fontSize: '16px', color: 'var(--text-dark)', marginBottom: '4px' }}>
                    {event.st_name || 'TBD'}
                  </strong>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Phone: {event.st_phone || 'Contact department'}
                  </span>
                </div>

                {/* Staff Coordinator */}
                <div style={{ border: '1px solid var(--light-border)', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Shield size={16} color="#4f46e5" />
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
                      Staff Coordinator
                    </h4>
                  </div>
                  <strong style={{ display: 'block', fontSize: '16px', color: 'var(--text-dark)', marginBottom: '4px' }}>
                    {event.name || 'TBD'}
                  </strong>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    Phone: {event.staff_phone || 'Contact department'}
                  </span>
                </div>
              </div>

              {/* Register Button */}
              <div style={{ borderTop: '1px solid var(--light-border)', paddingTop: '30px', textAlign: 'center' }}>
                <Link
                  to={`/register/${event.event_id}`}
                  className="btn-default"
                  style={{ textDecoration: 'none', display: 'inline-block', fontSize: '15px', padding: '14px 40px', borderRadius: '8px' }}
                >
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EventDetails;
