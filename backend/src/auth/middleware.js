import { verifyToken } from './tokens.js';
import { toProductRole, PRODUCT_ROLES } from './roles.js';
import { findUserById } from '../db/persistence.js';

// Extracts the Bearer credential, validates it, resolves the current user
// from the users collection and attaches the minimal authenticated-user
// context to the request. Reuses the centralized error handling via next(err).
export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      throw error;
    }

    const payload = verifyToken(token);
    if (!payload || typeof payload.sub !== 'string') {
      const error = new Error('Invalid or expired authentication token');
      error.statusCode = 401;
      throw error;
    }

    const user = await findUserById(payload.sub);
    if (!user) {
      const error = new Error('Invalid or expired authentication token');
      error.statusCode = 401;
      throw error;
    }

    req.user = {
      id: user._id,
      role: user.role,
    };
    next();
  } catch (error) {
    next(error);
  }
}

// Role authorization: evaluates the authenticated user's stored role
// against the required UI/UX product role(s). Authorization is enforced
// here on the backend (DEC-011); frontend route hiding is UX only.
export function authorize(...requiredProductRoles) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        const error = new Error('Authentication required');
        error.statusCode = 401;
        throw error;
      }
      const productRole = toProductRole(req.user.role);
      if (!productRole || !PRODUCT_ROLES.includes(productRole) || !requiredProductRoles.includes(productRole)) {
        const error = new Error('You do not have permission to access this resource');
        error.statusCode = 403;
        throw error;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
