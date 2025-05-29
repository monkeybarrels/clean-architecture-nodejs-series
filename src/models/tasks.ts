/**
 * Core Task domain interface
 * This represents the task entity as it exists in our domain
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

/**
 * Task creation data
 * Used when creating a new task
 */
export interface CreateTaskData {
  title: string;
  userId: string;
}

/**
 * Task update data
 * Used when updating an existing task
 */
export interface UpdateTaskData {
  title?: string;
  completed?: boolean;
}

/**
 * Task query parameters
 * Used for filtering and pagination
 */
export interface TaskQueryParams {
  userId: string;
  completed?: boolean;
  page?: number;
  limit?: number;
}