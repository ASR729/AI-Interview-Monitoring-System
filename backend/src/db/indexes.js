import { COLLECTIONS } from './collections.js';

// Baseline indexes from Database Specification §15 (Index Strategy) plus
// IDX-USR-001, IDX-REC-001, IDX-CAN-001.
//
// Intentionally deferred (not justified by current queries; the spec
// warns against over-indexing):
// - IDX-USR-002 (role, status)          — no current role/status queries
// - IDX-REC-002 (company)               — optional future use
// - IDX-CAN-002 (skills)                — future filtering
// - IDX-EVT-004 (review_status, timestamp) — review queue in later versions
// - IDX-EVT-005 (analysis_id)           — no current query
// - IDX-ALT-003 (event_id)              — no current query
const BASELINE_INDEXES = [
  { collection: COLLECTIONS.USERS, name: 'idx_usr_001_email_unique', key: { email: 1 }, options: { unique: true } },

  { collection: COLLECTIONS.RECRUITERS, name: 'idx_rec_001_user_id_unique', key: { user_id: 1 }, options: { unique: true } },

  { collection: COLLECTIONS.CANDIDATES, name: 'idx_can_001_user_id_unique', key: { user_id: 1 }, options: { unique: true, sparse: true } },

  { collection: COLLECTIONS.INTERVIEW_SESSIONS, name: 'idx_int_001_recruiter_status_created', key: { recruiter_id: 1, status: 1, created_at: 1 } },
  { collection: COLLECTIONS.INTERVIEW_SESSIONS, name: 'idx_int_002_candidate_status_scheduled', key: { candidate_id: 1, status: 1, scheduled_start_at: 1 } },
  { collection: COLLECTIONS.INTERVIEW_SESSIONS, name: 'idx_int_003_status_scheduled', key: { status: 1, scheduled_start_at: 1 } },
  { collection: COLLECTIONS.INTERVIEW_SESSIONS, name: 'idx_int_004_created_desc', key: { created_at: -1 } },

  { collection: COLLECTIONS.MONITORING_EVENTS, name: 'idx_evt_001_interview_timestamp', key: { interview_id: 1, timestamp: 1 } },
  { collection: COLLECTIONS.MONITORING_EVENTS, name: 'idx_evt_002_interview_severity_timestamp', key: { interview_id: 1, severity: 1, timestamp: 1 } },
  { collection: COLLECTIONS.MONITORING_EVENTS, name: 'idx_evt_003_interview_type_timestamp', key: { interview_id: 1, event_type: 1, timestamp: 1 } },

  { collection: COLLECTIONS.ALERTS, name: 'idx_alt_001_interview_created', key: { interview_id: 1, created_at: 1 } },
  { collection: COLLECTIONS.ALERTS, name: 'idx_alt_002_recipient_status_created', key: { recipient_user_id: 1, status: 1, created_at: 1 } },

  { collection: COLLECTIONS.EVIDENCE, name: 'idx_evd_001_interview_created', key: { interview_id: 1, created_at: 1 } },
  { collection: COLLECTIONS.EVIDENCE, name: 'idx_evd_002_event_created', key: { event_id: 1, created_at: 1 } },

  { collection: COLLECTIONS.AI_ANALYSIS_RESULTS, name: 'idx_ai_001_interview_processed', key: { interview_id: 1, processed_at: 1 } },
  { collection: COLLECTIONS.AI_ANALYSIS_RESULTS, name: 'idx_ai_002_type_processed', key: { analysis_type: 1, processed_at: 1 } },
  { collection: COLLECTIONS.AI_ANALYSIS_RESULTS, name: 'idx_ai_003_event', key: { event_id: 1 } },

  { collection: COLLECTIONS.FINAL_REPORTS, name: 'idx_rpt_001_interview_unique', key: { interview_id: 1 }, options: { unique: true } },
  { collection: COLLECTIONS.FINAL_REPORTS, name: 'idx_rpt_002_generated_desc', key: { generated_at: -1 } },
];

export const ensureBaselineIndexes = async (db) => {
  for (const spec of BASELINE_INDEXES) {
    await db.collection(spec.collection).createIndex(spec.key, { name: spec.name, ...spec.options });
  }
  return BASELINE_INDEXES.length;
};
