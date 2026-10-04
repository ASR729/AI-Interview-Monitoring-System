import { Router } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../auth/middleware.js';
import { authorizeInterviewAccess } from '../auth/resourceAccess.js';
import { requireDatabase } from '../config/database.js';
import { COLLECTIONS } from '../db/collections.js';
import { listInterviewsByInterviewer, findFinalReportByInterviewId } from '../db/persistence.js';

const router = Router();

// Interviewer product (Phase 8, UX-INT-001, DEC-029): assigned-interview
// views over the existing interview_sessions documents. Interviewer access
// is enforced by authorizeInterviewAccess — interview_sessions.interviewer_id
// must equal the authenticated interviewer user's id. Live monitoring
// (UX-INT-002), WebRTC, events, alerts and evidence belong to later phases
// and are intentionally not exposed here.

async function interviewerCandidateDisplay(interview) {
  if (!interview.candidate_id) return null;
  const db = requireDatabase();
  const candidate = await db.collection(COLLECTIONS.CANDIDATES).findOne({ _id: interview.candidate_id });
  if (!candidate) return null;
  const user = await db
    .collection(COLLECTIONS.USERS)
    .findOne({ _id: candidate.user_id }, { projection: { name: 1 } });
  return { id: candidate._id, name: user ? user.name : null };
}

function shapeInterviewerInterview(interview, candidate) {
  return {
    id: interview._id,
    title: interview.title,
    status: interview.status,
    scheduled_start_at: interview.scheduled_start_at ?? null,
    started_at: interview.started_at ?? null,
    ended_at: interview.ended_at ?? null,
    candidate: candidate ?? interview.candidate ?? null,
    created_at: interview.created_at,
    updated_at: interview.updated_at,
  };
}

router.get('/interviews', authenticate, authorize('interviewer'), asyncHandler(async (req, res) => {
  const interviews = await listInterviewsByInterviewer(req.user.id);
  res.status(200).json({
    status: 'ok',
    interviews: interviews.map((i) => shapeInterviewerInterview(i, i.candidate)),
  });
}));

router.get('/interviews/:id', authenticate, authorize('interviewer'), asyncHandler(async (req, res) => {
  const interview = await authorizeInterviewAccess(req.user.id, req.user.role, req.params.id);
  const candidate = await interviewerCandidateDisplay(interview);
  res.status(200).json({
    status: 'ok',
    interview: shapeInterviewerInterview(interview, candidate),
  });
}));

// Permitted report access (PRD-FR-010, Database Spec §13). Report generation
// belongs to Phase 19; when no report exists the endpoint responds 404 with a
// truthful message instead of fabricating one.
router.get('/interviews/:id/report', authenticate, authorize('interviewer'), asyncHandler(async (req, res) => {
  const interview = await authorizeInterviewAccess(req.user.id, req.user.role, req.params.id);
  const report = await findFinalReportByInterviewId(interview._id);
  if (!report) {
    throw new AppError('Report will be available after the interview is completed and reviewed', 404);
  }
  res.status(200).json({
    status: 'ok',
    report: {
      id: report._id,
      interview_id: report.interview_id,
      summary: report.summary ?? null,
      integrity_indicators: report.integrity_indicators ?? null,
      generated_at: report.generated_at ?? null,
      created_at: report.created_at ?? null,
    },
  });
}));

export default router;
