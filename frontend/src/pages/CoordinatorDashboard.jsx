import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import CoordinatorNavbar from '../components/CoordinatorNavbar';
import Footer from '../components/Footer';
import { Plus, Trash2, CalendarRange, Eye, Users, Award, Edit, User, CalendarDays } from 'lucide-react';

const CoordinatorDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const coordinatorName = localStorage.getItem('name') || 'Coordinator';

  const fetchOwnedEvents = async () => {
    try {
      const res = await axios.get('/api/events/owned');
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching owned events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnedEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This will remove all registrations and schedules.')) {
      try {
        const res = await axios.delete(`/api/events/${eventId}`);
        alert(res.data.message || 'Event Deleted successfully!');
        fetchOwnedEvents();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting event.');
      }
    }
  };

  const totalEventsCount = events.length;
  const registeredParticipantsCount = events.reduce((sum, e) => sum + (e.participents || 0), 0);

  // Filter list to only show upcoming events
  const upcomingEvents = events.filter((e) => {
    if (!e.Date) return true; // Show undated events just in case
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(e.Date);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });

  const upcomingEventsCount = upcomingEvents.length;

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CoordinatorNavbar />
      
      <div style={{ flexGrow: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        
        {/* Welcome Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0 0 4px 0', textAlign: 'left' }}>
              Welcome, {coordinatorName}
            </h1>
            <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '15px' }}>
              Manage your upcoming club events and view registrations
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/coordinator/profile" className="btn-default" style={{ background: 'var(--bg-card)', border: '1px solid var(--light-border)', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              <User size={16} />
              Profile
            </Link>
            <Link to="/coordinator/students" className="btn-default" style={{ background: 'var(--bg-card)', border: '1px solid var(--light-border)', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              <Users size={16} />
              View Participants
            </Link>
            <Link to="/coordinator/events/create" className="btn-default" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              <Plus size={16} />
              Create Event
            </Link>
          </div>
        </div>

        {/* Coordinator Metric Widgets Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '35px'
        }}>
          {/* Stat 1: Total Events */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '14px', borderRadius: '8px' }}>
              <CalendarRange size={26} color="#4f46e5" />
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Total Events</span>
              <strong style={{ fontSize: '28px', color: 'var(--text-dark)' }}>{totalEventsCount}</strong>
            </div>
          </div>

          {/* Stat 2: Total Registrations */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '14px', borderRadius: '8px' }}>
              <Users size={26} color="#10b981" />
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Total Registrations</span>
              <strong style={{ fontSize: '28px', color: 'var(--text-dark)' }}>{registeredParticipantsCount}</strong>
            </div>
          </div>

          {/* Stat 3: Upcoming Events */}
          <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '14px', borderRadius: '8px' }}>
              <CalendarDays size={26} color="#f59e0b" />
            </div>
            <div>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Upcoming Events</span>
              <strong style={{ fontSize: '28px', color: 'var(--text-dark)' }}>{upcomingEventsCount}</strong>
            </div>
          </div>
        </div>

        {/* Dashboard Table Panel */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', padding: '30px' }}>
          <h2 style={{ fontSize: '20px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#4f46e5" />
            Upcoming Events
          </h2>

          {loading ? (
            <h3 style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Loading events details...</h3>
          ) : upcomingEvents.length > 0 ? (
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
                  {upcomingEvents.map((event) => (
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
                            to={`/coordinator/events/${event.event_id}`}
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
                            title="Preview Details"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to={`/coordinator/events/update/${event.event_id}`}
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
                            title="Edit Event"
                          >
                            <Edit size={16} />
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
              <h3>No upcoming events found</h3>
              <p>Create a new event using the button above to schedule your next activity.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CoordinatorDashboard;
