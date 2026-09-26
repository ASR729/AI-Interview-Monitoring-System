# CLAUDE.md

# AI Interview Monitoring and Detection System

## 1. Source of Truth

The approved documents in `./docs/` are the primary source of truth:

1.  PRD v1.0
2.  SRS v1.0
3.  System Architecture v1.0
4.  Database Specification v1.0
5.  AI/ML Specification v1.0
6.  UI/UX Specification v1.0
7.  Development Plan v1.0
8.  Zero-Cost Infrastructure Plan v1.0
9.  Testing & Evaluation Plan v1.0
10. Startup/Product Roadmap v1.0

Use the actual filenames present in `./docs/`. Do not move, delete, or
silently rewrite these documents.

If requirements conflict, identify the conflict, determine which
document governs that decision, and record the resolution in
`DECISION_LOG.md`. Never silently invent a requirement.

## 2. Product Boundary

The MVP is:

authentication + RBAC + interview management + invitation + candidate
system check + interview room + WebRTC/media + webcam monitoring + CV +
face detection + multiple-face detection + selected observable signals +
structured events + MongoDB persistence + real-time alerts +
evidence/context + live monitoring + basic integrity view + interview
report + end-to-end testing + controlled evaluation.

Advanced audio, speech-to-text, NLP, multimodal fusion, ATS
integrations, billing, enterprise multi-tenancy and large-scale
production infrastructure are later stages unless explicitly approved
for the current phase.

## 3. AI Integrity Rules

The product provides **evidence, confidence, context and integrity-risk
indicators for human review**. It is not a definitive automated
cheating/deception judge.

Use:
`Observable Signal -> Analysis -> Confidence -> Event -> Evidence/Context -> Integrity Indicator -> Human Review`

Do not claim that a candidate is guilty, that cheating/deception is
definitively detected, or that intent is known.

Do not implement unsupported lie detection, psychological inference,
emotion-based guilt inference, or intent detection.

Keep observable behaviour, model/rule confidence, product severity and
aggregate indicators separate.

## 4. Architecture

Use the approved modular architecture:

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- AI service: Python + FastAPI
- Database: MongoDB
- Media: WebRTC where required
- Real-time application events: Socket.io / HTTPS
- Open-source/local AI/CV for the MVP where appropriate

Keep frontend, backend and AI service separated. Prefer a modular
application over premature microservices. Do not introduce Kubernetes,
distributed infrastructure, unnecessary queues, or enterprise
architecture during the MVP unless the current requirement explicitly
needs them.

## 5. Database Principles

The interview session is the central business context.

Use the documented concepts: users, recruiter/HR, candidate/interviewee,
interview sessions, monitoring events, AI analysis results, alerts,
evidence and final reports.

Monitoring events should preserve applicable timestamp, event type,
severity, confidence, evidence reference, model/rule version and review
state.

Do not permanently store every raw frame by default. Do not put large
raw media blobs inside ordinary event documents unless an approved
decision requires it.

## 6. Minimal-Code Rule

Implement the simplest production-quality solution that satisfies the
current approved requirement.

Do not add: - speculative abstractions - unused design patterns - unused
utilities - premature optimization - duplicate validation - future-phase
functionality - unnecessary dependencies - excessive comments -
boilerplate with no functional value

Prefer small modules, clear functions, explicit contracts, reuse where
actual reuse exists, configuration over hard-coding, and simple
solutions over complex abstractions.

Do not write code merely because it might be useful later.

## 7. Anti-Hallucination Rule

Never assume a requirement unless it is supported by: 1. approved
documentation, 2. verified existing implementation, 3. explicit user
instruction, 4. or a necessary technical dependency.

If information is missing, inspect the repository and relevant
documentation. If it cannot be safely inferred, ask.

Never invent credentials, API keys, provider behaviour, cloud
configuration, performance metrics, AI accuracy, precision/recall/F1,
user feedback, pilot results, production capacity, or business results.

Never mark something complete unless it was actually implemented and
verified.

## 8. Security/Privacy

- Never hard-code secrets.
- Use environment variables.
- Never commit real secrets.
- Hash passwords, never plaintext.
- Enforce authorization on the backend.
- Protect evidence references.
- Minimize personal data.
- Use secure transport where applicable.
- Respect monitoring disclosure, retention and deletion requirements.
- Do not expose sensitive data merely because it is technically
  available.

## 9. Testing

Test incrementally. For meaningful changes: 1. run relevant unit tests,
2. run integration tests where applicable, 3. exercise the affected
workflow, 4. fix failures, 5. verify acceptance criteria.

For AI evaluation use controlled, consent-based scenarios and actual
ground truth. Measure precision, recall, F1, false positives, false
negatives and alert latency where applicable. Never invent results.

## 10. Phase Gates

The project is implemented through 24 dependency-driven phases.

For every phase: 1. Read `IMPLEMENTATION_PLAN.md`. 2. Read only the
documentation relevant to that phase. 3. Inspect existing code first. 4.
Implement the minimum required functionality. 5. Test and fix failures.
6. Verify acceptance criteria. 7. Update `PROJECT_STATUS.md`. 8. Record
material decisions in `DECISION_LOG.md`. 9. Record limitations/blockers.
10. Create a stable Git milestone when Git is configured. 11. Stop at
the phase gate.

Do not silently continue into later phases. Critical unresolved failures
block progression.

## 11. Human/External Dependencies

Do not fabricate: - GitHub authentication - MongoDB/cloud credentials -
participant consent - ground-truth labels - real user/pilot feedback -
legal/privacy approval - production credentials - payment/ATS
credentials - measured production performance

When required, clearly report the exact human action.

## 12. Repository Discipline

Expected structure:

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

Do not create duplicate project roots.

## 13. Documentation Control

Maintain: - `IMPLEMENTATION_PLAN.md` - `PROJECT_STATUS.md` -
`DECISION_LOG.md`

Documentation must describe actual implementation state, not intended
future state.

## 14. Definition of Done

A phase is complete only when required implementation exists, relevant
verification has passed, critical failures are resolved or explicitly
blocked, acceptance criteria are satisfied or documented, project status
is updated, and material decisions are recorded.
