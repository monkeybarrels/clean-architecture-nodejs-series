import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
const PORT = Number(process.env['PORT']) || 3000;
const HOST = process.env['HOST'] || 'localhost';
const CORS_ORIGINS = process.env['CORS_ORIGINS'] || 'http://localhost:3000';
const CORS_CREDENTIALS = process.env['CORS_CREDENTIALS'] || 'true';
const NODE_ENV = process.env['NODE_ENV'] || 'development';


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
  origin: CORS_ORIGINS.split(',') || ['http://localhost:3000'],
  credentials: CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id'],
}));

// Logging middleware
const logFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  next();
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'CLEAN Architecture Task API',
    version: '1.0.0',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: '1.0.0',
  });
});

// API routes placeholder
app.get('/api', (req, res) => {
  res.json({
    message: 'API endpoints will be added in upcoming articles',
    availableEndpoints: [
      'GET /health - Health check',
      'GET /api - This endpoint',
    ],
    nextArticle: 'Controllers - Clean HTTP boundaries',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    suggestion: 'Check the available endpoints at GET /api',
  });
});

// Global error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString(),
    ...(NODE_ENV === 'development' && {
      message: error.message,
      stack: error.stack 
    }),
  });
});

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
  console.log(`🏥 Health check: http://${HOST}:${PORT}/health`);
  console.log(`📚 API info: http://${HOST}:${PORT}/api`);
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