import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import env from './config/env.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import projectRoutes from './routes/projects.js';
import chapterRoutes from './routes/chapters.js';
import sectionRoutes from './routes/section.js';
import teamRoutes from './routes/teams.js';
import teamRequestRoutes from './routes/teamRequests.js';
import brainstormRoutes from './routes/brainstorm.js';
import commentRoutes from './routes/comments.js';
import reportRoutes from './routes/reports.js';
import readingHistoryRoutes from './routes/readingHistory.js';

import adminRoutes from './routes/admin.js';

import pool from './config/database.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();

// ================= MIDDLEWARE =================

app.use(helmet());

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(
  express.json({
    limit: '50mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '50mb',
  })
);

app.use(morgan('dev'));

// ================= HEALTH =================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'INVERSA API Running',
  });
});

// ================= ROUTES =================

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/brainstorm', brainstormRoutes);
app.use('/api/team-requests', teamRequestRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reading-history', readingHistoryRoutes);

app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT NOW()'
    );

    res.json({
      success: true,
      message: 'Database connected',
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

app.get(
  '/api/protected',
  authMiddleware,

  (req, res) => {

    res.json({
      success: true,
      message: 'Protected route accessed',

      user: req.user,
    });

  }
);


// ================= 404 =================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});


export default app;