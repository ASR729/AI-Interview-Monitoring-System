import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

process.env.NODE_ENV = 'test';
process.env.MONGODB_DB_NAME = 'interview_monitoring_auth_test';
process.env.JWT_SECRET = 'phase6-auth-rbac-test-secret';

const TEST_DB_NAME = 'interview_monitoring_auth_test';

const { default: app } = await import('../src/app.js');
const { connectDatabase, closeDatabase, getDatabase, getDatabaseName } = await import('../src/config/database.js');
const { ensureBaselineIndexes } = await import('../src/db/indexes.js');
const { COLLECTIONS } = await import('../src/db/collections.js');
const { hashPassword } = await import('../src/auth/password.js');
const { PersistenceError, createUser, createRecruiter, createCandidate, createInterviewSession, findRecruiterByUserId, findCandidateByUserId } = await import('../src/db/persistence.js');

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

describe('Authentication & RBAC (Phase 6)', () => {
  before(async () => {
    const db = await connectDatabase();
    assert.ok(db, 'MongoDB connection must succeed for RBAC tests');
    assert.strictEqual(getDatabaseName(), TEST_DB_NAME);
    await ensureBaselineIndexes(db);
    await new Promise((resolve) => {
      server = app.listen(0, resolve);
    });
    port = server.address().port;
  });

  after(async () => {
    const activeDb = getDatabase();
    if (activeDb && activeDb.databaseName === TEST_DB_NAME) {
      await activeDb.dropDatabase();
    }
    if (server) await new Promise((resolve) => server.close(resolve));
    await closeDatabase();
  });

  const users = {};

  describe('Registration', () => {
    it('registers a valid HR user (201, token, safe user, product role)', async () => {
      const res = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'HR One', email: 'hr1@example.local', password: 'Password123', role: 'hr', company: 'Owner Corp' },
      });
      assert.strictEqual(res.statusCode, 201);
      assert.ok(res.body.token);
      assert.strictEqual(res.body.user.role, 'hr');
      assert.strictEqual(res.body.user.email, 'hr1@example.local');
      assert.strictEqual(JSON.stringify(res.body).includes('password'), false, 'no password/hash in response');
      users.hr1 = { token: res.body.token, id: res.body.user.id };
    });

    it('registers a valid Interviewer user', async () => {
      const res = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'Interviewer One', email: 'int1@example.local', password: 'Password123', role: 'interviewer' },
      });
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.user.role, 'interviewer');
      users.int1 = { token: res.body.token, id: res.body.user.id };
    });

    it('registers a valid Interviewee user', async () => {
      const res = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'Candidate One', email: 'cand1@example.local', password: 'Password123', role: 'interviewee' },
      });
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.user.role, 'interviewee');
      users.cand1 = { token: res.body.token, id: res.body.user.id };
    });

    it('rejects a duplicate email (409)', async () => {
      const res = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'Duplicate', email: 'hr1@example.local', password: 'Password123', role: 'hr' },
      });
      assert.strictEqual(res.statusCode, 409);
      assert.strictEqual(res.body.status, 'error');
    });

    it('rejects an invalid email format (400)', async () => {
      const res = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'Bad Email', email: 'not-an-email', password: 'Password123', role: 'hr' },
      });
      assert.strictEqual(res.statusCode, 400);
    });

    it('rejects missing credentials (400)', async () => {
      const missingName = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { email: 'missing@example.local', password: 'Password123', role: 'hr' },
      });
      assert.strictEqual(missingName.statusCode, 400);
      const missingPassword = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'No Password', email: 'missing@example.local', role: 'hr' },
      });
      assert.strictEqual(missingPassword.statusCode, 400);
    });

    it('rejects a short password (400)', async () => {
      const res = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'Short', email: 'short@example.local', password: 'short', role: 'hr' },
      });
      assert.strictEqual(res.statusCode, 400);
    });

    it('rejects unsupported roles (400): admin and superadmin are not registrable', async () => {
      const admin = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'Admin', email: 'admin1@example.local', password: 'Password123', role: 'admin' },
      });
      assert.strictEqual(admin.statusCode, 400);
      const superadmin = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'Super', email: 'super1@example.local', password: 'Password123', role: 'superadmin' },
      });
      assert.strictEqual(superadmin.statusCode, 400);
    });

    it('stores only a scrypt password hash; plaintext persistence MUST NOT occur', async () => {
      const db = getDatabase();
      const stored = await db.collection(COLLECTIONS.USERS).findOne({ email: 'hr1@example.local' });
      assert.ok(stored.password_hash);
      assert.ok(stored.password_hash.startsWith('scrypt$'));
      assert.ok(!JSON.stringify(stored).includes('Password123'), 'plaintext password must not be persisted');
    });

    it('creates the linked recruiter profile for HR registration', async () => {
      const db = getDatabase();
      const profile = await findRecruiterByUserId(users.hr1.id);
      assert.ok(profile, 'recruiter profile must exist');
      assert.strictEqual(profile.company, 'Owner Corp');
      const count = await db.collection(COLLECTIONS.RECRUITERS).countDocuments({ user_id: users.hr1.id });
      assert.strictEqual(count, 1);
    });

    it('creates the linked candidate profile for Interviewee registration', async () => {
      const profile = await findCandidateByUserId(users.cand1.id);
      assert.ok(profile, 'candidate profile must exist');
    });
  });

  describe('Login', () => {
    it('logs in a valid HR user (role from backend)', async () => {
      const res = await makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'hr1@example.local', password: 'Password123' },
      });
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.token);
      assert.strictEqual(res.body.user.role, 'hr');
      assert.ok(!JSON.stringify(res.body).includes('password_hash'), 'no password hash in response');
      users.hr1.token = res.body.token;
    });

    it('logs in a valid Interviewer user', async () => {
      const res = await makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'int1@example.local', password: 'Password123' },
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.user.role, 'interviewer');
      users.int1.token = res.body.token;
    });

    it('logs in a valid Interviewee user', async () => {
      const res = await makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'cand1@example.local', password: 'Password123' },
      });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.user.role, 'interviewee');
      users.cand1.token = res.body.token;
    });

    it('rejects an invalid password (401)', async () => {
      const res = await makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'hr1@example.local', password: 'WrongPassword123' },
      });
      assert.strictEqual(res.statusCode, 401);
    });

    it('rejects an unknown account with the same safe message as a wrong password (no enumeration)', async () => {
      const unknown = await makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'unknown@example.local', password: 'Password123' },
      });
      const wrongPassword = await makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'hr1@example.local', password: 'WrongPassword123' },
      });
      assert.strictEqual(unknown.statusCode, 401);
      assert.strictEqual(wrongPassword.statusCode, 401);
      assert.strictEqual(unknown.body.message, wrongPassword.body.message);
    });

    it('rejects missing credentials (401)', async () => {
      const res = await makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'hr1@example.local' },
      });
      assert.strictEqual(res.statusCode, 401);
    });
  });

  describe('Current authenticated user (/api/auth/me)', () => {
    it('returns the authenticated identity and role for HR', async () => {
      const res = await makeRequest('/api/auth/me', { token: users.hr1.token });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.user.email, 'hr1@example.local');
      assert.strictEqual(res.body.user.role, 'hr');
      assert.ok(!JSON.stringify(res.body).includes('password_hash'));
    });

    it('returns 401 without authentication', async () => {
      const res = await makeRequest('/api/auth/me');
      assert.strictEqual(res.statusCode, 401);
    });

    it('returns 401 for a malformed token', async () => {
      const res = await makeRequest('/api/auth/me', { token: 'malformed-token' });
      assert.strictEqual(res.statusCode, 401);
    });

    it('returns 401 for an expired token', async () => {
      process.env.JWT_SECRET = 'phase6-auth-rbac-test-secret';
      const { signToken } = await import('../src/auth/tokens.js');
      const expired = signToken({ sub: users.hr1.id }, { expiresIn: -10 });
      const res = await makeRequest('/api/auth/me', { token: expired });
      assert.strictEqual(res.statusCode, 401);
    });

    it('returns 401 for a token referencing a deleted/nonexistent user', async () => {
      process.env.JWT_SECRET = 'phase6-auth-rbac-test-secret';
      const { signToken } = await import('../src/auth/tokens.js');
      const ghost = signToken({ sub: 'nonexistent-user-id' });
      const res = await makeRequest('/api/auth/me', { token: ghost });
      assert.strictEqual(res.statusCode, 401);
    });
  });

  describe('Protected access (role-authorized endpoints)', () => {
    it('HR reaches the HR-protected endpoint (200)', async () => {
      const res = await makeRequest('/api/rbac/hr-only', { token: users.hr1.token });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.role, 'hr');
    });

    it('Interviewer reaches the Interviewer-protected endpoint (200)', async () => {
      const res = await makeRequest('/api/rbac/interviewer-only', { token: users.int1.token });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.role, 'interviewer');
    });

    it('Interviewee reaches the Interviewee-protected endpoint (200)', async () => {
      const res = await makeRequest('/api/rbac/interviewee-only', { token: users.cand1.token });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.role, 'interviewee');
    });

    it('rejects unauthenticated access to protected endpoints (401)', async () => {
      const hr = await makeRequest('/api/rbac/hr-only');
      assert.strictEqual(hr.statusCode, 401);
      const me = await makeRequest('/api/auth/me');
      assert.strictEqual(me.statusCode, 401);
    });
  });

  describe('Cross-role access (unauthorized roles blocked)', () => {
    it('Interviewer cannot access HR-protected resources (403)', async () => {
      const res = await makeRequest('/api/rbac/hr-only', { token: users.int1.token });
      assert.strictEqual(res.statusCode, 403);
    });

    it('Interviewee cannot access HR-protected resources (403)', async () => {
      const res = await makeRequest('/api/rbac/hr-only', { token: users.cand1.token });
      assert.strictEqual(res.statusCode, 403);
    });

    it('HR cannot access Interviewer-protected resources (403)', async () => {
      const res = await makeRequest('/api/rbac/interviewer-only', { token: users.hr1.token });
      assert.strictEqual(res.statusCode, 403);
    });

    it('Interviewee cannot access Interviewer-protected resources (403)', async () => {
      const res = await makeRequest('/api/rbac/interviewer-only', { token: users.cand1.token });
      assert.strictEqual(res.statusCode, 403);
    });

    it('HR cannot access Interviewee-protected resources (403)', async () => {
      const res = await makeRequest('/api/rbac/interviewee-only', { token: users.hr1.token });
      assert.strictEqual(res.statusCode, 403);
    });

    it('Interviewer cannot access Interviewee-protected resources (403)', async () => {
      const res = await makeRequest('/api/rbac/interviewee-only', { token: users.int1.token });
      assert.strictEqual(res.statusCode, 403);
    });

    it('403 (unauthorized) is distinct from 401 (unauthenticated)', async () => {
      const unauthenticated = await makeRequest('/api/rbac/hr-only');
      const unauthorized = await makeRequest('/api/rbac/hr-only', { token: users.int1.token });
      assert.strictEqual(unauthenticated.statusCode, 401);
      assert.strictEqual(unauthorized.statusCode, 403);
    });
  });

  describe('Resource authorization foundation (specific interview)', () => {
    let interviewId;

    before(async () => {
      const recruiterProfile = await findRecruiterByUserId(users.hr1.id);
      const candidateProfile = await findCandidateByUserId(users.cand1.id);
      const interview = await createInterviewSession({
        recruiterId: recruiterProfile._id,
        candidateId: candidateProfile._id,
        title: 'Phase 6 Authorization Foundation Interview',
      });
      interviewId = interview._id;

      const secondHr = await makeRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'HR Two', email: 'hr2@example.local', password: 'Password123', role: 'hr', company: 'Other Corp' },
      });
      users.hr2 = { token: secondHr.body.token, id: secondHr.body.user.id };
    });

    it('the owning HR user can access the interview (200)', async () => {
      const res = await makeRequest(`/api/rbac/interview/${interviewId}`, { token: users.hr1.token });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.interview._id, interviewId);
      assert.strictEqual(res.body.interview.title, 'Phase 6 Authorization Foundation Interview');
    });

    it('the participating Interviewee can access the interview (200)', async () => {
      const res = await makeRequest(`/api/rbac/interview/${interviewId}`, { token: users.cand1.token });
      assert.strictEqual(res.statusCode, 200);
    });

    it('another HR user (non-owner) cannot access the interview (403)', async () => {
      const res = await makeRequest(`/api/rbac/interview/${interviewId}`, { token: users.hr2.token });
      assert.strictEqual(res.statusCode, 403);
    });

    it('an Interviewer cannot access the unauthorized interview (403; assignment is Phase 8)', async () => {
      const res = await makeRequest(`/api/rbac/interview/${interviewId}`, { token: users.int1.token });
      assert.strictEqual(res.statusCode, 403);
    });

    it('returns 404 for an unknown interview id', async () => {
      const res = await makeRequest('/api/rbac/interview/nonexistent-interview-id', { token: users.hr1.token });
      assert.strictEqual(res.statusCode, 404);
    });

    it('rejects unauthenticated interview access (401)', async () => {
      const res = await makeRequest(`/api/rbac/interview/${interviewId}`);
      assert.strictEqual(res.statusCode, 401);
    });
  });

  describe('Admin role (recognized SRS role; no product-role access in Phase 6)', () => {
    it('an admin can authenticate but is denied product-role endpoints (403)', async () => {
      const passwordHash = await hashPassword('Password123');
      await createUser({ name: 'Admin One', email: 'admin@example.local', passwordHash, role: 'admin' });
      const login = await makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'admin@example.local', password: 'Password123' },
      });
      assert.strictEqual(login.statusCode, 200);
      assert.strictEqual(login.body.user.role, 'admin');
      const hrOnly = await makeRequest('/api/rbac/hr-only', { token: login.body.token });
      assert.strictEqual(hrOnly.statusCode, 403);
      const interviewerOnly = await makeRequest('/api/rbac/interviewer-only', { token: login.body.token });
      assert.strictEqual(interviewerOnly.statusCode, 403);
      const intervieweeOnly = await makeRequest('/api/rbac/interviewee-only', { token: login.body.token });
      assert.strictEqual(intervieweeOnly.statusCode, 403);
    });
  });

  describe('Logout', () => {
    it('returns success for an authenticated logout', async () => {
      const res = await makeRequest('/api/auth/logout', { method: 'POST', token: users.hr1.token });
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.status, 'ok');
    });

    it('rejects unauthenticated logout (401)', async () => {
      const res = await makeRequest('/api/auth/logout', { method: 'POST' });
      assert.strictEqual(res.statusCode, 401);
    });

    it('stateless JWT limitation: a token remains technically valid after logout until expiry (documented, no server-side revocation)', async () => {
      const login = await makeRequest('/api/auth/login', {
        method: 'POST',
        body: { email: 'int1@example.local', password: 'Password123' },
      });
      const token = login.body.token;
      const before = await makeRequest('/api/auth/me', { token });
      assert.strictEqual(before.statusCode, 200);
      await makeRequest('/api/auth/logout', { method: 'POST', token });
      const after = await makeRequest('/api/auth/me', { token });
      assert.strictEqual(after.statusCode, 200, 'documents the documented stateless limitation; client removes the credential on logout');
    });
  });

  describe('Health regression (Phase 3 preserved)', () => {
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
