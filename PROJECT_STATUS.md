# PROJECT_STATUS.md

# AI Interview Monitoring and Detection System

## Current State

- **Current stage:** Phase 6 COMPLETE → Ready for Phase 7 (HR Product)
- **Current phase:** Phase 6 — Authentication & RBAC
- **Overall status:** IN PROGRESS
- **MVP:** IN PROGRESS (authentication/role foundation established)
- **V2:** NOT STARTED
- **SaaS/Enterprise:** NOT STARTED

## Documentation Baseline

Completed: - \[x\] PRD v1.0 - \[x\] SRS v1.0 - \[x\] System Architecture
v1.0 - \[x\] Database Specification v1.0 - \[x\] AI/ML Specification
v1.0 - \[x\] UI/UX Specification v1.0 - \[x\] Development Plan v1.0 -
\[x\] Zero-Cost Infrastructure Plan v1.0 - \[x\] Testing & Evaluation
Plan v1.0 - \[x\] Startup/Product Roadmap v1.0

## Phase Tracker

|  \# | Phase                            | Status      | Verification |
|----:|----------------------------------|-------------|--------------|
|   1 | Requirements Freeze & Repository | COMPLETE    | Git initialized, directories created, .gitignore, README.md, docker-compose.yml |
|   2 | Frontend Foundation              | STABILIZED — pending user browser confirmation | tsc 0 errors, lint 0 errors, build passes, dev server live on :5180 → https://5180-iteaxs65egwgp2h9q52q5.e2b.app/ (pinned, HTTP 200) |
|   3 | Node/Express Backend Foundation  | COMPLETE    | Express app, health endpoint, CORS, error handling, tests |
|   4 | Python/FastAPI AI Service        | COMPLETE    | 24/24 pytest pass, uvicorn cold start verified, /health + /ready live on :8000, OpenAPI docs 200 |
|   5 | MongoDB                          | COMPLETE    | MongoDB 8.0.4 local (127.0.0.1:27017), 9 collections, 19 baseline indexes, 43/43 tests pass, /ready live, /health unchanged |
|   6 | Authentication & RBAC            | COMPLETE    | JWT (HS256) + scrypt hashing, auth/role middleware, protected routes, role-aware frontend routing, 62 new tests; 105/105 backend suite pass |
|   7 | HR Product                       | NOT STARTED | —            |
|   8 | Interviewer Product              | NOT STARTED | —            |
|   9 | Candidate/Interviewee Product    | NOT STARTED | —            |
|  10 | Interview Room                   | NOT STARTED | —            |
|  11 | WebRTC & Socket.io               | NOT STARTED | —            |
|  12 | Webcam Capture                   | NOT STARTED | —            |
|  13 | Computer Vision                  | NOT STARTED | —            |
|  14 | Observable Behaviour Signals     | NOT STARTED | —            |
|  15 | Event Engine & Persistence       | NOT STARTED | —            |
|  16 | Real-Time Alerts                 | NOT STARTED | —            |
|  17 | Evidence System                  | NOT STARTED | —            |
|  18 | Live Monitoring & Integrity View | NOT STARTED | —            |
|  19 | Interview Report                 | NOT STARTED | —            |
|  20 | End-to-End MVP Test              | NOT STARTED | —            |
|  21 | Controlled AI Evaluation         | NOT STARTED | —            |
|  22 | Internal Validation / Pilot      | NOT STARTED | —            |
|  23 | V2 Multimodal Intelligence       | NOT STARTED | —            |
|  24 | SaaS / Enterprise                | NOT STARTED | —            |

## Repository State

Expected root:

``` text
ai-interview-monitoring-system/
├── frontend/
├── backend/
├── ai-service/
├── tests/
├── docs/
├── scripts/
├── .gitignore
├── README.md
└── docker-compose.yml
```

**Actual (verified):**
- ✅ Git initialized
- ✅ Directories created: frontend/, backend/, ai-service/, tests/, scripts/, docs/
- ✅ .gitignore created
- ✅ README.md created
- ✅ docker-compose.yml created

## MVP Definition of Done

``` text
Authentication
→ Role-aware access
→ Interview creation
→ Invitation
→ Candidate system check
→ Interview room
→ WebRTC/media
→ Webcam
→ CV
→ Supported observable signals
→ Structured monitoring events
→ MongoDB
→ Real-time alerts
→ Evidence/context
→ Live monitoring
→ Basic integrity view
→ Interview report
→ End-to-end tests
→ Controlled AI evaluation
```

## AI Evaluation Status

No performance results are currently claimed.

To be measured after implementation: - precision - recall - F1 - false
positives - false negatives - alert latency - relevant system/resource
behaviour

All results must come from controlled evaluation evidence.

## Current Blockers

None known at documentation stage.

Possible future human/external dependencies: - GitHub authentication -
MongoDB setup - browser camera/microphone permissions - controlled
evaluation participants/scenarios - participant consent - pilot
feedback - production/cloud credentials - payment/ATS credentials

These must never be fabricated.

## Status Values

Use: - `NOT STARTED` - `IN PROGRESS` - `BLOCKED` - `COMPLETE` -
`DEFERRED`

## Update Rule

After every phase, update: - status - implementation summary -
tests/verification - acceptance criteria - limitations - blockers -
human actions - commit/milestone - next phase

**Last state:** Phase 6 complete. Authentication & RBAC established: stateless JWT (HS256, `jsonwebtoken`) with Bearer transport, scrypt password hashing (Node built-in crypto), `authenticate()`/`authorize()` middleware enforcing the UI/UX product roles (hr/interviewer/interviewee) mapped from the SRS backend role vocabulary, `/api/auth/*` (register/login/logout/me) plus explicit `/api/rbac/*` verification endpoints, interview resource-authorization foundation via documented recruiter/candidate ownership, and role-aware frontend routing wired to the real backend (mock auth removed). Verified by a 105/105-test suite (62 new auth/RBAC tests, synthetic users, dedicated `_test` databases, guarded cleanup) plus live role-matrix and security-audit checks. Regression verified: Phase 3 backend tests pass (`/health` unchanged, backend live on :3001), Phase 4 AI service healthy on :8000, Phase 5 MongoDB/persistence intact, Phase 2 frontend builds and serves at the pinned canonical URL. Ready for Phase 7 (HR Product).

## Phase 3 Details

**Implementation Date:** 2026-09-27

**Files Created:**
- `backend/package.json` - Project manifest with Express, CORS, Helmet, Morgan, Dotenv
- `backend/server.js` - Entry point with graceful shutdown
- `backend/src/app.js` - Express configuration
- `backend/src/routes/index.js` - API router foundation
- `backend/src/middleware/errorHandler.js` - Error handling middleware
- `backend/tests/app.test.js` - Test suite
- `backend/.env.example` - Environment template
- `backend/.gitignore` - Git ignore rules
- `backend/README.md` - Complete documentation

**Backend Configuration:**
- Port: 3001
- API Base: `/api`
- Health Endpoint: `GET /health`
- CORS: Allows `http://localhost:5173`, `http://localhost:5180`, and the pinned e2b preview origin `https://5180-iteaxs65egwgp2h9q52q5.e2b.app`
- Environment: Development-ready with dotenv

**Verification Required:**
See `PHASE_3_VERIFICATION.md` for manual verification steps. User must:
1. Install dependencies: `cd backend && npm install`
2. Start server: `npm run dev`
3. Test health endpoint: `curl http://localhost:3001/health`
4. Run tests: `npm test`

**Phase 3 Acceptance Criteria:** COMPLETE (pending manual verification)
- ✅ Express application structure created
- ✅ Environment configuration (.env.example)
- ✅ CORS configured for local development
- ✅ Health endpoint implemented
- ✅ Centralized error handling
- ✅ Request logging with Morgan
- ✅ Test foundation created
- ✅ No frontend modifications
- ✅ No database implementation (Phase 5)
- ✅ No authentication (Phase 6)
- ✅ No business endpoints (Phases 7-19)

**Known Limitations:**
- Backend has no business logic (intentional - deferred to later phases)
- No MongoDB connectivity yet (Phase 5)
- No authentication/RBAC (Phase 6)
- No WebRTC/Socket.io (Phase 11)
- No AI service integration (Phase 4)

**Next Phase:** Phase 2 — Frontend Foundation (resume and integrate with backend)

## Phase 2 Stabilization (2026-10-03)

**Fixes applied:**
- Removed nested `<BrowserRouter>` (duplicate in `main.tsx` and `App.tsx`)
- Added `src/vite-env.d.ts` (typed `import.meta.env`, `VITE_API_BASE_URL`)
- Reconciled component/page contracts: `Button.danger`, `Toggle.checked/onChange`, `DropdownItem.onSelect`, `DropdownItem.icon` accepts element types
- Fixed Avatar status typing, Toast effect cleanup, Dropdown case-block declarations
- Renamed data-driven `Table` → `DataTable`; added compositional `Table/TableHeader/TableBody/TableRow/TableHead/TableCell/TableFooter/TableCaption` primitives
- Fixed duplicate imports (`Filter`, `Users`), missing imports (`Link`, `Clock`, `Shield`, `Modal`, table primitives, lucide icons), invalid prop usage (`Link href` → `to`), type errors (sort casts, `getTracks` on `MediaStream`, `avgRating` number cast, widened `mockResults` status)
- Added `updateProfile` to `useAuth` (mock)
- Created `eslint.config.js` (ESLint 9 flat config) — `npm run lint` executes: 0 errors, 244 non-blocking warnings
- Build script now `tsc -b && vite build` — typecheck enforced before build; build passes
- Created missing `public/grid.svg` and `public/favicon.svg`
- Fixed README merge-conflict markers and doc links (.docx → .md)

**Results:** tsc 173 → 0 errors; lint executes; production build passes; dev server verified live. Frontend API client (`lib/api.ts`) typed and ready (mock auth remains until Phase 6).

**Known non-blocking:** 248 lint warnings (unused vars), bundle >500 kB warning, no automated browser test — user browser confirmation at the pinned frontend link (https://5180-iteaxs65egwgp2h9q52q5.e2b.app/) is the remaining gate.

## Service URL Pinning (2026-10-04)

**User hard constraint (permanent, never change even if requested):**
- **Frontend public URL:** `https://5180-iteaxs65egwgp2h9q52q5.e2b.app/` — maps to local port **5180**
- **Backend public URL:** `https://3001-iteaxs65egwgp2h9q52q5.e2b.app/` — maps to local port **3001**
- **AI service (internal):** port **8000** (backend-only caller; not exposed via a pinned public URL)

**Changes made to enforce the constraint:**
- Removed a stray duplicate vite dev server (CLI-forced `--port 5173`); a single config-driven vite instance remains on 5180
- Added `strictPort: true` to `frontend/vite.config.ts` and `frontend/vite.config.js` — if port 5180 is ever blocked, vite fails loudly instead of silently serving on a different port/link
- Backend CORS now allows the e2b preview origin (`backend/.env` and `backend/.env.example`), so browser API calls from the pinned frontend origin work from Phase 6 onward

**Verified (2026-10-04):**
- Frontend e2b link → HTTP 200
- Backend e2b link → `{"status":"ok","service":"interview-monitoring-backend",...}`
- CORS preflight echo: `Access-Control-Allow-Origin: https://5180-iteaxs65egwgp2h9q52q5.e2b.app`
- AI service health on :8000 → OK

## Phase 4 Details

**Implementation Date:** 2026-10-03 (completed/resumed)

**Status:** COMPLETE — all acceptance criteria verified.

**Files (all verified in repo):**
- `ai-service/app/main.py` — FastAPI app factory, lifespan startup/shutdown logging, JSON error handlers
- `ai-service/app/core/config.py` — centralized `pydantic-settings` configuration (env vars, optional untracked `.env`)
- `ai-service/app/core/logging.py` — logging configuration (no sensitive content in logs)
- `ai-service/app/routes/health.py` — `GET /`, `GET /health`, `GET /ready`
- `ai-service/app/schemas/health.py` — typed response models (Pydantic)
- `ai-service/app/services/analysis/__init__.py` — documented extension point for Phase 13+ analysis modules (empty by design)
- `ai-service/requirements.txt` — pinned dependencies (fastapi, uvicorn, pydantic, pydantic-settings, pytest, httpx2)
- `ai-service/.env.example`, `ai-service/.gitignore`, `ai-service/README.md`
- `ai-service/tests/test_app.py`, `ai-service/tests/test_config.py`, `ai-service/tests/test_health.py`

**Service Configuration:**
- Port: 8000 (bind `0.0.0.0`)
- Health Endpoint: `GET /health` (liveness; process status only — never claims AI/model status)
- Readiness Endpoint: `GET /ready` (`components_ready: ["api"]`)
- Docs: `/docs` (Swagger UI), `/redoc`, `/openapi.json`
- Environment: development-ready, no secrets committed

**Verification Performed (2026-10-03):**
1. `pytest`: **24/24 passed** (app, config, health suites; deterministic, offline)
2. Cold start: killed existing process, fresh `uvicorn app.main:app` start — success
3. `curl http://localhost:8000/health` → `{"status":"ok","service":"ai-service","version":"0.1.0","environment":"development","timestamp":"..."}`
4. `curl http://localhost:8000/ready` → `{"status":"ready","service":"ai-service","version":"0.1.0","components_ready":["api"]}`
5. `/docs` → HTTP 200; unknown route → JSON 404
6. `pip install -r requirements.txt` → all requirements satisfied, clean install
7. Negative-scope guards: tests assert no `pymongo`/`motor` (Phase 5) and no `cv2`/`mediapipe` (Phase 13) are importable in this phase

**Phase 4 Acceptance Criteria:** COMPLETE
- ✅ FastAPI service structure (app/core/routes/schemas/services separation)
- ✅ Environment-driven configuration with `.env.example` (no secrets)
- ✅ Health endpoint implemented and verified live
- ✅ Readiness endpoint implemented
- ✅ Modular inference extension point documented (`app/services/analysis/`)
- ✅ MVP CV dependency decision recorded (deferred to Phase 13 — see DEC-018)
- ✅ Automated test suite passing
- ✅ No MongoDB (Phase 5), no authentication (Phase 6), no business endpoints (Phases 7–19)
- ✅ AI integrity rules respected: health endpoints never claim AI/model/detection status

**Known Limitations:**
- No AI/CV models or analysis capability (intentional — Phase 13, per Development Plan M07 "CV service foundation")
- No MongoDB or persistence (Phase 5)
- No Node.js backend integration (later phase boundary; browsers must not call this service directly)
- `docker-compose.yml` references `ai-service/Dockerfile` (not yet created) and uses an outdated `uvicorn main:app` path (actual module: `app.main:app`); containerization is deferred — the service is verified to run locally without Docker
- Host Python 3.11.2 was created without `ensurepip`; the venv was bootstrapped manually (documented in `ai-service/README.md` §4)
- This environment's package index provides the official next-generation httpx client under the name `httpx2` (same maintainer: Tom Christie/Pydantic); pinned accordingly in `requirements.txt` and verified working

**Next Phase:** Phase 5 — MongoDB (depends on Phase 3; backend connection and persistence test).

## Phase 5 Details

**Implementation Date:** 2026-10-04

**Status:** COMPLETE — all acceptance gates verified.

**Development Database:**
- MongoDB Community Server 8.0.4 (Debian 12 tarball), installed at `/usr/local/bin/mongod`
- Data directory: `/home/user/mongodb-data` (outside the repository; no git risk)
- Bound to `127.0.0.1:27017` only (no external exposure; no credentials required for local dev — production requires authenticated least-privilege credentials, TBD)
- Docker is not available in this environment; `docker-compose.yml` was NOT used for MongoDB (no Phase 5 Docker changes; Phase 4 Docker inconsistency left untouched)

**Files Created:**
- `backend/src/config/database.js` — connection lifecycle (env-driven URI/db name, sanitized logging, graceful failure, idempotent reconnect, close)
- `backend/src/db/collections.js` — the nine documented collection names
- `backend/src/db/constants.js` — documented role/status values only (open enums left open)
- `backend/src/db/indexes.js` — 19 baseline indexes (Database Spec §15 + IDX-USR-001/REC-001/CAN-001) with documented deferrals
- `backend/src/db/persistence.js` — application persistence layer with reference validation (DB-VAL-001..008 applicable subset) and `PersistenceError`
- `backend/tests/database.test.js` — 28 persistence/connection tests (synthetic data, dedicated `_test` database, guarded cleanup)

**Files Modified:**
- `backend/server.js` — non-blocking MongoDB connect + baseline indexes at startup; MongoDB disconnect in graceful shutdown; /ready log line
- `backend/src/app.js` — added `GET /ready` (database connectivity); existing `GET /health` unchanged
- `backend/.env.example` / `backend/.env` — `MONGODB_URI`, `MONGODB_DB_NAME` placeholders/local values (no secrets)
- `backend/package.json` / `package-lock.json` — added `mongodb@^6.21.0` (official driver; no ODM)
- `backend/README.md` — MongoDB setup, env vars, collections, limitations/TBDs

**Collections Implemented (9):** users, recruiters, candidates, interview_sessions, monitoring_events, ai_analysis_results, alerts, evidence, final_reports. Identifiers are application-generated UUID strings stored as `_id` (Database Spec allows String/ObjectId). interview_sessions is the central entity; monitoring events require a valid interview session (DB-VAL-001) and a timestamp (DB-VAL-002); evidence/AI-analysis/report references are validated at the application layer (DB-VAL-005/007).

**Connection Verification (2026-10-04):**
1. Node driver ping → `{"ok":1}` on `mongodb://127.0.0.1:27017`
2. Backend startup → `[db] MongoDB connected` + `[db] Baseline indexes ensured (19)`
3. `GET /health` → 200, response unchanged from Phase 3
4. `GET /ready` → 200 `{"status":"ready","database":{"connected":true,...}}`
5. Graceful shutdown: SIGTERM → `[db] MongoDB connection closed` → HTTP server closed → port 3001 released
6. Graceful failure: unreachable URI returns null (no crash); `/ready` reports 503 when disconnected

**Persistence Test Results:** 43/43 passed (backend suite: Phase 3 app tests + Phase 5 persistence tests + graceful-connection-failure test). Synthetic data only (`@example.local`, demo names). Dedicated test database `interview_monitoring_test`; guarded drop (only `_test` databases); verified empty after run. Dev database untouched by tests. Note: `tests/app.test.js` (Phase 3) binds port 3001 itself, so the test suite must run with the dev server stopped (pre-existing Phase 3 test-harness behaviour, unchanged).

**Index Verification:** all 19 documented baseline indexes created and recognized (verified via `listIndexes`): users(1), recruiters(1), candidates(1), interview_sessions(4), monitoring_events(3), alerts(2), evidence(2), ai_analysis_results(3), final_reports(2). Deferred: IDX-USR-002, IDX-REC-002, IDX-CAN-002, IDX-EVT-004, IDX-EVT-005, IDX-ALT-003 (no current queries; over-indexing caution respected).

**Regression Verification (2026-10-04):**
- Phase 3: backend starts, listens on 3001, `/health` 200, existing middleware/error handling/graceful shutdown preserved, existing tests pass
- Phase 4: AI service untouched and healthy on 8000 (`/health` → ok)
- Phase 2: frontend accessible at `https://5180-iteaxs65egwgp2h9q52q5.e2b.app/` (HTTP 200) and locally on 5180
- Canonical URLs unchanged (see DEC-021)

**Known Limitations / TBDs:**
- Interview lifecycle states: Database Spec §8.1 proposed set (`draft, scheduled, invited, ready, in_progress, completed`) adopted provisionally; SRS has not finalized exact states (references examples such as "configured, active and completed") — conflict recorded in DEC-023. No cancellation/expiry/error states invented.
- Open enums (users.status, alerts.status, review_status, severity, event_type, source): no closed-enum enforcement (exact values TBD); documented defaults applied when omitted.
- Confidence: numeric type-check only; no bounded range until a selected model defines one (DB-VAL-003, DB-TBD-003).
- Retention: `retention_class`/`expires_at` fields supported; no retention period implemented (TBD-004/DB-TBD-006). DB-VAL-009 applies to future review flows (Phases 17/18).
- Evidence storage provider TBD (DB-TBD-004); MongoDB stores metadata/references only.
- Deferred indexes documented in `src/db/indexes.js`.
- No authentication/RBAC (Phase 6); no interview CRUD API (Phase 7); no real-time alert engine (Phase 16).

**Next Phase:** Phase 6 — Authentication & RBAC (depends on Phases 2, 3, 5).

## Phase 6 Details

**Implementation Date:** 2026-10-04

**Status:** COMPLETE — all acceptance gates verified.

**Authentication Architecture (see DEC-024..027):**
- Mechanism: stateless JWT (HS256) via `jsonwebtoken`; Bearer transport
  (Authorization header; CORS already allowed it). Tokens carry only
  `sub` (user id); the current user and role are resolved from the
  users collection on every protected request.
- Password hashing: Node built-in `crypto.scrypt` (16-byte random salt,
  64-byte key, `timingSafeEqual` verification; stored as
  `scrypt$<salt>$<hash>`). No plaintext is ever stored, logged or
  returned; no custom cryptographic algorithms; no new hashing
  dependency.
- Logout: client-side credential removal (frontend clears token/user);
  the `/api/auth/logout` endpoint validates the credential and returns
  success. Stateless JWT server-side revocation is NOT implemented —
  documented limitation (tokens remain valid until expiry; expiry is
  env-driven `JWT_EXPIRES_IN`, dev default 24h, provisional).
- JWT secret: server-side env only (`backend/.env`, untracked);
  `.env.example` contains a placeholder; auth endpoints return 503 with
  a non-secret message when unconfigured; `/health` unaffected.

**Role Model:**
- Backend storage keeps the SRS role vocabulary (DEC-023):
  `recruiter, candidate, interviewer, admin`.
- The application-facing layer uses the UI/UX product roles (§3):
  `hr, interviewer, interviewee`, mapped via
  `backend/src/auth/roles.js` (recruiter→hr, candidate→interviewee,
  interviewer→interviewer). The frontend and API responses use product
  roles; the backend role remains internal.
- `admin` has no product-role mapping in this phase (no admin UI in the
  UI/UX specification; UX-TBD-002 open): admin can authenticate but is
  denied product-role endpoints (403). Self-registration as admin is
  not possible (registration accepts only the three product roles).

**Files Created:**
- `backend/src/auth/password.js` — scrypt hash/verify (SRS-SEC-003)
- `backend/src/auth/tokens.js` — JWT sign/verify (env secret, 503 when unconfigured)
- `backend/src/auth/roles.js` — product↔backend role mapping
- `backend/src/auth/middleware.js` — `authenticate()` (401s) + `authorize(...roles)` (403)
- `backend/src/auth/resourceAccess.js` — interview resource-authorization foundation
- `backend/src/routes/auth.js` — POST /register, POST /login, POST /logout, GET /me
- `backend/src/routes/rbac.js` — GET /hr-only, /interviewer-only, /interviewee-only, /interview/:id (explicit Phase 6 verification endpoints, isolated from Phase 7 business routes)
- `backend/tests/auth.test.js` — 17 unit tests (password hashing, tokens, role mapping)
- `backend/tests/auth-rbac.test.js` — 45 integration tests (full role matrix, dedicated `interview_monitoring_auth_test` database, guarded cleanup, ephemeral port)
- `scripts/seed-demo-users.js` — idempotent synthetic demo accounts for browser verification

**Files Modified:**
- `backend/src/db/persistence.js` — added `findUserByEmail`, `findUserById`,
  `toSafeUser` (safe representation; never exposes password_hash),
  `deleteUserById`, `findRecruiterByUserId`, `findCandidateByUserId`
- `backend/src/routes/index.js` — mounted `/auth` + `/rbac` (existing middleware/health/CORS/error handling untouched)
- `backend/package.json` / `package-lock.json` — added `jsonwebtoken@^9.0.3` (standard JWT implementation; hand-rolling would be custom crypto)
- `backend/.env.example` / `backend/.env` — JWT_SECRET (placeholder only in .env.example; real value untracked in .env), JWT_EXPIRES_IN
- `frontend/src/lib/api.ts` — `ApiError` (statusCode + safe server message), token header handling (`setAuthToken`), auth endpoints
- `frontend/src/hooks/useAuth.tsx` — real backend auth: restore-on-load via `/api/auth/me`, login/register return the backend-assigned role, async logout (API + local clear), `getRoleDashboardPath`
- `frontend/src/App.tsx` — `PublicRoute authRedirect` (authenticated users on /signin /signup are routed to their role dashboard — UX-AUTH-002)
- `frontend/src/pages/auth/SignInPage.tsx` — role selector removed (backend role is the source of truth), provider buttons/dead forgot-password link removed, safe error messaging, demo accounts seeded with real credentials
- `frontend/src/pages/auth/SignUpPage.tsx` — wired to real registration, 409 duplicate-email handling, demo/provider buttons removed
- `frontend/src/components/layout/{PublicLayout,HRLayout,InterviewerLayout,IntervieweeLayout}.tsx` — logout handlers await `logout()` before navigating (deterministic sign-out with the async auth flow)

**Protected API surface (Phase 6):**
- Public: `POST /api/auth/register`, `POST /api/auth/login`
- Authenticated: `POST /api/auth/logout`, `GET /api/auth/me`
- Role-protected verification endpoints: `GET /api/rbac/hr-only`,
  `GET /api/rbac/interviewer-only`, `GET /api/rbac/interviewee-only`
- Resource-authorization foundation: `GET /api/rbac/interview/:id`
  (recruiter-owner / candidate-participant via the documented
  interview_sessions.recruiter_id / candidate_id relationships only;
  Interviewer denied — no documented assignment relationship exists
  until Phase 8)
- `GET /health` and `GET /ready` unchanged.

**Registration persistence:**
- users collection only (Phase 6 scope; no second auth collection):
  name, email (unique IDX-USR-001), password_hash (scrypt), role
  (backend SRS vocabulary), status ('active' default), created_at,
  updated_at.
- HR registration additionally creates the linked recruiter profile
  (company preserved from the existing product flow) and Interviewee
  registration the linked candidate profile, via existing Phase 5
  persistence functions, with compensation (created user removed) on
  unexpected profile failure — documented in DEC-027.

**Test Results (2026-10-04):**
- Backend suite: **105/105 passed** (43 existing Phase 3+5 + 62 new
  Phase 6: 17 unit + 45 RBAC integration). Synthetic users only
  (`@example.local`, `@demo.com`); dedicated `interview_monitoring_auth_test`
  database with guarded drop; deterministic and repeatable.
- Verified in tests: registration success/duplicate/invalid/unsupported
  role/short password; login per role/invalid password/unknown account
  (same safe message — no enumeration); missing credentials; /me with
  valid/malformed/expired/ghost tokens; plaintext persistence MUST NOT
  occur; password_hash never in API responses; linked profiles; full
  cross-role denial matrix (403 vs 401 distinction); interviewer denied
  from a specific interview (403); unknown interview 404; admin
  authenticate-but-denied; logout semantics including the documented
  stateless limitation; /health + /ready regression.
- Frontend: `tsc -b && vite build` passes; lint 0 errors (244
  pre-existing warnings); no new frontend dependencies.

**Live Verification (2026-10-04):** login for all three demo roles
returns the correct backend-derived product role; HR→hr-only 200;
Interviewer→hr-only 403; Interviewee→interviewee-only 200;
HR→interviewee-only 403; unauthenticated→me 401; wrong password 401;
logout 200; CORS preflight from the pinned frontend origin echoes
`Access-Control-Allow-Origin` + `Authorization` allowed; backend logs
contain no passwords/tokens/secrets.

**Role Authorization Matrix (verified):**

|  Scenario | Result |
|-----------|--------|
| Registration: valid user | 201 SUCCESS |
| Registration: duplicate email | 409 REJECT |
| Registration: invalid credentials/unsupported role | 400 REJECT |
| Plaintext password persistence | MUST NOT OCCUR (verified: scrypt only) |
| Login: valid HR / Interviewer / Interviewee | 200 SUCCESS (role from backend) |
| Login: invalid password / unknown account | 401 REJECT (same safe message) |
| HR → HR-protected endpoint | 200 ALLOW |
| Interviewer → Interviewer-protected endpoint | 200 ALLOW |
| Interviewee → Interviewee-protected endpoint | 200 ALLOW |
| Unauthenticated → protected endpoint | 401 REJECT |
| Interviewer/Interviewee → HR-protected | 403 REJECT |
| HR/Interviewee → Interviewer-protected | 403 REJECT |
| HR/Interviewer → Interviewee-protected | 403 REJECT |
| Interviewee → Interviewer-only | 403 REJECT |
| Owning HR → specific interview | 200 ALLOW |
| Participating Interviewee → specific interview | 200 ALLOW |
| Non-owner HR → specific interview | 403 REJECT |
| Interviewer → specific interview | 403 REJECT (assignment is Phase 8) |
| Authenticated → logout | 200; state cleared client-side |
| After logout → protected (normal client flow) | REJECT (client credential removed) |
| admin → product-role endpoints | 403 REJECT (no product mapping; UX-TBD-002) |

**Security Audit (2026-10-04):**
- ✅ No plaintext passwords anywhere (DB verified: scrypt hashes only)
- ✅ Real JWT secret not committed (only in untracked `backend/.env`; `.env.example` placeholder; `git check-ignore` confirms; diff grep confirms)
- ✅ No secrets in frontend source/env; server-side only
- ✅ No password hashes in API responses (register/login/me tested)
- ✅ No authentication bypass: all protected routes use `authenticate` (+ `authorize`/resource checks)
- ✅ Backend is the authorization boundary (frontend route hiding is UX only; enforced by tests)
- ✅ 401 (unauthenticated) and 403 (unauthorized) kept distinct
- ✅ No tokens/passwords/secrets in logs (verified live + code review)
- ✅ No unsafe CORS changes (preflight echo verified; Phase 3 config preserved)
- ✅ `/health` unchanged

**Regression Verification (2026-10-04):**
- Phase 3: backend starts, listens on 3001, `/health` 200 unchanged, `/ready` 200, CORS/error middleware/graceful shutdown preserved, all Phase 3 tests pass
- Phase 4: AI service untouched and healthy on 8000 (`/ready` → ok)
- Phase 5: MongoDB connected, users collection compatible (same fields/indexes), all Phase 5 persistence tests pass, test databases dropped after runs, dev database intact
- Phase 2: frontend builds (`tsc -b && vite build`), lint 0 errors, serving 200 locally (:5180) and at the pinned URL; single BrowserRouter; auth UI now wired to the real backend

**Known Limitations / TBDs:**
- Stateless JWT: no server-side token revocation (logout is client-side credential removal; tokens valid until expiry). Token blocklist/refresh-token rotation is future work if required.
- Token expiry (dev default 24h) is provisional — production values are TBD (SRS-SEC-010).
- Interviewer assignment/authorization for specific interviews is deferred to Phase 8 (no documented assignment relationship exists yet).
- HR vs Interviewer permission boundary remains UX-TBD-002 (open); no cross-role permissions invented.
- Multi-role accounts (UX-TBD-001) and role selection (UX-AUTH-003) not implemented; one role per account (backend-assigned role is the source of truth).
- admin role: recognized by SRS but has no product UI or product-role mapping in this phase.
- OAuth/social login not implemented (UX-AUTH-001: provider buttons only if implemented).
- Password reset/email verification/MFA not in Phase 6 scope.
- `npm audit` reports 3 pre-existing high-severity dev-only advisories (nodemon→chokidar→braces, from Phase 3); unrelated to authentication; not fixed to avoid a breaking nodemon change outside this phase's scope.

**Next Phase:** Phase 7 — HR Product (depends on Phase 6).
