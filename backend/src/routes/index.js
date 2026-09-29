import express from 'express';

const router = express.Router();

/**
 * API Router
 *
 * This is the root router for all API endpoints.
 * Mount specific route modules here as they are implemented.
 *
 * Phase 3: Foundation only - no business endpoints yet
 * Future phases will add:
 * - Phase 6: /auth (authentication routes)
 * - Phase 7: /interviews (interview management)
 * - Phase 7: /users (user management)
 * - Phase 18: /monitoring (live monitoring endpoints)
 * - Phase 19: /reports (interview reports)
 */

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'AI Interview Monitoring API',
    version: '0.1.0',
    status: 'Phase 3: Backend Foundation',
    endpoints: {
      health: 'GET /health',
      api: 'GET /api',
    },
    documentation: 'See README.md for API documentation',
  });
});

// TODO Phase 6: Add authentication routes
// router.use('/auth', authRouter);

// TODO Phase 7: Add interview routes
// router.use('/interviews', interviewRouter);

// TODO Phase 7: Add user routes
// router.use('/users', userRouter);

// TODO Phase 18: Add monitoring routes
// router.use('/monitoring', monitoringRouter);

// TODO Phase 19: Add report routes
// router.use('/reports', reportRouter);

export default router;
