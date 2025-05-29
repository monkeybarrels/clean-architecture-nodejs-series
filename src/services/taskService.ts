import { Task, CreateTaskData, UpdateTaskData, TaskQueryParams } from '../models/tasks';

/**
 * Task Service - Placeholder Implementation
 * This will be properly implemented in Article 3
 * For now, provides in-memory storage for testing controllers
 */
export class TaskService {
  private tasks: Task[] = [];
  private nextId = 1;

  async createTask(data: CreateTaskData): Promise<Task> {
    const task: Task = {
      id: this.nextId.toString(),
      title: data.title,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: data.userId
    };

    this.tasks.push(task);
    this.nextId++;

    // Simulate async operation
    await this.delay(50);

    return task;
  }

  async getTasksByUser(params: TaskQueryParams): Promise<{ tasks: Task[]; total: number }> {
    // Simulate async operation
    await this.delay(30);

    let filteredTasks = this.tasks.filter(task => task.userId === params.userId);

    // Apply completed filter if provided
    if (params.completed !== undefined) {
      filteredTasks = filteredTasks.filter(task => task.completed === params.completed);
    }

    const total = filteredTasks.length;

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedTasks = filteredTasks.slice(startIndex, startIndex + limit);

    return {
      tasks: paginatedTasks,
      total
    };
  }

  async getTaskById(id: string, userId: string): Promise<Task | null> {
    // Simulate async operation
    await this.delay(30);

    const task = this.tasks.find(t => t.id === id && t.userId === userId);
    return task || null;
  }

  async updateTask(id: string, data: UpdateTaskData, userId: string): Promise<Task | null> {
    // Simulate async operation
    await this.delay(50);

    const taskIndex = this.tasks.findIndex(t => t.id === id && t.userId === userId);
    if (taskIndex === -1) {
      return null;
    }

    const existingTask = this.tasks[taskIndex]!; // Non-null assertion since index is valid
    const updatedTask: Task = {
      id: existingTask.id,
      title: data.title !== undefined ? data.title : existingTask.title,
      completed: data.completed !== undefined ? data.completed : existingTask.completed,
      createdAt: existingTask.createdAt,
      updatedAt: new Date(),
      userId: existingTask.userId
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    // Simulate async operation
    await this.delay(50);

    const taskIndex = this.tasks.findIndex(t => t.id === id && t.userId === userId);
    
    if (taskIndex === -1) {
      return false;
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper method for testing
  getAllTasks(): Task[] {
    return [...this.tasks];
  }

  // Helper method for testing
  clearAllTasks(): void {
    this.tasks = [];
    this.nextId = 1;
  }
}