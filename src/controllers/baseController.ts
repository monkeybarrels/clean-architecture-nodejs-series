import { Request, Response } from 'express';
import { ErrorResponse } from '../models/http/responses';

/**
 * Base controller with common functionality
 * All controllers should extend this class
 */
export abstract class BaseController {
  /**
   * Send success response
   */
  protected sendSuccess<T>(
    res: Response, 
    data: T, 
    message?: string, 
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      data,
      ...(message && { message })
    });
  }

  /**
   * Send error response
   */
  protected sendError(
    res: Response,
    message: string,
    statusCode: number = 400,
    code?: string,
    details?: string[]
  ): void {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message,
        ...(code && { code }),
        ...(details && { details })
      },
      timestamp: new Date().toISOString()
    };

    res.status(statusCode).json(errorResponse);
  }

  /**
   * Extract user ID from request
   * In a real app, this would come from JWT or session
   */
  protected extractUserId(req: Request): string {
    const userId = req.headers['user-id'] as string;
    
    if (!userId) {
      throw new Error('User authentication required');
    }

    return userId;
  }

  /**
   * Parse pagination parameters
   */
  protected parsePaginationParams(req: Request): { page: number; limit: number } {
    const page = Math.max(1, parseInt(req.query['page'] as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query['limit'] as string) || 10));

    return { page, limit };
  }

  /**
   * Parse boolean query parameter
   */
  protected parseBoolean(value: string | undefined): boolean | undefined {
    if (value === undefined) return undefined;
    return value.toLowerCase() === 'true';
  }

  /**
   * Handle async controller methods
   */
  protected asyncHandler(
    fn: (req: Request, res: Response) => Promise<void>
  ) {
    return (req: Request, res: Response, next: import('express').NextFunction) => {
      Promise.resolve(fn(req, res)).catch(next);
    };
  }

  /**
   * Log controller actions
   */
  protected logAction(action: string, userId: string, details?: any): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Controller: ${action} | User: ${userId}`, details || '');
  }
}