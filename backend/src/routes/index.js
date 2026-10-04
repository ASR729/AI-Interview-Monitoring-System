import express from 'express';
import authRouter from './auth.js';
import rbacRouter from './rbac.js';
import interviewsRouter from './interviews.js';
import candidatesRouter from './candidates.js';

const router = express.Router();

/**
 * API Router
 *
 * This is the root router for all API endpoints.
 * Mount specific route modules here as they are implemented.
 *
 * Phase 6: /auth (authentication), /rbac (authorization verification)
 * Phase 7: /interviews (HR interview management), /candidates (HR
 * candidate selection list)
 * Future phases will add:
 * - Phase 7: /users (user management)
 * - Phase 18: /monitoring (live monitoring endpoints)
 * - Phase 19: /reports (interview reports)
 */

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'AI Interview Monitoring API',
    version: '0.1.0',
    status: 'Phase 7: HR Product',
    endpoints: {
      health: 'GET /health',
      api: 'GET /api',
    },
    documentation: 'See README.md for API documentation',
  });
});

router.use('/auth', authRouter);
router.use('/rbac', rbacRouter);
router.use('/interviews', interviewsRouter);
router.use('/candidates', candidatesRouter);

// TODO Phase 18: Add monitoring routes
// router.use('/monitoring', monitoringRouter);

// TODO Phase 19: Add report routes
// router.use('/reports', reportRouter);

export default router;
