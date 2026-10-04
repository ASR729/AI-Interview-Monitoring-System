import jwt from 'jsonwebtoken';

// Stateless JWT (HS256) session handling. The signing secret stays
// server-side (env only); tokens are transported via the Authorization
// header and validated on every protected request. Logout is client-side
// credential removal; server-side revocation is not implemented in this
// phase and is documented as a limitation.
const DEFAULT_EXPIRES_IN = '24h';

export const getJwtSecret = () => process.env.JWT_SECRET || null;

export const getTokenExpiresIn = () => process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRES_IN;

export function signToken(payload, options = {}) {
  const secret = getJwtSecret();
  if (!secret) {
    const error = new Error('Authentication is not configured: JWT_SECRET is missing');
    error.statusCode = 503;
    throw error;
  }
  return jwt.sign(payload, secret, {
    expiresIn: options.expiresIn ?? getTokenExpiresIn(),
  });
}

export function verifyToken(token) {
  const secret = getJwtSecret();
  if (!secret) {
    const error = new Error('Authentication is not configured: JWT_SECRET is missing');
    error.statusCode = 503;
    throw error;
  }
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    const invalid = new Error('Invalid or expired authentication token');
    invalid.statusCode = 401;
    throw invalid;
  }
}
