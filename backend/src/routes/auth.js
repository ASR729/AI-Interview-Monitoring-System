import { Router } from 'express';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { authenticate } from '../auth/middleware.js';
import { hashPassword, verifyPassword } from '../auth/password.js';
import { signToken } from '../auth/tokens.js';
import { toProductRole, toBackendRole, REGISTRABLE_PRODUCT_ROLES } from '../auth/roles.js';
import {
  PersistenceError,
  findUserByEmail,
  findUserById,
  toSafeUser,
  createUser,
  createRecruiter,
  createCandidate,
  deleteUserById,
} from '../db/persistence.js';

const router = Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

// Application-facing user representation: product role (UI/UX) with the
// stored backend role retained for roles without a product mapping.
function shapeAuthUser(userDoc) {
  return { ...toSafeUser(userDoc), role: toProductRole(userDoc.role) ?? userDoc.role };
}

function mapPersistenceError(error) {
  if (error instanceof PersistenceError) {
    if (error.code === 'DUPLICATE_EMAIL') {
      return new AppError('An account with this email already exists', 409);
    }
    if (error.code === 'INVALID_FIELD') {
      return new AppError(error.message, 400);
    }
    return new AppError('Registration could not be completed', 500);
  }
  return error;
}

// Creates the documented profile records linked to the new user identity
// (Database Spec: User -> Recruiter / Candidate). Optional profile fields
// are omitted when not provided. On unexpected profile failure the created
// user is removed so registration fails cleanly without orphaned accounts.
async function createLinkedProfiles(userId, role, { company } = {}) {
  try {
    if (role === 'recruiter') {
      await createRecruiter({ userId, ...(company ? { company } : {}) });
    } else if (role === 'candidate') {
      await createCandidate({ userId });
    }
  } catch (error) {
    if (error instanceof PersistenceError && error.code === 'DUPLICATE_REFERENCE') return;
    await deleteUserById(userId);
    throw error;
  }
}

// REGISTRATION (public)
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, role, company } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new AppError('Name is required', 400);
  }
  if (!email || typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
    throw new AppError('A valid email address is required', 400);
  }
  if (!password || typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH) {
    throw new AppError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`, 400);
  }
  const backendRole = toBackendRole(role);
  if (!backendRole || !REGISTRABLE_PRODUCT_ROLES.includes(toProductRole(backendRole))) {
    throw new AppError(`Role must be one of: ${REGISTRABLE_PRODUCT_ROLES.join(', ')}`, 400);
  }
  if (company !== undefined && company !== null && typeof company !== 'string') {
    throw new AppError('Company must be a string when provided', 400);
  }

  // Duplicate check before hashing to avoid unnecessary KDF work; the
  // unique index (IDX-USR-001) remains the enforcement boundary.
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await hashPassword(password);
  let user;
  try {
    user = await createUser({
      name,
      email,
      passwordHash,
      role: backendRole,
    });
  } catch (error) {
    throw mapPersistenceError(error);
  }

  try {
    await createLinkedProfiles(user._id, backendRole, { company: typeof company === 'string' ? company : undefined });
  } catch (error) {
    throw mapPersistenceError(error);
  }

  const token = signToken({ sub: user._id });
  const created = await findUserById(user._id);
  res.status(201).json({
    status: 'ok',
    token,
    user: shapeAuthUser(created ?? user),
  });
}));

// LOGIN (public). Unknown account and wrong password return the same
// response to avoid account enumeration.
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    throw new AppError('Invalid email or password', 401);
  }

  const user = await findUserByEmail(email);
  if (!user || !user.password_hash) {
    throw new AppError('Invalid email or password', 401);
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken({ sub: user._id });
  res.status(200).json({
    status: 'ok',
    token,
    user: shapeAuthUser(user),
  });
}));

// LOGOUT (authenticated). Stateless JWT: the server holds no session
// state; the client removes its credential. Tokens remain valid until
// expiry — server-side revocation is a documented limitation of this phase.
router.post('/logout', authenticate, (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Logged out',
  });
});

// CURRENT AUTHENTICATED USER (authenticated)
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await findUserById(req.user.id);
  if (!user) {
    throw new AppError('Invalid or expired authentication token', 401);
  }
  res.status(200).json({
    status: 'ok',
    user: shapeAuthUser(user),
  });
}));

export default router;
