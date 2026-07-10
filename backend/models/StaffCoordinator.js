import mongoose from 'mongoose';

const staffCoordinatorSchema = new mongoose.Schema({
  stid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: null
  },
  event_id: {
    type: String,
    required: true
  }
}, { timestamps: false });

const StaffCoordinator = mongoose.model('StaffCoordinator', staffCoordinatorSchema, 'staff_coordinator');
export default StaffCoordinator;
