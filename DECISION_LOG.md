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
