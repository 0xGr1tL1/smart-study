import './config/env.js';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import taskRoutes from './routes/tasks.js';
import noteRoutes from './routes/notes.js';
import chatbotRoutes from './routes/chatbot.js';
import { connectDB } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.get('/', (req,res)=> res.json({ ok: true }));

connectDB().then(()=> app.listen(PORT, ()=> console.log(`API on http://localhost:${PORT}`)))
  .catch(e=> { console.error(e); process.exit(1); });
