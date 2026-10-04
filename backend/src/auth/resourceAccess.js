import { AppError } from '../middleware/errorHandler.js';
import { requireDatabase } from '../config/database.js';
import { COLLECTIONS } from '../db/collections.js';
import { findRecruiterByUserId, findCandidateByUserId } from '../db/persistence.js';

// Resource-authorization foundation (Phase 6). Authentication answers
// "who are you?", role authorization answers "are you allowed this type
// of operation?", and this module answers "are you allowed THIS specific
// interview?" using only the documented relationships (Database Spec:
// interview_sessions.recruiter_id / candidate_id; user -> recruiter /
// candidate profile).
//
// Interviewer access to a specific interview is intentionally denied in
// this phase: no documented interviewer-assignment relationship exists
// until Phase 8 invents/implements it. Full interview-level authorization
// is completed in Phases 7-8.
export async function authorizeInterviewAccess(userId, backendRole, interviewId) {
  if (!interviewId || typeof interviewId !== 'string') {
    throw new AppError('interview id is required', 400);
  }

  const db = requireDatabase();
  const interview = await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).findOne({ _id: interviewId });
  if (!interview) {
    throw new AppError('Interview not found', 404);
  }

  if (backendRole === 'recruiter') {
    const profile = await findRecruiterByUserId(userId);
    if (!profile || profile._id !== interview.recruiter_id) {
      throw new AppError('You do not have permission to access this interview', 403);
    }
    return interview;
  }

  if (backendRole === 'candidate') {
    const profile = await findCandidateByUserId(userId);
    if (!profile || profile._id !== interview.candidate_id) {
      throw new AppError('You do not have permission to access this interview', 403);
    }
    return interview;
  }

  throw new AppError('You do not have permission to access this interview', 403);
}
