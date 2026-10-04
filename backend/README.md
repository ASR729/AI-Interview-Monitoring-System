# AI Interview Monitoring Backend

Backend API for the AI Interview Monitoring and Detection System.

## Overview

This is the Node.js/Express backend service that provides the API layer for the interview monitoring platform. Phase 3 establishes the foundational application structure; Phase 5 adds the MongoDB persistence foundation.

**Current Status**: Phase 5 - MongoDB Persistence Foundation Complete

## Tech Stack

- **Runtime**: Node.js >= 18.0.0
- **Framework**: Express.js 4.x
- **Language**: JavaScript (ES Modules)
- **Database**: MongoDB (official `mongodb` Node.js driver; no ODM)

## Project Structure

```
backend/
├── src/
│   ├── app.js                    # Express application setup (+ /ready endpoint)
│   ├── config/
│   │   └── database.js           # MongoDB connection lifecycle
│   ├── db/
│   │   ├── collections.js        # Collection name constants
│   │   ├── constants.js          # Documented role/status values
│   │   ├── indexes.js            # Baseline index definitions
│   │   └── persistence.js        # Persistence layer with reference validation
│   ├── routes/
│   │   └── index.js              # API router (foundation)
│   └── middleware/
│       └── errorHandler.js       # Error handling middleware
├── tests/
│   ├── app.test.js               # Application tests (Phase 3)
│   └── database.test.js          # MongoDB persistence tests (Phase 5)
├── server.js                     # Application entry point
├── package.json
├── .env.example                  # Environment template
└── README.md
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB Community Server (local) — see "MongoDB" below

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

### MongoDB

The backend uses MongoDB Community Server locally (approved development database; Atlas Free may be used for prototype use if local MongoDB is unavailable).

Install MongoDB Community Server for Debian 12 (or use the official installer for your platform):

```bash
curl -o /tmp/mongodb.tgz https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian12-8.0.4.tgz
tar -xzf /tmp/mongodb.tgz -C /tmp
sudo install -m 755 /tmp/mongodb-linux-x86_64-debian12-8.0.4/bin/mongod /usr/local/bin/mongod
mkdir -p ~/mongodb-data
mongod --dbpath ~/mongodb-data --bind_ip 127.0.0.1 --port 27017 --fork --logpath ~/mongodb-data/mongod.log
```

The local development instance binds `127.0.0.1` only (no external exposure). Production deployments require authenticated, least-privilege credentials (TBD).

Verify the connection:

```bash
curl http://localhost:3001/ready
```

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

Run the test suite (app + persistence tests):

```bash
npm test
```

Persistence tests connect to `MONGODB_URI` (default `mongodb://127.0.0.1:27017`) and use a dedicated test database (`${MONGODB_DB_NAME}_test`, default `interview_monitoring_test`). The suite refuses to run against a database not ending in `_test` and drops the test database on completion. Test data is synthetic only (`@example.local` emails, demo names).

### Stopping the server

Send `SIGTERM`/`SIGINT` (or stop nodemon). Graceful shutdown closes the HTTP server and disconnects MongoDB.

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

#### Readiness Check

Application + database connectivity. Deliberately separate from `/health` so the liveness check is never misleading about database state.

```
GET /ready
```

**Response** (200 — ready):
```json
{
  "status": "ready",
  "timestamp": "2026-10-04T06:24:05.078Z",
  "service": "interview-monitoring-backend",
  "database": { "connected": true, "state": "connected" }
}
```

**Response** (503 — database not connected):
```json
{
  "status": "not_ready",
  "timestamp": "...",
  "service": "interview-monitoring-backend",
  "database": { "connected": false, "state": "disconnected" }
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
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017` | 5 |
| `MONGODB_DB_NAME` | MongoDB database name | `interview_monitoring` | 5 |
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

- ✅ **Phase 3**: Backend Foundation (COMPLETE)
  - Express application structure
  - Environment configuration
  - CORS for local development
  - Health endpoint
  - Error handling
  - Request logging
  - Basic tests

- ✅ **Phase 4**: Python/FastAPI AI Service (COMPLETE — separate service, port 8000)

- ✅ **Phase 5**: MongoDB Persistence Foundation (COMPLETE)
  - MongoDB connection lifecycle (env-driven, graceful failure, graceful shutdown)
  - Nine collections: users, recruiters, candidates, interview_sessions, monitoring_events, ai_analysis_results, alerts, evidence, final_reports
  - Interview session as the central entity; application-level reference validation (DB-VAL-001..008 applicable subset)
  - Baseline indexes from Database Specification §15
  - `/ready` readiness endpoint (database connectivity)
  - Persistence test suite (synthetic data, dedicated test database, guarded cleanup)

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
- MongoDB connection (success + graceful failure)
- Persistence of all nine collections with reference validation
- Interview-session reference enforcement for monitoring events (DB-VAL-001)
- Timestamp persistence, baseline index existence, test-data cleanup

Future test coverage will include:
- Authentication flows
- API endpoint validation
- Integration tests
- Load/performance tests

## MongoDB Collections (Phase 5)

Per the approved Database Specification v1.0 (`docs/04-Database-Specification.md`):

| Collection | Purpose | Notes |
|------------|---------|-------|
| `users` | Account identity | Unique email index; roles: recruiter, candidate, interviewer, admin (SRS role table) |
| `recruiters` | Recruiter profile | `user_id` → users (unique index) |
| `candidates` | Candidate profile | `user_id` → users (unique sparse index) |
| `interview_sessions` | **Central entity** | recruiter/candidate/lifecycle; status set is provisional (see Limitations) |
| `monitoring_events` | Integrity events | require valid interview + timestamp; evidence referenced, not embedded |
| `ai_analysis_results` | Model/rule outputs | stable baseline only; output is a controlled structured object (schemas TBD) |
| `alerts` | Recruiter-facing alerts | linked to interview/event/recipient; persistence only (no real-time engine yet) |
| `evidence` | Evidence metadata | references only (`storage_reference`); no raw media blobs; retention fields supported, policy TBD |
| `final_reports` | Integrity summary | stable baseline only; one current report per interview (unique index) |

Identifiers are application-generated UUID strings stored as `_id` (Database Specification allows String/ObjectId). Cross-references are validated at the application layer (MongoDB has no enforced foreign keys).

## Important Limitations / TBDs (Phase 5)

- **Interview lifecycle states**: Database Specification §8.1 proposes `draft → scheduled/invited → ready → in_progress → completed`; the SRS has not finalized exact states (it references examples such as "configured, active and completed"). The proposed set is adopted provisionally and recorded in DECISION_LOG; no cancellation/expiry/error states were invented.
- **Open enums**: users.status, alerts.status, review_status, severity, event_type and source remain open strings (exact values TBD in SRS/DB Spec; severity scale TBD per UI Spec). Documented defaults are applied when omitted.
- **Confidence**: type-checked as numeric when provided; no bounded range enforced until a selected model defines one (DB-VAL-003, DB-TBD-003).
- **Retention**: `retention_class`/`expires_at` fields are supported; no retention period implemented (TBD-004/DB-TBD-006). DB-VAL-009 (expired evidence access) applies to future review flows (Phase 17/18) — not implemented.
- **Evidence storage**: MongoDB stores metadata/references only. The actual object-storage provider is TBD (DB-TBD-004).
- **Deferred indexes**: IDX-USR-002, IDX-REC-002, IDX-CAN-002, IDX-EVT-004, IDX-EVT-005, IDX-ALT-003 — documented in `src/db/indexes.js`; create only when actual queries justify them.
- **docker-compose.yml**: still references a missing ai-service Dockerfile (Phase 4 known issue); Docker is not used for MongoDB in this environment (mongod runs directly).

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
