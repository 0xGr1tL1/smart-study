import mongoose from 'mongoose';
const NoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
}, { timestamps: true });
export default mongoose.model('Note', NoteSchema);
