import mongoose from 'mongoose';

const eventInfoSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true,
    unique: true
  },
  Date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
}, { timestamps: false });

const EventInfo = mongoose.model('EventInfo', eventInfoSchema, 'event_info');
export default EventInfo;
