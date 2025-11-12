import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Task from '../models/Task.js';
const router = express.Router();
router.use(requireAuth);
router.get('/', async (req,res)=>{ const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 }); res.json(tasks); });
router.post('/', async (req,res)=>{ const t = await Task.create({ ...req.body, userId: req.userId }); res.json(t); });
router.put('/:id', async (req,res)=>{
  const t = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true });
  if(!t) return res.status(404).json({ error: 'Not found' });
  res.json(t);
});
router.delete('/:id', async (req,res)=>{
  const t = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if(!t) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true, id: req.params.id });
});
export default router;
