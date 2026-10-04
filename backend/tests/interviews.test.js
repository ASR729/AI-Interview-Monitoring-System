import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

process.env.NODE_ENV = 'test';
process.env.MONGODB_DB_NAME = 'interview_monitoring_hr_test';
process.env.JWT_SECRET = 'phase7-hr-product-test-secret';

const TEST_DB_NAME = 'interview_monitoring_hr_test';

const { default: app } = await import('../src/app.js');
const { connectDatabase, closeDatabase, getDatabase, getDatabaseName } = await import('../src/config/database.js');
const { ensureBaselineIndexes } = await import('../src/db/indexes.js');
const { COLLECTIONS } = await import('../src/db/collections.js');
const { findRecruiterByUserId, findCandidateByUserId } = await import('../src/db/persistence.js');

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

describe('HR Interview Management (Phase 7)', () => {
  const users = {};

  before(async () => {
    const db = await connectDatabase();
    assert.ok(db, 'MongoDB connection must succeed for Phase 7 tests');
    assert.strictEqual(getDatabaseName(), TEST_DB_NAME);
    await ensureBaselineIndexes(db);
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    port = server.address().port;

    // Synthetic accounts (synthetic data only; dedicated _test database)
    for (const [name, role, email] of [
      ['HR Owner', 'hr', 'hr-owner@example.local'],
      ['HR Other', 'hr', 'hr-other@example.local'],
      ['Interviewer One', 'interviewer', 'int1@example.local'],
      ['Candidate One', 'interviewee', 'cand1@example.local'],
    ]) {
      const res = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name, email, password: 'Password123', role, ...(role === 'hr' ? { company: `${name} Corp` } : {}) },
      });
      assert.strictEqual(res.statusCode, 201, `registration of ${email} must succeed`);
      users[role === 'hr' ? (email.startsWith('hr-owner') ? 'hr1' : 'hr2') : role] = {
        token: res.body.token,
        id: res.body.user.id,
      };
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

  describe('Authentication (unauthenticated requests are rejected)', () => {
    it('rejects unauthenticated interview creation (401)', async () => {
      const res = await makeRequest('/api/interviews', {
        method: 'POST',
        body: { title: 'Unauthorized', candidateId: 'any' },
      });
      assert.strictEqual(res.statusCode, 401);
    });

    it('rejects unauthenticated interview listing (401)', async () => {
      const res = await makeRequest('/api/interviews');
      assert.strictEqual(res.statusCode, 401);
    });

    it('rejects unauthenticated interview details (401)', async () => {
      const res = await makeRequest('/api/interviews/some-id');
      assert.strictEqual(res.statusCode, 401);
    });

    it('rejects unauthenticated interview update (401)', async () => {
      const res = await makeRequest('/api/interviews/some-id', { method: 'PATCH', body: { title: 'X' } });
      assert.strictEqual(res.statusCode, 401);
    });

    it('rejects unauthenticated invitation (401)', async () => {
      const res = await makeRequest('/api/interviews/some-id/invite', { method: 'POST' });
      assert.strictEqual(res.statusCode, 401);
    });

    it('rejects unauthenticated candidate listing (401)', async () => {
      const res = await makeRequest('/api/candidates');
      assert.strictEqual(res.statusCode, 401);
    });
  });

  describe('Role authorization (cross-role access is blocked)', () => {
    it('HR can access HR interview endpoints (200)', async () => {
      const list = await makeRequest('/api/interviews', { token: users.hr1.token });
      assert.strictEqual(list.statusCode, 200);
      assert.strictEqual(list.body.status, 'ok');
      assert.ok(Array.isArray(list.body.interviews));
    });

    it('Interviewer cannot access HR-only interview management (403)', async () => {
      const list = await makeRequest('/api/interviews', { token: users.interviewer.token });
      assert.strictEqual(list.statusCode, 403);
      const create = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.interviewer.token,
        body: { title: 'No', candidateId: 'x' },
      });
      assert.strictEqual(create.statusCode, 403);
      const detail = await makeRequest('/api/interviews/some-id', { token: users.interviewer.token });
      assert.strictEqual(detail.statusCode, 403);
      const update = await makeRequest('/api/interviews/some-id', {
        method: 'PATCH',
        token: users.interviewer.token,
        body: { title: 'X' },
      });
      assert.strictEqual(update.statusCode, 403);
      const invite = await makeRequest('/api/interviews/some-id/invite', {
        method: 'POST',
        token: users.interviewer.token,
      });
      assert.strictEqual(invite.statusCode, 403);
    });

    it('Interviewee cannot access HR-only interview management (403)', async () => {
      const list = await makeRequest('/api/interviews', { token: users.interviewee.token });
      assert.strictEqual(list.statusCode, 403);
      const create = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.interviewee.token,
        body: { title: 'No', candidateId: 'x' },
      });
      assert.strictEqual(create.statusCode, 403);
      const detail = await makeRequest('/api/interviews/some-id', { token: users.interviewee.token });
      assert.strictEqual(detail.statusCode, 403);
      const update = await makeRequest('/api/interviews/some-id', {
        method: 'PATCH',
        token: users.interviewee.token,
        body: { title: 'X' },
      });
      assert.strictEqual(update.statusCode, 403);
      const invite = await makeRequest('/api/interviews/some-id/invite', {
        method: 'POST',
        token: users.interviewee.token,
      });
      assert.strictEqual(invite.statusCode, 403);
    });

    it('Interviewer and Interviewee cannot list candidates for HR selection (403)', async () => {
      const asInterviewer = await makeRequest('/api/candidates', { token: users.interviewer.token });
      assert.strictEqual(asInterviewer.statusCode, 403);
      const asInterviewee = await makeRequest('/api/candidates', { token: users.interviewee.token });
      assert.strictEqual(asInterviewee.statusCode, 403);
    });
  });

  describe('Candidate selection list', () => {
    it('HR can list candidates (safe fields only)', async () => {
      const res = await makeRequest('/api/candidates', { token: users.hr1.token });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.status, 'ok');
      assert.ok(Array.isArray(res.body.candidates));
      assert.strictEqual(res.body.candidates.length, 1, 'the registered interviewee produces one candidate profile');
      const candidate = res.body.candidates[0];
      assert.strictEqual(candidate.email, 'cand1@example.local');
      assert.ok(!JSON.stringify(res.body).includes('password'), 'no password/hash in response');
      assert.ok(!('password_hash' in candidate));
    });
  });

  describe('Interview creation', () => {
    let candidateProfileId;

    before(async () => {
      const profile = await findCandidateByUserId(users.interviewee.id);
      assert.ok(profile);
      candidateProfileId = profile._id;
    });

    it('creates a valid interview (201) with the approved fields', async () => {
      const res = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: {
          title: 'Senior Frontend Engineer — Technical Screen',
          candidateId: candidateProfileId,
          scheduledStartAt: '2026-11-01T10:00:00.000Z',
        },
      });
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.status, 'ok');
      const interview = res.body.interview;
      assert.ok(interview.id);
      assert.strictEqual(interview.title, 'Senior Frontend Engineer — Technical Screen');
      assert.strictEqual(interview.status, 'draft');
      assert.strictEqual(interview.candidate.id, candidateProfileId);
      assert.strictEqual(interview.candidate.email, 'cand1@example.local');
      assert.strictEqual(interview.scheduled_start_at, '2026-11-01T10:00:00.000Z');
      assert.strictEqual(interview.invite_reference, null);
      users.hr1.interviewId = interview.id;
    });

    it('persists the interview in interview_sessions with the correct ownership relationship', async () => {
      const db = getDatabase();
      const stored = await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).findOne({ _id: users.hr1.interviewId });
      assert.ok(stored, 'interview must be persisted in MongoDB');
      const recruiterProfile = await findRecruiterByUserId(users.hr1.id);
      assert.ok(recruiterProfile);
      assert.strictEqual(stored.recruiter_id, recruiterProfile._id, 'ownership must match the owning HR recruiter profile');
      assert.strictEqual(stored.candidate_id, await (async () => (await findCandidateByUserId(users.interviewee.id))._id)());
      assert.strictEqual(stored.status, 'draft');
    });

    it('creates a draft interview without a schedule (optional field omitted)', async () => {
      const res = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: { title: 'Unscheduled Interview', candidateId: candidateProfileId },
      });
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.interview.scheduled_start_at, null);
      assert.strictEqual(res.body.interview.status, 'draft');
    });

    it('rejects invalid interview data (400): missing title', async () => {
      const res = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: { candidateId: candidateProfileId },
      });
      assert.strictEqual(res.statusCode, 400);
    });

    it('rejects invalid interview data (400): missing candidate', async () => {
      const res = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: { title: 'No Candidate' },
      });
      assert.strictEqual(res.statusCode, 400);
    });

    it('rejects invalid interview data (400): malformed schedule date', async () => {
      const res = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: { title: 'Bad Date', candidateId: candidateProfileId, scheduledStartAt: 'not-a-date' },
      });
      assert.strictEqual(res.statusCode, 400);
    });

    it('rejects an invalid candidate reference (400)', async () => {
      const res = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr1.token,
        body: { title: 'Ghost Candidate', candidateId: 'nonexistent-candidate-id' },
      });
      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.body.status, 'error');
    });

    it('rejects creation when the HR account has no recruiter profile (403)', async () => {
      const { createUser } = await import('../src/db/persistence.js');
      const { hashPassword } = await import('../src/auth/password.js');
      const { signToken } = await import('../src/auth/tokens.js');
      await createUser({
        name: 'Broken HR',
        email: 'broken-hr@example.local',
        passwordHash: await hashPassword('Password123'),
        role: 'recruiter',
      });
      const login = await makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'broken-hr@example.local', password: 'Password123' },
      });
      assert.strictEqual(login.statusCode, 200);
      const token = signToken({ sub: login.body.user.id });
      const res = await makeRequest('/api/interviews', {
        method: 'POST',
        token,
        body: { title: 'No Profile', candidateId: candidateProfileId },
      });
      assert.strictEqual(res.statusCode, 403);
    });
  });

  describe('Interview list (ownership boundary)', () => {
    before(async () => {
      const profile = await findCandidateByUserId(users.interviewee.id);
      const res = await makeRequest('/api/interviews', {
        method: 'POST',
        token: users.hr2.token,
        body: { title: 'HR Other Interview', candidateId: profile._id },
      });
      assert.strictEqual(res.statusCode, 201);
      users.hr2.interviewId = res.body.interview.id;
    });

    it('HR lists only their own interviews', async () => {
      const res = await makeRequest('/api/interviews', { token: users.hr1.token });
      assert.strictEqual(res.statusCode, 200);
      const ids = res.body.interviews.map((i) => i.id);
      assert.ok(ids.includes(users.hr1.interviewId));
      assert.ok(!ids.includes(users.hr2.interviewId), "must not receive another HR's interview");
      for (const interview of res.body.interviews) {
        assert.strictEqual(interview.candidate.email, 'cand1@example.local');
        assert.ok(!JSON.stringify(interview).includes('password'), 'no password material in list responses');
      }
    });

    it('the other HR sees only their own interview (no leakage either way)', async () => {
      const res = await makeRequest('/api/interviews', { token: users.hr2.token });
      assert.strictEqual(res.statusCode, 200);
      const ids = res.body.interviews.map((i) => i.id);
      assert.ok(ids.includes(users.hr2.interviewId));
      assert.ok(!ids.includes(users.hr1.interviewId));
    });

    it('empty dataset returns a correct empty list (dashboard empty state)', async () => {
      const { createUser, createRecruiter } = await import('../src/db/persistence.js');
      const { hashPassword } = await import('../src/auth/password.js');
      const { signToken } = await import('../src/auth/tokens.js');
      const user = await createUser({
        name: 'Empty HR',
        email: 'empty-hr@example.local',
        passwordHash: await hashPassword('Password123'),
        role: 'recruiter',
      });
      await createRecruiter({ userId: user._id });
      const token = signToken({ sub: user._id });
      const res = await makeRequest('/api/interviews', { token });
      assert.strictEqual(res.statusCode, 200);
      assert.deepStrictEqual(res.body.interviews, []);
    });
  });

  describe('Interview details', () => {
    it('HR retrieves their own authorized interview (200)', async () => {
      const res = await makeRequest(`/api/interviews/${users.hr1.interviewId}`, { token: users.hr1.token });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.interview.id, users.hr1.interviewId);
      assert.strictEqual(res.body.interview.candidate.email, 'cand1@example.local');
    });

    it("HR cannot retrieve another HR's interview (403)", async () => {
      const res = await makeRequest(`/api/interviews/${users.hr2.interviewId}`, { token: users.hr1.token });
      assert.strictEqual(res.statusCode, 403);
    });

    it('returns 404 for an unknown interview id', async () => {
      const res = await makeRequest('/api/interviews/nonexistent-interview-id', { token: users.hr1.token });
      assert.strictEqual(res.statusCode, 404);
    });
  });

  describe('Interview update', () => {
    it('HR updates the title and schedule where permitted (200)', async () => {
      const res = await makeRequest(`/api/interviews/${users.hr1.interviewId}`, {
        method: 'PATCH',
        token: users.hr1.token,
        body: { title: 'Senior Frontend Engineer — Final Round', scheduledStartAt: '2026-11-02T14:00:00.000Z' },
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.interview.title, 'Senior Frontend Engineer — Final Round');
      assert.strictEqual(res.body.interview.scheduled_start_at, '2026-11-02T14:00:00.000Z');

      const db = getDatabase();
      const stored = await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).findOne({ _id: users.hr1.interviewId });
      assert.strictEqual(stored.title, 'Senior Frontend Engineer — Final Round');
    });

    it('HR can clear the schedule (null)', async () => {
      const res = await makeRequest(`/api/interviews/${users.hr1.interviewId}`, {
        method: 'PATCH',
        token: users.hr1.token,
        body: { scheduledStartAt: null },
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.interview.scheduled_start_at, null);
    });

    it("rejects an update by another HR (403)", async () => {
      const res = await makeRequest(`/api/interviews/${users.hr1.interviewId}`, {
        method: 'PATCH',
        token: users.hr2.token,
        body: { title: 'Hostile Takeover' },
      });
      assert.strictEqual(res.statusCode, 403);
    });

    it('rejects an update with no updatable fields (400)', async () => {
      const res = await makeRequest(`/api/interviews/${users.hr1.interviewId}`, {
        method: 'PATCH',
        token: users.hr1.token,
        body: {},
      });
      assert.strictEqual(res.statusCode, 400);
    });

    it('rejects an empty title (400)', async () => {
      const res = await makeRequest(`/api/interviews/${users.hr1.interviewId}`, {
        method: 'PATCH',
        token: users.hr1.token,
        body: { title: '   ' },
      });
      assert.strictEqual(res.statusCode, 400);
    });

    it('rejects a malformed schedule date (400)', async () => {
      const res = await makeRequest(`/api/interviews/${users.hr1.interviewId}`, {
        method: 'PATCH',
        token: users.hr1.token,
        body: { scheduledStartAt: 'not-a-date' },
      });
      assert.strictEqual(res.statusCode, 400);
    });

    it('returns 404 when updating an unknown interview', async () => {
      const res = await makeRequest('/api/interviews/nonexistent-interview-id', {
        method: 'PATCH',
        token: users.hr1.token,
        body: { title: 'X' },
      });
      assert.strictEqual(res.statusCode, 404);
    });
  });

  describe('Invitation workflow', () => {
    it('rejects an invitation for an unknown interview (404)', async () => {
      const res = await makeRequest('/api/interviews/nonexistent-interview-id/invite', {
        method: 'POST',
        token: users.hr1.token,
      });
      assert.strictEqual(res.statusCode, 404);
    });

    it("rejects an invitation by a non-owning HR (403)", async () => {
      const res = await makeRequest(`/api/interviews/${users.hr1.interviewId}/invite`, {
        method: 'POST',
        token: users.hr2.token,
      });
      assert.strictEqual(res.statusCode, 403);
    });

    it('initiates the invitation for a draft interview (200): draft -> invited with reference', async () => {
      const res = await makeRequest(`/api/interviews/${users.hr1.interviewId}/invite`, {
        method: 'POST',
        token: users.hr1.token,
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.interview.status, 'invited');
      assert.ok(res.body.interview.invite_reference, 'an opaque invite reference must be generated');
    });

    it('persists the invitation state correctly in interview_sessions', async () => {
      const db = getDatabase();
      const stored = await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).findOne({ _id: users.hr1.interviewId });
      assert.strictEqual(stored.status, 'invited');
      assert.ok(typeof stored.invite_reference === 'string' && stored.invite_reference.length > 0);
    });

    it('rejects re-inviting an already invited interview (409)', async () => {
      const res = await makeRequest(`/api/interviews/${users.hr1.interviewId}/invite`, {
        method: 'POST',
        token: users.hr1.token,
      });
      assert.strictEqual(res.statusCode, 409);
    });

    it('rejects inviting an interview that is not in the draft state (409)', async () => {
      const db = getDatabase();
      await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).updateOne(
        { _id: users.hr2.interviewId },
        { $set: { status: 'scheduled' } }
      );
      const res = await makeRequest(`/api/interviews/${users.hr2.interviewId}/invite`, {
        method: 'POST',
        token: users.hr2.token,
      });
      assert.strictEqual(res.statusCode, 409);
    });
  });

  describe('Health regression (Phases 3/5 preserved)', () => {
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
