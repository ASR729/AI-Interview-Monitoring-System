import 'dotenv/config';
import app from './src/app.js';
import { connectDatabase, closeDatabase } from './src/config/database.js';
import { ensureBaselineIndexes } from './src/db/indexes.js';

const PORT = process.env.PORT || 3001;

// Start server
const server = app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`[${new Date().toISOString()}] Listening on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] Health check: http://localhost:${PORT}/health`);
  console.log(`[${new Date().toISOString()}] Readiness check: http://localhost:${PORT}/ready`);
});

// MongoDB connection (Phase 5): non-blocking so the backend still serves
// /health when MongoDB is unavailable; /ready reports the actual state.
connectDatabase()
  .then(async (db) => {
    if (!db) return;
    const indexCount = await ensureBaselineIndexes(db);
    console.log(`[${new Date().toISOString()}] Baseline indexes ensured (${indexCount})`);
  })
  .catch((error) => {
    console.error(`[${new Date().toISOString()}] Database initialization failed: ${error.message}`);
  });

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
  console.log(`\n[${new Date().toISOString()}] ${signal} received, starting graceful shutdown...`);

  server.close(() => {
    closeDatabase().finally(() => {
      console.log(`[${new Date().toISOString()}] HTTP server closed`);
      process.exit(0);
    });
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error(`[${new Date().toISOString()}] Forced shutdown after timeout`);
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error(`[${new Date().toISOString()}] Uncaught Exception:`, error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`[${new Date().toISOString()}] Unhandled Rejection at:`, promise, 'reason:', reason);
  process.exit(1);
});

export default server;
