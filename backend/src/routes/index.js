import express from 'express';
import authRouter from './auth.js';
import rbacRouter from './rbac.js';

const router = express.Router();

/**
 * API Router
 *
 * This is the root router for all API endpoints.
 * Mount specific route modules here as they are implemented.
 *
 * Phase 6: /auth (authentication), /rbac (authorization verification)
 * Future phases will add:
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
    status: 'Phase 6: Authentication & RBAC',
    endpoints: {
      health: 'GET /health',
      api: 'GET /api',
    },
    documentation: 'See README.md for API documentation',
  });
});

router.use('/auth', authRouter);
router.use('/rbac', rbacRouter);

// TODO Phase 7: Add interview routes
// router.use('/interviews', interviewRouter);

// TODO Phase 7: Add user routes
// router.use('/users', userRouter);

// TODO Phase 7: Add user routes
// router.use('/users', userRouter);

// TODO Phase 18: Add monitoring routes
// router.use('/monitoring', monitoringRouter);

// TODO Phase 19: Add report routes
// router.use('/reports', reportRouter);

export default router;
