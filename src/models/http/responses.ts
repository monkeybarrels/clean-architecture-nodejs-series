/**
 * HTTP Response interfaces
 * These define the shape of data sent in HTTP responses
 */

export interface TaskResponse {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string; // ISO string for HTTP
  updatedAt: string; // ISO string for HTTP
}

export interface CreateTaskResponse {
  success: true;
  data: {
    task: TaskResponse;
  };
  message: string;
}

export interface GetTaskResponse {
  success: true;
  data: {
    task: TaskResponse;
  };
}

export interface GetTasksResponse {
  success: true;
  data: {
    tasks: TaskResponse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface UpdateTaskResponse {
  success: true;
  data: {
    task: TaskResponse;
  };
  message: string;
}

export interface DeleteTaskResponse {
  success: true;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: string[];
  };
  timestamp: string;
}

/**
 * Generic API Response wrapper
 */
export type ApiResponse<T = any> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: { message: string; code?: string; details?: string[] }; timestamp: string };