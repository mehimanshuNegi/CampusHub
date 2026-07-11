import express from 'express';
import {
  getUsers,
  updateUser,
  toggleUserStatus,
  deleteUser,
  promoteStudent,
  demoteCoordinator,
  transferEventOwnership,
  getCoordinatorActivity,
  resetCoordinatorPassword
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/users', getUsers);
router.put('/users/:role/:id', updateUser);
router.put('/users/:role/:id/status', toggleUserStatus);
router.delete('/users/:role/:id', deleteUser);

router.post('/coordinators/promote', promoteStudent);
router.post('/coordinators/demote', demoteCoordinator);
router.put('/events/:event_id/transfer', transferEventOwnership);
router.get('/coordinators/:id/activity', getCoordinatorActivity);
router.post('/coordinators/:id/reset-password', resetCoordinatorPassword);

export default router;
