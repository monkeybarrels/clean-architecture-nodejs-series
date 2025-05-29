import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../models/http/responses';

const NODE_ENV = process.env['NODE_ENV'] || 'development';

/**
 * Global error handler middleware
 * Catches all unhandled errors and formats them consistently
 */
export const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Global Error Handler:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  // Don't expose sensitive error details in production
  const isDevelopment = NODE_ENV === 'development';
  
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: isDevelopment ? error.message : 'Internal server error',
      code: 'INTERNAL_ERROR',
      ...(isDevelopment && { details: [error.stack || ''] })
    },
    timestamp: new Date().toISOString()
  };

  res.status(500).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: `Endpoint ${req.method} ${req.path} not found`,
      code: 'ENDPOINT_NOT_FOUND'
    },
    timestamp: new Date().toISOString()
  };

  res.status(404).json(errorResponse);
};