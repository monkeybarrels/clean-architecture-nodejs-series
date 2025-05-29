import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { TaskService } from '../services/taskService';
import { rateLimitMiddleware } from '../middleware/validation';

/**
 * Create task routes
 * All task-related HTTP endpoints
 */
export function createTaskRoutes(): Router {
  const router = Router();
  
  // Initialize dependencies
  const taskService = new TaskService();
  const taskController = new TaskController(taskService);

  // Apply rate limiting to all task routes
  router.use(rateLimitMiddleware);

  // Task CRUD operations
  router.post('/tasks', taskController.createTask);
  router.get('/tasks', taskController.getTasks);
  router.get('/tasks/:id', taskController.getTask);
  router.put('/tasks/:id', taskController.updateTask);
  router.delete('/tasks/:id', taskController.deleteTask);

  // Task actions
  router.post('/tasks/:id/complete', taskController.completeTask);

  return router;
}