import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { authenticate, authorize } from '../auth/middleware.js';
import { authorizeInterviewAccess } from '../auth/resourceAccess.js';
import { requireDatabase } from '../config/database.js';
import { COLLECTIONS } from '../db/collections.js';
import {
  PersistenceError,
  findRecruiterByUserId,
  createInterviewSession,
  listInterviewsByRecruiter,
  updateInterviewSession,
  markInterviewInvited,
  assignInterviewerToInterview,
} from '../db/persistence.js';

const router = Router();

// HR interview management (Phase 7). Interviewee-specific interview views
// belong to Phase 9; interviewer assignment belongs to Phase 8. All routes
// require the HR product role AND recruiter ownership of the resource.

function mapPersistenceError(error) {
  if (error instanceof PersistenceError) {
    if (error.code === 'INVALID_FIELD') return new AppError(error.message, 400);
    if (error.code === 'INVALID_REFERENCE') return new AppError(error.message, 400);
    if (error.code === 'NOT_FOUND') return new AppError('Interview not found', 404);
    if (error.code === 'INVALID_STATE') return new AppError('Interview is not in a state that allows this action', 409);
    if (error.code === 'DUPLICATE_REFERENCE' || error.code === 'DUPLICATE_EMAIL') return new AppError('Record already exists', 409);
    return new AppError('The operation could not be completed', 500);
  }
  return error;
}

async function requireRecruiterProfile(userId) {
  const profile = await findRecruiterByUserId(userId);
  if (!profile) {
    throw new AppError('A recruiter profile is required for this operation', 403);
  }
  return profile;
}

async function candidateDisplay(candidateId) {
  if (!candidateId) return null;
  const db = requireDatabase();
  const candidate = await db.collection(COLLECTIONS.CANDIDATES).findOne({ _id: candidateId });
  if (!candidate) return null;
  const user = await db
    .collection(COLLECTIONS.USERS)
    .findOne({ _id: candidate.user_id }, { projection: { password_hash: 0 } });
  return {
    id: candidate._id,
    name: user ? user.name : null,
    email: user ? user.email : null,
  };
}

async function interviewerDisplay(interviewerId) {
  if (!interviewerId) return null;
  const db = requireDatabase();
  const user = await db
    .collection(COLLECTIONS.USERS)
    .findOne({ _id: interviewerId }, { projection: { password_hash: 0 } });
  if (!user) return null;
  return { id: user._id, name: user.name };
}

function shapeInterview(interview, candidate, interviewer) {
  return {
    id: interview._id,
    title: interview.title,
    status: interview.status,
    scheduled_start_at: interview.scheduled_start_at ?? null,
    invite_reference: interview.invite_reference ?? null,
    candidate: candidate ?? interview.candidate ?? null,
    interviewer: interviewer ?? interview.interviewer ?? null,
    created_at: interview.created_at,
    updated_at: interview.updated_at,
  };
}

router.post('/', authenticate, authorize('hr'), asyncHandler(async (req, res) => {
  const { title, candidateId, scheduledStartAt, interviewerId } = req.body || {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw new AppError('Title is required', 400);
  }
  if (!candidateId || typeof candidateId !== 'string') {
    throw new AppError('A valid candidate is required', 400);
  }
  if (scheduledStartAt !== undefined && scheduledStartAt !== null) {
    const parsed = new Date(scheduledStartAt);
    if (Number.isNaN(parsed.getTime())) {
      throw new AppError('scheduledStartAt must be a valid date/time', 400);
    }
  }
  if (interviewerId !== undefined && interviewerId !== null && typeof interviewerId !== 'string') {
    throw new AppError('interviewerId must be a valid interviewer user id', 400);
  }

  const profile = await requireRecruiterProfile(req.user.id);
  let interview;
  try {
    interview = await createInterviewSession({
      recruiterId: profile._id,
      candidateId,
      title,
      ...(scheduledStartAt !== undefined && scheduledStartAt !== null && { scheduledStartAt }),
      ...(interviewerId !== undefined && interviewerId !== null && { interviewerId }),
    });
  } catch (error) {
    throw mapPersistenceError(error);
  }

  const candidate = await candidateDisplay(interview.candidate_id);
  const interviewer = await interviewerDisplay(interview.interviewer_id);
  res.status(201).json({
    status: 'ok',
    interview: shapeInterview(interview, candidate, interviewer),
  });
}));

router.get('/', authenticate, authorize('hr'), asyncHandler(async (req, res) => {
  const profile = await requireRecruiterProfile(req.user.id);
  const interviews = await listInterviewsByRecruiter(profile._id);
  res.status(200).json({
    status: 'ok',
    interviews: interviews.map((i) => shapeInterview(i, i.candidate, i.interviewer)),
  });
}));

router.get('/:id', authenticate, authorize('hr'), asyncHandler(async (req, res) => {
  const interview = await authorizeInterviewAccess(req.user.id, req.user.role, req.params.id);
  const candidate = await candidateDisplay(interview.candidate_id);
  const interviewer = await interviewerDisplay(interview.interviewer_id);
  res.status(200).json({
    status: 'ok',
    interview: shapeInterview(interview, candidate, interviewer),
  });
}));

router.patch('/:id', authenticate, authorize('hr'), asyncHandler(async (req, res) => {
  const interview = await authorizeInterviewAccess(req.user.id, req.user.role, req.params.id);
  const { title, scheduledStartAt } = req.body || {};

  const hasTitle = title !== undefined;
  const hasSchedule = scheduledStartAt !== undefined;
  if (!hasTitle && !hasSchedule) {
    throw new AppError('No updatable fields provided (title, scheduledStartAt)', 400);
  }
  if (hasTitle && (typeof title !== 'string' || title.trim().length === 0)) {
    throw new AppError('Title must be a non-empty string', 400);
  }
  if (hasSchedule && scheduledStartAt !== null) {
    const parsed = new Date(scheduledStartAt);
    if (Number.isNaN(parsed.getTime())) {
      throw new AppError('scheduledStartAt must be a valid date/time or null', 400);
    }
  }

  let updated;
  try {
    updated = await updateInterviewSession(interview._id, {
      ...(hasTitle && { title }),
      ...(hasSchedule && { scheduledStartAt }),
    });
  } catch (error) {
    throw mapPersistenceError(error);
  }

  res.status(200).json({
    status: 'ok',
    interview: shapeInterview(updated, await candidateDisplay(updated.candidate_id), await interviewerDisplay(updated.interviewer_id)),
  });
}));

// Invitation workflow (SRS-FR-005; Database Spec §8 invite_reference).
// Internal only: generates the opaque invite reference and transitions
// draft -> invited. No external email provider exists in the MVP boundary.
router.post('/:id/invite', authenticate, authorize('hr'), asyncHandler(async (req, res) => {
  const interview = await authorizeInterviewAccess(req.user.id, req.user.role, req.params.id);

  if (interview.status === 'invited' && interview.invite_reference) {
    throw new AppError('This interview has already been invited', 409);
  }

  let updated;
  try {
    updated = await markInterviewInvited(interview._id, randomUUID());
  } catch (error) {
    throw mapPersistenceError(error);
  }

  res.status(200).json({
    status: 'ok',
    interview: shapeInterview(updated, await candidateDisplay(updated.candidate_id), await interviewerDisplay(updated.interviewer_id)),
  });
}));

// Interviewer assignment workflow (Phase 8, DEC-029): sets
// interview_sessions.interviewer_id to an active user with the interviewer
// role. Reassignment follows the same rule while the interview is still in a
// pre-room state (draft/scheduled/invited); later states reject (409).
router.post('/:id/assign', authenticate, authorize('hr'), asyncHandler(async (req, res) => {
  const interview = await authorizeInterviewAccess(req.user.id, req.user.role, req.params.id);
  const { interviewerId } = req.body || {};

  if (!interviewerId || typeof interviewerId !== 'string') {
    throw new AppError('A valid interviewer is required', 400);
  }

  let updated;
  try {
    updated = await assignInterviewerToInterview(interview._id, interviewerId);
  } catch (error) {
    throw mapPersistenceError(error);
  }

  res.status(200).json({
    status: 'ok',
    interview: shapeInterview(updated, await candidateDisplay(updated.candidate_id), await interviewerDisplay(updated.interviewer_id)),
  });
}));

export default router;
