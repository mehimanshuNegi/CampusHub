import mongoose from 'mongoose';

const clubCoordinatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  clubName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Active'
  },
  role: {
    type: String,
    default: 'coordinator'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ClubCoordinator = mongoose.model('ClubCoordinator', clubCoordinatorSchema, 'club_coordinators');
export default ClubCoordinator;
