import express from 'express';
import {
  submitCoordinatorRequest,
  getCoordinatorRequests,
  approveCoordinatorRequest,
  rejectCoordinatorRequest,
  getCoordinatorProfile,
  updateCoordinatorProfile
} from '../controllers/clubCoordinatorController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public: Submit a coordinator application request
router.post('/request', submitCoordinatorRequest);

// Protected Admin: Manage application requests
router.get('/requests', authenticateToken(['admin']), getCoordinatorRequests);
router.post('/requests/:id/approve', authenticateToken(['admin']), approveCoordinatorRequest);
router.post('/requests/:id/reject', authenticateToken(['admin']), rejectCoordinatorRequest);

// Protected Coordinator: Profile management
router.get('/profile', authenticateToken(['coordinator']), getCoordinatorProfile);
router.put('/profile', authenticateToken(['coordinator']), updateCoordinatorProfile);

export default router;
