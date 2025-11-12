import mongoose from 'mongoose';
const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
  due: { type: Date },
  notes: { type: String },
}, { timestamps: true });
export default mongoose.model('Task', TaskSchema);
