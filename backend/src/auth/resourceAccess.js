import { AppError } from '../middleware/errorHandler.js';
import { requireDatabase } from '../config/database.js';
import { COLLECTIONS } from '../db/collections.js';
import { findRecruiterByUserId, findCandidateByUserId } from '../db/persistence.js';

// Resource-authorization foundation (Phase 6), extended in Phase 8
// (DEC-029). Authentication answers "who are you?", role authorization
// answers "are you allowed this type of operation?", and this module answers
// "are you allowed THIS specific interview?" using only the documented
// relationships (Database Spec: interview_sessions.recruiter_id /
// candidate_id, plus interviewer_id added for Phase 8 assignment;
// user -> recruiter / candidate profile).
//
// Interviewer access is permitted only for interviews where
// interview_sessions.interviewer_id equals the interviewer's user id.
// Interviews without an assignment remain inaccessible to interviewers.
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

  if (backendRole === 'interviewer') {
    if (!interview.interviewer_id || interview.interviewer_id !== userId) {
      throw new AppError('You do not have permission to access this interview', 403);
    }
    return interview;
  }

  throw new AppError('You do not have permission to access this interview', 403);
}
