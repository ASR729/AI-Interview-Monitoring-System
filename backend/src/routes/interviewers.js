import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../auth/middleware.js';
import { listInterviewerUsers } from '../db/persistence.js';

const router = Router();

// HR product (Phase 8): interviewer selection list for assigning an
// interviewer to an interview. Mirrors GET /api/candidates (Phase 7) — only
// safe user fields are returned.
router.get('/', authenticate, authorize('hr'), asyncHandler(async (req, res) => {
  const interviewers = await listInterviewerUsers();
  res.status(200).json({
    status: 'ok',
    interviewers,
  });
}));

export default router;
