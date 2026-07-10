import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import AdminNavbar from '../components/AdminNavbar';
import CoordinatorNavbar from '../components/CoordinatorNavbar';
import Footer from '../components/Footer';
import { Calendar, Clock, MapPin, Tag, User, ShieldAlert, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import EventImage from '../components/EventImage';

const AdminEventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = localStorage.getItem('role') || 'admin';
  const email = localStorage.getItem('email') || '';

  const fetchEventDetails = async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data);
    } catch (err) {
      setError('Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event? This will remove all schedules, coordinators, and registrations.')) {
      try {
        await api.delete(`/events/${eventId}`);
        alert('Event deleted successfully.');
        navigate(role === 'admin' ? '/admin' : '/coordinator/dashboard');
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting event.');
      }
    }
  };

  const categoryLabels = { 1: 'Technical', 2: 'Gaming', 3: 'On-Stage', 4: 'Off-Stage' };
  const categoryColors = { 1: '#4f46e5', 2: '#10b981', 3: '#f59e0b', 4: '#ec4899' };
  const dashboardPath = role === 'admin' ? '/admin' : '/coordinator/dashboard';

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {role === 'admin' ? <AdminNavbar /> : <CoordinatorNavbar />}
      
      <div style={{ flexGrow: '1', maxWidth: '900px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <Link to={dashboardPath} style={{
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
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>Back to Dashboard</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Loading event details...</h3>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ color: '#ef4444', margin: '0 0 10px 0' }}>{error}</h3>
            <Link to={dashboardPath} className="btn-default" style={{ textDecoration: 'none', marginTop: '15px', display: 'inline-block' }}>Go back to dashboard</Link>
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '8px',
            border: '1px solid var(--light-border)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden'
          }}>
            {/* Event Banner */}
            <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
              <EventImage
                src={`/${event.img_link.trim()}`}
                alt={event.event_title}
                height={300}
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

            {/* Event Details Content */}
            <div style={{ padding: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 6px 0' }}>
                    {event.event_title}
                  </h1>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Event ID: {event.event_id}</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(79, 70, 229, 0.08)', color: '#4f46e5', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '15px' }}>
                    <Tag size={16} />
                    <span>Fee: ₹{event.event_price}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '700' }}>
                    👥 Registered Participants: {event.participents}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '35px' }}>
                <h3 style={{ fontSize: '18px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 12px 0' }}>
                  Event Description
                </h3>
                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0 }}>
                  {event.description}
                </p>
              </div>

              {/* Logistics Grid */}
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
                    <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Location / Venue</span>
                    <strong style={{ fontSize: '15px', color: 'var(--text-dark)' }}>{event.location || 'TBA'}</strong>
                  </div>
                </div>
              </div>

              {/* Coordinators Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {/* Student Lead */}
                <div style={{ border: '1px solid var(--light-border)', borderRadius: '8px', padding: '20px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)', margin: '0 0 12px 0' }}>
                    <User size={16} color="#4f46e5" />
                    Student Lead
                  </h4>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    <div style={{ marginBottom: '6px' }}>Name: <strong style={{ color: 'var(--text-dark)' }}>{event.st_name || 'N/A'}</strong></div>
                    <div>Phone: <strong style={{ color: 'var(--text-dark)' }}>{event.st_phone || 'None'}</strong></div>
                  </div>
                </div>

                {/* Staff Coordinator */}
                <div style={{ border: '1px solid var(--light-border)', borderRadius: '8px', padding: '20px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: '700', color: 'var(--text-dark)', margin: '0 0 12px 0' }}>
                    <ShieldAlert size={16} color="#4f46e5" />
                    Staff Mentor
                  </h4>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    <div style={{ marginBottom: '6px' }}>Name: <strong style={{ color: 'var(--text-dark)' }}>{event.name || 'N/A'}</strong></div>
                    <div>Phone: <strong style={{ color: 'var(--text-dark)' }}>{event.staff_phone || 'None'}</strong></div>
                  </div>
                </div>
              </div>

              {/* Admin Actions Button Layout */}
              {(() => {
                // isOwner: admin always has access; coordinator only if they created the event
                const isOwner = role === 'admin' || event.createdBy === email;
                return (
                  <div style={{ display: 'flex', gap: '15px', borderTop: '1px solid var(--light-border)', paddingTop: '30px', flexWrap: 'wrap' }}>
                    <Link to={dashboardPath} className="btn-default" style={{ background: 'var(--bg-card)', border: '1px solid var(--light-border)', color: 'var(--text-dark)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flexGrow: '1', padding: '12px' }}>
                      <ArrowLeft size={16} />
                      Dashboard
                    </Link>
                    {isOwner && (
                      <>
                        <Link to={role === 'admin' ? `/admin/events/update/${event.event_id}` : `/coordinator/events/update/${event.event_id}`} className="btn-default" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', flexGrow: '1', padding: '12px' }}>
                          <Edit size={16} />
                          Edit Event
                        </Link>
                        <button
                          type="button"
                          onClick={handleDelete}
                          style={{
                            background: '#ef4444',
                            border: 'none',
                            color: '#ffffff',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            flexGrow: '1'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#dc2626'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = '#ef4444'; }}
                        >
                          <Trash2 size={16} />
                          Delete Event
                        </button>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminEventDetails;
