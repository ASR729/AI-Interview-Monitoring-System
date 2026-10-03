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
