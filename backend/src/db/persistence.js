import { randomUUID } from 'node:crypto';
import { requireDatabase } from '../config/database.js';
import { COLLECTIONS } from './collections.js';
import {
  USER_ROLES,
  INTERVIEW_STATUSES,
  USER_STATUS_DEFAULT,
  REVIEW_STATUS_DEFAULT,
  ALERT_STATUS_DEFAULT,
} from './constants.js';

export class PersistenceError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'PersistenceError';
    this.code = code;
  }
}

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const toDate = (value, field) => {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) throw new PersistenceError(`${field} is not a valid date`, 'INVALID_FIELD');
    return value;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new PersistenceError(`${field} is not a valid date`, 'INVALID_FIELD');
  return parsed;
};

const optionalString = (value) =>
  value !== undefined && value !== null && value !== '' && { value: String(value) };

const optionalNumber = (value, field) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new PersistenceError(`${field} must be a number when provided`, 'INVALID_FIELD');
  }
  return { value };
};

async function interviewExists(db, interviewId) {
  if (!isNonEmptyString(interviewId)) {
    throw new PersistenceError('interview_id is required', 'INVALID_FIELD');
  }
  const interview = await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).findOne({ _id: interviewId });
  if (!interview) {
    throw new PersistenceError('interview_id does not resolve to a valid interview session (DB-VAL-001)', 'INVALID_REFERENCE');
  }
  return interview;
}

// Interviewer reference (Phase 8/DEC-029): interview_sessions.interviewer_id
// references users._id directly (no interviewer profile collection is
// documented in the Database Specification). The referenced user must exist,
// hold the interviewer backend role and be active.
async function assertInterviewerReference(db, interviewerUserId) {
  if (!isNonEmptyString(interviewerUserId)) {
    throw new PersistenceError('interview.interviewer_id is required', 'INVALID_FIELD');
  }
  const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: interviewerUserId });
  if (!user || user.role !== 'interviewer') {
    throw new PersistenceError('interview.interviewer_id does not resolve to an interviewer', 'INVALID_REFERENCE');
  }
  if (user.status !== 'active') {
    throw new PersistenceError('interview.interviewer_id must reference an active interviewer', 'INVALID_REFERENCE');
  }
  return user;
}

async function assertEvidenceReferences(db, interviewId, evidenceIds) {
  if (!Array.isArray(evidenceIds)) {
    throw new PersistenceError('evidence_ids must be an array of evidence identifiers', 'INVALID_FIELD');
  }
  const unique = [...new Set(evidenceIds)];
  if (unique.length === 0) return;
  const found = await db
    .collection(COLLECTIONS.EVIDENCE)
    .find({ _id: { $in: unique }, interview_id: interviewId })
    .project({ _id: 1 })
    .toArray();
  if (found.length !== unique.length) {
    throw new PersistenceError('evidence_ids must resolve to evidence records for the same interview (DB-VAL-005)', 'INVALID_REFERENCE');
  }
}

async function assertEventReferences(db, interviewId, eventIds) {
  const unique = [...new Set(eventIds)];
  const found = await db
    .collection(COLLECTIONS.MONITORING_EVENTS)
    .find({ _id: { $in: unique }, interview_id: interviewId })
    .project({ _id: 1 })
    .toArray();
  if (found.length !== unique.length) {
    throw new PersistenceError('event references must resolve to monitoring events for the same interview (DB-VAL-007)', 'INVALID_REFERENCE');
  }
}

export async function findUserByEmail(email) {
  const db = requireDatabase();
  if (!isNonEmptyString(email)) return null;
  return db.collection(COLLECTIONS.USERS).findOne({ email: email.trim().toLowerCase() });
}

export async function findUserById(userId) {
  const db = requireDatabase();
  if (!isNonEmptyString(userId)) return null;
  return db.collection(COLLECTIONS.USERS).findOne({ _id: userId });
}

// Safe user representation: never includes password_hash or other
// authentication internals (SRS-SEC-003; data-minimization DEC-012).
export function toSafeUser(userDoc) {
  if (!userDoc) return null;
  return {
    id: userDoc._id,
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
    status: userDoc.status,
    created_at: userDoc.created_at,
    updated_at: userDoc.updated_at,
  };
}

export async function deleteUserById(userId) {
  const db = requireDatabase();
  if (!isNonEmptyString(userId)) throw new PersistenceError('user_id is required', 'INVALID_FIELD');
  await db.collection(COLLECTIONS.USERS).deleteOne({ _id: userId });
}

export async function findRecruiterByUserId(userId) {
  const db = requireDatabase();
  if (!isNonEmptyString(userId)) return null;
  return db.collection(COLLECTIONS.RECRUITERS).findOne({ user_id: userId });
}

export async function findCandidateByUserId(userId) {
  const db = requireDatabase();
  if (!isNonEmptyString(userId)) return null;
  return db.collection(COLLECTIONS.CANDIDATES).findOne({ user_id: userId });
}

export async function createUser({ name, email, passwordHash, role, status } = {}) {
  const db = requireDatabase();
  if (!isNonEmptyString(name)) throw new PersistenceError('user.name is required', 'INVALID_FIELD');
  if (!isNonEmptyString(email)) throw new PersistenceError('user.email is required', 'INVALID_FIELD');
  if (!USER_ROLES.includes(role)) {
    throw new PersistenceError(`user.role must be one of: ${USER_ROLES.join(', ')}`, 'INVALID_FIELD');
  }
  if (passwordHash !== undefined && passwordHash !== null && !isNonEmptyString(passwordHash)) {
    throw new PersistenceError('user.password_hash must be a string when provided', 'INVALID_FIELD');
  }

  const now = new Date();
  const doc = {
    _id: randomUUID(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    ...(passwordHash !== undefined && passwordHash !== null && { password_hash: passwordHash }),
    role,
    status: optionalString(status)?.value ?? USER_STATUS_DEFAULT,
    created_at: now,
    updated_at: now,
  };

  try {
    await db.collection(COLLECTIONS.USERS).insertOne(doc);
  } catch (error) {
    if (error.code === 11000) {
      throw new PersistenceError('user.email already exists', 'DUPLICATE_EMAIL');
    }
    throw error;
  }
  return doc;
}

export async function createRecruiter({ userId, company, designation, phone } = {}) {
  const db = requireDatabase();
  if (!isNonEmptyString(userId)) throw new PersistenceError('recruiter.user_id is required', 'INVALID_FIELD');
  const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: userId });
  if (!user) {
    throw new PersistenceError('recruiter.user_id does not resolve to a user', 'INVALID_REFERENCE');
  }
  if (user.role !== 'recruiter') {
    throw new PersistenceError('recruiter.user_id must reference a user with the recruiter role', 'INVALID_REFERENCE');
  }

  const now = new Date();
  const doc = {
    _id: randomUUID(),
    user_id: userId,
    ...(optionalString(company) && { company: optionalString(company).value }),
    ...(optionalString(designation) && { designation: optionalString(designation).value }),
    ...(optionalString(phone) && { phone: optionalString(phone).value }),
    created_at: now,
    updated_at: now,
  };

  try {
    await db.collection(COLLECTIONS.RECRUITERS).insertOne(doc);
  } catch (error) {
    if (error.code === 11000) {
      throw new PersistenceError('a recruiter profile already exists for this user', 'DUPLICATE_REFERENCE');
    }
    throw error;
  }
  return doc;
}

export async function createCandidate({ userId, resumeReference, skills, experience } = {}) {
  const db = requireDatabase();
  if (!isNonEmptyString(userId)) throw new PersistenceError('candidate.user_id is required', 'INVALID_FIELD');
  const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: userId });
  if (!user) {
    throw new PersistenceError('candidate.user_id does not resolve to a user', 'INVALID_REFERENCE');
  }
  if (user.role !== 'candidate') {
    throw new PersistenceError('candidate.user_id must reference a user with the candidate role', 'INVALID_REFERENCE');
  }
  if (skills !== undefined && skills !== null && !Array.isArray(skills)) {
    throw new PersistenceError('candidate.skills must be an array of strings when provided', 'INVALID_FIELD');
  }

  const now = new Date();
  const doc = {
    _id: randomUUID(),
    user_id: userId,
    ...(optionalString(resumeReference) && { resume_reference: optionalString(resumeReference).value }),
    ...(Array.isArray(skills) && { skills }),
    ...(experience !== undefined && experience !== null && { experience }),
    created_at: now,
    updated_at: now,
  };

  try {
    await db.collection(COLLECTIONS.CANDIDATES).insertOne(doc);
  } catch (error) {
    if (error.code === 11000) {
      throw new PersistenceError('a candidate profile already exists for this user', 'DUPLICATE_REFERENCE');
    }
    throw error;
  }
  return doc;
}

export async function createInterviewSession({
  recruiterId,
  candidateId,
  title,
  scheduledStartAt,
  status,
  inviteReference,
  monitoringConfiguration,
  interviewerId,
} = {}) {
  const db = requireDatabase();
  if (!isNonEmptyString(recruiterId)) throw new PersistenceError('interview.recruiter_id is required', 'INVALID_FIELD');
  if (!isNonEmptyString(candidateId)) throw new PersistenceError('interview.candidate_id is required', 'INVALID_FIELD');
  if (!isNonEmptyString(title)) throw new PersistenceError('interview.title is required', 'INVALID_FIELD');

  const recruiter = await db.collection(COLLECTIONS.RECRUITERS).findOne({ _id: recruiterId });
  if (!recruiter) {
    throw new PersistenceError('interview.recruiter_id does not resolve to a recruiter', 'INVALID_REFERENCE');
  }
  const candidate = await db.collection(COLLECTIONS.CANDIDATES).findOne({ _id: candidateId });
  if (!candidate) {
    throw new PersistenceError('interview.candidate_id does not resolve to a candidate', 'INVALID_REFERENCE');
  }
  // Interviewer assignment (Phase 8/DEC-029): optional at creation; the
  // reference must resolve to an active user with the interviewer role.
  if (interviewerId !== undefined && interviewerId !== null) {
    await assertInterviewerReference(db, interviewerId);
  }

  const effectiveStatus = optionalString(status)?.value ?? 'draft';
  if (!INTERVIEW_STATUSES.includes(effectiveStatus)) {
    throw new PersistenceError(
      `interview.status must be one of: ${INTERVIEW_STATUSES.join(', ')} (set is provisional pending SRS finalization)`,
      'INVALID_FIELD'
    );
  }
  if (monitoringConfiguration !== undefined && monitoringConfiguration !== null && typeof monitoringConfiguration !== 'object') {
    throw new PersistenceError('interview.monitoring_configuration must be an object when provided', 'INVALID_FIELD');
  }

  const now = new Date();
  const doc = {
    _id: randomUUID(),
    recruiter_id: recruiterId,
    candidate_id: candidateId,
    title: title.trim(),
    ...(scheduledStartAt !== undefined && scheduledStartAt !== null && { scheduled_start_at: toDate(scheduledStartAt, 'interview.scheduled_start_at') }),
    status: effectiveStatus,
    ...(interviewerId !== undefined && interviewerId !== null && { interviewer_id: interviewerId }),
    ...(inviteReference !== undefined && inviteReference !== null && { invite_reference: inviteReference }),
    ...(monitoringConfiguration !== undefined && monitoringConfiguration !== null && { monitoring_configuration: monitoringConfiguration }),
    created_at: now,
    updated_at: now,
  };

  await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).insertOne(doc);
  return doc;
}

export async function findInterviewById(interviewId) {
  const db = requireDatabase();
  if (!isNonEmptyString(interviewId)) return null;
  return db.collection(COLLECTIONS.INTERVIEW_SESSIONS).findOne({ _id: interviewId });
}

// HR product (Phase 7): candidate selection list. Candidates are not
// organization-scoped (no org fields documented in the Database
// Specification; multi-tenancy is Phase 24). Only safe fields from the
// linked user record are returned (DEC-012).
export async function listCandidateProfiles() {
  const db = requireDatabase();
  const candidates = await db.collection(COLLECTIONS.CANDIDATES).find({}).sort({ created_at: -1 }).toArray();
  if (candidates.length === 0) return [];
  const userIds = candidates.map((c) => c.user_id).filter(Boolean);
  const users = await db
    .collection(COLLECTIONS.USERS)
    .find({ _id: { $in: userIds } })
    .project({ password_hash: 0 })
    .toArray();
  const userById = new Map(users.map((u) => [u._id, u]));
  return candidates.map((c) => {
    const u = userById.get(c.user_id);
    return {
      id: c._id,
      user_id: c.user_id,
      name: u ? u.name : null,
      email: u ? u.email : null,
      status: u ? u.status : null,
      created_at: c.created_at,
    };
  });
}

// HR product (Phase 7): recruiter-scoped interview listing (ownership
// boundary). Joins candidate profile + user for display names without
// exposing authentication internals.
export async function listInterviewsByRecruiter(recruiterId) {
  const db = requireDatabase();
  if (!isNonEmptyString(recruiterId)) throw new PersistenceError('recruiter_id is required', 'INVALID_FIELD');
  const interviews = await db
    .collection(COLLECTIONS.INTERVIEW_SESSIONS)
    .find({ recruiter_id: recruiterId })
    .sort({ created_at: -1 })
    .toArray();
  if (interviews.length === 0) return [];
  const candidateIds = [...new Set(interviews.map((i) => i.candidate_id))];
  const candidates = await db
    .collection(COLLECTIONS.CANDIDATES)
    .find({ _id: { $in: candidateIds } })
    .toArray();
  const candidateById = new Map(candidates.map((c) => [c._id, c]));
  const userIds = candidates.map((c) => c.user_id).filter(Boolean);
  const interviewerIds = [...new Set(interviews.map((i) => i.interviewer_id).filter(Boolean))];
  const users = await db
    .collection(COLLECTIONS.USERS)
    .find({ _id: { $in: [...userIds, ...interviewerIds] } })
    .project({ password_hash: 0 })
    .toArray();
  const userById = new Map(users.map((u) => [u._id, u]));
  return interviews.map((interview) => {
    const candidate = candidateById.get(interview.candidate_id) || null;
    const candidateUser = candidate ? userById.get(candidate.user_id) || null : null;
    const interviewerUser = interview.interviewer_id ? userById.get(interview.interviewer_id) || null : null;
    return {
      ...interview,
      candidate: candidate
        ? {
            id: candidate._id,
            name: candidateUser ? candidateUser.name : null,
            email: candidateUser ? candidateUser.email : null,
          }
        : null,
      interviewer: interview.interviewer_id
        ? {
            id: interview.interviewer_id,
            name: interviewerUser ? interviewerUser.name : null,
          }
        : null,
    };
  });
}

// HR product (Phase 7): narrow update surface (ownership must be checked
// by the caller). Only title and scheduled_start_at are updatable in this
// phase; candidate reassignment and lifecycle state here would invent
// undocumented rules. Non-allowlisted fields are ignored.
export async function updateInterviewSession(interviewId, { title, scheduledStartAt } = {}) {
  const db = requireDatabase();
  if (!isNonEmptyString(interviewId)) throw new PersistenceError('interview id is required', 'INVALID_FIELD');
  const set = { updated_at: new Date() };
  if (title !== undefined && title !== null) {
    if (!isNonEmptyString(title)) throw new PersistenceError('interview.title must be a non-empty string', 'INVALID_FIELD');
    set.title = title.trim();
  }
  if (scheduledStartAt === null) {
    set.scheduled_start_at = null;
  } else if (scheduledStartAt !== undefined) {
    set.scheduled_start_at = toDate(scheduledStartAt, 'interview.scheduled_start_at');
  }
  const result = await db
    .collection(COLLECTIONS.INTERVIEW_SESSIONS)
    .findOneAndUpdate({ _id: interviewId }, { $set: set }, { returnDocument: 'after' });
  if (!result) throw new PersistenceError('interview not found', 'NOT_FOUND');
  return result;
}

// HR product (Phase 7): invitation workflow transition. Only documents the
// proposed draft -> invited direction (Database Specification §8.1);
// generates the opaque invite_reference token metadata. Other lifecycle
// states reject.
export async function markInterviewInvited(interviewId, inviteReference) {
  const db = requireDatabase();
  if (!isNonEmptyString(interviewId)) throw new PersistenceError('interview id is required', 'INVALID_FIELD');
  if (!isNonEmptyString(inviteReference)) throw new PersistenceError('invite reference is required', 'INVALID_FIELD');
  const result = await db
    .collection(COLLECTIONS.INTERVIEW_SESSIONS)
    .findOneAndUpdate(
      { _id: interviewId, status: 'draft' },
      { $set: { status: 'invited', invite_reference: inviteReference, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
  if (!result) throw new PersistenceError('interview is not in a state that can be invited', 'INVALID_STATE');
  return result;
}

// Interviewer product (Phase 8, DEC-029): interview_sessions.interviewer_id
// references users._id for a user with the interviewer role. Assignment is
// only meaningful before the interview room is active (draft/scheduled/
// invited); ready/in_progress/completed sessions reject (no documented
// reassignment-after-start rule exists). Only originator states are
// enumerated — the DEC-023 provisional lifecycle is preserved untouched.
const ASSIGNABLE_STATUSES = ['draft', 'scheduled', 'invited'];

export async function assignInterviewerToInterview(interviewId, interviewerUserId) {
  const db = requireDatabase();
  if (!isNonEmptyString(interviewId)) throw new PersistenceError('interview id is required', 'INVALID_FIELD');
  await assertInterviewerReference(db, interviewerUserId);
  const result = await db
    .collection(COLLECTIONS.INTERVIEW_SESSIONS)
    .findOneAndUpdate(
      { _id: interviewId, status: { $in: ASSIGNABLE_STATUSES } },
      { $set: { interviewer_id: interviewerUserId, updated_at: new Date() } },
      { returnDocument: 'after' }
    );
  if (!result) throw new PersistenceError('interview is not in a state that can be assigned', 'INVALID_STATE');
  return result;
}

// HR product (Phase 8): interviewer selection list for assignment. Mirrors
// the safe-fields shape of listCandidateProfiles (users only; no profile
// collection is documented for interviewers).
export async function listInterviewerUsers() {
  const db = requireDatabase();
  const users = await db
    .collection(COLLECTIONS.USERS)
    .find({ role: 'interviewer', status: 'active' })
    .project({ password_hash: 0 })
    .sort({ created_at: -1 })
    .toArray();
  return users.map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    status: u.status,
    created_at: u.created_at,
  }));
}

// Interviewer product (Phase 8, DEC-029): assigned-interview listing. Returns
// interviews where interviewer_id matches the interviewer's user id, with the
// candidate display name joined (email intentionally withheld — §privacy: the
// interviewer workflow requires candidate identity, not contact data).
export async function listInterviewsByInterviewer(interviewerUserId) {
  const db = requireDatabase();
  if (!isNonEmptyString(interviewerUserId)) throw new PersistenceError('interviewer id is required', 'INVALID_FIELD');
  const interviews = await db
    .collection(COLLECTIONS.INTERVIEW_SESSIONS)
    .find({ interviewer_id: interviewerUserId })
    .sort({ created_at: -1 })
    .toArray();
  if (interviews.length === 0) return [];
  const candidateIds = [...new Set(interviews.map((i) => i.candidate_id))];
  const candidates = await db
    .collection(COLLECTIONS.CANDIDATES)
    .find({ _id: { $in: candidateIds } })
    .toArray();
  const candidateById = new Map(candidates.map((c) => [c._id, c]));
  const users = await db
    .collection(COLLECTIONS.USERS)
    .find({ _id: { $in: candidates.map((c) => c.user_id).filter(Boolean) } })
    .project({ password_hash: 0 })
    .toArray();
  const userById = new Map(users.map((u) => [u._id, u]));
  return interviews.map((interview) => {
    const candidate = candidateById.get(interview.candidate_id) || null;
    const candidateUser = candidate ? userById.get(candidate.user_id) || null : null;
    return {
      ...interview,
      candidate: candidate ? { id: candidate._id, name: candidateUser ? candidateUser.name : null } : null,
    };
  });
}

// Candidate/Interviewee product (Phase 9): assigned-interview listing for the
// authenticated candidate (interview_sessions.candidate_id scope, Phase 6
// ownership mapping). Joins the interviewer display name without exposing
// authentication internals or candidate contact data.
export async function listInterviewsByCandidate(candidateProfileId) {
  const db = requireDatabase();
  if (!isNonEmptyString(candidateProfileId)) throw new PersistenceError('candidate id is required', 'INVALID_FIELD');
  const interviews = await db
    .collection(COLLECTIONS.INTERVIEW_SESSIONS)
    .find({ candidate_id: candidateProfileId })
    .sort({ created_at: -1 })
    .toArray();
  if (interviews.length === 0) return [];
  const interviewerIds = [...new Set(interviews.map((i) => i.interviewer_id).filter(Boolean))];
  const users = await db
    .collection(COLLECTIONS.USERS)
    .find({ _id: { $in: interviewerIds } })
    .project({ password_hash: 0 })
    .toArray();
  const userById = new Map(users.map((u) => [u._id, u]));
  return interviews.map((interview) => ({
    ...interview,
    interviewer: interview.interviewer_id
      ? {
          id: interview.interviewer_id,
          name: userById.get(interview.interviewer_id)?.name ?? null,
        }
      : null,
  }));
}

// Interviewer product (Phase 8): permitted report retrieval. final_reports is
// the documented collection (Database Specification §13); IDX-RPT-001 makes
// this lookup unique per interview. Returns null when no report exists yet —
// report generation belongs to Phase 19.
export async function findFinalReportByInterviewId(interviewId) {
  const db = requireDatabase();
  if (!isNonEmptyString(interviewId)) return null;
  return db.collection(COLLECTIONS.FINAL_REPORTS).findOne({ interview_id: interviewId });
}

export async function createMonitoringEvent({
  interviewId,
  timestamp,
  eventType,
  source,
  severity,
  confidence,
  description,
  evidenceIds,
  analysisId,
  modelVersion,
  reviewStatus,
  metadata,
} = {}) {
  const db = requireDatabase();
  const interview = await interviewExists(db, interviewId);
  if (timestamp === undefined || timestamp === null) {
    throw new PersistenceError('monitoring event requires a timestamp (DB-VAL-002)', 'INVALID_FIELD');
  }
  const occurredAt = toDate(timestamp, 'monitoring event timestamp');
  if (!isNonEmptyString(eventType)) throw new PersistenceError('monitoring event event_type is required', 'INVALID_FIELD');
  if (!isNonEmptyString(source)) throw new PersistenceError('monitoring event source is required', 'INVALID_FIELD');
  if (severity !== undefined && severity !== null && !isNonEmptyString(severity)) {
    throw new PersistenceError('monitoring event severity must be a string when provided', 'INVALID_FIELD');
  }
  const confidenceValue = optionalNumber(confidence, 'monitoring event confidence');
  if (evidenceIds !== undefined && evidenceIds !== null) {
    await assertEvidenceReferences(db, interview._id, evidenceIds);
  }
  if (analysisId !== undefined && analysisId !== null) {
    const analysis = await db.collection(COLLECTIONS.AI_ANALYSIS_RESULTS).findOne({ _id: analysisId });
    if (!analysis || analysis.interview_id !== interview._id) {
      throw new PersistenceError('analysis_id must resolve to an analysis result for the same interview', 'INVALID_REFERENCE');
    }
  }
  if (metadata !== undefined && metadata !== null && typeof metadata !== 'object') {
    throw new PersistenceError('monitoring event metadata must be an object when provided', 'INVALID_FIELD');
  }

  const doc = {
    _id: randomUUID(),
    interview_id: interview._id,
    timestamp: occurredAt,
    event_type: eventType.trim(),
    source: source.trim(),
    ...(optionalString(severity) && { severity: optionalString(severity).value }),
    ...(confidenceValue && { confidence: confidenceValue.value }),
    ...(optionalString(description) && { description: optionalString(description).value }),
    ...(Array.isArray(evidenceIds) && { evidence_ids: evidenceIds }),
    ...(analysisId !== undefined && analysisId !== null && { analysis_id: analysisId }),
    ...(optionalString(modelVersion) && { model_version: optionalString(modelVersion).value }),
    review_status: optionalString(reviewStatus)?.value ?? REVIEW_STATUS_DEFAULT,
    ...(metadata !== undefined && metadata !== null && { metadata }),
    created_at: new Date(),
  };

  await db.collection(COLLECTIONS.MONITORING_EVENTS).insertOne(doc);
  return doc;
}

export async function createAiAnalysisResult({
  interviewId,
  eventId,
  analysisType,
  modelName,
  modelVersion,
  inputReference,
  output,
  confidence,
  processedAt,
  processingLatencyMs,
} = {}) {
  const db = requireDatabase();
  const interview = await interviewExists(db, interviewId);
  if (!isNonEmptyString(analysisType)) throw new PersistenceError('analysis analysis_type is required', 'INVALID_FIELD');
  if (output !== undefined && output !== null && typeof output !== 'object') {
    throw new PersistenceError('analysis output must be a structured object when provided', 'INVALID_FIELD');
  }
  const confidenceValue = optionalNumber(confidence, 'analysis confidence');
  const latencyValue = optionalNumber(processingLatencyMs, 'analysis processing_latency_ms');
  if (eventId !== undefined && eventId !== null) {
    const event = await db.collection(COLLECTIONS.MONITORING_EVENTS).findOne({ _id: eventId });
    if (!event || event.interview_id !== interview._id) {
      throw new PersistenceError('event_id must resolve to a monitoring event for the same interview', 'INVALID_REFERENCE');
    }
  }

  const doc = {
    _id: randomUUID(),
    interview_id: interview._id,
    ...(eventId !== undefined && eventId !== null && { event_id: eventId }),
    analysis_type: analysisType.trim(),
    ...(optionalString(modelName) && { model_name: optionalString(modelName).value }),
    ...(optionalString(modelVersion) && { model_version: optionalString(modelVersion).value }),
    ...(inputReference !== undefined && inputReference !== null && { input_reference: inputReference }),
    ...(output !== undefined && output !== null && { output }),
    ...(confidenceValue && { confidence: confidenceValue.value }),
    processed_at: toDate(processedAt ?? new Date(), 'analysis processed_at'),
    ...(latencyValue && { processing_latency_ms: latencyValue.value }),
    created_at: new Date(),
  };

  await db.collection(COLLECTIONS.AI_ANALYSIS_RESULTS).insertOne(doc);
  return doc;
}

export async function createAlert({
  interviewId,
  eventId,
  recipientUserId,
  alertType,
  severity,
  message,
  evidenceIds,
  status,
} = {}) {
  const db = requireDatabase();
  const interview = await interviewExists(db, interviewId);
  if (!isNonEmptyString(recipientUserId)) throw new PersistenceError('alert.recipient_user_id is required', 'INVALID_FIELD');
  const recipient = await db.collection(COLLECTIONS.USERS).findOne({ _id: recipientUserId });
  if (!recipient) {
    throw new PersistenceError('alert.recipient_user_id does not resolve to a user', 'INVALID_REFERENCE');
  }
  if (eventId !== undefined && eventId !== null) {
    const event = await db.collection(COLLECTIONS.MONITORING_EVENTS).findOne({ _id: eventId });
    if (!event || event.interview_id !== interview._id) {
      throw new PersistenceError('alert event_id must resolve to a monitoring event for the same interview', 'INVALID_REFERENCE');
    }
  }
  if (!isNonEmptyString(alertType)) throw new PersistenceError('alert.alert_type is required', 'INVALID_FIELD');
  if (!isNonEmptyString(severity)) throw new PersistenceError('alert.severity is required', 'INVALID_FIELD');
  if (!isNonEmptyString(message)) throw new PersistenceError('alert.message is required', 'INVALID_FIELD');
  if (evidenceIds !== undefined && evidenceIds !== null) {
    await assertEvidenceReferences(db, interview._id, evidenceIds);
  }

  const doc = {
    _id: randomUUID(),
    interview_id: interview._id,
    ...(eventId !== undefined && eventId !== null && { event_id: eventId }),
    recipient_user_id: recipientUserId,
    alert_type: alertType.trim(),
    severity: severity.trim(),
    message: message.trim(),
    ...(Array.isArray(evidenceIds) && { evidence_ids: evidenceIds }),
    status: optionalString(status)?.value ?? ALERT_STATUS_DEFAULT,
    created_at: new Date(),
  };

  await db.collection(COLLECTIONS.ALERTS).insertOne(doc);
  return doc;
}

export async function createEvidence({
  interviewId,
  eventId,
  evidenceType,
  storageReference,
  startTime,
  endTime,
  contentHash,
  sizeBytes,
  mimeType,
  metadata,
  retentionClass,
  expiresAt,
} = {}) {
  const db = requireDatabase();
  const interview = await interviewExists(db, interviewId);
  if (!isNonEmptyString(evidenceType)) throw new PersistenceError('evidence.evidence_type is required', 'INVALID_FIELD');
  if (eventId !== undefined && eventId !== null) {
    const event = await db.collection(COLLECTIONS.MONITORING_EVENTS).findOne({ _id: eventId });
    if (!event || event.interview_id !== interview._id) {
      throw new PersistenceError('evidence event_id must resolve to a monitoring event for the same interview', 'INVALID_REFERENCE');
    }
  }
  const sizeValue = optionalNumber(sizeBytes, 'evidence size_bytes');

  const doc = {
    _id: randomUUID(),
    interview_id: interview._id,
    ...(eventId !== undefined && eventId !== null && { event_id: eventId }),
    evidence_type: evidenceType.trim(),
    ...(storageReference !== undefined && storageReference !== null && { storage_reference: storageReference }),
    ...(startTime !== undefined && startTime !== null && { start_time: toDate(startTime, 'evidence start_time') }),
    ...(endTime !== undefined && endTime !== null && { end_time: toDate(endTime, 'evidence end_time') }),
    ...(optionalString(contentHash) && { content_hash: optionalString(contentHash).value }),
    ...(sizeValue && { size_bytes: sizeValue.value }),
    ...(optionalString(mimeType) && { mime_type: optionalString(mimeType).value }),
    ...(metadata !== undefined && metadata !== null && { metadata }),
    ...(optionalString(retentionClass) && { retention_class: optionalString(retentionClass).value }),
    ...(expiresAt !== undefined && expiresAt !== null && { expires_at: toDate(expiresAt, 'evidence expires_at') }),
    created_at: new Date(),
  };

  await db.collection(COLLECTIONS.EVIDENCE).insertOne(doc);
  return doc;
}

export async function createFinalReport({
  interviewId,
  summary,
  integrityIndicators,
  notableEventIds,
  evidenceIds,
  reviewStatus,
  reviewNotes,
  generatedAt,
} = {}) {
  const db = requireDatabase();
  const interview = await interviewExists(db, interviewId);
  if (!isNonEmptyString(summary)) throw new PersistenceError('report.summary is required', 'INVALID_FIELD');
  if (integrityIndicators !== undefined && integrityIndicators !== null && typeof integrityIndicators !== 'object') {
    throw new PersistenceError('report.integrity_indicators must be an object when provided', 'INVALID_FIELD');
  }
  if (notableEventIds !== undefined && notableEventIds !== null) {
    if (!Array.isArray(notableEventIds)) {
      throw new PersistenceError('report.notable_event_ids must be an array of event identifiers', 'INVALID_FIELD');
    }
    await assertEventReferences(db, interview._id, notableEventIds);
  }
  if (evidenceIds !== undefined && evidenceIds !== null) {
    if (!Array.isArray(evidenceIds)) {
      throw new PersistenceError('report.evidence_ids must be an array of evidence identifiers', 'INVALID_FIELD');
    }
    await assertEvidenceReferences(db, interview._id, evidenceIds);
  }

  const now = new Date();
  const doc = {
    _id: randomUUID(),
    interview_id: interview._id,
    summary: summary.trim(),
    ...(integrityIndicators !== undefined && integrityIndicators !== null && { integrity_indicators: integrityIndicators }),
    ...(Array.isArray(notableEventIds) && { notable_event_ids: notableEventIds }),
    ...(Array.isArray(evidenceIds) && { evidence_ids: evidenceIds }),
    ...(optionalString(reviewStatus) && { review_status: optionalString(reviewStatus).value }),
    ...(optionalString(reviewNotes) && { review_notes: optionalString(reviewNotes).value }),
    generated_at: toDate(generatedAt ?? now, 'report generated_at'),
    updated_at: now,
  };

  try {
    await db.collection(COLLECTIONS.FINAL_REPORTS).insertOne(doc);
  } catch (error) {
    if (error.code === 11000) {
      throw new PersistenceError('a report already exists for this interview', 'DUPLICATE_REFERENCE');
    }
    throw error;
  }
  return doc;
}
