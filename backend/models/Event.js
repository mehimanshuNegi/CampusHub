import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true,
    unique: true
  },
  event_title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
    default: 'Join us for this exciting campus activity and showcase your skills!'
  },
  event_price: {
    type: Number,
    required: true
  },
  participents: {
    type: Number,
    default: 0
  },
  img_link: {
    type: String,
    required: true
  },
  type_id: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdBy: {
    type: String,
    default: 'admin'
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  maxParticipants: {
    type: Number,
    default: null
  },
  registrationDeadline: {
    type: Date,
    default: null
  }
}, { timestamps: false });

const Event = mongoose.model('Event', eventSchema, 'events');
export default Event;
