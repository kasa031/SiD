import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, '../uploads')));

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import pollRoutes from './routes/polls.js';
import voteRoutes from './routes/votes.js';
import commentRoutes from './routes/comments.js';

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Polls API er oppe' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/comments', commentRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server kjører på http://localhost:${PORT}`);
});

