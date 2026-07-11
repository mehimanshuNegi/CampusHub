import express from 'express';
import {
  getEventsByType,
  getAllEvents,
  getEventById,
  getOwnedEvents,
  createEvent,
  deleteEvent,
  updateEvent,
  duplicateEvent,
  uploadBanner
} from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public event browsing routes
router.get('/type/:type_id', getEventsByType);
router.get('/', getAllEvents);

// Coordinator owned events (placed before parameter matches to prevent param collision)
router.get('/owned', authenticateToken(['coordinator']), getOwnedEvents);

// Upload banner (placed before individual details to prevent param collision)
router.post('/upload', authenticateToken(['admin', 'coordinator']), uploadBanner);

// Individual event logistics details
router.get('/:event_id', getEventById);

// Protected mutation actions
router.post('/', authenticateToken(['admin', 'coordinator']), createEvent);
router.delete('/:event_id', authenticateToken(['admin', 'coordinator']), deleteEvent);
router.put('/:event_id', authenticateToken(['admin', 'coordinator']), updateEvent);
router.post('/:event_id/duplicate', authenticateToken(['admin', 'coordinator']), duplicateEvent);

export default router;
