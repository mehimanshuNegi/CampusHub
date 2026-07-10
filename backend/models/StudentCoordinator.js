import mongoose from 'mongoose';

const studentCoordinatorSchema = new mongoose.Schema({
  sid: {
    type: String,
    required: true,
    unique: true
  },
  st_name: {
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

const StudentCoordinator = mongoose.model('StudentCoordinator', studentCoordinatorSchema, 'student_coordinator');
export default StudentCoordinator;
