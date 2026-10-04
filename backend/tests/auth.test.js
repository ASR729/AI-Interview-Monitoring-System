import { describe, it } from 'node:test';
import assert from 'node:assert';

import { hashPassword, verifyPassword } from '../src/auth/password.js';
import { signToken, verifyToken, getJwtSecret, getTokenExpiresIn } from '../src/auth/tokens.js';
import { toProductRole, toBackendRole, PRODUCT_ROLES, REGISTRABLE_PRODUCT_ROLES } from '../src/auth/roles.js';

describe('Password hashing (Phase 6, SRS-SEC-003)', () => {
  it('hashes a password into the scrypt$salt$hash format', async () => {
    const hash = await hashPassword('TestPassword123');
    assert.ok(hash.startsWith('scrypt$'));
    const parts = hash.split('$');
    assert.strictEqual(parts.length, 3);
    assert.ok(parts[1].length >= 32, 'salt hex present');
    assert.ok(parts[2].length >= 128, 'derived key hex present');
  });

  it('verifies the correct password', async () => {
    const hash = await hashPassword('TestPassword123');
    assert.strictEqual(await verifyPassword('TestPassword123', hash), true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('TestPassword123');
    assert.strictEqual(await verifyPassword('WrongPassword123', hash), false);
  });

  it('generates a unique salt per hash (same password hashes differently)', async () => {
    const a = await hashPassword('SamePassword123');
    const b = await hashPassword('SamePassword123');
    assert.notStrictEqual(a, b);
    assert.strictEqual(await verifyPassword('SamePassword123', a), true);
    assert.strictEqual(await verifyPassword('SamePassword123', b), true);
  });

  it('rejects malformed stored hashes without throwing', async () => {
    assert.strictEqual(await verifyPassword('TestPassword123', ''), false);
    assert.strictEqual(await verifyPassword('TestPassword123', 'plaintext-not-a-hash'), false);
    assert.strictEqual(await verifyPassword('TestPassword123', 'bcrypt$nothex$nothex'), false);
    assert.strictEqual(await verifyPassword('TestPassword123', undefined), false);
  });

  it('never stores plaintext: hash output does not contain the password', async () => {
    const hash = await hashPassword('UniquePlaintextZebra123');
    assert.ok(!hash.includes('UniquePlaintextZebra123'));
  });
});

describe('Token handling (Phase 6, stateless JWT)', () => {
  it('signs and verifies a token round-trip', () => {
    process.env.JWT_SECRET = 'unit-test-secret';
    const token = signToken({ sub: 'user-123' });
    const payload = verifyToken(token);
    assert.strictEqual(payload.sub, 'user-123');
    delete process.env.JWT_SECRET;
  });

  it('rejects a malformed token with 401', () => {
    process.env.JWT_SECRET = 'unit-test-secret';
    assert.throws(
      () => verifyToken('not.a.jwt'),
      (error) => error.statusCode === 401
    );
    delete process.env.JWT_SECRET;
  });

  it('rejects a token signed with a different secret with 401', () => {
    process.env.JWT_SECRET = 'secret-one';
    const token = signToken({ sub: 'user-123' });
    process.env.JWT_SECRET = 'secret-two';
    assert.throws(
      () => verifyToken(token),
      (error) => error.statusCode === 401
    );
    delete process.env.JWT_SECRET;
  });

  it('rejects an expired token with 401', () => {
    process.env.JWT_SECRET = 'unit-test-secret';
    const token = signToken({ sub: 'user-123' }, { expiresIn: -10 });
    assert.throws(
      () => verifyToken(token),
      (error) => error.statusCode === 401
    );
    delete process.env.JWT_SECRET;
  });

  it('refuses to sign without a configured secret (503)', () => {
    process.env.JWT_SECRET = '';
    assert.throws(
      () => signToken({ sub: 'user-123' }),
      (error) => error.statusCode === 503
    );
    assert.strictEqual(getJwtSecret(), null);
    delete process.env.JWT_SECRET;
  });

  it('defaults expiry to a documented dev value when unset', () => {
    delete process.env.JWT_EXPIRES_IN;
    assert.strictEqual(getTokenExpiresIn(), '24h');
    process.env.JWT_EXPIRES_IN = '1h';
    assert.strictEqual(getTokenExpiresIn(), '1h');
    delete process.env.JWT_EXPIRES_IN;
  });
});

describe('Role model mapping (UI/UX product roles <-> SRS backend roles)', () => {
  it('maps backend roles to product roles', () => {
    assert.strictEqual(toProductRole('recruiter'), 'hr');
    assert.strictEqual(toProductRole('interviewer'), 'interviewer');
    assert.strictEqual(toProductRole('candidate'), 'interviewee');
  });

  it('maps no product role for admin (no admin product UI in this phase)', () => {
    assert.strictEqual(toProductRole('admin'), null);
  });

  it('returns null for unknown roles', () => {
    assert.strictEqual(toProductRole('superadmin'), null);
    assert.strictEqual(toProductRole(undefined), null);
  });

  it('maps product roles to backend roles', () => {
    assert.strictEqual(toBackendRole('hr'), 'recruiter');
    assert.strictEqual(toBackendRole('interviewer'), 'interviewer');
    assert.strictEqual(toBackendRole('interviewee'), 'candidate');
    assert.strictEqual(toBackendRole('HR'), 'recruiter');
    assert.strictEqual(toBackendRole('Interviewee'), 'candidate');
  });

  it('does not allow admin self-registration via product roles', () => {
    assert.strictEqual(toBackendRole('admin'), null);
    assert.deepStrictEqual([...REGISTRABLE_PRODUCT_ROLES].sort(), ['hr', 'interviewee', 'interviewer']);
    assert.deepStrictEqual([...PRODUCT_ROLES].sort(), ['hr', 'interviewee', 'interviewer']);
  });
});
