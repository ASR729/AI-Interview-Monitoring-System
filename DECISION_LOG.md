# DECISION_LOG.md

# AI Interview Monitoring and Detection System

Record material project decisions here. Do not silently reverse a
decision. If a decision changes, add a new record explaining why.

## Status Legend

- **APPROVED** — established by approved documentation/project direction
- **PROVISIONAL** — selected for implementation but may be refined with
  evidence
- **TBD** — intentionally unresolved
- **SUPERSEDED** — replaced by a later decision

## Approved Baseline Decisions

### DEC-001 — Product Framing

**Status:** APPROVED  
The system is an AI Interview Monitoring / Interview Integrity Platform
that produces observable signals, structured events, evidence/context
and integrity-risk indicators for human review. It is not a definitive
automated cheating/deception judge.  
**Basis:** PRD, SRS, AI/ML Specification.

### DEC-002 — Evidence + Risk Indicators + Human Review

**Status:** APPROVED  
Core principle: evidence + confidence + context + human review. No
individual signal is conclusive proof of cheating, deception or
intent.  
**Basis:** SRS, AI/ML Specification, UI/UX Specification.

### DEC-003 — Modular Application Architecture

**Status:** APPROVED  
Use logical separation of frontend, application backend, AI analysis,
persistence, real-time communication and monitoring/event processing.
Avoid premature microservices.  
**Basis:** System Architecture, Development Plan.

### DEC-004 — Technology Direction

**Status:** APPROVED  
React + Vite + Tailwind CSS; Node.js + Express.js; Python + FastAPI;
MongoDB; WebRTC; Socket.io; open-source/local AI/CV for MVP where
appropriate. Exact library/model versions must be verified during
implementation.  
**Basis:** Architecture, UI/UX, Development Plan, Infrastructure Plan.

### DEC-005 — Interview Session as Central Business Context

**Status:** APPROVED  
The interview session connects participants, monitoring events, AI
analysis, alerts, evidence and reports.  
**Basis:** Architecture and Database Specification.

### DEC-006 — Event-Oriented Monitoring Data

**Status:** APPROVED  
Represent monitoring output primarily as timestamped structured events
rather than permanently storing every raw frame. Events may reference
evidence.  
**Basis:** Architecture and Database Specification.

### DEC-007 — Confidence and Severity Are Separate

**Status:** APPROVED  
Model/rule confidence and product severity are separate concepts and
must not be conflated.  
**Basis:** Database Specification, UI/UX Specification, Testing Plan.

### DEC-008 — Local-First / ₹0 Initial Development

**Status:** APPROVED  
Initial development/validation targets ₹0 recurring infrastructure spend
using local hardware, open-source software and suitable free tiers. This
does not imply permanent free production SaaS.  
**Basis:** Zero-Cost Infrastructure Plan and Roadmap.

### DEC-009 — MVP Before Advanced Multimodal AI

**Status:** APPROVED  
Complete and evaluate webcam/CV/event/alert/evidence MVP before audio,
speech-to-text, NLP and multimodal fusion.  
**Basis:** Development Plan, AI/ML Specification, Roadmap.

### DEC-010 — No Fabricated AI Performance

**Status:** APPROVED  
Precision, recall, F1, false positives, false negatives and latency must
be measured using controlled data. No result may be claimed before
measurement.  
**Basis:** SRS and Testing & Evaluation Plan.

### DEC-011 — Backend Authorization Is the Security Boundary

**Status:** APPROVED  
UI visibility is not a security control. Backend authorization enforces
permissions.  
**Basis:** UI/UX Specification and security requirements.

### DEC-012 — Data Minimization

**Status:** APPROVED  
Do not persist unnecessary raw media. Do not embed large raw media blobs
in ordinary event documents unless an approved architecture decision
requires it.  
**Basis:** Database Specification and Architecture.

### DEC-013 — Phase-Gated Development

**Status:** APPROVED  
Implement through 24 dependency-driven phases. Verify each phase before
progression. Critical unresolved failures block progression.  
**Basis:** Development Plan and implementation strategy.

## Provisional Implementation Decisions

### DEC-014 — Persistent Project-Control Files

**Status:** PROVISIONAL  
Maintain `CLAUDE.md`, `IMPLEMENTATION_PLAN.md`, `PROJECT_STATUS.md` and
`DECISION_LOG.md` as persistent engineering context.

### DEC-015 — Minimum-Code Strategy

**Status:** PROVISIONAL  
Implement the smallest production-quality solution satisfying the
current requirement. Avoid speculative abstractions, unused dependencies
and future-phase functionality.

### DEC-016 — Phase-Scoped Documentation Reading

**Status:** PROVISIONAL  
During implementation, read documentation relevant to the current phase
instead of repeatedly loading unrelated future-stage material. The
complete documentation remains authoritative.

## Explicitly TBD

### TBD-001 — Production cloud provider

Production provider/topology remains flexible.

### TBD-002 — Production concurrency target

Must be benchmarked rather than assumed.

### TBD-003 — Production latency target

Must be measured and validated.

### TBD-004 — Production data/evidence retention period

The requirement exists; final duration is not established.

### TBD-005 — Production backup/RPO/RTO

To be defined when production requirements justify them.

### TBD-006 — Final production evidence/object storage

Not fixed by the current baseline.

### TBD-007 — Final billing model/pricing

Deferred until validation.

### TBD-008 — ATS integration priorities

To be based on validated product/customer requirements.

### TBD-009 — Advanced multimodal model selection

Requires technical evaluation and validation.

### TBD-010 — Final supported observable-behaviour taxonomy

Only documented, feasible, ethically appropriate and evaluated signals
should be enabled.

## Decision Change Procedure

When a new material decision is required: 1. identify the
problem/requirement; 2. inspect approved documentation; 3. inspect
current implementation; 4. identify alternatives if useful; 5. choose
only when justified; 6. record the decision; 7. record affected
phases/components; 8. update affected technical documents; 9. add
tests/acceptance criteria where needed.

## Phase 1 Decisions

### DEC-017 — Repository Initialization & Baseline Structure

**Status:** APPROVED  
**Date:** 2026-09-26  
**Phase:** Phase 1 — Requirements Freeze & Repository

**Context:**
Project documentation complete, but no Git repository, no implementation directories, no project scaffolding files.

**Decision:**
Initialize Git repository; create standard directory structure (frontend/, backend/, ai-service/, tests/, scripts/); create .gitignore, README.md, docker-compose.yml with local development services (MongoDB, backend, AI service, frontend).

**Alternatives:**
- Defer Git initialization to later
- Use different directory structure
- Use different container orchestration

**Rationale:**
- Git is required for phase-gated milestones per CLAUDE.md
- Directory structure matches approved architecture (DEC-003, DEC-004)
- docker-compose.yml enables zero-cost local development per Zero-Cost Infrastructure Plan (DEC-008)
- README.md provides project traceability

**Impact:**
Establishes the repository baseline for all subsequent phases.

**Verification:**
- `git status` shows initialized repository
- All expected directories exist
- .gitignore, README.md, docker-compose.yml present and valid

**Related requirements:**
CLAUDE.md §12, IMPLEMENTATION_PLAN.md Phase 1, DEC-003, DEC-004, DEC-008

---

## Future Decision Template

``` text
## DEC-XXX — [Decision title]

Status:
Date:
Phase:

Context:

Decision:

Alternatives:

Rationale:

Impact:

Verification:

Related requirements:

Supersedes:
```

## DEC — Phase 2 Stabilization Decisions

**Status:** APPROVED (by implementation)
- Single `BrowserRouter` in `main.tsx`; `App.tsx` contains only `<Routes>`.
- Component API extended (`danger`, `checked`, `onSelect`) to match page usage — pages kept as the usage contract source.
- Data-driven table renamed to `DataTable`; compositional `Table*` primitives added to `ui/Table.tsx`.
- ESLint 9 flat config adopted (`eslint.config.js`); unused-vars demoted to warn (legacy demo pages retain illustrative code).
- Build pipeline: `tsc -b && vite build` to guarantee type checking in production builds.
- Frontend remains mock-data only; no Phase 4–6 functionality implemented.

## DEC — Sign-out and Layout Fixes (User-reported, 2026-10-03)

**Status:** APPROVED (by implementation, user-requested bug fix)

Context:
- User reported: unusable dashboard layout, non-functional logout button after sign-in, and sign-in/sign-up form not centered.
- Headless-browser verification showed the HR/interviewer/interviewee dashboard logout worked in current code, but the public homepage avatar-menu "Sign out" was a no-op (empty handler in `PublicLayout.tsx`), which is the path the user actually hit.

Decision:
- Wired the public homepage user-menu "Sign out" to `logout()` + `navigate('/', { replace: true })` in `PublicLayout.tsx`.
- Replaced the misused shared `Dropdown` component (internal `isOpen` caused a double-click requirement) in `PublicLayout` with plain menu markup matching the dashboard layouts; added click-outside close.
- Made logout deterministic in `HRLayout`, `InterviewerLayout`, `IntervieweeLayout`: explicit `navigate('/signin', { replace: true })` after `logout()` via a shared `handleLogout`.
- Hardened `logout` in `useAuth.tsx`: clears `user`/`token` from both localStorage and sessionStorage.
- Fixed invalid nested `<button>` DOM (button-in-button) in table action menus (`hr/DashboardPage.tsx`, `interviewer/ReportsPage.tsx`) by using styled span triggers.
- Sign-in/sign-up pages remain fully centered (verified); no split layout used.

Alternatives:
- Controlled `open`/`onToggle` props on the shared Dropdown component (rejected: broader API change than needed).

Rationale:
- Minimal, deterministic fixes; single-click sign-out everywhere; no ghost sessions after reload.

Impact:
- Frontend-only change; no backend/AI-service impact; no data model change.

Verification:
- 13/13 headless Chrome tests passed (homepage sign-out, sidebar/avatar-menu sign-out per role, redirect-after-logout, centered auth cards, no DOM nesting warnings).
- `npm run lint`: 0 errors. `npm run build`: passes.

Related requirements:
- UI/UX Specification v1.0 (navigation, auth pages); PRD v1.0 (authentication).

Supersedes:
- None.

## DEC-018 — AI Service Foundation Scope; CV Dependencies Deferred to Phase 13

**Status:** APPROVED (by implementation, resolving an IMPLEMENTATION_PLAN ambiguity)
**Date:** 2026-10-03
**Phase:** Phase 4 — Python/FastAPI AI Service

**Context:**
`IMPLEMENTATION_PLAN.md` Phase 4 work line mentions "MVP CV dependencies", but the
same plan's Phase 13 ("Computer Vision") depends on Phases 4 **and** 12, and the
Development Plan (M07) defines the Phase 4 step as "CV service foundation: Create
FastAPI AI-service structure and monitoring interfaces" — structure and interfaces,
not CV libraries. AI/ML Specification §30 lists the CV framework (OpenCV) and
face/landmark processing (MediaPipe) as Baseline decisions for the CV work itself,
with "exact implementation TBD". Installing heavy CV dependencies before any CV
code exists would violate the Minimum-Code Strategy (DEC-015) and add unused
dependencies.

**Decision:**
Phase 4 delivers the development foundation only: FastAPI app factory, environment-
driven configuration, `/health` + `/ready` + `/` endpoints, JSON error handling,
OpenAPI docs, tests, and the documented `app/services/analysis/` extension point.
No CV framework (opencv-python, mediapipe, numpy-for-CV) is installed in Phase 4;
tests assert these are absent. CV dependencies are installed in Phase 13 when the
CV engine is actually implemented and validated.

**Alternatives:**
- Install opencv-python/mediapipe in Phase 4 (rejected: unused dependencies, no CV
  code until Phase 13, conflicts with DEC-015 and test-enforced negative scope).

**Rationale:**
- Development Plan M07 governs the foundation step: structure + monitoring interfaces.
- IMPLEMENTATION_PLAN Phase 13 explicitly depends on Phase 12 (WebRTC/media) for CV,
  proving CV work is not expected inside Phase 4.
- AI/ML Spec §30 marks exact CV implementation as TBD pending validation.

**Impact:**
- `requirements.txt` contains only foundation dependencies; Phase 13 will extend it.
- Phase 4 gate ("AI service runs locally and health check passes") is unaffected.

**Verification:**
- `tests/test_app.py::TestNoExternalDependencies` asserts `cv2`/`mediapipe` (and
  `pymongo`/`motor`) are not importable — 24/24 tests pass.

**Related requirements:**
IMPLEMENTATION_PLAN.md Phase 4/13, Development Plan M07, AI/ML Specification §30,
DEC-004, DEC-009, DEC-015.

---

## DEC-019 — AI Service Runtime Boundary and Port

**Status:** APPROVED (by implementation)
**Date:** 2026-10-03
**Phase:** Phase 4 — Python/FastAPI AI Service

**Context:**
The AI service must be separated from the Node.js application backend (System
Architecture v1.0; AI/ML Specification §29). A concrete local runtime shape was
needed for Phase 4 verification.

**Decision:**
The AI service binds `0.0.0.0:8000` locally (configurable via `AI_SERVICE_HOST`/
`AI_SERVICE_PORT`). Browsers must not call this service directly; the Node.js
application backend is the future internal-HTTP caller (proposed flow
`Application -> AI Service`). Health endpoints report process status only and never
claim AI/model/detector readiness, per the AI integrity rules (DEC-001, DEC-002).

**Alternatives:**
- Same-process embedding in Express (rejected: violates approved separation).
- Direct browser access (rejected: bypasses the primary authorization boundary).

**Rationale:**
- Matches System Architecture v1.0 deployment shape and AI/ML Spec §29.
- Keeps the Phase 4 gate verifiable with a simple local health check.

**Impact:**
- Port 8000 reserved for this service in local development; docker-compose maps it.
- Phase 11+/13+ integration must go through the backend, not the browser.

**Verification:**
- Cold-start uvicorn + `curl http://localhost:8000/health` returned
  `{"status":"ok", ...}` (2026-10-03); 24/24 tests pass.

**Related requirements:**
System Architecture v1.0 (§ authorization boundary, deployment shape), AI/ML
Specification §29, CLAUDE.md §4/§8, DEC-001, DEC-002, DEC-003.

---

## DEC-020 — httpx Client Package Provisioning in the Development Environment

**Status:** PROVISIONAL (environment-verified)
**Date:** 2026-10-03
**Phase:** Phase 4 — Python/FastAPI AI Service

**Context:**
FastAPI's `TestClient` requires an HTTP client library. This development
environment's package index provides the official next-generation httpx client
(maintained by Tom Christie / Pydantic Services Inc., BSD-3-Clause) under the
package name `httpx2` (with dependency `httpcore2`); the classic `httpx` name is
not resolvable here.

**Decision:**
Pin `httpx2==2.13.1` in `ai-service/requirements.txt` and verify the full
dependency set installs cleanly and the test suite passes against it. On a
standard PyPI environment where `httpx` resolves, `httpx` is the equivalent pin;
either name satisfies the TestClient requirement.

**Alternatives:**
- Force `httpx` install (rejected: not resolvable from this environment's index).
- Vendor the client (rejected: unnecessary).

**Rationale:**
- Same upstream maintainer/license as httpx; verified metadata and functionality.
- Requirements must reflect what actually installs and passes verification.

**Impact:**
- `requirements.txt` line 6 pins `httpx2==2.13.1`; verified 2026-10-03.
- If the project later moves to a standard PyPI index, replace with `httpx`.

**Verification:**
- `pip install -r requirements.txt` → all satisfied; 24/24 tests pass (2026-10-03).

**Related requirements:**
DEC-004 (exact library versions verified during implementation), CLAUDE.md §7
(anti-hallucination), CLAUDE.md §11.

---

## DEC-021 — Pinned Public Service URLs (User Hard Constraint)

**Status:** APPROVED (explicit user instruction; permanent)
**Date:** 2026-10-04
**Phase:** Cross-phase (Phases 2–3 runtime; all future phases)

**Context:**
The development environment is an e2b sandbox whose preview links map
`<port>-<sandbox-host>.e2b.app` to local ports. The user designated the
frontend preview link as the permanent public URL and instructed that it must
never change — "even if I say to do so" — and that frontend and backend must
remain working and visible at their links in the browser.

**Decision:**
- **Frontend public URL (permanent):** `https://5180-iteaxs65egwgp2h9q52q5.e2b.app/`
  → local port **5180**.
- **Backend public URL:** `https://3001-iteaxs65egwgp2h9q52q5.e2b.app/`
  → local port **3001**.
- **AI service:** internal port **8000** (backend-only caller; no pinned public
  URL required in the current phase).
- `strictPort: true` in both `frontend/vite.config.*` files: vite must fail
  loudly rather than silently serve on a different port/link.
- Backend CORS allows the e2b preview origin plus localhost origins (5173/5180)
  so browser API calls from the pinned frontend origin work from Phase 6 onward.
- The frontend dev-port change 5173 → 5180 (commit `9fe0da0`, 2026-10-03) is
  confirmed as intentional environment adaptation, not accidental drift.

**Alternatives:**
- Revert vite to port 5173 (rejected: breaks the user's designated link).
- Leave CORS localhost-only (rejected: browser calls from the e2b origin would
  be blocked from Phase 6 onward).

**Rationale:**
- The e2b preview link is the user's only browser access point; changing it
  severs visibility regardless of technical merit.
- `strictPort` enforces the constraint at the tool level (fail-fast over
  silent port drift).

**Impact:**
- Future phases must keep frontend on :5180 and backend on :3001 and must not
  repurpose the e2b preview origin.
- Deployment provider decisions (TBD-001) remain separate; the pinned URLs are
  a development-environment constraint, not the production topology.

**Verification:**
- Frontend e2b link → HTTP 200; backend e2b link → health OK (2026-10-04).
- CORS echo: `Access-Control-Allow-Origin: https://5180-iteaxs65egwgp2h9q52q5.e2b.app`.
- Single config-driven vite instance on 5180 (stray duplicate removed).

**Related requirements:**
User instruction (2026-10-04), System Architecture v1.0 (authorization
boundary), UI/UX Specification v1.0, DEC-003, DEC-011, DEC-019.

---

## DEC-022 — Phase 5 MongoDB Development Database, Driver and Connection Architecture

**Status:** APPROVED (by implementation)
**Date:** 2026-10-04
**Phase:** Phase 5 — MongoDB (persistence foundation)

**Context:**
Phase 5 requires MongoDB persistence in the Node/Express backend. This
environment has no Docker and no pre-installed MongoDB; the Zero-Cost
Infrastructure Plan prefers MongoDB Community Server locally where
practical, with Atlas Free as a prototype alternative when local MongoDB
is unavailable. The backend previously had no MongoDB dependency.

**Decision:**
- Development database: **MongoDB Community Server 8.0.4**, installed
  from the official Debian 12 tarball, data directory
  `/home/user/mongodb-data` (outside the repository), bound to
  `127.0.0.1:27017` only. No credentials required for the local
  localhost-only instance; production requires authenticated
  least-privilege credentials (TBD). Atlas Free was not used because a
  local server was available.
- Library: official **`mongodb` Node.js driver 6.21.0** (no ODM). The
  raw driver is the simplest maintainable integration for the current
  ESM/Express backend (DEC-004), avoids ODM schema-invention pressure,
  and keeps AI-analysis persistence generic and traceable.
- Connection architecture: `backend/src/config/database.js` with
  environment-driven `MONGODB_URI`/`MONGODB_DB_NAME`, sanitized
  logging (credentials redacted), graceful failure (connection failure
  never crashes the backend; `/health` still serves), idempotent
  reconnect, and graceful disconnect in the existing shutdown handler.
  Connection is non-blocking at startup so the canonical backend URL
  is never broken by database unavailability.

**Alternatives:**
- Mongoose ODM (rejected: adds schema/ODM abstractions the current
  phase does not need; conflicts with DEC-015).
- MongoDB Atlas Free (rejected for this environment: local server
  available; per Infrastructure Plan local-first preference).
- Blocking startup on MongoDB (rejected: would break the pinned
  canonical backend URL when MongoDB is unavailable).

**Rationale:**
- Local Community Server satisfies ₹0 infrastructure (DEC-008) and the
  local-first rule; sandbox has sudo and network access to the official
  tarball.
- The raw driver matches the Database Specification's identifier
  flexibility ("String/ObjectId") without imposing ODM idioms.

**Impact:**
- `backend/package.json` gains one runtime dependency (`mongodb`).
- Future phases use `requireDatabase()` from the persistence layer;
  `/ready` reports actual database connectivity.

**Verification:**
- Node driver ping → `{"ok":1}`; backend startup logs connected +
  19 indexes; `GET /ready` → 200; SIGTERM → graceful shutdown with
  MongoDB disconnect; unreachable-URI test returns null without crash.
- 43/43 backend tests pass.

**Related requirements:**
IMPLEMENTATION_PLAN.md Phase 5, Database Specification §19 (security),
CLAUDE.md §4/§8, DEC-004, DEC-008, DEC-015, DEC-021.

---

## DEC-023 — Phase 5 Persistence Model Conventions and TBD Discipline

**Status:** APPROVED (by implementation; resolves documented
ambiguities)
**Date:** 2026-10-04
**Phase:** Phase 5 — MongoDB (persistence foundation)

**Context:**
The Database Specification v1.0 is a baseline proposal; several enums,
identifier forms and lifecycle states are explicitly TBD/Proposed. The
SRS has not finalized the interview lifecycle states (§states "lifecycle
stages such as configured, active and completed" — examples only), while
Database Specification §8.1 proposes `draft → scheduled/invited → ready
→ in_progress → completed`. A documented conflict exists between the two
example vocabularies.

**Decision:**
- **Identifiers:** application-generated UUID strings stored as `_id`
  (Database Specification allows "String/ObjectId"; String chosen).
  Cross-references (`recruiter_id`, `candidate_id`, `interview_id`,
  `event_id`, `evidence_ids`, `analysis_id`, `recipient_user_id`) store
  these identifiers and are validated at the application layer
  (MongoDB has no enforced foreign keys): DB-VAL-001 (events require a
  valid interview session), DB-VAL-002 (timestamp required), DB-VAL-003
  (confidence type-checked numeric when provided; **no bounded range
  enforced** until a model defines one), DB-VAL-005 (evidence refs must
  resolve and belong to the same interview), DB-VAL-007 (report/event
  refs belong to the report's interview), DB-VAL-008 (created_at/
  updated_at generated by the data layer). DB-VAL-009 is deferred
  (applies to future recruiter review flows, Phases 17/18).
- **Interview status:** the Database Specification §8.1 proposed set
  (`draft, scheduled, invited, ready, in_progress, completed`) is
  enforced provisionally as the working set, defaulting to `draft`.
  No cancellation/expiry/error states were invented. The SRS-governed
  final list remains TBD; when the SRS finalizes states, the set must
  be reconciled (this record documents the conflict; the Database
  Specification's proposed vocabulary governs until then).
- **Roles:** `recruiter, candidate, interviewer, admin` — the SRS role
  table's recognized roles (Recruiter/HR, Candidate, Hiring Manager /
  Interviewer, System Administrator). Permissions are NOT enforced in
  Phase 5 (Phase 6 owns RBAC).
- **Open enums:** users.status, alerts.status, review_status, severity,
  event_type and source remain open strings — exact values are TBD
  (DB-TBD-001/002, UI Spec "exact severity scale TBD"). Documented
  defaults are applied when omitted (active / active / unreviewed).
  No closed-enum enforcement that would convert TBD into fixed values.
- **AI analysis / final reports:** stable baseline fields only; `output`
  and `integrity_indicators` are controlled structured objects without
  invented model-specific schemas (schemas TBD per AI/ML Spec).
- **Index strategy:** 19 documented baseline indexes created; six
  deferred (IDX-USR-002, IDX-REC-002, IDX-CAN-002, IDX-EVT-004,
  IDX-EVT-005, IDX-ALT-003) per the Database Specification's
  over-indexing caution. IDX-RPT-001 is unique (one current report per
  interview, per §14 and "Unique/Conditional").
- **Test strategy:** dedicated test database derived as
  `${MONGODB_DB_NAME}_test`; the suite refuses to run against a
  database not ending in `_test` and drops only that database
  (guarded destructive cleanup). Synthetic data only
  (`@example.local`, demo names).

**Alternatives:**
- Enforce closed enums for all status fields (rejected: documentation
  explicitly marks exact states TBD; converting TBD into fixed values
  is prohibited).
- Accept any status string including invented cancellation/expiry/error
  states (rejected: inventing unsupported lifecycle states).
- Non-unique IDX-RPT-001 (rejected: §14 documents one current report per
  interview; uniqueness enforces the documented invariant).

**Rationale:**
- Respects TBD discipline while preserving DB-VAL validation discipline.
- The lifecycle conflict is resolved by adopting the Database
  Specification's proposed vocabulary (the governing baseline for the
  data model) and recording that the SRS final list remains TBD.

**Impact:**
- `src/db/constants.js` documents open enums; `src/db/indexes.js`
  documents deferred indexes; when the SRS finalizes states/severity,
  only these modules need updating.

**Verification:**
- 43/43 tests pass, including: invalid interview_id rejected (DB-VAL-001),
  missing timestamp rejected (DB-VAL-002), non-numeric confidence
  rejected (DB-VAL-003), cross-interview evidence/event refs rejected
  (DB-VAL-005/007), lifecycle state outside the proposed set rejected,
  duplicate email/report rejected via unique indexes, 19 baseline
  indexes recognized, test database cleanup verified.

**Related requirements:**
Database Specification §8.1, §9.1, §15, §20 (DB-VAL-001..009), §25
(implementation guidance), SRS (role table, lifecycle examples), AI/ML
Specification §(severity placeholders TBD), CLAUDE.md §5/§6/§7,
DEC-005, DEC-006, DEC-007, DEC-012, DEC-015.

---

## DEC-024 — Phase 6 Authentication Mechanism: Stateless JWT (HS256)

**Status:** APPROVED (by implementation; SRS-SEC-010 defers the exact
mechanism to architecture/privacy decisions)
**Date:** 2026-10-04
**Phase:** Phase 6 — Authentication & RBAC

**Context:**
SRS-SEC-010 and System Architecture ("exact mechanism is SRS/TBD")
delegate the session/token mechanism to an implementation decision. The
Database Specification documents no dedicated sessions collection (the
nine Phase 5 collections are users, recruiters, candidates,
interview_sessions, monitoring_events, ai_analysis_results, alerts,
evidence, final_reports). CORS already allows the Authorization header
with credentials.

**Decision:**
Stateless JWT (HS256) via the standard `jsonwebtoken` library. Tokens
are transported in the `Authorization: Bearer` header, carry only `sub`
(user id), and are validated on every protected request; the current
user and role are re-resolved from the users collection (source of
truth; stale-role and deleted-account risk avoided). The signing secret
is server-side env only (`JWT_SECRET`; auth endpoints return 503 with a
non-secret message when unconfigured; `/health` unaffected). Token
expiry is env-driven (`JWT_EXPIRES_IN`, dev default `24h`,
provisional). Logout is client-side credential removal; the
`/api/auth/logout` endpoint validates the credential and returns
success. Server-side token revocation is NOT implemented and is
documented as a limitation (tokens remain valid until expiry).

**Alternatives:**
- MongoDB-backed server-side sessions (rejected: requires an
  undocumented sessions collection and cleanup machinery; more moving
  parts than the phase needs).
- Hand-rolled HMAC tokens (rejected: custom cryptographic algorithms are
  prohibited).
- Cookie sessions (rejected: same collection/infra cost as server
  sessions; Bearer header already allowed by the existing CORS config).

**Rationale:**
- Smallest architecture compatible with the approved documents (no new
  collection, no session store, standard library).
- Per-request user resolution keeps authorization correct without
  refresh/revocation machinery in this phase.

**Impact:**
- `backend/package.json` gains one runtime dependency (`jsonwebtoken`).
- Logout invalidates the client credential; tokens remain technically
  valid until expiry (documented limitation; tested).
- Production token policy (expiry, refresh, revocation) remains TBD
  (SRS-SEC-010).

**Verification:**
- 45/45 RBAC integration tests + 17/17 unit tests pass, including
  malformed/expired/wrong-secret/missing-secret token handling and the
  documented stateless logout limitation.
- Live verification: login for all three roles, protected/cross-role
  matrix, logout 200.

**Related requirements:**
SRS-SEC-010, SRS-FR-001/002, System Architecture (§Auth & Access, §
session security), Zero-Cost Infrastructure Plan §16, CLAUDE.md §8/§11,
DEC-004, DEC-011, DEC-015, DEC-021.

---

## DEC-025 — Phase 6 Password Hashing: Node Built-in scrypt

**Status:** APPROVED (by implementation)
**Date:** 2026-10-04
**Phase:** Phase 6 — Authentication & RBAC

**Context:**
SRS-SEC-003 requires standard secure password-storage practices. The
backend had no password-hashing dependency. Node's built-in
`node:crypto` provides scrypt (RFC 7914), an OWASP-recommended
password-based KDF, so an established mechanism exists without adding a
dependency.

**Decision:**
Use Node built-in `crypto.scrypt` with a per-user 16-byte random salt
and 64-byte derived key, verified with `timingSafeEqual`; stored as
`scrypt$<saltHex>$<hashHex>` in the existing users collection
(`password_hash`). Plaintext passwords are never persisted, logged,
returned or placed in frontend state; API responses use a safe
representation that never includes password_hash.

**Alternatives:**
- `bcrypt` dependency (rejected: not installed; scrypt from the standard
  library satisfies the requirement without a new dependency per the
  dependency-discipline rule).
- Argon2 native dependency (rejected: native build cost; not required by
  any approved document).
- Custom cryptographic hashing (rejected: prohibited).

**Rationale:**
- Standard, audited, NIST/OWASP-recognized KDF already available in the
  runtime; timing-safe comparison prevents timing attacks.
- Format prefix (`scrypt$`) allows future algorithm migration.

**Impact:**
- No new dependency; `backend/src/auth/password.js` is the single
  hashing module.
- Future rehashing/migration (e.g. to argon2id) can key off the stored
  scheme prefix.

**Verification:**
- 17/17 unit tests pass: hash format, round-trip verify, wrong-password
  rejection, unique per-hash salts, malformed-hash safety, no plaintext
  in output; integration tests assert the stored document contains only
  the scrypt hash and responses never contain password material.

**Related requirements:**
SRS-SEC-003, Database Specification §5/§19, CLAUDE.md §8/§10/§32,
DEC-012, DEC-015.

---

## DEC-026 — Phase 6 Role Model Mapping and Provisional Permission Boundary

**Status:** APPROVED (by implementation; resolves the SRS/UI-UX role
vocabulary difference; UX-TBD-002 remains open)
**Date:** 2026-10-04
**Phase:** Phase 6 — Authentication & RBAC

**Context:**
The UI/UX Specification §3 defines the product roles as HR,
Interviewer, Interviewee, while the backend storage roles established
in Phase 5 (DEC-023, from the SRS role table) are `recruiter,
candidate, interviewer, admin` — Phase 5 code, indexes and tests depend
on that vocabulary. UX-TBD-002 leaves the exact HR vs Interviewer
permission boundary open, and UX-TBD-001 leaves multi-role accounts
open.

**Decision:**
- Backend storage keeps the SRS vocabulary (DEC-023 unchanged):
  `recruiter, candidate, interviewer, admin`.
- The application-facing auth/RBAC layer uses the UI/UX product roles:
  `hr, interviewer, interviewee`, mapped in
  `backend/src/auth/roles.js` (recruiter→hr, candidate→interviewee,
  interviewer→interviewer, case-insensitive). Auth API responses and
  frontend role-aware routing use product roles; the backend role stays
  internal.
- `authorize(...productRoles)` middleware enforces the product role on
  the backend (DEC-011). No cross-role permissions are invented: each
  role may access only its own role-protected endpoints.
- `admin` has no product-role mapping in this phase (no admin product
  UI in the UI/UX specification): admin accounts can authenticate but
  are denied product-role endpoints (403). Self-registration as admin
  is not possible (registration accepts only the three product roles).
- One role per account (UX-TBD-001 treated as single-role); role
  selection (UX-AUTH-003) is not implemented — the backend-assigned
  role is the source of truth.

**Alternatives:**
- Rename backend roles to product roles (rejected: breaks Phase 5
  persistence code/tests and silently reverses DEC-023).
- Grant admin access to HR endpoints (rejected: invented cross-role
  permission; UX-TBD-002 open).

**Rationale:**
- Preserves the recorded Phase 5 baseline and SRS traceability while
  exposing the UI/UX product roles consistently at the application
  boundary.
- Phase 6 proves "authorized access works and unauthorized role access
  is blocked" without inventing a permission matrix.

**Impact:**
- Phase 7+ reuses `authorize()`/`toProductRole()`; if UX-TBD-002 or
  UX-TBD-001 are later decided, only `roles.js` and route guards change.

**Verification:**
- Full cross-role denial matrix verified by integration tests and live
  curl checks (403 vs 401 distinction; admin authenticate-but-denied).
- Role-mapping unit tests pass (17/17).

**Related requirements:**
UI/UX Specification §3/§7 (UX-AUTH-002/003, role-security rule,
UX-TBD-001/002), SRS role table, SRS-SEC-002, Database Specification §5,
CLAUDE.md §2/§3, DEC-011, DEC-023.

---

## DEC-027 — Phase 6 Registration Persistence, Auth UI Cleanup and Resource-Authorization Foundation

**Status:** APPROVED (by implementation)
**Date:** 2026-10-04
**Phase:** Phase 6 — Authentication & RBAC

**Context:**
Phase 6 requires authentication-related persistence using the existing
users collection. The existing Phase 2 signup flow collects a company
name for HR accounts (Database Spec documents the User → Recruiter
relationship and a recruiters collection), and the resource-ownership
test required by Phase 6 ("Interviewer cannot access unauthorized
interview") maps to the documented interview_sessions.recruiter_id /
candidate_id relationships. No interviewer-assignment relationship is
documented until Phase 8.

**Decision:**
- Registration persists to the users collection only (name, email,
  password_hash, role, status 'active', timestamps). Additionally, HR
  registration creates the linked recruiter profile (company preserved)
  and Interviewee registration the linked candidate profile, via the
  existing Phase 5 persistence functions — establishing the documented
  User → Recruiter/Candidate relationships. On unexpected profile
  failure the created user is removed (registration fails cleanly,
  no orphaned accounts). No second authentication collection.
- Registration validation: required fields, email format, duplicate
  email → 409, password ≥ 8 chars, only the three product roles.
  Duplicate-email rejection is intentional (task requirement) —
  registration is not enumeration-sensitive in the same way login is.
- Login uses identical safe messaging ("Invalid email or password") for
  unknown account and wrong password (no enumeration).
- Auth UI cleanups (existing product flow): sign-in role selector
  removed (backend role is the source of truth; UX-AUTH-002), OAuth
  provider buttons removed (UX-AUTH-001: only if implemented; OAuth out
  of scope), dead forgot-password link removed (password reset out of
  scope), sign-up demo buttons removed (duplicate registration would
  409), sign-in demo accounts retained and seeded with real hashed
  credentials via `scripts/seed-demo-users.js`, dead "Remember me"
  checkbox removed (token persistence is uniform).
- Resource-authorization foundation: `backend/src/auth/resourceAccess.js`
  (`authorizeInterviewAccess`) + `GET /api/rbac/interview/:id` — access
  to a specific interview uses ONLY the documented relationships
  (recruiter-owner via the user's recruiter profile, candidate-participant
  via the candidate profile). Interviewers are denied in this phase (no
  documented assignment relationship exists until Phase 8). The route
  is an explicit, isolated Phase 6 verification endpoint — not interview
  management (Phase 7).

**Alternatives:**
- Users-only persistence, drop the company field (rejected: silently
  discards user-provided data from the existing product flow).
- Allow interviewer access to specific interviews via an invented
  assignment field (rejected: interview assignment semantics are
  Phase 8).
- Keep OAuth/forgot-password mock UI (rejected: non-functional controls
  mislead users; UX-AUTH-001 constrains provider buttons).

**Rationale:**
- Reuses existing Phase 5 persistence exactly as documented; no new
  collections; no invented semantics; the ownership relationships the
  Phase 6 test requires are the documented ones.

**Impact:**
- Phase 7 builds interview management on `authorizeInterviewAccess()`;
  Phase 8 adds interviewer assignment and extends the access rules.
- Auth UI is now fully functional against the real backend.

**Verification:**
- Integration tests: linked profiles created; ownership matrix (owner
  200 / participant 200 / non-owner 403 / interviewer 403 / unknown 404
  / unauthenticated 401); registration validation and duplicate
  rejection; safe login messaging; live registration + /me verified.
- `scripts/seed-demo-users.js` run successfully (idempotent).
- Frontend build/lint pass; logout handlers deterministic.

**Related requirements:**
SRS-FR-001/002, SRS-SEC-001/002/003, Database Specification §5/§6/§7,
UI/UX Specification §7 (UX-AUTH-001/002), IMPLEMENTATION_PLAN.md Phase 6,
CLAUDE.md §5/§6/§8, DEC-011, DEC-012, DEC-015, DEC-023.

---

## DEC-028 — Phase 7 HR Product API Surface, Invitation Semantics and HR Screen Data Integrity

**Status:** APPROVED (by implementation)
**Date:** 2026-10-04
**Phase:** Phase 7 — HR Product

**Context:**
Phase 7 requires HR interview management (create/list/open/update, candidate
association, invitation) using the existing `interview_sessions` collection and
Phase 6 auth/RBAC. The SRS-FR-005 invitation requirement has no approved email
provider (Zero-Cost Infrastructure Plan defines an internal MVP boundary), the
UI/UX §8.1–8.2 dashboard/list concepts were previously rendered with Phase 2
mock data including fabricated integrity scores/alerts/match scores, and the
interview lifecycle remains the DEC-023 provisional set.

**Decision:**
- **API surface:** `POST/GET /api/interviews`, `GET/PATCH /api/interviews/:id`,
  `POST /api/interviews/:id/invite`, `GET /api/candidates` — all behind the
  existing `authenticate()` + `authorize('hr')` middleware; ownership on
  `:id` routes enforced with the Phase 6 `authorizeInterviewAccess()` resource
  authorization (recruiter profile ↔ `interview_sessions.recruiter_id`). No new
  collections, no schema changes, no new indexes, no new dependencies.
- **Creation fields:** exactly `title` (required), `candidateId` (required,
  validated to resolve to an existing candidate profile), `scheduledStartAt`
  (optional ISO date). Status defaults to `draft`. No invented company/job/
  scoring/monitoring-configuration fields (monitoring_configuration remains a
  documented-but-unexposed Phase 5 schema field).
- **Update surface:** `PATCH` allows only `title` and `scheduledStartAt`
  (including clearing the schedule with null). Candidate reassignment and
  direct status mutation are not permitted through the API in this phase —
  lifecycle changes happen only through documented workflow operations.
- **Invitation workflow:** internal state transition only —
  `draft → invited`, generating an opaque `invite_reference` (UUID) persisted
  on the interview session, exactly the Database Spec §8 field. No external
  email provider, no API keys, no delivery claims. Re-inviting an invited or
  non-draft interview is rejected (409). The candidate-facing consumption of
  the reference belongs to Phase 9.
- **Candidate association:** `GET /api/candidates` lists registered candidate
  profiles (safe user fields only). Candidates are not organization-scoped —
  no org fields are documented in the Database Specification (multi-tenancy
  is Phase 24).
- **HR screens:** Dashboard, Interviews list, Create Interview, Interview
  Details and Candidates pages are wired to the real APIs with loading/empty/
  error states. Fabricated Phase 2 mock metrics (integrity scores, alert
  counts, match scores, fake candidate pipelines) were removed from HR
  screens — Phase 7 forbids AI risk/fraud metrics, and mock data may not
  remain where a backend capability exists. Placeholder screens (Reports,
  Organization, Settings) remain clearly future states.

**Alternatives:**
- An `hr_interviews` collection (rejected: undocumented duplicate of
  interview_sessions).
- External email provider for invitations (rejected: no approved provider/API
  key; MVP boundary is the internal state workflow).
- PATCH accepting status/candidate changes (rejected: would silently resolve
  the DEC-023 TBD lifecycle semantics).
- Keeping the Phase 2 mock dashboard until later phases (rejected: the
  corresponding APIs now exist; fabricated metrics violate the Phase 7
  boundary and data-integrity rules).

**Rationale:**
- Smallest implementation satisfying SRS-FR-002/004/005, UI/UX §8, and the
  Database Spec §8 model while preserving DEC-023 TBD discipline and DEC-011
  backend authorization.

**Impact:**
- Phase 8 (interviewer assignment) and Phase 9 (candidate invitation
  consumption) build on these endpoints and the `invite_reference` field.
- `interviewStatus.ts` is the single frontend status-badge mapping for the
  provisional lifecycle set.

**Verification:**
- 145/145 backend tests (40 new Phase 7; full auth/role/ownership/validation/
  invitation matrix); frontend `tsc -b && vite build` + lint 0 errors; live
  role/ownership checks on the dev server.

**Related requirements:**
SRS-FR-002/004/005, Database Specification §8 (invite_reference, §8.1
lifecycle), UI/UX Specification §8.1–8.2 (UX-HR-001/002), Zero-Cost
Infrastructure Plan (internal MVP boundary), IMPLEMENTATION_PLAN.md Phase 7,
CLAUDE.md §2/§5/§6/§7, DEC-005, DEC-011, DEC-015, DEC-023, DEC-027.

---

## DEC-029 — Phase 8 Interviewer Assignment Schema, Interviewer Product Surface and Report Access Boundary

**Status:** APPROVED (schema decision approved by the user before implementation)
**Date:** 2026-10-04
**Phase:** Phase 8 — Interviewer Product

**Context:**
Phase 8 requires assigned-interview views and backend-enforced assigned-interview
authorization, but the approved Database Specification defines NO interviewer
field on interview_sessions (only recruiter_id/candidate_id connect
participants), the word "interviewer" does not appear in the Database
Specification, the SRS interviewer permissions are explicitly TBD, and no
interviewer profile collection is documented. Phase 6 resourceAccess.js had
already documented this gap. A schema change was therefore required and the
implementation stopped for approval per the phase-gate rules.

**Decision (approved):**
- **Assignment schema:** a single nullable scalar `interviewer_id` is added to
  `interview_sessions`, referencing `users._id` for a user with the
  `interviewer` backend role and `active` status. It mirrors the
  recruiter_id/candidate_id reference pattern. No new collection
  (interviewer_interviews / assigned_interviews rejected per phase boundary).
- **Assignment workflow:** the owning HR user assigns/reassigns via
  `POST /api/interviews/:id/assign` (HR product role + resource ownership) or
  optionally at creation (`interviewerId` on `POST /api/interviews`); the
  reference is validated (exists + interviewer role + active; invalid → 400).
  Assignment is allowed only while the interview is in a pre-room state
  (draft/scheduled/invited); ready/in_progress/completed reject with 409
  (no documented reassignment-after-start rule exists; DEC-023 lifecycle
  preserved untouched).
- **Interviewer API surface:** `GET /api/interviewer/interviews`,
  `GET /api/interviewer/interviews/:id`,
  `GET /api/interviewer/interviews/:id/report` (plus `GET /api/interviewers`
  for HR assignment support) — a separate role namespace that leaves the
  Phase 7 HR endpoints untouched.
- **Authorization:** `authorizeInterviewAccess` gains an interviewer branch —
  access is permitted only when interview_sessions.interviewer_id equals the
  authenticated interviewer's user id; unassigned interviews remain
  inaccessible to interviewers (Phase 6 behavior preserved).
- **Report access boundary:** permitted report access returns the existing
  final_reports document for an authorized assigned interview (Database Spec
  §13; IDX-RPT-001 unique index already existed); when no report exists the
  endpoint responds 404 with a truthful message. Report generation remains
  Phase 19. No fabricated report data is exposed.
- **Privacy:** the interviewer view exposes candidate identity (name) only —
  candidate email/contact data is intentionally withheld; no password/token
  material in any response.
- **Index:** one new sparse index `idx_int_005_interviewer_status_created`
  ({interviewer_id, status, created_at}) mirroring idx_int_001 for the
  recruiter listing workload — a current Phase 8 query, not speculative.

**Alternatives:**
- A separate interview_assignments collection (rejected: forbidden class of
  collection and more infrastructure than needed).
- Reusing `/api/interviews/:id` across roles (rejected: would complicate
  per-role response shaping and weaken the Phase 7 HR boundary).
- Inventing an interviewers profile collection (rejected: not documented).
- Fabricating report/live-monitoring data for the interviewer UI (rejected:
  violates the AI-integrity and data-integrity rules).

**Rationale:**
- Smallest change enabling UX-INT-001 assigned/upcoming/ongoing/completed
  views and backend-enforced assigned-interview authorization while
  preserving the Phase 7 HR boundary, the DEC-023 lifecycle TBD and the
  no-fabrication rules.

**Impact:**
- Phase 9 (candidate product) and Phase 10 (interview room) build on the
  interviewer_id relationship; the room workflow can gate on the assigned
  interviewer/participants.
- Phase 19 report generation will target final_reports keyed by interview_id
  (access path already implemented and tested).

**Verification:**
- 177/177 backend tests (32 new Phase 8: auth/role matrix, assignment
  workflow, view representation, isolation, empty state, report access with
  synthetic fixture, honest 404); frontend `tsc -b && vite build` + lint 0
  errors; live end-to-end assignment/visibility verification on the dev
  server.

**Related requirements:**
UX-INT-001 (§9.1), UX-INT-002 boundary note (§9.2), PRD-FR-002/004/010, SRS
role table (interviewer permissions TBD), Database Specification §8/§13
(final_reports), IMPLEMENTATION_PLAN.md Phase 8, CLAUDE.md §2/§5/§6/§7,
DEC-005, DEC-011, DEC-023, DEC-028.

---
