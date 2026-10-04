import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { isDatabaseConnected, getDatabaseState } from './config/database.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration for local development
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'interview-monitoring-backend',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Readiness endpoint: application + database connectivity (Phase 5).
// Deliberately separate from /health so the existing liveness check is
// never misleading about database state.
app.get('/ready', (req, res) => {
  const connected = isDatabaseConnected();
  if (connected) {
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      service: 'interview-monitoring-backend',
      database: {
        connected: true,
        state: getDatabaseState().state,
      },
    });
  } else {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      service: 'interview-monitoring-backend',
      database: {
        connected: false,
        state: getDatabaseState().state,
      },
    });
  }
});

// API routes
app.use('/api', apiRouter);

// 404 handler - must come after all other routes
app.use(notFoundHandler);

// Error handling middleware - must be last
app.use(errorHandler);

export default app;
