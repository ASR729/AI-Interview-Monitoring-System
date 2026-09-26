# IMPLEMENTATION_PLAN.md

# AI Interview Monitoring and Detection System — 24-Phase Implementation Plan

## Purpose

Convert the approved documentation into a dependency-driven
implementation sequence.

Core sequence:

**Foundation → Auth/RBAC → Interview Workflow → Media → CV → Events →
Alerts → Evidence → Reports → Evaluation → Validation → V2 → SaaS →
Enterprise**

## Documentation Baseline

Use the ten approved documents in `./docs/`: PRD, SRS, System
Architecture, Database Specification, AI/ML Specification, UI/UX
Specification, Development Plan, Zero-Cost Infrastructure Plan, Testing
& Evaluation Plan, Startup/Product Roadmap.

The documents define product scope, software behaviour, architecture,
data, AI boundaries, UX, infrastructure, testing and roadmap direction.
Exact technical values marked TBD in those documents must remain TBD
until decided or measured.

------------------------------------------------------------------------

## Phase 1 — Requirements Freeze & Repository

**Work:** inspect repository; freeze requirements; configure Git/GitHub;
establish README, `.gitignore`, project-control files and traceability.
**Relevant:** PRD, SRS, Development Plan, Roadmap. **Gate:**
repository/documentation baseline is stable and ambiguities are
recorded. **Depends on:** documentation complete.

## Phase 2 — Frontend Foundation

**Work:** React + Vite + Tailwind; routing/layout; API client/config;
reusable UI conventions; loading/error/empty states. **Relevant:**
UI/UX, SRS, Architecture, Development Plan. **Gate:** frontend runs
locally with the application shell. **Depends on:** Phase 1.

## Phase 3 — Node/Express Backend Foundation

**Work:** Express structure; configuration; API routing; middleware;
validation; error handling; logging; health endpoint. **Gate:** backend
runs locally and health check passes. **Depends on:** Phase 1.

## Phase 4 — Python/FastAPI AI Service

**Work:** FastAPI service; configuration; health endpoint; modular
inference structure; MVP CV dependencies. **Gate:** AI service runs
locally and health check passes. **Depends on:** Phase 1.

## Phase 5 — MongoDB

**Work:** local/approved development MongoDB; core collections and
relationships; connection handling; required baseline indexes;
persistence conventions. **Core concepts:** users, recruiter/HR,
candidate/interviewee, interview sessions, monitoring events, AI
analysis results, alerts, evidence, final reports. **Gate:** verified
backend connection and persistence test. **Depends on:** Phase 3.

## Phase 6 — Authentication & RBAC

**Work:** authentication; password hashing if applicable; protected
routes; backend authorization; HR, Interviewer and Interviewee role
access. **Gate:** authorized access works and unauthorized role access
is blocked. **Depends on:** Phases 2, 3, 5.

## Phase 7 — HR Product

**Work:** HR dashboard; interview creation; interview management;
invitation workflow. **Gate:** authorized HR user can create/manage an
interview and initiate the documented invitation flow. **Depends on:**
Phase 6.

## Phase 8 — Interviewer Product

**Work:** interviewer dashboard; assigned/upcoming/completed interview
views; permitted report access. **Gate:** interviewer can access
assigned workflows. **Depends on:** Phases 6–7.

## Phase 9 — Candidate/Interviewee Product

**Work:** candidate dashboard; assigned interview; preparation;
system-check entry. **Gate:** candidate can access the correct
interview/preparation flow. **Depends on:** Phases 6–7.

## Phase 10 — Interview Room

**Work:** controlled interview room; session state; participant/session
context; connection/readiness/session lifecycle states. **Gate:** valid
interview enters and maintains the room workflow. **Depends on:** Phases
7–9.

## Phase 11 — WebRTC & Socket.io

**Work:** WebRTC media workflow; Socket.io application events;
connection/reconnect/error handling; interview-session event context.
**Gate:** local interview room establishes required real-time
communication. **Depends on:** Phase 10.

## Phase 12 — Webcam Capture

**Work:** camera permission; webcam stream; controlled frame
sampling/processing path; unavailable/denied states; avoid unnecessary
raw-frame persistence. **Gate:** consented session provides webcam input
to monitoring. **Depends on:** Phases 10–11.

## Phase 13 — Computer Vision

**Work:** CV engine; face detection; multiple-face detection; confidence
handling where applicable; versioned CV output. **Gate:** controlled
test inputs produce supported face observations for event processing.
**Depends on:** Phases 4 and 12.

## Phase 14 — Selected Observable Behaviour Signals

**Work:** implement only signals supported by approved AI/ML/product
documentation and validated technically. Possible documented areas
include face presence, multiple faces, head/gaze direction and selected
movement/activity signals. **Do not:** infer intent, deception, guilt,
psychology or unsupported emotion conclusions. **Gate:** each enabled
signal has defined semantics, confidence handling, limitations and test
scenarios. **Depends on:** Phase 13.

## Phase 15 — Event Engine & Persistence

**Work:** normalize monitoring output; timestamp/event
type/severity/confidence; evidence references; model/rule version;
MongoDB persistence; relationship validation. **Gate:** detection →
normalized event → MongoDB works. **Depends on:** Phases 5, 13, 14.

## Phase 16 — Real-Time Alerts

**Work:** configured alert conditions; interviewer/recruiter alerts;
Socket.io delivery; event linkage; duplicate/reconnect/error handling.
**Gate:** qualifying event creates a real-time linked alert. **Depends
on:** Phases 11 and 15.

## Phase 17 — Evidence System

**Work:** evidence/context references; authorized retrieval; event
linkage; review context; avoid unnecessary raw-media storage. **Gate:**
authorized reviewer can retrieve event evidence/context. **Depends on:**
Phase 15.

## Phase 18 — Live Monitoring & Basic Integrity View

**Work:** live interviewer dashboard; candidate video/session state;
chronological events; severity/confidence; alerts; evidence actions;
interpretable integrity indicators. **UX rule:**
event/context/confidence/evidence must remain more informative than an
unexplained aggregate score. **Gate:** interviewer can monitor and
inspect live events/evidence. **Depends on:** Phases 11, 15–17.

## Phase 19 — Interview Report

**Work:** post-interview summary; events; timestamps; evidence
references; integrity indicators; review status where implemented.
**Gate:** authorized reviewer can retrieve a coherent report. **Depends
on:** Phases 15–18.

## Phase 20 — End-to-End MVP Test

**Vertical slice:** HR → create interview → invitation → candidate →
system check → interview room → webcam → CV → event → MongoDB → alert →
evidence → monitoring → report. **Gate:** complete MVP workflow works
locally; critical defects resolved or explicitly documented. **Depends
on:** Phases 1–19.

## Phase 21 — Controlled AI Evaluation

**Work:** controlled scenarios; ground truth; precision; recall; F1;
false positives/negatives; alert latency; model/rule/dataset versioning;
regression tests; MVP fixes. **Rule:** never invent metrics. **Gate:**
actual evaluation evidence exists for supported MVP signals. **Depends
on:** Phase 20.

## Phase 22 — Internal Validation / Pilot / Feedback

**Work:** internal validation; consent-based pilot; structured feedback;
usability/friction/usefulness/limitations; prioritized changes.
**Gate:** evidence exists about what works, fails and should be
improved. **Depends on:** Phase 21.

## Phase 23 — V2 Multimodal Integrity Intelligence

**Work:** audio; speech-to-text; NLP; multimodal fusion; advanced
reports. **Rule:** introduce only after requirements, data, privacy,
evaluation methodology and feasibility are established. **Gate:**
validated V2 capability adds measurable value without undermining
trust/privacy/reliability. **Depends on:** Phase 22.

## Phase 24 — SaaS Productization & Enterprise Scale

**Work:** SaaS productization; organization management; billing;
integrations; enterprise scalability; governance/security/operational
maturity. **Rule:** do not implement production-scale infrastructure
before actual requirements justify it. **Gate:** validated product
supports required operational, organization, integration and justified
scale needs. **Depends on:** Phase 23 and validation evidence.

------------------------------------------------------------------------

## Critical Dependency Path

``` text
Foundation
→ Authentication/RBAC
→ Interview Management
→ System Check
→ Interview Room
→ WebRTC/Media
→ CV Monitoring
→ Event Engine
→ Persistence
→ Alerts
→ Evidence/Reports
→ End-to-End MVP
→ Controlled Evaluation
→ Validation/Pilot
→ V2 Multimodal Intelligence
→ SaaS Productization
→ Enterprise Scale
```

## Human / External Dependencies

Claude Code may implement required software, but must not fabricate: -
GitHub authentication - MongoDB/cloud credentials - participant
consent - ground-truth labels - real pilot feedback - privacy/legal
approvals - production credentials - payment/ATS credentials - measured
production performance

## Phase Gate Report

Every completed phase must report: 1. phase/status 2. requirements
implemented 3. files created/modified 4. tests/verification 5.
acceptance criteria 6. limitations 7. human actions 8. Git
commit/milestone 9. next phase

The next implementation activity is **Phase 1**.
