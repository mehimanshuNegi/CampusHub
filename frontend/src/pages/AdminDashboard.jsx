import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import AdminNavbar from '../components/AdminNavbar';
import Footer from '../components/Footer';
import { Plus, Trash2, CalendarRange, Eye, Users, ShieldAlert, Award } from 'lucide-react';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching admin events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This will remove all coordinators and registration records.')) {
      try {
        const res = await api.delete(`/events/${eventId}`);
        alert(res.data.message || 'Event Deleted Successfully');
        fetchEvents();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting record');
      }
    }
  };

  const totalEventsCount = events.length;
  const registeredParticipantsCount = events.reduce((sum, e) => sum + (e.participents || 0), 0);
  const totalCoordinatorsCount = totalEventsCount * 2;
  const totalCategoriesCount = 4;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminNavbar />
      
      <div style={{ flexGrow: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 4px 0', textAlign: 'left' }}>
              CampusHub Dashboard
            </h1>
            <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '15px' }}>
              Manage event listings, venues, prices, and coordinators
            </p>
          </div>
          <Link to="/admin/events/create" className="btn-default" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <Plus size={18} />
            Create Event
          </Link>
        </div>

        {/* Dynamic Metric Widgets Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '35px'
        }}>
          {/* Stat 1: Total Events */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '12px', borderRadius: '8px' }}>
              <CalendarRange size={24} color="#4f46e5" />
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Total Events</span>
              <strong style={{ fontSize: '24px', color: 'var(--text-dark)' }}>{totalEventsCount}</strong>
            </div>
          </div>

          {/* Stat 2: Registered Participants */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px' }}>
              <Users size={24} color="#10b981" />
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Registrations</span>
              <strong style={{ fontSize: '24px', color: 'var(--text-dark)' }}>{registeredParticipantsCount}</strong>
            </div>
          </div>

          {/* Stat 3: Coordinators */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '8px' }}>
              <ShieldAlert size={24} color="#f59e0b" />
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Coordinators</span>
              <strong style={{ fontSize: '24px', color: 'var(--text-dark)' }}>{totalCoordinatorsCount}</strong>
            </div>
          </div>

          {/* Stat 4: Categories */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '12px', borderRadius: '8px' }}>
              <Award size={24} color="#ec4899" />
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Categories</span>
              <strong style={{ fontSize: '24px', color: 'var(--text-dark)' }}>{totalCategoriesCount}</strong>
            </div>
          </div>
        </div>

        {/* Dashboard Table Panel */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', padding: '30px' }}>
          <h2 style={{ fontSize: '20px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarRange size={20} color="#4f46e5" />
            Active Events Schedule
          </h2>
          
          {loading ? (
            <h3 style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Loading events details...</h3>
          ) : events.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-hover" style={{ margin: '0', border: 'none', boxShadow: 'none', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Participants</th>
                    <th>Price</th>
                    <th>Student Coordinator</th>
                    <th>Staff Coordinator</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Venue</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.event_id}>
                      <td style={{ fontWeight: '600', color: '#4f46e5' }}>{event.event_title}</td>
                      <td style={{ fontWeight: '600' }}>{event.participents}</td>
                      <td>₹{event.event_price}</td>
                      <td>{event.st_name}</td>
                      <td>{event.name}</td>
                      <td>{event.Date}</td>
                      <td>{event.time}</td>
                      <td>{event.location}</td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <Link
                            to={`/admin/events/${event.event_id}`}
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--light-border)',
                              color: 'var(--text-muted)',
                              padding: '5px 8px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                            title="Preview Event"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(event.event_id)}
                            style={{
                              background: 'transparent',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#ef4444',
                              padding: '5px 8px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            title="Delete Event"
                            onMouseOver={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <h3>No events scheduled</h3>
              <p>Create a new event using the button above.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
