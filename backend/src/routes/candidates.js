import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../auth/middleware.js';
import { listCandidateProfiles } from '../db/persistence.js';

const router = Router();

// HR product (Phase 7): candidate selection list for interview creation.
// Candidates are not organization-scoped (no org fields documented in the
// Database Specification; multi-tenancy is Phase 24). Only safe fields
// from linked user records are returned. Candidate manage/detail flows
// remain Phase 9.
router.get('/', authenticate, authorize('hr'), asyncHandler(async (req, res) => {
  const candidates = await listCandidateProfiles();
  res.status(200).json({
    status: 'ok',
    candidates,
  });
}));

export default router;
