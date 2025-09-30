# RDQ_V3 - AI Coding Agent Instructions

## Project Overview
RDQ_V3 is a full-stack application with a React frontend and Java/Quarkus backend. The project follows a clear separation with dedicated folders for each tier.

## Project Structure
```
RDQ_V3/
├── frontend/          # React application (LTS version)
├── Backend/           # Java 21 + Quarkus backend
├── docs/              # Functional specifications (SFD)
└── .prompts/          # History of AI interactions and actions
```

## Development Setup

### Frontend (React)
```bash
cd frontend
npm install
npm start              # Development server
npm run build         # Production build
npm test              # Run tests
```

### Backend (Java 21 + Quarkus)
```bash
cd Backend
./mvnw compile quarkus:dev    # Development mode with hot reload
./mvnw clean package          # Build the application
./mvnw test                   # Run tests
```

## Architecture Overview

### Key Components
- **Frontend**: React application serving the user interface
- **Backend**: Quarkus-based REST API handling business logic and data persistence
- **Communication**: REST API calls between frontend and backend

### Data Flow
- Frontend makes HTTP requests to Backend REST endpoints
- Backend processes requests and returns JSON responses
- Real-time updates handled via WebSocket connections (if implemented)

## Development Workflows

### Full Stack Development
```bash
# Start both services for development
# Terminal 1 - Backend
cd Backend
./mvnw compile quarkus:dev

# Terminal 2 - Frontend  
cd frontend
npm start
```

### Building the Project
```bash
# Build frontend
cd frontend && npm run build

# Build backend
cd Backend && ./mvnw clean package
```

### Running Tests
```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd Backend && ./mvnw test

# Run all tests
npm run test:all  # (if configured)
```

## Project Conventions

### File Structure
- **frontend/**: React application with standard Create React App structure
- **Backend/**: Maven-based Quarkus project with Java packages
- **docs/**: Functional specifications and technical documentation
- **.prompts/**: AI interaction history and development session logs
- **API Endpoints**: RESTful services under `/api/` prefix
- **Static Assets**: Served from React build in production

### Technology Stack
- **Frontend**: React (LTS), JavaScript/TypeScript, npm/yarn
- **Backend**: Java 21, Quarkus Framework, Maven
- **Communication**: REST APIs, JSON payloads
- **Development**: Hot reload enabled for both tiers

### Code Patterns
*Update as patterns emerge:*
- REST endpoint patterns in Quarkus
- React component organization
- State management approach (Context API, Redux, etc.)
- Error handling between frontend/backend
- Authentication/authorization flow

## Documentation & Version Control

### Repository Information
- **Organization**: Catamania
- **Main Branch**: `main`
- **Repository**: GitHub-hosted source control

### JIRA Project Management
- **Serveur**: MCP (Model Context Protocol)
- **Projet**: "Test MCP"
- **Epic Métier**: TM-52 - RDQ_V3 - Gestion des RDQ (User Stories fonctionnelles)
- **Epic Technique**: TM-53 - RDQ_V3 - Infrastructure et Backend (User Stories techniques)
- **Accès**: Via serveur MCP pour consultation et suivi des tickets

### Documentation Structure
- **docs/**: Functional specifications (SFD - Spécifications Fonctionnelles Détaillées)
- **.prompts/**: History of AI interactions and development actions
- **README.md**: Project overview and setup instructions

## Integration Points
*Document external dependencies and services as they're added:*
- Database connections
- API integrations
- Third-party services
- Authentication systems

## Common Commands

### Development
```bash
# Start frontend dev server
cd frontend && npm start

# Start backend with hot reload
cd Backend && ./mvnw compile quarkus:dev

# Install frontend dependencies
cd frontend && npm install

# Clean and rebuild backend
cd Backend && ./mvnw clean compile
```

### Debugging
```bash
# Backend debugging (default port 5005)
cd Backend && ./mvnw compile quarkus:dev -Ddebug

# View backend logs
cd Backend && ./mvnw compile quarkus:dev -Dquarkus.log.level=DEBUG

# React debugging in browser dev tools
cd frontend && npm start
```

### Build & Package
```bash
# Production build
cd frontend && npm run build
cd Backend && ./mvnw clean package

# Create native executable (if configured)
cd Backend && ./mvnw package -Pnative
```

### Version Control
```bash
# Standard Git workflow on main branch
git add .
git commit -m "Description of changes"
git push origin main

# Create feature branch
git checkout -b feature/feature-name
git push -u origin feature/feature-name
```

## Key Files to Understand
*List important files that agents should examine first:*
- `README.md` - Project documentation
- `docs/` - Functional specifications (SFD)
- `.prompts/` - AI interaction history for context
- Configuration files (when created)
- Main entry points (when established)

## Troubleshooting
*Add common issues and solutions as they're discovered*

## Specialized Instructions

### Frontend Development
For React/TypeScript frontend development, refer to:
- **[Frontend Instructions](frontend-instructions.md)** - Detailed guidelines for React components, TypeScript patterns, state management, forms, routing, styling, and testing
- **[React Instructions](react-instructions.md)** - Component architecture, state management, performance optimization, and React best practices
- **[HTML Instructions](html-instructions.md)** - Semantic HTML, accessibility, responsive design, and clean markup standards

### Backend Development  
For Java/Quarkus backend development, refer to:
- **[Backend Instructions](backend-instructions.md)** - Comprehensive guide for Quarkus setup, JPA entities, REST APIs, security, database management, and testing
- **[Java Instructions](java-instructions.md)** - Best practices for Java code quality, conventions, testing patterns, and development standards

### API Development
For API design and documentation, refer to:
- **[OpenAPI Instructions](openapi-instructions.md)** - Standards for API documentation, versioning, structure, and OpenAPI specifications
- **[YAML Instructions](yaml-instructions.md)** - Best practices for YAML formatting, linting rules, and configuration files
- **[Java Instructions](java-instructions.md)** - Best practices for Java code quality, conventions, testing patterns, and development standards

## Notes for AI Agents
- This is a fresh project - help establish good patterns from the start
- Follow modern best practices for the chosen technology stack
- **ALWAYS consult the specialized instruction files** for detailed development guidelines
- Ask for clarification on architectural decisions
- Maintain consistency with emerging patterns
- Update these instructions as the project grows

### When to Use Specialized Instructions
- **Frontend work**: Components, pages, hooks, forms, styling → Use `frontend-instructions.md`
- **React development**: Component architecture, hooks, performance → Use `react-instructions.md`
- **HTML markup**: Semantic elements, accessibility, responsive → Use `html-instructions.md`
- **Backend work**: API endpoints, services, entities, database → Use `backend-instructions.md`
- **Java code quality**: Best practices, conventions, testing → Use `java-instructions.md`
- **API design**: OpenAPI specifications, REST endpoints → Use `openapi-instructions.md`
- **Configuration files**: YAML formatting, config management → Use `yaml-instructions.md`
- **Full-stack integration**: Authentication, API contracts → Use both frontend and backend files
- **General project setup**: Build scripts, CI/CD, documentation → Use this main file

---
*Last updated: October 2025 - Added specialized instruction files*