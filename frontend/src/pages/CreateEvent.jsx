import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import AdminNavbar from '../components/AdminNavbar';
import CoordinatorNavbar from '../components/CoordinatorNavbar';
import Footer from '../components/Footer';
import { PlusCircle, ArrowLeft } from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role') || 'admin';
  const [formData, setFormData] = useState({
    event_title: '',
    event_price: '',
    img_link: '',
    type_id: '',
    Date: '',
    time: '',
    location: '',
    sname: '',
    st_name: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/events', formData);
      alert(res.data.message || 'Event Inserted Successfully!');
      navigate(role === 'admin' ? '/admin' : '/coordinator/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Error inserting event. Event might already exist.');
    }
  };

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {role === 'admin' ? <AdminNavbar /> : <CoordinatorNavbar />}

      <div style={{ flexGrow: 1, maxWidth: '700px', margin: '0 auto', width: '100%', padding: '120px 24px 60px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '35px' }}>
          <Link to={role === 'admin' ? '/admin' : '/coordinator/dashboard'} style={{
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
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontSize: '32px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-dark)', margin: '0', textAlign: 'left' }}>
              Create New Event
            </h1>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '15px' }}>
              Add a new activity to the campus program catalog
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ margin: '0', border: '1px solid var(--light-border)', boxShadow: 'var(--shadow-md)', borderRadius: '12px', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Event Category Type</label>
                <select
                  name="type_id"
                  className="form-control"
                  value={formData.type_id}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', background: 'var(--bg-card)', color: 'var(--text-dark)' }}
                >
                  <option value="">Select Category</option>
                  <option value="1">Technical Events</option>
                  <option value="2">Gaming Events</option>
                  <option value="3">On Stage Events</option>
                  <option value="4">Off Stage Events</option>
                </select>
              </div>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', justifycontent: 'center' }}>
                <p style={{ margin: '25px 0 0 0', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
                  ℹ️ Unique Event ID will be generated sequentially (e.g. CH015).
                </p>
              </div>
            </div>

            <div>
              <label style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Event Title</label>
              <input
                type="text"
                name="event_title"
                className="form-control"
                placeholder="e.g. Hackathon 2026"
                value={formData.event_title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Event Description</label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Describe what participants will do in this event, rules, etc."
                value={formData.description}
                onChange={handleChange}
                required
                style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Registration Fee (₹)</label>
                <input
                  type="number"
                  name="event_price"
                  className="form-control"
                  placeholder="e.g. 150"
                  value={formData.event_price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Image Path</label>
                <input
                  type="text"
                  name="img_link"
                  className="form-control"
                  placeholder="e.g. images/technical.jpg"
                  value={formData.img_link}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Date</label>
                <input
                  type="date"
                  name="Date"
                  className="form-control"
                  value={formData.Date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Time</label>
                <input
                  type="text"
                  name="time"
                  className="form-control"
                  placeholder="e.g. 10.00am"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Venue Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="e.g. Auditorium / Lab 020"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Staff Coordinator Name</label>
                <input
                  type="text"
                  name="sname"
                  className="form-control"
                  placeholder="Enter staff name"
                  value={formData.sname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontWeight: '600', color: 'var(--text-dark)' }}>Student Coordinator Name</label>
                <input
                  type="text"
                  name="st_name"
                  className="form-control"
                  placeholder="Enter student name"
                  value={formData.st_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: '15px', display: 'flex', gap: '15px' }}>
              <button type="submit" className="btn-default" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <PlusCircle size={18} />
                Publish Event
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreateEvent;
