import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);

// Standard secure password-storage practice (SRS-SEC-003): Node's built-in
// scrypt KDF (RFC 7914) with a per-user random salt. Stored format:
// scrypt$<saltHex>$<hashHex>. Plaintext passwords are never persisted,
// logged or returned.
const SALT_BYTES = 16;
const KEY_BYTES = 64;

export async function hashPassword(password) {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('password is required');
  }
  const salt = randomBytes(SALT_BYTES);
  const derived = await scrypt(password, salt, KEY_BYTES);
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
}

export async function verifyPassword(password, storedHash) {
  if (typeof password !== 'string' || password.length === 0) return false;
  if (typeof storedHash !== 'string') return false;
  const [scheme, saltHex, hashHex] = storedHash.split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  if (salt.length === 0 || expected.length === 0) return false;
  const derived = await scrypt(password, salt, expected.length);
  return timingSafeEqual(derived, expected);
}
