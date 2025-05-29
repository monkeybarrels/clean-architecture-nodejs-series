import rateLimit from 'express-rate-limit';

const windowMs = parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 10);
const max = parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10);

/**
 * Rate limiting middleware
 */
export const rateLimitMiddleware = rateLimit({
  windowMs,
  max,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    timestamp: new Date().toISOString()
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

/**
 * User authentication middleware placeholder
 * In a real app, this would validate JWT tokens
 */
export const requireAuth = (req: any, res: any, next: any) => {
  const userId = req.headers['user-id'];
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication required. Please provide user-id header.',
        code: 'AUTHENTICATION_REQUIRED'
      },
      timestamp: new Date().toISOString()
    });
  }

  next();
};