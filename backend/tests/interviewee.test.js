import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

process.env.NODE_ENV = 'test';
process.env.MONGODB_DB_NAME = 'interview_monitoring_candidate_test';
process.env.JWT_SECRET = 'phase9-candidate-product-test-secret';

const TEST_DB_NAME = 'interview_monitoring_candidate_test';

const { default: app } = await import('../src/app.js');
const { connectDatabase, closeDatabase, getDatabase, getDatabaseName } = await import('../src/config/database.js');
const { ensureBaselineIndexes } = await import('../src/db/indexes.js');
const { COLLECTIONS } = await import('../src/db/collections.js');
const { findCandidateByUserId, findRecruiterByUserId } = await import('../src/db/persistence.js');

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

describe('Candidate/Interviewee Product (Phase 9)', () => {
  const users = {};

  before(async () => {
    const db = await connectDatabase();
    assert.ok(db, 'MongoDB connection must succeed for Phase 9 tests');
    assert.strictEqual(getDatabaseName(), TEST_DB_NAME);
    await ensureBaselineIndexes(db);
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    port = server.address().port;

    for (const [name, role, email] of [
      ['HR Owner', 'hr', 'hr-owner@example.local'],
      ['Candidate One', 'interviewee', 'cand1@example.local'],
      ['Candidate Two', 'interviewee', 'cand2@example.local'],
      ['Interviewer One', 'interviewer', 'int1@example.local'],
    ]) {
      const res = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name, email, password: 'Password123', role, ...(role === 'hr' ? { company: `${name} Corp` } : {}) },
      });
      assert.strictEqual(res.statusCode, 201, `registration of ${email} must succeed`);
      const key = email.startsWith('cand') ? (email.includes('cand1') ? 'cand1' : 'cand2') : (email.startsWith('int') ? 'interviewer' : 'hr1');
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

  describe('Authorization: unauthenticated and wrong-role requests', () => {
    it('rejects unauthenticated candidate interview listing (401)', async () => {
      const res = await makeRequest('/api/interviewee/interviews');
      assert.strictEqual(res.statusCode, 401);
    });

    it('rejects unauthenticated candidate interview detail (401)', async () => {
      const res = await makeRequest('/api/interviewee/interviews/some-id');
      assert.strictEqual(res.statusCode, 401);
    });

    it('HR cannot access candidate-only endpoints (403)', async () => {
      const list = await makeRequest('/api/interviewee/interviews', { token: users.hr1.token });
      assert.strictEqual(list.statusCode, 403);
      const detail = await makeRequest('/api/interviewee/interviews/some-id', { token: users.hr1.token });
      assert.strictEqual(detail.statusCode, 403);
    });

    it('Interviewer cannot access candidate-only endpoints (403)', async () => {
      const list = await makeRequest('/api/interviewee/interviews', { token: users.interviewer.token });
      assert.strictEqual(list.statusCode, 403);
      const detail = await makeRequest('/api/interviewee/interviews/some-id', { token: users.interviewer.token });
      assert.strictEqual(detail.statusCode, 403);
    });
  });

  describe('Candidate interview access (ownership boundary)', () => {
    let cand1InterviewId;
    let cand2InterviewId;

    before(async () => {
      const cand1Profile = await findCandidateByUserId(users.cand1.id);
      const cand2Profile = await findCandidateByUserId(users.cand2.id);
      const hrProfile = await findRecruiterByUserId(users.hr1.id);
      assert.ok(cand1Profile && cand2Profile && hrProfile);

      const { createInterviewSession } = await import('../src/db/persistence.js');
      const assigned = await createInterviewSession({
        recruiterId: hrProfile._id,
        candidateId: cand1Profile._id,
        title: 'Candidate One Interview',
        interviewerId: users.interviewer.id,
      });
      cand1InterviewId = assigned._id;

      const other = await createInterviewSession({
        recruiterId: hrProfile._id,
        candidateId: cand2Profile._id,
        title: 'Candidate Two Private Interview',
      });
      cand2InterviewId = other._id;
    });

    it('candidate can retrieve own assigned interviews (200)', async () => {
      const res = await makeRequest('/api/interviewee/interviews', { token: users.cand1.token });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.status, 'ok');
      const ids = res.body.interviews.map((i) => i.id);
      assert.ok(ids.includes(cand1InterviewId));
      assert.ok(!ids.includes(cand2InterviewId), "another candidate's interview must not be listed");
      const interview = res.body.interviews[0];
      assert.strictEqual(interview.title, 'Candidate One Interview');
      assert.strictEqual(interview.interviewer.name, 'Interviewer One');
      assert.ok(!JSON.stringify(res.body).includes('password'), 'no password material in responses');
    });

    it('candidate can open own assigned interview (200)', async () => {
      const res = await makeRequest(`/api/interviewee/interviews/${cand1InterviewId}`, { token: users.cand1.token });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.interview.id, cand1InterviewId);
      assert.strictEqual(res.body.interview.title, 'Candidate One Interview');
      assert.strictEqual(res.body.interview.interviewer.name, 'Interviewer One');
    });

    it("candidate cannot open another candidate's interview by URL modification (403)", async () => {
      const res = await makeRequest(`/api/interviewee/interviews/${cand2InterviewId}`, { token: users.cand1.token });
      assert.strictEqual(res.statusCode, 403);
    });

    it("candidate cannot bypass authorization using query parameters (403)", async () => {
      const res = await makeRequest(`/api/interviewee/interviews/${cand2InterviewId}?candidateId=${users.cand1.id}`, {
        token: users.cand1.token,
      });
      assert.strictEqual(res.statusCode, 403);
    });

    it('candidate cannot bypass authorization using a request-body candidate ID (no interview data returned)', async () => {
      const res = await makeRequest(`/api/interviewee/interviews/${cand2InterviewId}`, {
        method: 'POST',
        token: users.cand1.token,
        body: { candidateId: users.cand1.id },
      });
      // The candidate detail API exposes no POST route — a body-injected
      // candidateId cannot influence authorization; the request is denied
      // (404 method-not-routed) and leaks no interview data either way.
      assert.ok(res.statusCode === 404 || res.statusCode === 403, 'request must be denied');
      assert.strictEqual(JSON.stringify(res.body).includes('Candidate Two'), false);
    });

    it("candidate's list is not affected by supplying another candidate's ID as a query parameter", async () => {
      const clean = await makeRequest('/api/interviewee/interviews', { token: users.cand1.token });
      const tampered = await makeRequest(`/api/interviewee/interviews?candidateId=${users.cand2.id}`, { token: users.cand1.token });
      assert.strictEqual(clean.statusCode, 200);
      assert.strictEqual(tampered.statusCode, 200);
      assert.deepStrictEqual(
        tampered.body.interviews.map((i) => i.id),
        clean.body.interviews.map((i) => i.id),
        'query candidateId must not influence server-side authorization'
      );
    });

    it('returns 404 for a nonexistent interview', async () => {
      const res = await makeRequest('/api/interviewee/interviews/nonexistent-interview-id', { token: users.cand1.token });
      assert.strictEqual(res.statusCode, 404);
    });

    it('candidate with no candidate profile is denied (403)', async () => {
      const { createUser } = await import('../src/db/persistence.js');
      const { hashPassword } = await import('../src/auth/password.js');
      const { signToken } = await import('../src/auth/tokens.js');
      const orphan = await createUser({
        name: 'Broken Candidate',
        email: 'broken-cand@example.local',
        passwordHash: await hashPassword('Password123'),
        role: 'candidate',
      });
      const token = signToken({ sub: orphan._id });
      const res = await makeRequest('/api/interviewee/interviews', { token });
      assert.strictEqual(res.statusCode, 403);
    });

    it('lifecycle restrictions: completed interviews are not presented as active', async () => {
      const db = getDatabase();
      await db.collection(COLLECTIONS.INTERVIEW_SESSIONS).updateOne(
        { _id: cand1InterviewId },
        { $set: { status: 'completed', started_at: new Date(), ended_at: new Date() } }
      );
      const res = await makeRequest('/api/interviewee/interviews', { token: users.cand1.token });
      assert.strictEqual(res.statusCode, 200);
      const interview = res.body.interviews.find((i) => i.id === cand1InterviewId);
      assert.ok(interview);
      assert.strictEqual(interview.status, 'completed');
      assert.ok(interview.ended_at, 'ended_at is exposed for completed sessions');
    });
  });

  describe('INT-REG-001: Health regression (Phases 3-8 preserved)', () => {
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
