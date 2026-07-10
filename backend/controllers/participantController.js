import Participant from '../models/Participant.js';
import Event from '../models/Event.js';
import EventInfo from '../models/EventInfo.js';

// Helper function to generate sequential registration IDs in the format CH-XXXX
const generateNextRegistrationId = async () => {
  const participants = await Participant.find({});
  if (participants.length === 0) {
    return 'CH-0001';
  }

  let maxNum = 0;
  participants.forEach((p) => {
    if (typeof p.registration_id === 'string') {
      const match = p.registration_id.match(/^CH-(\d+)$/);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    }
  });

  const nextNum = maxNum + 1;
  return 'CH-' + String(nextNum).padStart(4, '0');
};

export const registerParticipant = async (req, res) => {
  try {
    const { name, branch, sem, email, phone, college, event_id, registration_password, transactionId } = req.body;

    if (!event_id || !name || !email || !registration_password) {
      return res.status(400).json({ message: 'Missing required registration details' });
    }

    const event = await Event.findOne({ event_id });
    if (!event) {
      return res.status(404).json({ message: 'Selected event not found' });
    }

    const isFree = !event.event_price || Number(event.event_price) === 0;

    // For paid events, transaction ID is required
    if (!isFree && !transactionId) {
      return res.status(400).json({ message: 'Transaction ID is required for paid events' });
    }

    const registration_id = await generateNextRegistrationId();

    const participant = await Participant.create({
      registration_id,
      registration_password,
      event_id,
      name,
      branch,
      sem: parseInt(sem) || 1,
      email,
      phone,
      college,
      transactionId: isFree ? null : transactionId,
      paymentStatus: isFree ? 'Verified' : 'Pending'
    });

    res.status(201).json({
      message: 'Registered Successfully!',
      registration_id: participant.registration_id,
      event_title: event.event_title,
      name: participant.name,
      paymentStatus: participant.paymentStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyRegistrationDetails = async (req, res) => {
  try {
    const { registration_id, registration_password } = req.body;

    if (!registration_id || !registration_password) {
      return res.status(400).json({ message: 'Please enter both Registration ID and Password' });
    }

    const participant = await Participant.findOne({ registration_id });
    if (!participant) {
      return res.status(404).json({ message: 'Registration ID not found' });
    }

    if (participant.registration_password !== registration_password) {
      return res.status(400).json({ message: 'Incorrect registration password' });
    }

    const event = await Event.findOne({ event_id: participant.event_id });
    const info = await EventInfo.findOne({ event_id: participant.event_id });

    res.json({
      registration_id: participant.registration_id,
      name: participant.name,
      branch: participant.branch,
      sem: participant.sem,
      email: participant.email,
      phone: participant.phone,
      college: participant.college,
      event_title: event ? event.event_title : 'Unknown Event',
      event_date: info ? info.Date : 'Upcoming',
      event_venue: info ? info.location : 'Campus Venue',
      createdAt: participant.createdAt ? new Date(participant.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      // Payment fields
      transactionId: participant.transactionId,
      paymentStatus: participant.paymentStatus,
      event_price: event ? event.event_price : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelParticipantRegistration = async (req, res) => {
  try {
    const { registration_id, registration_password } = req.body;

    if (!registration_id || !registration_password) {
      return res.status(400).json({ message: 'Please enter both Registration ID and Password' });
    }

    const participant = await Participant.findOne({ registration_id });
    if (!participant) {
      return res.status(404).json({ message: 'Registration ID not found' });
    }

    if (participant.registration_password !== registration_password) {
      return res.status(400).json({ message: 'Incorrect registration password' });
    }

    await Participant.deleteOne({ registration_id });

    res.json({ message: 'Registration cancelled successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getParticipantDetails = async (req, res) => {
  try {
    let participants = [];
    if (req.user && req.user.role === 'coordinator') {
      const ownedEvents = await Event.find({ createdBy: req.user.email });
      const ownedEventIds = ownedEvents.map(e => e.event_id);
      participants = await Participant.find({ event_id: { $in: ownedEventIds } });
    } else {
      participants = await Participant.find({});
    }

    const details = await Promise.all(
      participants.map(async (part) => {
        const event = await Event.findOne({ event_id: part.event_id });
        return {
          registration_id: part.registration_id,
          name: part.name,
          branch: part.branch,
          sem: part.sem,
          email: part.email,
          phone: part.phone,
          college: part.college,
          event_title: event ? event.event_title : 'Unknown Event',
          event_price: event ? event.event_price : 0,
          transactionId: part.transactionId,
          paymentStatus: part.paymentStatus
        };
      })
    );

    const sortedDetails = details.sort((a, b) => a.event_title.localeCompare(b.event_title));
    res.json(sortedDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all payment-pending registrations (for payment verification page)
export const getPaymentDetails = async (req, res) => {
  try {
    let participants = [];
    if (req.user && req.user.role === 'coordinator') {
      // Coordinators only see payments for their own events
      const ownedEvents = await Event.find({ createdBy: req.user.email });
      const ownedEventIds = ownedEvents.map(e => e.event_id);
      // Only show paid events (paymentStatus != Verified for free)
      participants = await Participant.find({
        event_id: { $in: ownedEventIds }
      });
    } else {
      // Admin sees all
      participants = await Participant.find({});
    }

    const details = await Promise.all(
      participants.map(async (part) => {
        const event = await Event.findOne({ event_id: part.event_id });
        // Only include paid events (price > 0)
        if (!event || !event.event_price || Number(event.event_price) === 0) return null;
        return {
          registration_id: part.registration_id,
          name: part.name,
          email: part.email,
          event_id: part.event_id,
          event_title: event ? event.event_title : 'Unknown Event',
          event_price: event ? event.event_price : 0,
          transactionId: part.transactionId,
          paymentStatus: part.paymentStatus,
          createdAt: part.createdAt
        };
      })
    );

    // Filter out nulls (free events) and sort by date desc
    const filtered = details
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payment status (Verify or Reject)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { registration_id } = req.params;
    const { paymentStatus } = req.body;

    if (!['Verified', 'Rejected'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status value' });
    }

    const participant = await Participant.findOne({ registration_id });
    if (!participant) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // If coordinator, verify they own the event
    if (req.user && req.user.role === 'coordinator') {
      const event = await Event.findOne({ event_id: participant.event_id });
      if (!event || event.createdBy !== req.user.email) {
        return res.status(403).json({ message: 'Access denied: You can only verify payments for your own events' });
      }
    }

    participant.paymentStatus = paymentStatus;
    await participant.save();

    res.json({ message: `Payment ${paymentStatus} successfully`, paymentStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
