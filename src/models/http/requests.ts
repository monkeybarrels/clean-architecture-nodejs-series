/**
 * HTTP Request interfaces
 * These define the shape of data coming from HTTP requests
 */

export interface CreateTaskRequest {
  title: string;
}

export interface UpdateTaskRequest {
  title?: string;
  completed?: boolean;
}

export interface GetTasksQuery {
  completed?: string; // Query params come as strings
  page?: string;
  limit?: string;
}

export interface TaskParams {
  id: string;
}

/**
 * Base request interface with common headers
 */
export interface AuthenticatedRequest {
  userId?: string; // Will come from headers or JWT in real apps
}