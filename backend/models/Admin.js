import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'Administrator'
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended'],
    default: 'Active'
  }
}, { timestamps: false });

const Admin = mongoose.model('Admin', adminSchema, 'admins');
export default Admin;
