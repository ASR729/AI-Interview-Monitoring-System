# AI Interview Monitoring Backend

Backend API for the AI Interview Monitoring and Detection System.

## Overview

This is the Node.js/Express backend service that provides the API layer for the interview monitoring platform. Phase 3 establishes the foundational application structure without business logic implementation.

**Current Status**: Phase 3 - Backend Foundation Complete

## Tech Stack

- **Runtime**: Node.js >= 18.0.0
- **Framework**: Express.js 4.x
- **Language**: JavaScript (ES Modules)

## Project Structure

```
backend/
├── src/
│   ├── app.js                    # Express application setup
│   ├── routes/
│   │   └── index.js              # API router (foundation)
│   └── middleware/
│       └── errorHandler.js       # Error handling middleware
├── tests/
│   └── app.test.js               # Basic application tests
├── server.js                     # Application entry point
├── package.json
├── .env.example                  # Environment template
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. Install dependencies:

```bash
cd backend
npm install
```

2. Set up environment:

```bash
cp .env.example .env
```

3. Configure `.env` as needed (defaults work for local development)

### Development

Start the development server with auto-reload:

```bash
npm run dev
```

The server will start at `http://localhost:3001`

### Production

Start the production server:

```bash
npm start
```

### Testing

Run the test suite:

```bash
npm test
```

## API Documentation

### Base URL

- **Local Development**: `http://localhost:3001`
- **API Base Path**: `/api`

### Endpoints

#### Health Check

Check if the service is running.

```
GET /health
```

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2026-09-27T14:31:53.853Z",
  "service": "interview-monitoring-backend",
  "version": "0.1.0",
  "environment": "development"
}
```

#### API Info

Get API information.

```
GET /api
```

**Response** (200 OK):
```json
{
  "message": "AI Interview Monitoring API",
  "version": "0.1.0",
  "status": "Phase 3: Backend Foundation",
  "endpoints": {
    "health": "GET /health",
    "api": "GET /api"
  },
  "documentation": "See README.md for API documentation"
}
```

## Environment Variables

| Variable | Description | Default | Phase |
|----------|-------------|---------|-------|
| `NODE_ENV` | Environment mode | `development` | 3 |
| `PORT` | Server port | `3001` | 3 |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | `http://localhost:5173` | 3 |
| `MONGODB_URI` | MongoDB connection string | - | 5 (future) |
| `JWT_SECRET` | JWT signing secret | - | 6 (future) |
| `AI_SERVICE_URL` | AI service endpoint | - | 4 (future) |

## CORS Configuration

The backend is configured to allow requests from the frontend during local development:

- **Allowed Origin**: `http://localhost:5173` (Vite dev server)
- **Credentials**: Enabled
- **Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization

## Error Handling

All errors are handled centrally and returned in a consistent format:

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Cannot GET /nonexistent",
  "timestamp": "2026-09-27T14:31:53.853Z"
}
```

In development mode, additional debug information is included:
- `stack`: Error stack trace
- `path`: Request path
- `method`: HTTP method

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm start` | Start production server |
| `npm test` | Run test suite |

## Graceful Shutdown

The server handles termination signals gracefully:
- Responds to `SIGTERM` and `SIGINT`
- Closes existing connections
- 10-second timeout before forced shutdown

## Phase Implementation Status

- ✅ **Phase 3**: Backend Foundation (CURRENT)
  - Express application structure
  - Environment configuration
  - CORS for local development
  - Health endpoint
  - Error handling
  - Request logging
  - Basic tests

- ⏳ **Phase 4**: Python/FastAPI AI Service (NOT STARTED)
- ⏳ **Phase 5**: MongoDB (NOT STARTED)
- ⏳ **Phase 6**: Authentication & RBAC (NOT STARTED)
- ⏳ **Phase 7**: Interview Management (NOT STARTED)

## Future Endpoints (Planned)

The following endpoints will be implemented in future phases:

- **Phase 6**: `/api/auth/*` - Authentication
- **Phase 7**: `/api/interviews/*` - Interview management
- **Phase 7**: `/api/users/*` - User management
- **Phase 18**: `/api/monitoring/*` - Live monitoring
- **Phase 19**: `/api/reports/*` - Interview reports

## Development Guidelines

### Code Style

- Use ES6+ modules (`import`/`export`)
- Use async/await for asynchronous operations
- Follow consistent error handling patterns
- Keep routes thin, business logic in services
- Document all public APIs

### Security

- Never commit `.env` files
- Use environment variables for secrets
- Validate all user inputs
- Implement proper authentication (Phase 6)
- Use parameterized queries (Phase 5)

## Testing Strategy

Current tests cover:
- Server startup
- Health endpoint functionality
- 404 handling
- CORS headers
- Error response format

Future test coverage will include:
- Authentication flows
- API endpoint validation
- Database operations
- Integration tests
- Load/performance tests

## Troubleshooting

### Port Already in Use

If port 3001 is already in use:

1. Find and kill the process:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill
```

2. Or change the port in `.env`:
```
PORT=3002
```

### CORS Errors

If you see CORS errors in the browser console:

1. Verify frontend is running on `http://localhost:5173`
2. Check `ALLOWED_ORIGINS` in `.env`
3. Restart the backend server after `.env` changes

## License

ISC

## Related Documentation

- [Project Root README](../README.md)
- [Phase Implementation Plan](../IMPLEMENTATION_PLAN.md)
- [System Architecture](../docs/03-System-Architecture.md)
- [Development Plan](../docs/07-Development-Plan.md)
