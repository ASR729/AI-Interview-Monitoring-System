import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../auth/middleware.js';
import { authorizeInterviewAccess } from '../auth/resourceAccess.js';

const router = Router();

// Phase 6 RBAC verification endpoints. These are minimal, clearly-named
// authorization test endpoints (isolated from future business
// functionality): they prove authentication + role authorization without
// implementing interview management (Phase 7) or assignment (Phase 8).
router.get('/hr-only', authenticate, authorize('hr'), (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'HR-authorized access',
    role: 'hr',
  });
});

router.get('/interviewer-only', authenticate, authorize('interviewer'), (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Interviewer-authorized access',
    role: 'interviewer',
  });
});

router.get('/interviewee-only', authenticate, authorize('interviewee'), (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Interviewee-authorized access',
    role: 'interviewee',
  });
});

// Resource-authorization foundation: access to a specific interview via
// the documented recruiter/candidate ownership relationships only.
router.get('/interview/:id', authenticate, asyncHandler(async (req, res) => {
  const interview = await authorizeInterviewAccess(req.user.id, req.user.role, req.params.id);
  res.status(200).json({
    status: 'ok',
    interview,
  });
}));

export default router;
