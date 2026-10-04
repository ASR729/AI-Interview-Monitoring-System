// Documented values only. Open enums are NOT closed by this module:
// - users.status, alerts.status, monitoring_events.review_status, severity,
//   event_type and source remain open (exact states TBD in SRS/DB Spec).
// - user roles: SRS role table (Recruiter/HR, Candidate, Hiring Manager /
//   Interviewer, System Administrator); permissions enforced in Phase 6.
export const USER_ROLES = ['recruiter', 'candidate', 'interviewer', 'admin'];

// Database Specification §8.1 proposed lifecycle; SRS has not finalized
// exact states (recorded in DECISION_LOG). No invented cancellation,
// expiry or error states.
export const INTERVIEW_STATUSES = ['draft', 'scheduled', 'invited', 'ready', 'in_progress', 'completed'];

export const USER_STATUS_DEFAULT = 'active';
export const REVIEW_STATUS_DEFAULT = 'unreviewed';
export const ALERT_STATUS_DEFAULT = 'active';
