import express from 'express';
import {
  getStudentCoordinators,
  getStaffCoordinators,
  updateStudentCoordinator,
  updateStaffCoordinator
} from '../controllers/coordinatorController.js';

const router = express.Router();

router.get('/student', getStudentCoordinators);
router.get('/staff', getStaffCoordinators);
router.put('/student/:id', updateStudentCoordinator);
router.put('/staff/:id', updateStaffCoordinator);

export default router;
