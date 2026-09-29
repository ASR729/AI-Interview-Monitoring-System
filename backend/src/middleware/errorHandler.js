/**
 * Error handling middleware
 *
 * Provides centralized error handling for the Express application.
 * Formats errors consistently and prevents sensitive information leakage.
 */

/**
 * Custom error class for operational errors
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 Not Found handler
 * Catches all requests that don't match any route
 */
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `Cannot ${req.method} ${req.originalUrl}`,
    404
  );
  next(error);
};

/**
 * Central error handling middleware
 * Must be registered last in the middleware chain
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log error for debugging
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    statusCode,
    method: req.method,
    url: req.originalUrl,
    stack: isDevelopment ? err.stack : undefined,
  });

  // Prepare error response
  const errorResponse = {
    status: 'error',
    statusCode,
    message: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  };

  // Include stack trace in development only
  if (isDevelopment) {
    errorResponse.stack = err.stack;
    errorResponse.path = req.originalUrl;
    errorResponse.method = req.method;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors and pass to error middleware
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
