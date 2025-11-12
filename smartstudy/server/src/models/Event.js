import mongoose from 'mongoose';
const EventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  allDay: { type: Boolean, default: false },
  type: { type: String, enum: ['event','course'], default: 'event' },
  courseCode: { type: String },
  location: { type: String },
  notes: { type: String }
}, { timestamps: true });
export default mongoose.model('Event', EventSchema);
