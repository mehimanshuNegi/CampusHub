import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import api from '../api';
import { ArrowRight, Code, Gamepad2, Music, Palette, BookOpen, User, Mail, Phone, MapPin, Calendar, HelpCircle } from 'lucide-react';
import EventImage from '../components/EventImage';

const LandingPage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setFeaturedEvents(res.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = [
    {
      id: 1,
      title: 'Technical Events',
      desc: 'Hackathons, cryptohunts, competitive coding, and quizzes to challenge your tech stack.',
      image: '/images/technical.jpg',
      icon: Code,
      color: '#4f46e5'
    },
    {
      id: 2,
      title: 'Gaming Events',
      desc: 'Team matchups, PUBG battles, and shooter tournaments to show your arena skills.',
      image: '/images/gaming.jpg',
      icon: Gamepad2,
      color: '#10b981'
    },
    {
      id: 3,
      title: 'On-Stage Events',
      desc: 'Dance battles, fashion shows, and musical face-offs spotlighting your stage presence.',
      image: '/images/onstage.jpg',
      icon: Music,
      color: '#f59e0b'
    },
    {
      id: 4,
      title: 'Off-Stage Events',
      desc: 'Cooking without fire, creative rangolis, movie-making, and artistic mehandi designs.',
      image: '/images/offstage.jpg',
      icon: Palette,
      color: '#ec4899'
    }
  ];

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(49, 46, 129, 0.85)), url(/images/cs03.jpg) center center/cover no-repeat',
        color: '#ffffff',
        padding: '160px 24px 100px 24px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{
            background: 'rgba(79, 70, 229, 0.15)',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            color: '#c7d2fe',
            fontSize: '13px',
            fontWeight: '600',
            padding: '6px 16px',
            borderRadius: '50px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'inline-block',
            marginBottom: '20px'
          }}>
            🚀 CAMPUSHUB EVENTS GATEWAY
          </span>
          <h1 style={{
            fontSize: '48px',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: '800',
            lineHeight: '1.2',
            letterSpacing: '-1px',
            marginBottom: '20px'
          }}>
            Simplify College Event Registrations & Management
          </h1>
          <p style={{
            fontSize: '17px',
            color: '#cbd5e1',
            marginBottom: '35px',
            lineHeight: '1.6',
            fontFamily: 'Inter, sans-serif',
            maxWidth: '650px',
            margin: '0 auto 35px auto'
          }}>
            Welcome to CampusHub. A clean, responsive college activities manager designed to help students discover and register for fests, coding events, gaming arenas, and cultural shows.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <a href="#categories" className="btn-default" style={{ textDecoration: 'none' }}>
              Explore Events
            </a>
            <Link to="/registered-event" style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.4)',
              color: '#ffffff',
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.25s ease'
            }}
              onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseOut={(e) => { e.target.style.background = 'transparent'; }}
            >
              View Registration
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section id="categories" style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', width: '100%' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '32px',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 800,
          color: 'var(--text-dark)',
          marginBottom: '10px'
        }}>
          Event Categories
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '15px', marginBottom: '50px' }}>
          Select a category to browse upcoming campus fests and tournaments
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          {categories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <div
                key={cat.id}
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
                <div style={{ overflow: 'hidden', position: 'relative', height: '160px', borderRadius: '12px 12px 0 0' }}>
                  <EventImage
                    src={cat.image}
                    alt={cat.title}
                    height={160}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: cat.color,
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}>
                    <IconComp size={18} />
                  </div>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 8px 0' }}>
                    {cat.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 16px 0', flexGrow: '1' }}>
                    {cat.desc}
                  </p>
                  <Link
                    to={`/events/type/${cat.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#4f46e5',
                      fontWeight: '600',
                      fontSize: '13px',
                      textDecoration: 'none'
                    }}
                  >
                    Browse Category
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Events Section */}
      <section style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--light-border)', borderBottom: '1px solid var(--light-border)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '32px',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            color: 'var(--text-dark)',
            marginBottom: '10px'
          }}>
            Featured Upcoming Events
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '15px', marginBottom: '50px' }}>
            Register now to lock in your slots for these hot events
          </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: 'var(--text-muted)' }}>Loading active events...</p>
            </div>
          ) : featuredEvents.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {featuredEvents.map((event) => {
                const badgeColors = { 1: '#4f46e5', 2: '#10b981', 3: '#f59e0b', 4: '#ec4899' };
                const badgeLabels = { 1: 'Technical', 2: 'Gaming', 3: 'On-Stage', 4: 'Off-Stage' };
                return (
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
                    <div style={{ height: '180px', overflow: 'hidden', position: 'relative', borderRadius: '12px 12px 0 0' }}>
                      <EventImage
                        src={`/${event.img_link.trim()}`}
                        alt={event.event_title}
                        height={180}
                      />
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: badgeColors[event.type_id] || '#4f46e5',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}>
                        {badgeLabels[event.type_id] || 'Event'}
                      </span>
                    </div>
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 10px 0' }}>
                        {event.event_title}
                      </h3>
                      <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px', alignItems: 'center' }}>
                        <Calendar size={14} />
                        <span>Date: {event.Date || 'Upcoming'}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 20px 0', flexGrow: '1' }}>
                        {event.description?.substring(0, 100) || 'Join us and compete against top talent.'}...
                      </p>
                      <Link
                        to={`/events/${event.event_id}`}
                        className="btn-default"
                        style={{ textDecoration: 'none', textAlign: 'center', fontSize: '13px', padding: '10px 20px' }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <p>No upcoming events available.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px', width: '100%' }}>
        <div style={{
          background: 'var(--bg-card)',
          padding: '40px',
          borderRadius: '12px',
          border: '1px solid var(--light-border)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <BookOpen size={26} color="#4f46e5" />
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
              About CampusHub
            </h2>
          </div>

          <p style={{ fontSize: '15px', color: 'var(--text-dark)', marginBottom: '16px', lineHeight: '1.7' }}>
            CampusHub is an activities portal designed to centralize college event registrations, coordinate listings, schedule details, and facilitator outreach.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--text-dark)', lineHeight: '1.7' }}>
            Students can browse scheduled events across Technical, Gaming, On-Stage, and Off-Stage categories, inspect scheduling logistics, and register instantly. The registration details, custom passwords, and sequential registration IDs are fully database-backed, illustrating core activities management structures cleanly.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px 24px', width: '100%' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '32px',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 800,
          color: 'var(--text-dark)',
          marginBottom: '40px'
        }}>
          Common Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <FAQItem
            question="How do I sign up for an event?"
            answer="Find your desired event, click 'View Details & Register', and fill out the registration form. You will receive an auto-generated Registration ID (e.g. CH-0001) which you should save along with the password you created."
          />
          <FAQItem
            question="Can I withdraw or cancel my registration?"
            answer="Yes. Go to 'Registered Event' in the navigation bar, enter your Registration ID and Password, and you can view your registration details or click 'Cancel Registration' to withdraw from the event slots."
          />
          <FAQItem
            question="Who coordinates these activities?"
            answer="Each category has dedicated student and staff coordinators. You can view their direct contact information and phone numbers on the Event Details page."
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ background: 'var(--bg-base)', borderTop: '1px solid var(--light-border)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '32px',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            color: 'var(--text-dark)',
            marginBottom: '10px'
          }}>
            Get In Touch
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '15px', marginBottom: '40px' }}>
            Have questions about the events or need help? Contact our student leads.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', justifyContent: 'center' }}>
            {/* Contact Card 1 */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--light-border)', padding: '24px', boxShadow: 'var(--shadow-sm)', maxWidth: '400px', margin: '0 auto', width: '100%' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} color="#4f46e5" />
                Himanshu Negi
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-muted)', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} color="#94a3b8" />
                  <span>himanshu@campushub.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} color="#94a3b8" />
                  <span>+91 9999999999</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="#94a3b8" />
                  <span>Bengaluru, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '8px',
      border: '1px solid var(--light-border)',
      padding: '20px',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-sm)'
    }} onClick={() => setIsOpen(!isOpen)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-dark)', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={18} color="#4f46e5" />
          {question}
        </h4>
        <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <p style={{ margin: '12px 0 0 26px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
          {answer}
        </p>
      )}
    </div>
  );
};

export default LandingPage;
