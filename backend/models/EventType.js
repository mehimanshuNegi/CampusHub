import mongoose from 'mongoose';

const eventTypeSchema = new mongoose.Schema({
  type_id: {
    type: Number,
    required: true,
    unique: true
  },
  type_title: {
    type: String,
    required: true
  }
}, { timestamps: false });

const EventType = mongoose.model('EventType', eventTypeSchema, 'event_type');
export default EventType;
