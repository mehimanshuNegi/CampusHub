import express from 'express';
import {
  getEventsByType,
  getAllEvents,
  getEventById,
  getOwnedEvents,
  createEvent,
  deleteEvent,
  updateEvent
} from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public event browsing routes
router.get('/type/:type_id', getEventsByType);
router.get('/', getAllEvents);

// Coordinator owned events (placed before parameter matches to prevent param collision)
router.get('/owned', authenticateToken(['coordinator']), getOwnedEvents);

// Individual event logistics details
router.get('/:event_id', getEventById);

// Protected mutation actions
router.post('/', authenticateToken(['admin', 'coordinator']), createEvent);
router.delete('/:event_id', authenticateToken(['admin', 'coordinator']), deleteEvent);
router.put('/:event_id', authenticateToken(['admin', 'coordinator']), updateEvent);

export default router;
