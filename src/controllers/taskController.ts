import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { TaskService } from '../services/taskService';
import { 
  CreateTaskRequest, 
  UpdateTaskRequest, 
  GetTasksQuery,
  TaskParams 
} from '../models/http/requests';
import { 
  TaskResponse,
  CreateTaskResponse,
  GetTaskResponse,
  GetTasksResponse,
  UpdateTaskResponse,
  DeleteTaskResponse
} from '../models/http/responses';
import { ValidationResult, ValidationRules } from '../models/common/validation';
import { Task } from '../models/tasks';

/**
 * Task Controller
 * Handles HTTP requests for task operations
 * Validates input, calls services, formats responses
 */
export class TaskController extends BaseController {
  constructor(private taskService: TaskService) {
    super();
  }

  /**
   * Create a new task
   * POST /api/tasks
   */
  createTask = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.extractUserId(req);
      const requestData: CreateTaskRequest = req.body;

      this.logAction('CREATE_TASK_ATTEMPT', userId, { title: requestData.title });

      // Validate input
      const validation = this.validateCreateTaskInput(requestData);
      if (!validation.isValid) {
        this.logAction('CREATE_TASK_VALIDATION_FAILED', userId, validation.errors);
        this.sendError(
          res, 
          'Validation failed', 
          400, 
          'VALIDATION_ERROR',
          validation.errors?.map(e => e.message)
        );
        return;
      }

      // Call service
      const task = await this.taskService.createTask({
        title: validation.data!.title,
        userId
      });

      this.logAction('CREATE_TASK_SUCCESS', userId, { taskId: task.id });

      // Format response
      const response: CreateTaskResponse = {
        success: true,
        data: {
          task: this.mapTaskToResponse(task)
        },
        message: 'Task created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      this.handleError(error, req, res);
    }
  });

  /**
   * Get all tasks for a user
   * GET /api/tasks
   */
  getTasks = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.extractUserId(req);
      const query: GetTasksQuery = req.query;
      const { page, limit } = this.parsePaginationParams(req);

      this.logAction('GET_TASKS_ATTEMPT', userId, { page, limit });

      // Parse query parameters
      const completed = this.parseBoolean(query.completed);

      // Call service
      const taskQueryParams: any = {
        userId,
        page,
        limit
      };
      if (completed !== undefined) {
        taskQueryParams.completed = completed;
      }
      const result = await this.taskService.getTasksByUser(taskQueryParams);

      this.logAction('GET_TASKS_SUCCESS', userId, { 
        count: result.tasks.length, 
        total: result.total 
      });

      // Format response
      const response: GetTasksResponse = {
        success: true,
        data: {
          tasks: result.tasks.map(task => this.mapTaskToResponse(task)),
          pagination: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit),
            hasNext: page * limit < result.total,
            hasPrev: page > 1
          }
        }
      };

      res.json(response);
    } catch (error) {
      this.handleError(error, req, res);
    }
  });

  /**
   * Get a specific task
   * GET /api/tasks/:id
   */
  getTask = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.extractUserId(req);
      const { id }: TaskParams = req.params as unknown as TaskParams;

      this.logAction('GET_TASK_ATTEMPT', userId, { taskId: id });

      if (!id) {
        this.sendError(res, 'Task ID is required', 400, 'MISSING_TASK_ID');
        return;
      }

      // Call service
      const task = await this.taskService.getTaskById(id, userId);

      if (!task) {
        this.sendError(res, 'Task not found', 404, 'TASK_NOT_FOUND');
        return;
      }

      this.logAction('GET_TASK_SUCCESS', userId, { taskId: id });

      // Format response
      const response: GetTaskResponse = {
        success: true,
        data: {
          task: this.mapTaskToResponse(task)
        }
      };

      res.json(response);
    } catch (error) {
      this.handleError(error, req, res);
    }
  });

  /**
   * Update a task
   * PUT /api/tasks/:id
   */
  updateTask = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.extractUserId(req);
      const { id }: TaskParams = req.params as unknown as TaskParams;
      const requestData: UpdateTaskRequest = req.body;

      this.logAction('UPDATE_TASK_ATTEMPT', userId, { taskId: id, updates: requestData });

      if (!id) {
        this.sendError(res, 'Task ID is required', 400, 'MISSING_TASK_ID');
        return;
      }

      // Validate input
      const validation = this.validateUpdateTaskInput(requestData);
      if (!validation.isValid) {
        this.sendError(
          res, 
          'Validation failed', 
          400, 
          'VALIDATION_ERROR',
          validation.errors?.map(e => e.message)
        );
        return;
      }

      // Call service
      const task = await this.taskService.updateTask(id, validation.data!, userId);

      if (!task) {
        this.sendError(res, 'Task not found', 404, 'TASK_NOT_FOUND');
        return;
      }

      this.logAction('UPDATE_TASK_SUCCESS', userId, { taskId: id });

      // Format response
      const response: UpdateTaskResponse = {
        success: true,
        data: {
          task: this.mapTaskToResponse(task)
        },
        message: 'Task updated successfully'
      };

      res.json(response);
    } catch (error) {
      this.handleError(error, req, res);
    }
  });

  /**
   * Delete a task
   * DELETE /api/tasks/:id
   */
  deleteTask = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.extractUserId(req);
      const { id }: TaskParams = req.params as unknown as TaskParams;

      this.logAction('DELETE_TASK_ATTEMPT', userId, { taskId: id });

      if (!id) {
        this.sendError(res, 'Task ID is required', 400, 'MISSING_TASK_ID');
        return;
      }

      // Call service
      const deleted = await this.taskService.deleteTask(id, userId);

      if (!deleted) {
        this.sendError(res, 'Task not found', 404, 'TASK_NOT_FOUND');
        return;
      }

      this.logAction('DELETE_TASK_SUCCESS', userId, { taskId: id });

      // Format response
      const response: DeleteTaskResponse = {
        success: true,
        message: 'Task deleted successfully'
      };

      res.json(response);
    } catch (error) {
      this.handleError(error, req, res);
    }
  });

  /**
   * Mark task as completed
   * POST /api/tasks/:id/complete
   */
  completeTask = this.asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = this.extractUserId(req);
      const { id }: TaskParams = req.params as unknown as TaskParams;

      this.logAction('COMPLETE_TASK_ATTEMPT', userId, { taskId: id });

      if (!id) {
        this.sendError(res, 'Task ID is required', 400, 'MISSING_TASK_ID');
        return;
      }

      // Call service
      const task = await this.taskService.updateTask(id, { completed: true }, userId);

      if (!task) {
        this.sendError(res, 'Task not found', 404, 'TASK_NOT_FOUND');
        return;
      }

      this.logAction('COMPLETE_TASK_SUCCESS', userId, { taskId: id });

      // Format response
      const response: UpdateTaskResponse = {
        success: true,
        data: {
          task: this.mapTaskToResponse(task)
        },
        message: 'Task marked as completed'
      };

      res.json(response);
    } catch (error) {
      this.handleError(error, req, res);
    }
  });

  /**
   * Validate create task input
   */
  private validateCreateTaskInput(data: CreateTaskRequest): ValidationResult<{ title: string }> {
    const errors = [];

    // Validate title
    const titleError = ValidationRules.isValidTaskTitle(data.title);
    if (titleError) {
      errors.push(titleError);
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    return {
      isValid: true,
      data: {
        title: ValidationRules.sanitizeString(data.title)
      }
    };
  }

  /**
   * Validate update task input
   */
  private validateUpdateTaskInput(data: UpdateTaskRequest): ValidationResult<UpdateTaskRequest> {
    const errors = [];
    const validatedData: UpdateTaskRequest = {};

    // Validate title if provided
    if (data.title !== undefined) {
      const titleError = ValidationRules.isValidTaskTitle(data.title);
      if (titleError) {
        errors.push(titleError);
      } else {
        validatedData.title = ValidationRules.sanitizeString(data.title);
      }
    }

    // Validate completed if provided
    if (data.completed !== undefined) {
      if (!ValidationRules.isValidBoolean(data.completed)) {
        errors.push({
          field: 'completed',
          message: 'Completed must be a boolean value',
          code: 'INVALID_BOOLEAN'
        });
      } else {
        validatedData.completed = data.completed;
      }
    }

    // Check if at least one field is provided
    if (Object.keys(validatedData).length === 0 && errors.length === 0) {
      errors.push({
        field: 'general',
        message: 'At least one field must be provided for update',
        code: 'NO_UPDATE_FIELDS'
      });
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    return { isValid: true, data: validatedData };
  }

  /**
   * Map Task domain object to HTTP response
   */
  private mapTaskToResponse(task: Task): TaskResponse {
    return {
      id: task.id,
      title: task.title,
      completed: task.completed,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString()
    };
  }

  /**
   * Handle controller errors
   */
  private handleError(error: unknown, req: Request, res: Response): void {
    const userId = req.headers['user-id'] as string || 'unknown';
    
    console.error('TaskController Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      url: req.url,
      method: req.method,
      userId,
      timestamp: new Date().toISOString()
    });

    if (error instanceof Error) {
      // Handle known business errors
      if (error.message.includes('not found')) {
        this.sendError(res, 'Resource not found', 404, 'NOT_FOUND');
        return;
      }
      
      if (error.message.includes('permission') || error.message.includes('authentication')) {
        this.sendError(res, 'Permission denied', 403, 'FORBIDDEN');
        return;
      }

      if (error.message.includes('validation')) {
        this.sendError(res, error.message, 400, 'VALIDATION_ERROR');
        return;
      }
    }

    // Default to 500 for unknown errors
    this.sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}