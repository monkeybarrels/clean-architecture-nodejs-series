
## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm 7+
- TypeScript knowledge

### Installation

```bash
# Clone or create the project directory
mkdir clean-task-api
cd clean-task-api

# Copy all files from this article
# (package.json, tsconfig.json, etc.)

# Install dependencies
npm install

# Start development server
npm run dev

src/
├── controllers/     # HTTP request handlers (Article 2)
├── services/        # Business logic (Article 3)
├── data/           # Data access layer (Article 4)
├── models/         # Domain models & DTOs (Article 5)
├── infrastructure/ # Database, caching, monitoring (Article 6)
└── app.ts          # Application setup

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm 7+
- TypeScript knowledge

### Installation

```bash
# Clone or create the project directory
mkdir clean-task-api
cd clean-task-api

# Copy all files from this article
# (package.json, tsconfig.json, etc.)

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - Check TypeScript types

## 🧪 Testing the Setup

Once the server is running, test these endpoints:

```bash
# Basic API info
curl http://localhost:3000/

# Health check
curl http://localhost:3000/health

# API endpoints info
curl http://localhost:3000/api
```

## 🔧 Configuration

Copy `.env.example` to `.env` and adjust values:

```bash
cp .env.example .env
```

Key configuration options:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level

## 📁 Project Structure

### Current State (Article 1)
- ✅ Express server setup
- ✅ TypeScript configuration
- ✅ Basic middleware (CORS, Helmet, Morgan)
- ✅ Health checks
- ✅ Error handling
- ✅ Environment configuration

### Coming Next (Article 2)
- 🔄 HTTP controllers
- 🔄 Request validation
- 🔄 Response formatting
- 🔄 Clean HTTP boundaries

## 🎨 Design Principles

This setup follows CLEAN Architecture principles:

1. **Independence**: Framework-agnostic business logic
2. **Testability**: Easy to test without external dependencies
3. **Flexibility**: Easy to change UI, database, or external services
4. **Maintainability**: Clear separation of concerns

## 📝 What's Different

Unlike typical Express setups, notice:

- **No routes folder** - Controllers will handle routing
- **No utils folder** - Everything has a specific architectural purpose
- **Structured error handling** - Consistent error responses
- **Environment-first configuration** - Easy deployment

## 🔮 Series Roadmap

1. **Article 1 (Current)**: Project setup and foundation ✅
2. **Article 2**: Controllers - Clean HTTP boundaries
3. **Article 3**: Services - Business logic encapsulation
4. **Article 4**: Data Layer - Repository pattern
5. **Article 5**: Business Objects - Domain models
6. **Article 6**: Complete System - Production features

## 🤝 Contributing

This is an educational series. Feel free to experiment and extend!

## 📚 Further Reading

- [Clean Architecture by Robert Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

**Next Up**: Article 2 - Building bulletproof controllers that create clean boundaries between HTTP and business logic.
```

---

## 📋 Installation Instructions

To set up Article 1:

1. **Create the directory structure** as shown above
2. **Copy all file contents** into their respective files
3. **Run the setup commands**:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

4. **Test the endpoints**:
   - http://localhost:3000/ - Basic API info
   - http://localhost:3000/health - Health check
   - http://localhost:3000/api - Available endpoints

This gives you a solid foundation with proper TypeScript setup, middleware configuration, error handling, and the folder structure ready for the upcoming articles.