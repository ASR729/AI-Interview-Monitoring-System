import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

process.env.NODE_ENV = 'test';
process.env.MONGODB_DB_NAME = 'interview_monitoring_interviewer_test';
process.env.JWT_SECRET = 'phase8-interviewer-product-test-secret';

const TEST_DB_NAME = 'interview_monitoring_interviewer_test';

const { default: app } = await import('../src/app.js');
const { connectDatabase, closeDatabase, getDatabase, getDatabaseName } = await import('../src/config/database.js');
const { ensureBaselineIndexes } = await import('../src/db/indexes.js');
const { COLLECTIONS } = await import('../src/db/collections.js');
const { findCandidateByUserId } = await import('../src/db/persistence.js');

let server;
let port;

const makeRequest = (path, { method = 'GET', body, token, origin = 'http://localhost:5180' } = {}) => {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = {
      'Content-Type': 'application/json',
      Origin: origin,
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (payload) headers['Content-Length'] = Buffer.byteLength(payload);

    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data ? JSON.parse(data) : null,
        });
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

describe('Interviewer Product (Phase 8)', () => {
  const users = {};

  before(async () => {
    const db = await connectDatabase();
    assert.ok(db, 'MongoDB connection must succeed for Phase 8 tests');
    assert.strictEqual(getDatabaseName(), TEST_DB_NAME);
    await ensureBaselineIndexes(db);
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    port = server.address().port;

    for (const [name, role, email] of [
      ['HR Owner', 'hr', 'hr-owner@example.local'],
      ['HR Other', 'hr', 'hr-other@example.local'],
      ['Interviewer One', 'interviewer', 'int1@example.local'],
      ['Interviewer Two', 'interviewer', 'int2@example.local'],
      ['Candidate One', 'interviewee', 'cand1@example.local'],
    ]) {
      const res = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name, email, password: 'Password123', role, ...(role === 'hr' ? { company: `${name} Corp` } : {}) },
      });
      assert.strictEqual(res.statusCode, 201, `registration of ${email} must succeed`);
      const key = role === 'hr'
        ? (email.startsWith('hr-owner') ? 'hr1' : 'hr2')
        : (email.startsWith('int') ? (email.includes('int2') ? 'interviewer2' : 'interviewer') : role);
      users[key] = users[key] || {};
      users[key].token = res.body.token;
      users[key].id = res.body.user.id;
    }
  });

  after(async () => {
    const activeDb = getDatabase();
    if (activeDb && activeDb.databaseName === TEST_DB_NAME) {
      await activeDb.dropDatabase();
    }
    if (server) await new Promise((resolve) => server.close(resolve));
    await closeDatabase();
  });

  describe('AUTH-INT-001: Unauthenticated requests are rejected (401)', () => {
    it('rejects unauthenticated assigned-interview listing', async () => {
      const res = await makeRequest('/api/interviewer/interviews');
      assert.strictEqual(res.statusCode, 401);
    });

    it('rejects unauthenticated assigned-interview detail', async () => {
      const res = await makeRequest('/api/interviewer/interviews/some-id');
      assert.strictEqual(res.statusCode, 401);
    });

    it('rejects unauthenticated report access', async () => {
      const res = await makeRequest('/api/interviewer/interviews/some-id/report');
      assert.strictEqual(res.statusCode, 401);
    });

    it('rejects unauthenticated interviewer selection list', async () => {
      const res = await makeRequest('/api/interviewers');
      assert.strictEqual(res.statusCode, 401);
    });
  });

  describe('AUTH-INT-002/003: Cross-role access is blocked (403)', () => {
    it('HR cannot access interviewer-only endpoints', async () => {
      const list = await makeRequest('/api/interviewer/interviews', { token: users.hr1.token });
      assert.strictEqual(list.statusCode, 403);
      const detail = await makeRequest('/api/interviewer/interviews/some-id', { token: users.hr1.token });
      assert.strictEqual(detail.statusCode, 403);
      const report = await makeRequest('/api/interviewer/interviews/some-id/report', { token: users.hr1.token });
      assert.strictEqual(report.statusCode, 403);
    });

    it('Interviewee cannot access interviewer-only endpoints', async () => {
      const list = await makeRequest('/api/interviewer/interviews', { token: users.interviewee.token });
      assert.strictEqual(list.statusCode, 403);
      const detail = await makeRequest('/api/interviewer/interviews/some-id', { token: users.interviewee.token });
      assert.strictEqual(detail.statusCode, 403);
      const report = await makeRequest('/api/interviewer/interviews/some-id/report', { token: users.interviewee.token });
      assert.strictEqual(report.statusCode, 403);
    });

    it('Interviewer cannot access HR-only management operations', async () => {
      const create = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.interviewer.token,
        body: { title: 'No', candidateId: 'x' },
      });
      assert.strictEqual(create.statusCode, 403);
      const list = await makeRequest('/api/interviews', { token: users.interviewer.token });
      assert.strictEqual(list.statusCode, 403);
      const assign = await makeRequest('/api/interviews/some-id/assign', {
        method: 'POST',
        token: users.interviewer.token,
        body: { interviewerId: users.interviewer.id },
      });
      assert.strictEqual(assign.statusCode, 403);
      const invite = await makeRequest('/api/interviews/some-id/invite', {
        method: 'POST',
        token: users.interviewer.token,
      });
      assert.strictEqual(invite.statusCode, 403);
      const patch = await makeRequest('/api/interviews/some-id', {
        method: 'PATCH',
        token: users.interviewer.token,
        body: { title: 'X' },
      });
      assert.strictEqual(patch.statusCode, 403);
    });

    it('Interviewer cannot access the HR interviewer-selection list', async () => {
      const res = await makeRequest('/api/interviewers', { token: users.interviewer.token });
      assert.strictEqual(res.statusCode, 403);
    });
  });

  describe('Assignment workflow (HR -> interview_sessions.interviewer_id)', () => {
    let candidateProfileId;

    before(async () => {
      const profile = await findCandidateByUserId(users.interviewee.id);
      assert.ok(profile);
      candidateProfileId = profile._id;
    });

    it('HR can create an interview with an interviewer assigned at creation', async () => {
      const res = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: {
          title: 'Backend Screen — Assigned at Creation',
          candidateId: candidateProfileId,
          scheduledStartAt: '2026-12-01T10:00:00.000Z',
          interviewerId: users.interviewer.id,
        },
      });
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.interview.interviewer.id, users.interviewer.id);
      assert.strictEqual(res.body.interview.status, 'draft');
      users.assignedAtCreation = res.body.interview.id;

      const db = getDatabase();
      const stored = await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).findOne({ _id: users.assignedAtCreation });
      assert.strictEqual(stored.interviewer_id, users.interviewer.id);
    });

    it('HR can assign an interviewer to an existing own interview', async () => {
      const created = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: { title: 'Backend Screen — Assign Later', candidateId: candidateProfileId },
      });
      assert.strictEqual(created.statusCode, 201);
      users.int1InterviewId = created.body.interview.id;

      const res = await makeRequest(`/api/interviews/${users.int1InterviewId}/assign`, {
        method: 'POST',
        token: users.hr1.token,
        body: { interviewerId: users.interviewer.id },
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.interview.interviewer.id, users.interviewer.id);
      assert.strictEqual(res.body.interview.interviewer.name, 'Interviewer One');
    });

    it('rejects assignment with an invalid interviewer reference (400)', async () => {
      const res = await makeRequest(`/api/interviews/${users.int1InterviewId}/assign`, {
        method: 'POST',
        token: users.hr1.token,
        body: { interviewerId: 'nonexistent-interviewer-id' },
      });
      assert.strictEqual(res.statusCode, 400);
    });

    it('rejects assignment of a user without the interviewer role (400)', async () => {
      const res = await makeRequest(`/api/interviews/${users.int1InterviewId}/assign`, {
        method: 'POST',
        token: users.hr1.token,
        body: { interviewerId: users.interviewee.id },
      });
      assert.strictEqual(res.statusCode, 400);
    });

    it('rejects assignment by a non-owning HR (403)', async () => {
      const res = await makeRequest(`/api/interviews/${users.int1InterviewId}/assign`, {
        method: 'POST',
        token: users.hr2.token,
        body: { interviewerId: users.interviewer2.id },
      });
      assert.strictEqual(res.statusCode, 403);
    });

    it('rejects assignment on an in-progress interview (409; lifecycle preserved)', async () => {
      const db = getDatabase();
      await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).updateOne(
        { _id: users.int1InterviewId },
        { $set: { status: 'in_progress' } }
      );
      const res = await makeRequest(`/api/interviews/${users.int1InterviewId}/assign`, {
        method: 'POST',
        token: users.hr1.token,
        body: { interviewerId: users.interviewer2.id },
      });
      assert.strictEqual(res.statusCode, 409);
    });

    it('rejects assignment on a completed interview (409)', async () => {
      const db = getDatabase();
      await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).updateOne(
        { _id: users.int1InterviewId },
        { $set: { status: 'completed', ended_at: new Date() } }
      );
      const res = await makeRequest(`/api/interviews/${users.int1InterviewId}/assign`, {
        method: 'POST',
        token: users.hr1.token,
        body: { interviewerId: users.interviewer2.id },
      });
      assert.strictEqual(res.statusCode, 409);
    });

    it('rejects creation with an invalid interviewer reference (400)', async () => {
      const res = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: { title: 'Ghost Interviewer', candidateId: candidateProfileId, interviewerId: 'nonexistent' },
      });
      assert.strictEqual(res.statusCode, 400);
    });
  });

  describe('INT-DASH: Assigned interview views', () => {
    let upcomingId;
    let ongoingId;
    let completedId;

    before(async () => {
      const profile = await findCandidateByUserId(users.interviewee.id);
      const db = getDatabase();

      // Upcoming (draft, scheduled in the future) — assigned to interviewer 1
      const upcoming = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: {
          title: 'Upcoming Interview',
          candidateId: profile._id,
          scheduledStartAt: '2026-12-15T09:00:00.000Z',
          interviewerId: users.interviewer.id,
        },
      });
      assert.strictEqual(upcoming.statusCode, 201);
      upcomingId = upcoming.body.interview.id;

      // Ongoing (in_progress) — assigned to interviewer 1
      const ongoing = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: {
          title: 'Ongoing Interview',
          candidateId: profile._id,
          interviewerId: users.interviewer.id,
        },
      });
      assert.strictEqual(ongoing.statusCode, 201);
      ongoingId = ongoing.body.interview.id;
      await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).updateOne(
        { _id: ongoingId },
        { $set: { status: 'in_progress', started_at: new Date() } }
      );

      // Completed — assigned to interviewer 1
      const completed = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: {
          title: 'Completed Interview',
          candidateId: profile._id,
          interviewerId: users.interviewer.id,
        },
      });
      assert.strictEqual(completed.statusCode, 201);
      completedId = completed.body.interview.id;
      await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).updateOne(
        { _id: completedId },
        { $set: { status: 'completed', started_at: new Date(), ended_at: new Date() } }
      );

      // Assigned to interviewer 2 only (isolation probe)
      const other = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: {
          title: 'Other Interviewer Session',
          candidateId: profile._id,
          interviewerId: users.interviewer2.id,
        },
      });
      assert.strictEqual(other.statusCode, 201);
      users.int2InterviewId = other.body.interview.id;

      // Unassigned (no interviewer) — must not appear for any interviewer
      const unassigned = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: { title: 'Unassigned Interview', candidateId: profile._id },
      });
      assert.strictEqual(unassigned.statusCode, 201);
    });

    it('INT-DASH-001: interviewer can retrieve assigned interviews', async () => {
      const res = await makeRequest('/api/interviewer/interviews', { token: users.interviewer.token });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.status, 'ok');
      assert.ok(Array.isArray(res.body.interviews));
    });

    it('INT-DASH-005: upcoming interviews are correctly represented', async () => {
      const res = await makeRequest('/api/interviewer/interviews', { token: users.interviewer.token });
      const upcoming = res.body.interviews.find((i) => i.id === upcomingId);
      assert.ok(upcoming, 'upcoming interview must be in the assigned list');
      assert.strictEqual(upcoming.status, 'draft');
      assert.strictEqual(upcoming.scheduled_start_at, '2026-12-15T09:00:00.000Z');
      assert.strictEqual(upcoming.candidate.name, 'Candidate One');
    });

    it('INT-DASH-006: ongoing interviews are correctly represented', async () => {
      const res = await makeRequest('/api/interviewer/interviews', { token: users.interviewer.token });
      const ongoing = res.body.interviews.find((i) => i.id === ongoingId);
      assert.ok(ongoing, 'ongoing interview must be in the assigned list');
      assert.strictEqual(ongoing.status, 'in_progress');
      assert.ok(ongoing.started_at, 'started_at is exposed for the ongoing session');
    });

    it('INT-DASH-007: completed interviews are correctly represented', async () => {
      const res = await makeRequest('/api/interviewer/interviews', { token: users.interviewer.token });
      const completed = res.body.interviews.find((i) => i.id === completedId);
      assert.ok(completed, 'completed interview must be in the assigned list');
      assert.strictEqual(completed.status, 'completed');
      assert.ok(completed.ended_at);
    });

    it('INT-DASH-002/INT-SEC-001: unauthorized and other-interviewer sessions are not listed', async () => {
      const res = await makeRequest('/api/interviewer/interviews', { token: users.interviewer.token });
      const ids = res.body.interviews.map((i) => i.id);
      assert.ok(!ids.includes(users.int2InterviewId), "another interviewer's session must not leak");
      assert.ok(
        !res.body.interviews.some((i) => i.title === 'Unassigned Interview'),
        'unassigned interviews must not appear for interviewers'
      );
      for (const interview of res.body.interviews) {
        assert.ok(!JSON.stringify(interview).includes('password'), 'no password material in responses');
      }
    });

    it('INT-DASH-004: empty state when no interviews are assigned', async () => {
      const db = getDatabase();
      const { createUser } = await import('../src/db/persistence.js');
      const { hashPassword } = await import('../src/auth/password.js');
      const { signToken } = await import('../src/auth/tokens.js');
      await createUser({
        name: 'Idle Interviewer',
        email: 'idle-int@example.local',
        passwordHash: await hashPassword('Password123'),
        role: 'interviewer',
      });
      const login = await makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'idle-int@example.local', password: 'Password123' },
      });
      const token = login.body.token;
      const res = await makeRequest('/api/interviewer/interviews', { token });
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body.interviews, []);
    });

    it('INT-DASH-003: interviewer can open an authorized assigned interview', async () => {
      const res = await makeRequest(`/api/interviewer/interviews/${upcomingId}`, { token: users.interviewer.token });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.interview.id, upcomingId);
      assert.strictEqual(res.body.interview.title, 'Upcoming Interview');
      assert.strictEqual(res.body.interview.candidate.name, 'Candidate One');
      assert.ok(!('candidate_email' in res.body.interview), 'candidate contact data is withheld from interviewer view');
    });

    it('INT-DASH-002: interviewer cannot open an interview they are not assigned to (403)', async () => {
      const res = await makeRequest(`/api/interviewer/interviews/${users.int2InterviewId}`, {
        token: users.interviewer.token,
      });
      assert.strictEqual(res.statusCode, 403);
    });

    it('interviewer cannot open an unassigned interview (403)', async () => {
      const db = getDatabase();
      const unassigned = await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).findOne({ title: 'Unassigned Interview' });
      assert.ok(unassigned);
      const res = await makeRequest(`/api/interviewer/interviews/${unassigned._id}`, { token: users.interviewer.token });
      assert.strictEqual(res.statusCode, 403);
    });

    it('returns 404 for an unknown interview id', async () => {
      const res = await makeRequest('/api/interviewer/interviews/nonexistent-interview-id', {
        token: users.interviewer.token,
      });
      assert.strictEqual(res.statusCode, 404);
    });
  });

  describe('INT-REPORT: Permitted report access', () => {
    let reportedId;

    before(async () => {
      const profile = await findCandidateByUserId(users.interviewee.id);
      const created = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: {
          title: 'Interview With Report',
          candidateId: profile._id,
          interviewerId: users.interviewer.id,
        },
      });
      assert.strictEqual(created.statusCode, 201);
      reportedId = created.body.interview.id;

      const db = getDatabase();
      await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).updateOne(
        { _id: reportedId },
        { $set: { status: 'completed', ended_at: new Date() } }
      );
    });

    it('INT-REPORT-002: report access is honest when no report exists (404, no fabrication)', async () => {
      const res = await makeRequest(`/api/interviewer/interviews/${reportedId}/report`, {
        token: users.interviewer.token,
      });
      assert.strictEqual(res.statusCode, 404);
    });

    it('INT-REPORT-001: assigned interviewer can access a permitted report', async () => {
      const db = getDatabase();
      await db.collection(COLLECTIONS.FINAL_REPORTS).insertOne({
        _id: 'report-fixture-001',
        interview_id: reportedId,
        summary: 'Synthetic post-interview summary for access-path verification.',
        integrity_indicators: null,
        generated_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });
      const res = await makeRequest(`/api/interviewer/interviews/${reportedId}/report`, {
        token: users.interviewer.token,
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.report.interview_id, reportedId);
      assert.strictEqual(res.body.report.summary, 'Synthetic post-interview summary for access-path verification.');
    });

    it("INT-REPORT-002: another interviewer cannot access the report (403)", async () => {
      const res = await makeRequest(`/api/interviewer/interviews/${reportedId}/report`, {
        token: users.interviewer2.token,
      });
      assert.strictEqual(res.statusCode, 403);
    });
  });

  describe('Interviewer selection list (HR assignment support)', () => {
    it('HR can list active interviewer users (safe fields only)', async () => {
      const res = await makeRequest('/api/interviewers', { token: users.hr1.token });
      assert.strictEqual(res.statusCode, 200);
      assert.ok(Array.isArray(res.body.interviewers));
      assert.strictEqual(res.body.interviewers.length, 3, 'three registered interviewers');
      for (const interviewer of res.body.interviewers) {
        assert.ok(!('password_hash' in interviewer));
        assert.strictEqual(interviewer.status, 'active');
      }
    });
  });

  describe('INT-REG-001: Health regression (Phases 3-7 preserved)', () => {
    it('GET /health still works unchanged', async () => {
      const res = await makeRequest('/health');
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.status, 'ok');
      assert.strictEqual(res.body.service, 'interview-monitoring-backend');
    });

    it('GET /ready still works', async () => {
      const res = await makeRequest('/ready');
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.status, 'ready');
    });
  });
});
