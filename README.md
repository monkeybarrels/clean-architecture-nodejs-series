# CLEAN Architecture Task API - Article 2

Welcome to Article 2 of our CLEAN Architecture series! We've now implemented **clean controllers** that create proper boundaries between HTTP and business logic.

## 🎯 What We've Built

### Controllers Layer
- ✅ **Clean HTTP boundaries** - Controllers only handle HTTP concerns
- ✅ **Input validation** - Comprehensive request validation with detailed error messages
- ✅ **Response formatting** - Consistent API response structure
- ✅ **Error handling** - Proper error responses with codes and details
- ✅ **Authentication** - User context extraction (placeholder for real auth)
- ✅ **Rate limiting** - Protection against abuse
- ✅ **Logging** - Action logging for monitoring and debugging

### API Features
- ✅ **Full CRUD operations** for tasks
- ✅ **Pagination** support for task listing
- ✅ **Query filtering** (completed/incomplete tasks)
- ✅ **Consistent responses** with success/error structure
- ✅ **Detailed validation** with field-specific error messages

## 🏗️ Architecture Progress

```
src/
├── controllers/        # ✅ Clean HTTP request handlers
│   ├── baseController.ts   # Common controller functionality
│   └── taskController.ts   # Task-specific HTTP handling
├── services/          # 🔄 Business logic (placeholder)
│   └── taskService.ts     # In-memory implementation for testing
├── models/           # ✅ Data structures and interfaces
│   ├── task.ts           # Core domain interfaces
│   ├── http/             # HTTP-specific models
│   └── common/           # Shared validation logic
├── routes/           # ✅ Route definitions
├── middleware/       # ✅ Request processing
└── app.ts           # ✅ Updated application setup
```

## 🚀 Getting Started

### Installation
```bash
# Install dependencies (includes new packages)
npm install

# Start development server
npm run dev
```

### Testing the API

**1. Create a task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "user-id: user123" \
  -d '{"title": "Complete the CLEAN architecture series"}'
```

**2. Get all tasks:**
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "user-id: user123"
```

**3. Get tasks with pagination:**
```bash
curl -X GET "http://localhost:3000/api/tasks?page=1&limit=5&completed=false" \
  -H "user-id: user123"
```

**4. Update a task:**
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "user-id: user123" \
  -d '{"title": "Updated task title", "completed": true}'
```

**5. Complete a task:**
```bash
curl -X POST http://localhost:3000/api/tasks/1/complete \
  -H "user-id: user123"
```

**6. Delete a task:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/1 \
  -H "user-id: user123"
```

## 📋 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All API endpoints require a `user-id` header:
```
user-id: your-user-id
```

### Response Format
All responses follow this structure:
```json
{
  "success": true|false,
  "data": { ... },          // On success
  "message": "...",         // Optional success message
  "error": {                // On error
    "message": "...",
    "code": "ERROR_CODE",
    "details": ["..."]
  },
  "timestamp": "2023-..."   // On error
}
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tasks` | Create a new task |
| GET | `/tasks` | Get all user tasks |
| GET | `/tasks/:id` | Get specific task |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| POST | `/tasks/:id/complete` | Mark as completed |

### Query Parameters (GET /tasks)
- `completed`: Filter by completion status (true/false)
- `page`: Page number for pagination (default: 1)
- `limit`: Items per page (default: 10, max: 100)

## 🔧 Configuration

### Environment Variables
```env
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # Max requests per window

# Request Configuration  
REQUEST_TIMEOUT_MS=30000       # 30 seconds
MAX_REQUEST_SIZE=10mb          # Maximum request body size

# Security
ENABLE_RATE_LIMITING=true      # Enable/disable rate limiting
```

## 🎨 What Makes These Controllers "Clean"

### 1. Single Responsibility
Each controller method has one job: handle HTTP concerns
- Validate input from HTTP requests
- Call appropriate services
- Format responses for HTTP
- Handle HTTP-specific errors

### 2. No Business Logic
Controllers don't contain business rules:
```typescript
// ❌ BAD: Business logic in controller
if (task.priority === 'high' && !user.isPremium) {
  return res.status(403).json({ error: 'Premium required' });
}

// ✅ GOOD: Delegate to service
const task = await this.taskService.createTask(data);
```

### 3. Comprehensive Validation
Input validation happens at the HTTP boundary:
- Field validation with specific error messages
- Data sanitization and transformation
- Type checking and format validation

### 4. Consistent Error Handling
All errors are handled consistently:
- Structured error responses
- Appropriate HTTP status codes
- Error logging for debugging
- No sensitive data exposure

### 5. Testable Design
Controllers are easy to test:
- Dependencies injected through constructor
- Async operations properly handled
- Service calls can be mocked
- HTTP concerns isolated

## 🧪 Testing Examples

### Valid Requests
```bash
# Create task - valid
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "user-id: test-user" \
  -d '{"title": "Valid task title"}'
```

### Validation Errors
```bash
# Create task - title too short
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "user-id: test-user" \
  -d '{"title": "Hi"}'

# Response:
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": ["Title must be at least 3 characters"]
  },
  "timestamp": "2023-..."
}
```

### Authentication Errors
```bash
# Missing user-id header
curl -X GET http://localhost:3000/api/tasks

# Response:
{
  "success": false,
  "error": {
    "message": "Authentication required. Please provide user-id header.",
    "code": "AUTHENTICATION_REQUIRED"
  },
  "timestamp": "2023-..."
}
```

## 🔍 Code Organization

### BaseController Pattern
All controllers extend `BaseController`:
- Common functionality (success/error responses)
- Consistent user ID extraction
- Pagination helpers
- Error handling utilities

### Validation Layer
Comprehensive validation with:
- `ValidationRules` class for reusable rules
- Field-specific error messages
- Data sanitization
- Type checking

### Response Formatting
Consistent API responses:
- Success responses with data
- Error responses with codes
- Timestamp tracking
- Message handling

## 📈 What's Next (Article 3)

In the next article, we'll implement the **Services layer**:
- Rich business logic implementation
- Domain rules and validations
- Workflow coordination
- Framework-independent operations

The placeholder `TaskService` will be replaced with real business logic that handles:
- Task creation rules
- User permissions
- Business validations
- Complex operations

## 🤝 Contributing

This is part of an educational series. Feel free to:
- Experiment with the code
- Add new validation rules
- Extend the API endpoints
- Improve error handling

---

**Current State**: Controllers implemented with clean HTTP boundaries
**Next Article**: Services - The heart of your business logic
```

---

## 📋 Complete File Checklist

**Article 2 includes these files:**

✅ **Updated package.json** - Added express-validator and rate-limit
✅ **Enhanced .env.example** - Rate limiting and security config
✅ **Core models** - Task interfaces and HTTP models
✅ **BaseController** - Common controller functionality
✅ **TaskController** - Complete CRUD operations with validation
✅ **Route definitions** - Clean route organization
✅ **Middleware** - Rate limiting and error handling
✅ **Updated app.ts** - Full application with all middleware
✅ **Placeholder service** - In-memory implementation for testing
✅ **Comprehensive README** - API documentation and examples

## 🎯 Key Features Implemented

1. **Complete CRUD API** for tasks
2. **Input validation** with detailed error messages
3. **Rate limiting** protection
4. **Consistent response format** across all endpoints
5. **Comprehensive error handling** with proper HTTP codes
6. **Request logging** for monitoring
7. **Authentication middleware** (placeholder)
8. **API documentation** endpoint
9. **Health checks** with controller status
10. **Production-ready** error handling and security