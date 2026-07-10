import express from 'express';
import {
  registerParticipant,
  verifyRegistrationDetails,
  cancelParticipantRegistration,
  getParticipantDetails,
  getPaymentDetails,
  updatePaymentStatus
} from '../controllers/participantController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public registration form workflows
router.post('/', registerParticipant);
router.post('/verify', verifyRegistrationDetails);
router.post('/cancel', cancelParticipantRegistration);

// Protected: fetch participant listings
router.get('/details', authenticateToken(['admin', 'coordinator']), getParticipantDetails);

// Protected: Payment verification endpoints
router.get('/payments', authenticateToken(['admin', 'coordinator']), getPaymentDetails);
router.put('/payments/:registration_id/status', authenticateToken(['admin', 'coordinator']), updatePaymentStatus);

export default router;
