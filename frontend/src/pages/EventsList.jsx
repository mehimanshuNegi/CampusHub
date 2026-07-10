import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import EventImage from '../components/EventImage';

const EventsList = () => {
  const { typeId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`/api/events/type/${typeId}`);
        setEvents(res.data);
      } catch (error) {
        console.error('Error fetching events by type:', error);
      } finally {
        setLoading(false);
      }
    };

    if (typeId) {
      fetchEvents();
    }
  }, [typeId]);

  const categoryTitles = {
    1: 'Technical Events',
    2: 'Gaming Events',
    3: 'On-Stage Events',
    4: 'Off-Stage Events'
  };

  const badgeColors = {
    1: '#4f46e5',
    2: '#10b981',
    3: '#f59e0b',
    4: '#ec4899'
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <div style={{ flexGrow: '1', maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
          <Link to="/" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--light-border)',
            color: 'var(--text-dark)',
            padding: '10px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            textDecoration: 'none'
          }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 800,
              color: 'var(--text-dark)',
              margin: '0 0 4px 0',
              textAlign: 'left'
            }}>
              {categoryTitles[typeId] || 'Campus Activities'}
            </h1>
            <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '15px' }}>
              Select an event to view full details and register
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Loading active events...</h3>
          </div>
        ) : events.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {events.map((event) => (
              <div
                key={event.event_id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--light-border)',
                  boxShadow: 'var(--shadow-md)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative', borderRadius: '12px 12px 0 0' }}>
                  <EventImage
                    src={`/${event.img_link.trim()}`}
                    alt={event.event_title}
                    height={200}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: badgeColors[typeId] || '#4f46e5',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {categoryTitles[typeId]?.split(' ')[0] || 'Event'}
                  </span>
                </div>
                
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: '1', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      color: 'var(--text-dark)',
                      margin: '0 0 16px 0'
                    }}>
                      {event.event_title}
                    </h2>
                    
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      color: 'var(--text-muted)',
                      fontSize: '14px',
                      marginBottom: '20px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} color="#4f46e5" />
                        <span><strong>Date:</strong> {event.Date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={16} color="#4f46e5" />
                        <span><strong>Venue:</strong> {event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Link
                      to={`/events/${event.event_id}`}
                      className="btn-default"
                      style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                    >
                      View Details & Register
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ color: 'var(--text-dark)', margin: '0 0 10px 0' }}>No upcoming events available.</h3>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 20px 0' }}>Check back later or view other categories.</p>
            <Link to="/" className="btn-default" style={{ textDecoration: 'none' }}>Go back home</Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default EventsList;
