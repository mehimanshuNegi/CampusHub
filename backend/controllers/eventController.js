import Event from '../models/Event.js';
import EventInfo from '../models/EventInfo.js';
import StudentCoordinator from '../models/StudentCoordinator.js';
import StaffCoordinator from '../models/StaffCoordinator.js';
import Participant from '../models/Participant.js';

// Helper function to dynamically generate sequential unique event IDs
const generateNextEventId = async () => {
  const events = await Event.find({});
  if (events.length === 0) {
    return 'CH001';
  }

  let maxNum = 0;
  events.forEach((e) => {
    if (typeof e.event_id === 'string') {
      const match = e.event_id.match(/^CH(\d+)$/);
      if (match) {
        const num = parseInt(match[1]);
        if (num > maxNum) {
          maxNum = num;
        }
      }
    }
  });

  const nextNum = maxNum + 1;
  return 'CH' + String(nextNum).padStart(3, '0');
};

export const getEventById = async (req, res) => {
  try {
    const event_id = req.params.event_id;
    const event = await Event.findOne({ event_id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const info = await EventInfo.findOne({ event_id });
    const student = await StudentCoordinator.findOne({ event_id });
    const staff = await StaffCoordinator.findOne({ event_id });
    const participantsCount = await Participant.countDocuments({ event_id });

    res.json({
      ...event.toObject(),
      participents: participantsCount,
      Date: info ? info.Date : '',
      time: info ? info.time : '',
      location: info ? info.location : '',
      st_name: student ? student.st_name : '',
      st_phone: student ? student.phone : '',
      name: staff ? staff.name : '',
      staff_phone: staff ? staff.phone : ''
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventsByType = async (req, res) => {
  try {
    const type_id = parseInt(req.params.type_id);
    const events = await Event.find({ type_id });
    
    const detailedEvents = await Promise.all(
      events.map(async (event) => {
        const info = await EventInfo.findOne({ event_id: event.event_id });
        const student = await StudentCoordinator.findOne({ event_id: event.event_id });
        const staff = await StaffCoordinator.findOne({ event_id: event.event_id });
        const participantsCount = await Participant.countDocuments({ event_id: event.event_id });
        
        return {
          ...event.toObject(),
          participents: participantsCount,
          Date: info ? info.Date : '',
          time: info ? info.time : '',
          location: info ? info.location : '',
          st_name: student ? student.st_name : '',
          st_phone: student ? student.phone : '',
          name: staff ? staff.name : '',
          staff_phone: staff ? staff.phone : ''
        };
      })
    );
    res.json(detailedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    const detailedEvents = await Promise.all(
      events.map(async (event) => {
        const info = await EventInfo.findOne({ event_id: event.event_id });
        const student = await StudentCoordinator.findOne({ event_id: event.event_id });
        const staff = await StaffCoordinator.findOne({ event_id: event.event_id });
        const participantsCount = await Participant.countDocuments({ event_id: event.event_id });
        
        return {
          ...event.toObject(),
          participents: participantsCount,
          Date: info ? info.Date : '',
          time: info ? info.time : '',
          location: info ? info.location : '',
          st_name: student ? student.st_name : '',
          st_phone: student ? student.phone : '',
          name: staff ? staff.name : '',
          staff_phone: staff ? staff.phone : ''
        };
      })
    );
    res.json(detailedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Coordinator views only their owned events
export const getOwnedEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.email });
    const detailedEvents = await Promise.all(
      events.map(async (event) => {
        const info = await EventInfo.findOne({ event_id: event.event_id });
        const student = await StudentCoordinator.findOne({ event_id: event.event_id });
        const staff = await StaffCoordinator.findOne({ event_id: event.event_id });
        const participantsCount = await Participant.countDocuments({ event_id: event.event_id });
        
        return {
          ...event.toObject(),
          participents: participantsCount,
          Date: info ? info.Date : '',
          time: info ? info.time : '',
          location: info ? info.location : '',
          st_name: student ? student.st_name : '',
          st_phone: student ? student.phone : '',
          name: staff ? staff.name : '',
          staff_phone: staff ? staff.phone : ''
        };
      })
    );
    res.json(detailedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  let retries = 5;
  while (retries > 0) {
    try {
      const { event_title, event_price, img_link, type_id, Date, time, location, sname, st_name, description } = req.body;

      // Auto-generate unique Event ID inside backend
      const event_id = await generateNextEventId();

      await Event.create({
        event_id,
        event_title,
        description: description || 'Join us for this exciting campus activity and showcase your skills!',
        event_price: parseFloat(event_price) || 0,
        img_link: img_link || 'images/cs03.jpg',
        type_id: parseInt(type_id) || 1,
        participents: 0,
        createdBy: req.user ? (req.user.role === 'admin' ? 'admin' : req.user.email) : 'admin'
      });

      await EventInfo.create({
        event_id,
        Date,
        time,
        location
      });

      await StudentCoordinator.create({
        sid: event_id,
        st_name,
        phone: null,
        event_id
      });

      await StaffCoordinator.create({
        stid: event_id,
        name: sname,
        phone: null,
        event_id
      });

      return res.status(201).json({ message: 'Event Inserted Successfully!', event_id });
    } catch (error) {
      if (error.code === 11000) {
        retries--;
        if (retries === 0) {
          return res.status(500).json({ message: 'Failed to generate unique Event ID due to collisions' });
        }
        continue; // retry generation
      }
      return res.status(500).json({ message: error.message });
    }
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event_id = req.params.event_id;

    const event = await Event.findOne({ event_id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user && req.user.role === 'coordinator' && event.createdBy !== req.user.email) {
      return res.status(403).json({ message: 'Access Denied. You do not own this event.' });
    }

    await Event.deleteOne({ event_id });
    await EventInfo.deleteOne({ event_id });
    await StudentCoordinator.deleteOne({ event_id });
    await StaffCoordinator.deleteOne({ event_id });
    await Participant.deleteMany({ event_id });

    res.json({ message: 'Event Deleted Successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event_id = req.params.event_id;
    const { event_title, event_price, img_link, type_id, Date, time, location, sname, st_name, description } = req.body;

    const event = await Event.findOne({ event_id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (req.user && req.user.role === 'coordinator' && event.createdBy !== req.user.email) {
      return res.status(403).json({ message: 'Access Denied. You do not own this event.' });
    }

    await Event.updateOne({ event_id }, {
      event_title,
      description,
      event_price: parseFloat(event_price) || 0,
      img_link: img_link || 'images/cs03.jpg',
      type_id: parseInt(type_id) || 1
    });

    await EventInfo.updateOne({ event_id }, {
      Date,
      time,
      location
    });

    if (st_name !== undefined) {
      await StudentCoordinator.updateOne({ event_id }, { st_name });
    }

    if (sname !== undefined) {
      await StaffCoordinator.updateOne({ event_id }, { name: sname });
    }

    res.json({ message: 'Event Updated Successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
