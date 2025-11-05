import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { securityHeaders, sanitizeInput, apiLimiter } from './middleware/security.js';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware (must be first)
app.use(securityHeaders);

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'https://kasa031.github.io'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Ikke tillatt av CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Rate limiting for all API routes
app.use('/api', apiLimiter);

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, '../uploads')));

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import pollRoutes from './routes/polls.js';
import voteRoutes from './routes/votes.js';
import commentRoutes from './routes/comments.js';
import statsRoutes from './routes/stats.js';
import badgeRoutes from './routes/badges.js';
import aiRoutes from './routes/ai.js';

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Polls API er oppe' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server kjører på http://localhost:${PORT}`);
});

