import { Router } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../auth/middleware.js';
import { authorizeInterviewAccess } from '../auth/resourceAccess.js';
import { requireDatabase } from '../config/database.js';
import { COLLECTIONS } from '../db/collections.js';
import { findCandidateByUserId, listInterviewsByCandidate } from '../db/persistence.js';

const router = Router();

// Candidate/Interviewee product (Phase 9, UX-CAN-001/002): authorized
// assigned-interview views over the existing interview_sessions documents.
// Candidate access is enforced by authorizeInterviewAccess — the
// authenticated user must map to a candidate profile whose id equals
// interview_sessions.candidate_id. System check is a client-side browser
// capability flow (no readiness persistence is documented); the interview
// room (Phase 10), monitoring and alerts are intentionally not exposed here.

async function requireCandidateProfile(userId) {
  const profile = await findCandidateByUserId(userId);
  if (!profile) {
    throw new AppError('A candidate profile is required for this operation', 403);
  }
  return profile;
}

function interviewerDisplay(interviewerId) {
  if (!interviewerId) return Promise.resolve(null);
  const db = requireDatabase();
  return db
    .collection(COLLECTIONS.USERS)
    .findOne({ _id: interviewerId }, { projection: { name: 1 } })
    .then((user) => (user ? { id: user._id, name: user.name } : null));
}

function shapeCandidateInterview(interview, interviewer) {
  return {
    id: interview._id,
    title: interview.title,
    status: interview.status,
    scheduled_start_at: interview.scheduled_start_at ?? null,
    started_at: interview.started_at ?? null,
    ended_at: interview.ended_at ?? null,
    interviewer: interviewer ?? interview.interviewer ?? null,
    created_at: interview.created_at,
    updated_at: interview.updated_at,
  };
}

router.get('/interviews', authenticate, authorize('interviewee'), asyncHandler(async (req, res) => {
  const profile = await requireCandidateProfile(req.user.id);
  const interviews = await listInterviewsByCandidate(profile._id);
  const interviewerIds = new Set(interviews.map((i) => i.interviewer?.id).filter(Boolean));
  const names = new Map();
  for (const id of interviewerIds) {
    names.set(id, await interviewerDisplay(id));
  }
  res.status(200).json({
    status: 'ok',
    interviews: interviews.map((i) => shapeCandidateInterview(i, i.interviewer?.id ? names.get(i.interviewer.id) : null)),
  });
}));

router.get('/interviews/:id', authenticate, authorize('interviewee'), asyncHandler(async (req, res) => {
  await requireCandidateProfile(req.user.id);
  const interview = await authorizeInterviewAccess(req.user.id, req.user.role, req.params.id);
  const interviewer = await interviewerDisplay(interview.interviewer_id);
  res.status(200).json({
    status: 'ok',
    interview: shapeCandidateInterview(interview, interviewer),
  });
}));

export default router;
