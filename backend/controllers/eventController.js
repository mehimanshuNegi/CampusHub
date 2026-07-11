import Event from '../models/Event.js';
import EventInfo from '../models/EventInfo.js';
import StudentCoordinator from '../models/StudentCoordinator.js';
import StaffCoordinator from '../models/StaffCoordinator.js';
import Participant from '../models/Participant.js';
import { activeSessions } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const type_id_param = req.params.type_id;
    const events = await Event.find({
      $and: [
        {
          $or: [
            { type_id: type_id_param },
            { type_id: parseInt(type_id_param) || 0 }
          ]
        },
        { isArchived: { $ne: true } },
        { isPublished: { $ne: false } }
      ]
    });
    
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
    const authHeader = req.headers['authorization'];
    let token = authHeader ? authHeader.split(' ')[1] : null;
    if (!token) {
      token = req.headers['x-auth-token'] || req.body.token || req.query.token;
    }
    const isAdmin = token && activeSessions[token] && activeSessions[token].role === 'admin';

    let query = {};
    if (!isAdmin) {
      query = {
        isArchived: { $ne: true },
        isPublished: { $ne: false }
      };
    }

    const events = await Event.find(query);
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
      const {
        event_title,
        event_price,
        img_link,
        type_id,
        Date: dateVal,
        time,
        location,
        sname,
        st_name,
        description,
        isPublished,
        isArchived,
        maxParticipants,
        registrationDeadline
      } = req.body;

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
        createdBy: req.user ? (req.user.role === 'admin' ? 'admin' : req.user.email) : 'admin',
        isPublished: isPublished !== undefined ? isPublished : true,
        isArchived: isArchived !== undefined ? isArchived : false,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null
      });

      await EventInfo.create({
        event_id,
        Date: dateVal,
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
    const {
      event_title,
      event_price,
      img_link,
      type_id,
      Date: dateVal,
      time,
      location,
      sname,
      st_name,
      description,
      isPublished,
      isArchived,
      maxParticipants,
      registrationDeadline
    } = req.body;

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
      type_id: parseInt(type_id) || 1,
      isPublished: isPublished !== undefined ? isPublished : event.isPublished,
      isArchived: isArchived !== undefined ? isArchived : event.isArchived,
      maxParticipants: maxParticipants !== undefined ? (maxParticipants ? parseInt(maxParticipants) : null) : event.maxParticipants,
      registrationDeadline: registrationDeadline !== undefined ? (registrationDeadline ? new Date(registrationDeadline) : null) : event.registrationDeadline
    });

    await EventInfo.updateOne({ event_id }, {
      Date: dateVal,
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

// POST /api/events/:event_id/duplicate
export const duplicateEvent = async (req, res) => {
  try {
    const { event_id } = req.params;
    const originalEvent = await Event.findOne({ event_id });
    if (!originalEvent) {
      return res.status(404).json({ message: 'Original event not found' });
    }

    const originalInfo = await EventInfo.findOne({ event_id });
    const originalStudent = await StudentCoordinator.findOne({ event_id });
    const originalStaff = await StaffCoordinator.findOne({ event_id });

    const newEventId = await generateNextEventId();

    await Event.create({
      event_id: newEventId,
      event_title: `${originalEvent.event_title} (Copy)`,
      description: originalEvent.description,
      event_price: originalEvent.event_price,
      img_link: originalEvent.img_link,
      type_id: originalEvent.type_id,
      createdBy: req.user ? (req.user.role === 'admin' ? 'admin' : req.user.email) : originalEvent.createdBy,
      isPublished: false, // Default to unpublished so user can check
      isArchived: false,
      maxParticipants: originalEvent.maxParticipants,
      registrationDeadline: originalEvent.registrationDeadline
    });

    if (originalInfo) {
      await EventInfo.create({
        event_id: newEventId,
        Date: originalInfo.Date,
        time: originalInfo.time,
        location: originalInfo.location
      });
    }

    if (originalStudent) {
      await StudentCoordinator.create({
        sid: newEventId,
        st_name: originalStudent.st_name,
        phone: originalStudent.phone,
        event_id: newEventId
      });
    }

    if (originalStaff) {
      await StaffCoordinator.create({
        stid: newEventId,
        name: originalStaff.name,
        phone: originalStaff.phone,
        event_id: newEventId
      });
    }

    res.status(201).json({ message: 'Event duplicated successfully!', event_id: newEventId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/events/upload
export const uploadBanner = async (req, res) => {
  try {
    const { imageBase64, imageName } = req.body;
    if (!imageBase64 || !imageName) {
      return res.status(400).json({ message: 'Image data and name are required' });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    const ext = path.extname(imageName) || '.jpg';
    const filename = `banner-${Date.now()}${ext}`;

    const targetDir = path.join(__dirname, '../../frontend/public/images/uploads');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, filename);
    fs.writeFileSync(filePath, buffer);

    res.json({
      message: 'Banner uploaded successfully',
      imageUrl: `images/uploads/${filename}`
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed: ' + error.message });
  }
};
