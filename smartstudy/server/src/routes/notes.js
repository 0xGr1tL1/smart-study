import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Note from '../models/Note.js';
const router = express.Router();
router.use(requireAuth);
router.get('/', async (req,res)=>{ const notes = await Note.find({ userId: req.userId }).sort({ updatedAt: -1 }); res.json(notes); });
router.post('/', async (req,res)=>{ const n = await Note.create({ ...req.body, userId: req.userId }); res.json(n); });
router.put('/:id', async (req,res)=>{
  const n = await Note.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true });
  if(!n) return res.status(404).json({ error: 'Not found' });
  res.json(n);
});
router.delete('/:id', async (req,res)=>{
  const n = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if(!n) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true, id: req.params.id });
});
export default router;
