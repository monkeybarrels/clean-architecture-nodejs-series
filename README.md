# CLEAN Architecture in Node.js - Complete Implementation Series

This repository contains the complete code for the 6-part series on implementing CLEAN Architecture in Node.js, progressing from basic setup to a production-ready system.

## 📚 Article Series

Each branch corresponds to an article in the series:

1. **[article-1-setup](../../tree/article-1-setup)** - Project Setup & Folder Structure
2. **[article-2-controllers](../../tree/article-2-controllers)** - Clean Controllers
3. **[article-3-services](../../tree/article-3-services)** - Business Logic Services  
4. **[article-4-data-layer](../../tree/article-4-data-layer)** - Database-Agnostic Data Layer
5. **[article-5-business-objects](../../tree/article-5-business-objects)** - Domain Models & DTOs
6. **[article-6-complete](../../tree/article-6-complete)** - Complete Production System

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/clean-architecture-nodejs-series.git
cd clean-architecture-nodejs-series

# Checkout the final implementation
git checkout article-6-complete

# Install dependencies
npm install

# Start with Docker
docker-compose up -d

# Or run locally
npm run dev
```

## Architecture Overview
```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic
├── data/           # Data access repositories
├── models/         # Domain models and DTOs
├── infrastructure/ # Database, caching, health checks
└── app.ts          # Application setup
```