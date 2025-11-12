import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Event from '../models/Event.js';
const router = express.Router();
router.use(requireAuth);
router.get('/', async (req,res)=>{
  const { start, end } = req.query;
  const query = { userId: req.userId };
  if (start && end) {
    query.$or = [
      { start: { $gte: new Date(start), $lte: new Date(end) } },
      { end: { $gte: new Date(start), $lte: new Date(end) } }
    ];
  }
  const events = await Event.find(query).sort({ start: 1 });
  res.json(events);
});
router.post('/', async (req,res)=>{
  const created = await Event.create({ ...req.body, userId: req.userId });
  res.json(created);
});
router.put('/:id', async (req,res)=>{
  const updated = await Event.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true });
  if(!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});
router.delete('/:id', async (req,res)=>{
  const deleted = await Event.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if(!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true, id: req.params.id });
});
export default router;
