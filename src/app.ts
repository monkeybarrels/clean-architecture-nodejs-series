import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createTaskRoutes } from './routes/taskRoutes';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler';
import { requireAuth } from './middleware/validation';

const app = express();
const PORT = Number(process.env['PORT']) || 3000;
const HOST = process.env['HOST'] || 'localhost';
const CORS_ORIGINS = process.env['CORS_ORIGINS'] || 'http://localhost:3000';
const CORS_CREDENTIALS = process.env['CORS_CREDENTIALS'] || 'true';
const NODE_ENV = process.env['NODE_ENV'] || 'development';
const MAX_REQUEST_SIZE = process.env['MAX_REQUEST_SIZE'] || '10mb';
const REQUEST_TIMEOUT_MS = process.env['REQUEST_TIMEOUT_MS'] || '30000';


// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id'],
}));

// Logging middleware
const logFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// Body parsing middleware
app.use(express.json({ 
  limit: MAX_REQUEST_SIZE || '10mb',
  type: 'application/json'
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: MAX_REQUEST_SIZE || '10mb' 
}));

// Request timeout middleware
app.use((_req, _res, next) => {
  const timeout = parseInt(REQUEST_TIMEOUT_MS || '30000');
  _req.setTimeout(timeout);
  next();
});

// Basic route for testing
app.get('/', (_req, res) => {
  res.json({
    message: 'CLEAN Architecture Task API - Article 2',
    version: '2.0.0',
    environment: NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      tasks: '/api/tasks',
      health: '/health',
      docs: '/api'
    }
  });
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV || 'development',
    version: '2.0.0',
    components: {
      controllers: 'OK',
      middleware: 'OK',
      validation: 'OK'
    }
  });
});

// API documentation endpoint
app.get('/api', (_req, res) => {
  res.json({
    message: 'CLEAN Architecture Task API - Controllers Implemented',
    version: '2.0.0',
    documentation: {
      baseUrl: `http://${HOST}:${PORT}/api`,
      authentication: 'Add user-id header to requests',
      endpoints: [
        {
          method: 'POST',
          path: '/tasks',
          description: 'Create a new task',
          body: { title: 'string (required)' }
        },
        {
          method: 'GET',
          path: '/tasks',
          description: 'Get all tasks for user',
          query: { 
            completed: 'boolean (optional)', 
            page: 'number (optional)', 
            limit: 'number (optional)' 
          }
        },
        {
          method: 'GET',
          path: '/tasks/:id',
          description: 'Get a specific task'
        },
        {
          method: 'PUT',
          path: '/tasks/:id',
          description: 'Update a task',
          body: { 
            title: 'string (optional)', 
            completed: 'boolean (optional)' 
          }
        },
        {
          method: 'DELETE',
          path: '/tasks/:id',
          description: 'Delete a task'
        },
        {
          method: 'POST',
          path: '/tasks/:id/complete',
          description: 'Mark task as completed'
        }
      ],
      examples: {
        createTask: {
          request: 'POST /api/tasks',
          headers: { 'user-id': 'user123', 'Content-Type': 'application/json' },
          body: { title: 'Complete the project' }
        },
        getTasks: {
          request: 'GET /api/tasks?completed=false&page=1&limit=10',
          headers: { 'user-id': 'user123' }
        }
      }
    }
  });
});

// Apply authentication middleware to API routes
app.use('/api', requireAuth);

// API routes
app.use('/api', createTaskRoutes());

// 404 handler for unmatched routes
app.use('*', notFoundHandler);

// Global error handler (must be last)
app.use(globalErrorHandler);

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://${HOST}:${PORT}/health`);
  console.log(`📚 API docs: http://${HOST}:${PORT}/api`);
  console.log(`🎯 Controllers: Implemented and ready!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;