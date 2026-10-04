import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';

process.env.MONGODB_DB_NAME = 'interview_monitoring_test';

import { connectDatabase, closeDatabase, isDatabaseConnected, getDatabase, getDatabaseName } from '../src/config/database.js';
import { COLLECTIONS } from '../src/db/collections.js';
import { ensureBaselineIndexes } from '../src/db/indexes.js';
import {
  PersistenceError,
  createUser,
  createRecruiter,
  createCandidate,
  createInterviewSession,
  createMonitoringEvent,
  createAiAnalysisResult,
  createAlert,
  createEvidence,
  createFinalReport,
} from '../src/db/persistence.js';

const TEST_DB_NAME = 'interview_monitoring_test';

describe('MongoDB Persistence (Phase 5)', () => {
  let db;
  let recruiterUser;
  let recruiter;
  let candidateUser;
  let candidate;
  let interview;
  let event;
  let evidence;

  before(async () => {
    db = await connectDatabase();
    assert.ok(db, 'MongoDB connection must succeed for persistence tests');
    assert.strictEqual(getDatabaseName(), TEST_DB_NAME);
    await ensureBaselineIndexes(db);
  });

  after(async () => {
    const activeDb = getDatabase();
    if (activeDb && activeDb.databaseName === TEST_DB_NAME) {
      await activeDb.dropDatabase();
    }
    await closeDatabase();
  });

  describe('Connection', () => {
    it('connects and selects the dedicated test database', () => {
      assert.strictEqual(isDatabaseConnected(), true);
      assert.strictEqual(getDatabase().databaseName, TEST_DB_NAME);
    });
  });

  describe('users persistence', () => {
    it('inserts a synthetic recruiter user with defaults', async () => {
      recruiterUser = await createUser({ name: 'Demo Recruiter', email: 'recruiter@example.local', role: 'recruiter' });
      assert.ok(recruiterUser._id);
      assert.strictEqual(recruiterUser.email, 'recruiter@example.local');
      assert.strictEqual(recruiterUser.role, 'recruiter');
      assert.strictEqual(recruiterUser.status, 'active');
      assert.ok(recruiterUser.created_at instanceof Date);
      assert.ok(recruiterUser.updated_at instanceof Date);
      assert.strictEqual(recruiterUser.password_hash, undefined);
    });

    it('inserts a synthetic candidate user', async () => {
      candidateUser = await createUser({ name: 'Demo Candidate', email: 'candidate@example.local', role: 'candidate' });
      assert.strictEqual(candidateUser.role, 'candidate');
    });

    it('stores a password hash without plaintext', async () => {
      const syntheticHash = 'synthetic-hash-not-a-real-credential';
      const user = await createUser({ name: 'Demo Admin', email: 'admin@example.local', role: 'admin', passwordHash: syntheticHash });
      const stored = await db.collection(COLLECTIONS.USERS).findOne({ _id: user._id });
      assert.strictEqual(stored.password_hash, syntheticHash);
      assert.ok(!JSON.stringify(stored).includes('plaintext'));
    });

    it('rejects duplicate email via the unique index', async () => {
      await assert.rejects(
        () => createUser({ name: 'Duplicate', email: 'recruiter@example.local', role: 'recruiter' }),
        (error) => error instanceof PersistenceError && error.code === 'DUPLICATE_EMAIL'
      );
    });

    it('rejects roles outside the SRS-recognized role model', async () => {
      await assert.rejects(
        () => createUser({ name: 'Bad Role', email: 'bad@example.local', role: 'superadmin' }),
        PersistenceError
      );
    });
  });

  describe('recruiters and candidates persistence', () => {
    it('creates a recruiter profile linked to the recruiter user', async () => {
      recruiter = await createRecruiter({ userId: recruiterUser._id, company: 'Demo Company', designation: 'HR Lead' });
      assert.ok(recruiter._id);
      assert.strictEqual(recruiter.user_id, recruiterUser._id);
    });

    it('creates a candidate profile linked to the candidate user', async () => {
      candidate = await createCandidate({
        userId: candidateUser._id,
        skills: ['javascript', 'python'],
        experience: [{ title: 'Demo Role', years: 1 }],
      });
      assert.ok(candidate._id);
      assert.strictEqual(candidate.user_id, candidateUser._id);
      assert.deepStrictEqual(candidate.skills, ['javascript', 'python']);
    });

    it('rejects a recruiter profile referencing a non-recruiter user', async () => {
      await assert.rejects(
        () => createRecruiter({ userId: candidateUser._id, company: 'Demo Company' }),
        PersistenceError
      );
    });

    it('rejects a candidate profile with an unknown user', async () => {
      await assert.rejects(() => createCandidate({ userId: 'no-such-user' }), PersistenceError);
    });
  });

  describe('interview_sessions persistence', () => {
    it('inserts a synthetic interview session as the central entity', async () => {
      interview = await createInterviewSession({
        recruiterId: recruiter._id,
        candidateId: candidate._id,
        title: 'Synthetic Interview',
        scheduledStartAt: '2026-10-05T10:00:00.000Z',
        status: 'scheduled',
        monitoringConfiguration: { face_detection: true },
      });
      assert.ok(interview._id);
      assert.strictEqual(interview.recruiter_id, recruiter._id);
      assert.strictEqual(interview.candidate_id, candidate._id);
      assert.strictEqual(interview.status, 'scheduled');
      assert.ok(interview.scheduled_start_at instanceof Date);
      assert.strictEqual(interview.scheduled_start_at.toISOString(), '2026-10-05T10:00:00.000Z');
    });

    it('defaults status to the documented draft state', async () => {
      const draft = await createInterviewSession({ recruiterId: recruiter._id, candidateId: candidate._id, title: 'Draft Interview' });
      assert.strictEqual(draft.status, 'draft');
    });

    it('rejects invalid recruiter references', async () => {
      await assert.rejects(
        () => createInterviewSession({ recruiterId: 'no-such-recruiter', candidateId: candidate._id, title: 'Bad' }),
        PersistenceError
      );
    });

    it('rejects invalid candidate references', async () => {
      await assert.rejects(
        () => createInterviewSession({ recruiterId: recruiter._id, candidateId: 'no-such-candidate', title: 'Bad' }),
        PersistenceError
      );
    });

    it('rejects lifecycle states outside the documented proposed set', async () => {
      await assert.rejects(
        () => createInterviewSession({ recruiterId: recruiter._id, candidateId: candidate._id, title: 'Bad', status: 'cancelled' }),
        PersistenceError
      );
    });
  });

  describe('monitoring_events persistence', () => {
    it('creates an event referencing the interview with a controlled timestamp', async () => {
      const occurredAt = new Date(Date.now() - 60000);
      event = await createMonitoringEvent({
        interviewId: interview._id,
        timestamp: occurredAt,
        eventType: 'camera_failure',
        source: 'rule_engine',
        severity: 'high',
        description: 'Synthetic operational event for persistence verification',
      });
      assert.ok(event._id);
      assert.strictEqual(event.interview_id, interview._id);
      assert.ok(event.timestamp instanceof Date);
      assert.strictEqual(event.timestamp.getTime(), occurredAt.getTime());
      assert.strictEqual(event.review_status, 'unreviewed');
      assert.strictEqual(event.analysis_id, undefined);
    });

    it('keeps severity and confidence separate fields', async () => {
      const withConfidence = await createMonitoringEvent({
        interviewId: interview._id,
        timestamp: new Date(),
        eventType: 'multiple_faces',
        source: 'cv',
        severity: 'medium',
        confidence: 0.87,
        modelVersion: 'cv-rule-0.1.0-synthetic',
      });
      const stored = await db.collection(COLLECTIONS.MONITORING_EVENTS).findOne({ _id: withConfidence._id });
      assert.strictEqual(stored.severity, 'medium');
      assert.strictEqual(stored.confidence, 0.87);
      assert.strictEqual(stored.model_version, 'cv-rule-0.1.0-synthetic');
      assert.notStrictEqual(stored.severity, stored.confidence);
    });

    it('rejects an event whose interview_id does not resolve (DB-VAL-001)', async () => {
      await assert.rejects(
        () =>
          createMonitoringEvent({
            interviewId: 'no-such-interview',
            timestamp: new Date(),
            eventType: 'camera_failure',
            source: 'rule_engine',
          }),
        (error) => error instanceof PersistenceError && error.code === 'INVALID_REFERENCE'
      );
    });

    it('rejects an event without a timestamp (DB-VAL-002)', async () => {
      await assert.rejects(
        () => createMonitoringEvent({ interviewId: interview._id, eventType: 'camera_failure', source: 'rule_engine' }),
        (error) => error instanceof PersistenceError && error.code === 'INVALID_FIELD'
      );
    });

    it('rejects non-numeric confidence when provided (DB-VAL-003)', async () => {
      await assert.rejects(
        () =>
          createMonitoringEvent({
            interviewId: interview._id,
            timestamp: new Date(),
            eventType: 'multiple_faces',
            source: 'cv',
            confidence: 'very-high',
          }),
        PersistenceError
      );
    });

    it('rejects evidence references that do not belong to the interview (DB-VAL-005)', async () => {
      await assert.rejects(
        () =>
          createMonitoringEvent({
            interviewId: interview._id,
            timestamp: new Date(),
            eventType: 'multiple_faces',
            source: 'cv',
            evidenceIds: ['orphan-evidence-id'],
          }),
        (error) => error instanceof PersistenceError && error.code === 'INVALID_REFERENCE'
      );
    });
  });

  describe('evidence persistence', () => {
    it('creates evidence metadata referencing the interview and event', async () => {
      evidence = await createEvidence({
        interviewId: interview._id,
        eventId: event._id,
        evidenceType: 'snapshot',
        storageReference: 'local://synthetic-evidence/snapshot-1',
        contentHash: 'sha256-synthetic',
        sizeBytes: 1024,
        mimeType: 'image/png',
        retentionClass: 'interview_evidence',
      });
      assert.ok(evidence._id);
      assert.strictEqual(evidence.interview_id, interview._id);
      assert.strictEqual(evidence.event_id, event._id);
      assert.strictEqual(evidence.storage_reference, 'local://synthetic-evidence/snapshot-1');
      assert.ok(evidence.created_at instanceof Date);
    });

    it('rejects evidence with an event from another interview', async () => {
      const otherInterview = await createInterviewSession({
        recruiterId: recruiter._id,
        candidateId: candidate._id,
        title: 'Other Synthetic Interview',
      });
      await assert.rejects(
        () =>
          createEvidence({
            interviewId: otherInterview._id,
            eventId: event._id,
            evidenceType: 'snapshot',
          }),
        PersistenceError
      );
    });

    it('stores references only, without raw media blobs', async () => {
      const stored = await db.collection(COLLECTIONS.EVIDENCE).findOne({ _id: evidence._id });
      const serialized = JSON.stringify(stored);
      assert.ok(serialized.length < 2048, 'evidence document must remain lightweight metadata');
      assert.strictEqual(stored.evidence_type, 'snapshot');
    });
  });

  describe('alerts persistence', () => {
    it('creates an alert referencing the interview, event and recipient', async () => {
      const alert = await createAlert({
        interviewId: interview._id,
        eventId: event._id,
        recipientUserId: recruiterUser._id,
        alertType: 'monitoring_alert',
        severity: 'high',
        message: 'Synthetic alert for persistence verification',
        evidenceIds: [evidence._id],
      });
      assert.ok(alert._id);
      assert.strictEqual(alert.interview_id, interview._id);
      assert.strictEqual(alert.event_id, event._id);
      assert.strictEqual(alert.recipient_user_id, recruiterUser._id);
      assert.strictEqual(alert.status, 'active');
      assert.ok(alert.created_at instanceof Date);
      assert.strictEqual(alert.acknowledged_at, undefined);
    });

    it('rejects an alert whose event belongs to another interview', async () => {
      await assert.rejects(
        () =>
          createAlert({
            interviewId: interview._id,
            eventId: 'event-from-another-interview',
            recipientUserId: recruiterUser._id,
            alertType: 'monitoring_alert',
            severity: 'high',
            message: 'Bad',
          }),
        PersistenceError
      );
    });

    it('rejects an alert with an unknown recipient', async () => {
      await assert.rejects(
        () =>
          createAlert({
            interviewId: interview._id,
            recipientUserId: 'no-such-user',
            alertType: 'monitoring_alert',
            severity: 'high',
            message: 'Bad',
          }),
        PersistenceError
      );
    });
  });

  describe('ai_analysis_results persistence (stable baseline)', () => {
    it('stores a generic, traceable analysis output for the interview', async () => {
      const analysis = await createAiAnalysisResult({
        interviewId: interview._id,
        eventId: event._id,
        analysisType: 'synthetic_signal',
        modelName: 'synthetic-model',
        modelVersion: '0.0.1-synthetic',
        inputReference: 'local://synthetic-input/frame-ref',
        output: { synthetic: true, note: 'controlled structured object; real schemas are TBD' },
        confidence: 0.5,
        processingLatencyMs: 12,
      });
      assert.ok(analysis._id);
      assert.strictEqual(analysis.interview_id, interview._id);
      assert.strictEqual(analysis.event_id, event._id);
      assert.strictEqual(analysis.model_version, '0.0.1-synthetic');
      assert.deepStrictEqual(analysis.output, {
        synthetic: true,
        note: 'controlled structured object; real schemas are TBD',
      });
      assert.ok(analysis.processed_at instanceof Date);
      assert.strictEqual(analysis.processing_latency_ms, 12);
    });

    it('rejects an analysis with an event from another interview', async () => {
      const otherInterview = await createInterviewSession({
        recruiterId: recruiter._id,
        candidateId: candidate._id,
        title: 'Analysis Reference Interview',
      });
      await assert.rejects(
        () => createAiAnalysisResult({ interviewId: otherInterview._id, eventId: event._id, analysisType: 'synthetic_signal' }),
        PersistenceError
      );
    });

    it('allows an analysis without an event (interview-level analysis)', async () => {
      const analysis = await createAiAnalysisResult({ interviewId: interview._id, analysisType: 'synthetic_summary' });
      assert.strictEqual(analysis.event_id, undefined);
    });
  });

  describe('final_reports persistence (stable baseline)', () => {
    it('stores a baseline report referencing its interview, events and evidence', async () => {
      const report = await createFinalReport({
        interviewId: interview._id,
        summary: 'Synthetic report summary for persistence verification',
        integrityIndicators: { synthetic: true },
        notableEventIds: [event._id],
        evidenceIds: [evidence._id],
        reviewStatus: 'unreviewed',
      });
      assert.ok(report._id);
      assert.strictEqual(report.interview_id, interview._id);
      assert.deepStrictEqual(report.notable_event_ids, [event._id]);
      assert.deepStrictEqual(report.evidence_ids, [evidence._id]);
      assert.ok(report.generated_at instanceof Date);
      assert.ok(report.updated_at instanceof Date);
    });

    it('rejects a second report for the same interview (one current report)', async () => {
      await assert.rejects(
        () => createFinalReport({ interviewId: interview._id, summary: 'Duplicate' }),
        PersistenceError
      );
    });

    it('rejects report references to events of another interview (DB-VAL-007)', async () => {
      const otherInterview = await createInterviewSession({
        recruiterId: recruiter._id,
        candidateId: candidate._id,
        title: 'Report Reference Interview',
      });
      await assert.rejects(
        () =>
          createFinalReport({
            interviewId: otherInterview._id,
            summary: 'Bad',
            notableEventIds: [event._id],
          }),
        PersistenceError
      );
    });
  });

  describe('timestamps and indexes', () => {
    it('persists created_at consistently across collections (DB-VAL-008)', async () => {
      const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: recruiterUser._id });
      const evt = await db.collection(COLLECTIONS.MONITORING_EVENTS).findOne({ _id: event._id });
      assert.ok(user.created_at instanceof Date);
      assert.ok(user.updated_at instanceof Date);
      assert.ok(evt.created_at instanceof Date);
      assert.ok(evt.timestamp instanceof Date);
      assert.ok(evt.timestamp.getTime() <= Date.now());
    });

    it('has created the required baseline indexes', async () => {
      const expected = {
        [COLLECTIONS.USERS]: ['idx_usr_001_email_unique'],
        [COLLECTIONS.RECRUITERS]: ['idx_rec_001_user_id_unique'],
        [COLLECTIONS.CANDIDATES]: ['idx_can_001_user_id_unique'],
        [COLLECTIONS.INTERVIEW_SESSIONS]: [
          'idx_int_001_recruiter_status_created',
          'idx_int_002_candidate_status_scheduled',
          'idx_int_003_status_scheduled',
          'idx_int_004_created_desc',
        ],
        [COLLECTIONS.MONITORING_EVENTS]: [
          'idx_evt_001_interview_timestamp',
          'idx_evt_002_interview_severity_timestamp',
          'idx_evt_003_interview_type_timestamp',
        ],
        [COLLECTIONS.ALERTS]: ['idx_alt_001_interview_created', 'idx_alt_002_recipient_status_created'],
        [COLLECTIONS.EVIDENCE]: ['idx_evd_001_interview_created', 'idx_evd_002_event_created'],
        [COLLECTIONS.AI_ANALYSIS_RESULTS]: ['idx_ai_001_interview_processed', 'idx_ai_002_type_processed', 'idx_ai_003_event'],
        [COLLECTIONS.FINAL_REPORTS]: ['idx_rpt_001_interview_unique', 'idx_rpt_002_generated_desc'],
      };

      for (const [collectionName, expectedNames] of Object.entries(expected)) {
        const indexes = await db.collection(collectionName).listIndexes().toArray();
        const indexNames = indexes.map((i) => i.name);
        for (const name of expectedNames) {
          assert.ok(indexNames.includes(name), `missing index ${name} on ${collectionName}`);
        }
      }
    });
  });

  describe('test data hygiene', () => {
    it('contains only synthetic data', async () => {
      const users = await db.collection(COLLECTIONS.USERS).find({}).toArray();
      for (const user of users) {
        assert.ok(user.email.endsWith('@example.local'), 'all test emails must be synthetic');
      }
    });
  });
});

describe('MongoDB graceful connection failure', () => {
  it('returns null and does not throw when MongoDB is unreachable', async () => {
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27999';
    const result = await connectDatabase();
    assert.strictEqual(result, null);
    assert.strictEqual(isDatabaseConnected(), false);
    delete process.env.MONGODB_URI;
  });
});
