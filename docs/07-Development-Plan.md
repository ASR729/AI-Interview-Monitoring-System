**DEVELOPMENT PLAN**

AI Interview Monitoring and Detection System

**Document 7 — Development Plan**

Version 1.0 | Derived from PRD v1.0 + UI/UX Specification v1.0

**Development objective  
**Convert the approved product requirements and UI/UX baseline into an ordered, testable implementation plan for a six-member team, while keeping the initial product modular, feasible and ready for later scale.

**Document Field**

**Value**

Product

AI Interview Monitoring and Detection System

Document

Document 7 — Development Plan

Upstream baselines

PRD v1.0; UI/UX Specification v1.0

Development model

Incremental, milestone-based implementation

Primary platform

Responsive web application

Frontend direction

React + Vite + Tailwind CSS

Application backend

Node.js + Express.js

AI service

Python + FastAPI

Database

MongoDB

Real-time direction

WebRTC + Socket.io

Team size

6 members

Schedule basis

Relative implementation weeks; exact calendar dates TBD

# 1\. Purpose and Development Principles

This document converts the product and interface definitions into an implementation sequence. It identifies modules, work packages, dependencies, team ownership, milestones, deliverables, quality gates and handoffs.

**Source-of-truth rule  
**Development work must trace to an approved requirement or documented technical decision. The team should not add major features because they appear attractive or technically interesting unless they are explicitly approved and recorded.

-   Build the smallest complete interview workflow before adding advanced AI analysis.
-   Implement interfaces and backend contracts incrementally so frontend and backend can work in parallel.
-   Keep AI/monitoring modules replaceable and testable.
-   Prefer a modular application over premature microservices.
-   Treat AI findings as evidence/risk signals, not definitive proof of cheating.
-   Measure model and system performance instead of inventing results.
-   Complete a working vertical slice before optimizing individual components.

# 2\. Upstream Document Traceability

**Upstream Document**

**Development Use**

PRD v1.0

Defines product scope, MVP, requirements, roles, risks, technology direction and success criteria.

UI/UX Specification v1.0

Defines screen IDs, user journeys, frontend modules, component system and UI/backend capability mapping.

SRS — next technical baseline

Will define precise software behaviour, interfaces, acceptance criteria and technical constraints.

Architecture Specification — subsequent

Will define component boundaries and detailed service/data flow.

Database Specification — subsequent

Will define collections, fields, indexes and persistence contracts.

AI/ML Specification — subsequent

Will define model selection, datasets, inference and evaluation.

**Dependency note  
**This Development Plan uses the already-approved PRD and UI/UX baselines. Exact API routes, database schemas and model names are intentionally not invented here; they must follow the later dedicated specifications.

# 3\. Development Scope

## 3.1 Initial Implementation Scope

**Module**

**Scope**

**Priority**

M01

Project foundation and development environment

P0

M02

Authentication and role-aware access

P0

M03

Public website

P1

M04

Interview management

P0

M05

Interviewee system check

P0

M06

Interview room / WebRTC workflow

P0

M07

Video monitoring and CV event detection

P0

M08

Real-time event and alert pipeline

P0

M09

Evidence/event persistence

P0

M10

Integrity view and basic report

P1

M11

Cross-module testing and evaluation

P0

M12

Packaging, demo deployment and documentation

P1

## 3.2 Deferred Development Scope

-   Advanced audio/voice analysis.
-   Advanced NLP-based AI-assistance analysis.
-   Deepfake detection.
-   Advanced identity verification.
-   ATS integrations.
-   Enterprise multi-tenant infrastructure.
-   Subscription/payment system.
-   Mobile application.
-   Full ATS, HRMS or coding-assessment platform.

# 4\. Development Architecture Baseline

The implementation follows the technology direction already recorded in the PRD.

**Layer**

**Baseline**

**Development Implication**

Frontend

React + Vite + Tailwind CSS

Build reusable role-specific modules and shared components.

Application Backend

Node.js + Express.js

Implement authentication, interview/session APIs and application orchestration.

AI Service

Python + FastAPI

Expose modular monitoring/analysis capabilities to the application.

Database

MongoDB

Persist users, interviews, events, alerts, evidence references and reports as defined later.

CV

OpenCV + MediaPipe

Implement selected observable video signals.

NLP

Transformers/BERT-family tooling where justified

Future/proposed; do not block MVP unless explicitly approved.

Audio

Local speech-to-text + Librosa where useful

Future/proposed; exact model TBD.

Real-time

WebRTC + Socket.io

Support interview media and live event/alert communication.

Containerization

Docker

Provide reproducible development/runtime environment.

# 5\. Module Breakdown

**ID**

**Module**

**Responsibility**

**Depends On**

M01

Foundation

Repository, environment, shared configuration, coding conventions, base frontend/backend/AI services.

All modules

M02

Authentication & Authorization

Sign-in, session handling, role-aware routing and backend authorization.

M03–M12

M03

Public Website

Landing, Product, Features, How It Works and navigation CTAs.

M02

M04

Interview Management

Create, retrieve, update and manage interview sessions/invitations.

M02, M05, M06

M05

Interviewee System Check

Camera, microphone, connectivity and relevant browser capability checks.

M02, M06

M06

Interview Room

Interview session UI, media controls, session lifecycle and connection states.

M04, M05, real-time layer

M07

Video Monitoring / CV

Webcam signal capture/processing and selected suspicious-event detectors.

M06, AI service

M08

Real-Time Events & Alerts

Event transport, alert generation/presentation and event lifecycle.

M07, database

M09

Evidence & Persistence

Store/retrieve event metadata and evidence references.

M04, M07, M08, database

M10

Integrity View & Reports

Risk/evidence presentation and post-interview report.

M08, M09

M11

Testing & Evaluation

Unit, integration, E2E, UI, CV and performance validation.

All modules

M12

Release & Documentation

Build, configuration, deployment packaging, demo preparation and technical documentation.

M11

# 6\. Detailed Work Packages and Tasks

**Task**

**Module**

**Work Package**

**Description**

**Priority**

**Owner**

**Dependency**

DEV-001

M01

Create repository structure

Create frontend, backend, AI-service and documentation areas.

P0

Team Lead + Backend

None

DEV-002

M01

Local environment

Define environment variables, local database/service startup and developer setup instructions.

P0

Backend + DevOps/QA

DEV-001

DEV-003

M01

Shared UI foundation

Set up Tailwind, routing, layout, typography and reusable base components.

P0

Frontend

DEV-001

DEV-004

M01

Code quality baseline

Linting, formatting, error handling conventions and basic Git workflow.

P1

Team Lead

DEV-001

DEV-005

M02

Authentication UI

Implement Sign In and authentication states.

P0

Frontend

DEV-003

DEV-006

M02

Authentication backend

Implement credential/session handling according to SRS security requirements.

P0

Backend

DEV-002

DEV-007

M02

Role-aware routing

Route HR, Interviewer and Interviewee to permitted experiences.

P0

Frontend + Backend

DEV-005, DEV-006

DEV-008

M03

Public website

Build landing, product, features and how-it-works sections.

P1

Frontend

DEV-003

DEV-009

M04

Interview API

Implement interview session creation/retrieval/update lifecycle.

P0

Backend

DEV-006

DEV-010

M04

HR interview screens

Create Interview and Interview Management interfaces.

P0

Frontend

DEV-007, DEV-009

DEV-011

M04

Interviewer dashboard

Assigned/upcoming/ongoing/completed interview views.

P1

Frontend

DEV-007, DEV-009

DEV-012

M05

System-check UI

Camera/microphone/network/browser readiness interface and states.

P0

Frontend

DEV-007

DEV-013

M05

System-check logic

Implement supported client-side readiness checks.

P0

Frontend + Backend

DEV-012

DEV-014

M06

Interview room UI

Video layout, controls, connection state, monitoring notice and error states.

P0

Frontend

DEV-012

DEV-015

M06

Media session

Implement WebRTC/signalling integration according to architecture specification.

P0

Backend + Frontend

DEV-014

DEV-016

M07

CV service foundation

Create FastAPI AI-service structure and monitoring interfaces.

P0

AI/CV

DEV-002

DEV-017

M07

Video signal capture

Connect supported video frames/signals to CV processing pipeline.

P0

AI/CV + Frontend

DEV-015, DEV-016

DEV-018

M07

Initial CV detectors

Implement only validated MVP observable events selected in SRS/AI specification.

P0

AI/CV

DEV-017

DEV-019

M08

Event schema/contract

Define event payload contract based on SRS/database specification.

P0

Backend + AI

DEV-018

DEV-020

M08

Real-time event transport

Stream supported events to authorized monitoring clients.

P0

Backend

DEV-019

DEV-021

M08

Alert UI

Implement live alert cards/toasts, event timeline and severity/confidence display.

P0

Frontend

DEV-020

DEV-022

M09

Event persistence

Persist timestamped events and evidence references.

P0

Backend + Database

DEV-019

DEV-023

M09

Evidence review UI

Open event details and available evidence/context.

P1

Frontend

DEV-022

DEV-024

M10

Integrity view

Display risk indicators only if approved and supported by AI specification.

P1

Frontend + AI

DEV-022

DEV-025

M10

Report generation

Build post-interview event summary/report interface.

P1

Backend + Frontend

DEV-022, DEV-024

DEV-026

M11

Unit tests

Test frontend components, backend services and AI modules.

P0

All members

Relevant module complete

DEV-027

M11

Integration tests

Validate browser → backend → AI → event → alert → persistence flow.

P0

QA + Backend + AI

M02–M10

DEV-028

M11

E2E interview test

Run complete recruiter/interviewer/interviewee workflow.

P0

QA + Frontend

M02–M10

DEV-029

M11

CV evaluation

Evaluate selected scenarios using defined dataset/test protocol.

P0

AI/CV

M07

DEV-030

M11

Performance test

Measure real-time latency/resource use and document results.

P0

Backend + AI + QA

M08–M10

DEV-031

M12

Release build

Build reproducible release candidate and configuration documentation.

P1

Team Lead + DevOps/QA

M11

DEV-032

M12

Demo preparation

Prepare controlled demonstration dataset/scenarios and final walkthrough.

P1

All members

DEV-031

# 7\. Team Allocation

The following allocation converts the previously discussed six-member team structure into development ownership. It is a proposed working allocation and can be adjusted by the team without changing product scope.

**Member**

**Primary Responsibility**

**Secondary Responsibility**

**Key Modules**

Asifur Rahman — 1AT24CD017

Product / Technical Lead

Integration, architecture coordination, release

M01, M02, M04, M11, M12

Aakash Raj — 1AT24CS001

Frontend Engineer

UI component system and responsive design

M03, M05, M06, M10

Aarav Singh — 1AT24CS002

Backend Engineer

API, session and persistence integration

M02, M04, M08, M09

Ayush — 1AT24CS032

Computer Vision Engineer

CV evaluation and optimization

M07

Ashwani Kumar Mishra — 1AT24CD030

NLP / Audio Engineer

Future audio/NLP groundwork; integration support

M07 support; future M13

Mohit Kumar — 1AT24CD122

QA / AI-Fusion Engineer

Testing, evaluation, event/risk integration

M08, M10, M11

**Scope note  
**Advanced NLP/audio work is intentionally not allowed to block the MVP. The assigned NLP/audio member can support integration, dataset/evaluation preparation and future capability design while the core webcam/event pipeline is completed.

# 8\. Responsibility Matrix

**Work Area**

**Lead**

**Contributors**

**Approval / Review**

Product scope

Asifur

All

Team + Faculty Guide as required

Frontend/UI

Aakash

Asifur, Mohit

Frontend review

Backend/API

Aarav

Asifur, Mohit

Backend review

Computer Vision

Ayush

Mohit, Asifur

AI/ML review

Audio/NLP future work

Ashwani

Ayush, Mohit

AI/ML review

Real-time pipeline

Aarav

Aakash, Ayush, Mohit

Integration review

Testing/evaluation

Mohit

All

Team review

Release/demo

Asifur

All

Team + Faculty Guide

# 9\. Dependency Graph and Implementation Order

The recommended order is dependency-driven rather than feature-count-driven.

**Stage**

**Must Be Working Before**

**Reason**

1\. Foundation

Any feature work

Shared repository, environment and conventions.

2\. Auth + roles

Role-specific dashboards

Authorization is a prerequisite for protected workflows.

3\. Interview management

Interview room

A live room needs a valid interview/session context.

4\. System check

Interview room entry

Candidate readiness must be established before joining.

5\. Interview room/media

CV monitoring

Monitoring needs a live media/session source.

6\. CV/event detection

Live alerts

Alerts need actual event producers.

7\. Event transport

Evidence/reporting

Reports need structured events.

8\. Persistence/evidence

Integrity/report UI

The UI needs durable event/evidence data.

9\. Testing

Release

Release is blocked until critical workflows are validated.

**Critical path  
**Foundation → Authentication → Interview Management → System Check → Interview Room/WebRTC → CV Monitoring → Event Stream → Persistence → Alerts/Reports → End-to-End Validation → Release

# 10\. Milestone and Sprint Plan

The schedule uses relative weeks so it remains valid regardless of the team's actual start date. Exact dates should be added only after the team confirms the academic calendar and available hours.

**Sprint / Week**

**Focus**

**Major Deliverables**

**Exit Gate**

Week 1

Foundation

Repo, environment, frontend shell, backend shell, AI-service shell, coding conventions

All members can run the project locally

Week 2

Auth + public site

Sign-in, role routing, base dashboards, landing website

Protected role routing works

Week 3

Interview management

Create/manage interview, interviewer dashboard, interview session lifecycle

Interview can be created and retrieved

Week 4

Candidate readiness

System check + interview room UI + media foundation

Candidate reaches a valid interview room

Week 5

Real-time interview

WebRTC/session integration + live monitoring shell

Controlled two-party/live session works

Week 6

Computer vision

CV service + selected MVP event detectors

Controlled test events can be generated

Week 7

Events + alerts

Socket/event stream, alert UI, event timeline, persistence

Detected event reaches authorized monitoring UI and is stored

Week 8

Integrity/report

Evidence review, basic integrity view, report

End-to-end interview record can be reviewed

Week 9

Testing/evaluation

Unit/integration/E2E/CV/performance testing

Critical defects addressed; measurements captured

Week 10

Release/demo

Release candidate, documentation, demo scenario, final QA

Release/demo acceptance checklist passes

# 11\. Milestone Acceptance Gates

**Gate**

**Minimum Condition**

G1 — Foundation Complete

Repository, local setup and base services run consistently for all developers.

G2 — Auth Complete

Role-aware protected routes and backend authorization work for required roles.

G3 — Interview Workflow Complete

HR can create an interview and Interviewer/Interviewee can access the correct workflow.

G4 — Live Session Complete

Interviewee can pass system check and enter the interview room; media/session behaviour is testable.

G5 — Monitoring Complete

Selected CV events can be produced under controlled scenarios.

G6 — Alerting Complete

A supported event can be transported, displayed and associated with the interview.

G7 — Evidence Complete

Event metadata and evidence references can be persisted and reviewed.

G8 — Report Complete

Post-interview report presents supported events and indicators without unsupported claims.

G9 — Validation Complete

Critical workflow, AI/CV and performance tests have documented results.

G10 — Release Complete

Known critical defects are resolved or explicitly accepted; demo and setup documentation are ready.

# 12\. Git and Repository Workflow

A simple branch strategy is recommended for a six-member student team.

**Branch / Convention**

**Purpose**

main

Stable, review-approved code only.

develop

Integration branch if the team needs a shared pre-release branch.

feature/<module>-<short-name>

Individual feature work.

fix/<issue>-<short-name>

Bug fixes.

release/vX.Y

Release candidate preparation if needed.

-   Each feature should reference a development task ID.
-   Keep commits small enough to review.
-   Do not commit secrets or API keys.
-   Open a pull request before merging substantial changes.
-   At least one teammate should review code touching authentication, real-time communication, data persistence or AI scoring.
-   Keep generated datasets/media out of Git when they are too large or sensitive; use an approved data-storage approach instead.

# 13\. Proposed Repository Structure

This structure is a planning baseline, not a claim that the repository already exists.

ai-interview-monitoring/  
├── frontend/  
│ ├── src/  
│ │ ├── components/  
│ │ ├── pages/  
│ │ ├── modules/  
│ │ │ ├── hr/  
│ │ │ ├── interviewer/  
│ │ │ └── interviewee/  
│ │ ├── services/  
│ │ ├── hooks/  
│ │ └── styles/  
│ └── tests/  
├── backend/  
│ ├── src/  
│ │ ├── routes/  
│ │ ├── controllers/  
│ │ ├── services/  
│ │ ├── middleware/  
│ │ ├── models/  
│ │ └── utils/  
│ └── tests/  
├── ai-service/  
│ ├── app/  
│ │ ├── api/  
│ │ ├── monitoring/  
│ │ ├── cv/  
│ │ ├── audio/  
│ │ ├── nlp/  
│ │ └── fusion/  
│ └── tests/  
├── docs/  
├── scripts/  
├── docker/  
└── README.md

# 14\. Module Contracts

**Contract**

**Producer**

**Consumer**

**Rule**

Authentication/session

Backend

Frontend

Frontend receives only the information required for routing/session state.

Interview/session

Backend

HR/Interviewer/Interviewee UI

All actions must be authorization-checked.

Media session

WebRTC/signalling layer

Interview Room / Live Monitoring

Media state must be observable and recoverable.

Monitoring event

AI/CV service

Event pipeline

Event includes interview context, timestamp and applicable confidence/model metadata.

Alert

Event pipeline

Interviewer/HR UI

Alert is a presentation of a relevant event, not a definitive accusation.

Evidence reference

Monitoring/persistence

Alert/Report UI

Reference must resolve only for authorized users.

Report

Report service

HR/Interviewer

Report summarizes supported evidence and risk indicators.

# 15\. Testing Strategy

**Level**

**What to Test**

**Owner(s)**

**Output**

Unit

Frontend components, backend services, AI utilities

Module owners

Automated unit tests

Integration

API ↔ DB, backend ↔ AI service, event pipeline

Backend + AI + QA

Integration test results

UI

Navigation, forms, states, responsive behaviour

Frontend + QA

UI test checklist

E2E

HR → interview → interviewee system check → room → monitoring → report

QA + All

End-to-end test report

CV/AI

Controlled normal/suspicious scenarios

Ayush + Mohit

Metrics and error analysis

Performance

Event latency, resource use, concurrency baseline

Aarav + Mohit

Benchmark report

Security

Auth, authorization, secret handling, evidence access

Aarav + Asifur

Security checklist

**Measurement rule  
**No model accuracy, F1, false-positive rate, latency or concurrency figure should be placed in project documentation as an achieved result until the team has actually measured it.

# 16\. Definition of Done

1.  The task implements the approved requirement or documented technical decision.
2.  The intended user flow works in the supported environment.
3.  Loading, empty, error and permission states are handled where relevant.
4.  Authorization is enforced server-side for protected data/actions.
5.  Sensitive credentials/secrets are not committed.
6.  Relevant unit/integration tests are present.
7.  The feature is manually tested in the intended workflow.
8.  UI is consistent with the UI/UX specification.
9.  Requirement and task IDs are referenced in the implementation/PR where practical.
10.  Known limitations are documented.
11.  The change does not silently contradict an upstream document.

# 17\. Issue Priority and Severity

**Level**

**Meaning**

**Release Treatment**

P0

Required for core product workflow or safety/security.

Must be completed or explicitly approved before release.

P1

Important product capability but not necessary for the core vertical slice.

May be deferred if it threatens the critical path.

P2

Enhancement or future capability.

Do not block MVP.

Blocker

Prevents a core workflow from operating or creates a serious security/data issue.

Immediate attention.

Critical defect

Severe failure in authentication, session integrity, monitoring, data access or core workflow.

Release blocker unless explicitly accepted.

# 18\. Development Risks and Responses

**Risk**

**Development Response**

CV detector performs poorly

Start with a small set of observable events; create controlled test scenarios; measure precision/recall and error cases.

WebRTC integration consumes time

Build and test a minimal media/session slice before advanced monitoring.

Real-time pipeline is slow

Use event-driven processing, sampling and measured benchmarks.

Frontend/backend contract mismatch

Agree on interface contracts before implementation and test integration early.

AI work blocks core product

Keep AI service modular and use a limited MVP detector set.

Team members work in isolation

Integrate at least once per sprint and maintain shared task IDs.

Scope creep

Require new feature approval and classify it as MVP, P1 or future.

Free infrastructure limitations

Prototype locally and record actual resource needs before production claims.

False-positive concerns

Evidence-first UX, confidence separation, human review and documented limitations.

Sensitive data handling

Use controlled/consented test data and minimize unnecessary retention.

# 19\. Development Environments

**Environment**

**Purpose**

**Data**

Local Development

Individual feature development.

Synthetic/controlled development data.

Integration / Test

Combined frontend/backend/AI testing.

Controlled test scenarios only.

Demo / Staging

Stable demonstration before presentation/pilot.

Approved synthetic or consented demo data.

Production

Future SaaS deployment.

Requires finalized security, privacy, retention and infrastructure specifications.

Production deployment is intentionally not treated as part of the MVP until the infrastructure and security documents define the required controls.

# 20\. Development Data Strategy

-   Use controlled, consent-based scenarios for AI/CV testing.
-   Include normal interview scenarios and deliberately constructed suspicious-event scenarios.
-   Keep labels and scenario definitions separate from model code.
-   Record the dataset/test-set version used for each evaluation.
-   Do not claim general-world performance from a small controlled dataset.
-   Do not use sensitive personal data unnecessarily.
-   The final dataset schema and evaluation protocol will be defined in the AI/ML and Testing documents.

# 21\. Development Deliverables

**Deliverable ID**

**Deliverable**

**Source / Trace**

DEL-001

Working repository and developer setup

PRD technology direction + DEV-001/002

DEL-002

Public website

UX-PUB-\*

DEL-003

Authentication and role-aware application

PRD-FR-001 + UX-AUTH-\*

DEL-004

HR interview management

PRD-FR-002 + UX-HR-\*

DEL-005

Interviewer dashboard and live monitoring

PRD-FR-004 to FR-009 + UX-INT-\*

DEL-006

Interviewee dashboard/system check/interview room

PRD-FR-003/004 + UX-CAN-\*

DEL-007

CV monitoring/event detection

PRD-FR-005/006 + AI specification

DEL-008

Real-time alerts and event history

PRD-FR-007/008 + UX-INT-\*

DEL-009

Integrity view/report

PRD-FR-009/010 + UX-REP-001

DEL-010

Automated and manual test evidence

PRD success criteria + TEST-\*

DEL-011

Release/demo package

Development Plan + Infrastructure/Testing

# 22\. Sprint Tracking Template

**Field**

**Required Content**

Sprint Goal

One sentence describing the sprint outcome.

Tasks

DEV-\* task IDs planned for the sprint.

Owner

Responsible member.

Dependency

Blocked-by task/module, if any.

Status

Not Started / In Progress / Review / Done / Blocked.

Evidence

PR, test result, screenshot, benchmark or demo reference.

Known Issues

Open defects/limitations.

Carry-over

Tasks intentionally moved to next sprint and reason.

Decision Changes

Any approved deviation from the baseline documents.

# 23\. Development Plan Acceptance Criteria

1.  All MVP modules have an identified owner.
2.  Critical dependencies are explicitly ordered.
3.  Each major implementation task maps to a module and upstream requirement/UI area.
4.  The six-member team has defined primary and secondary responsibilities.
5.  Milestones have objective exit gates.
6.  Testing is planned alongside implementation rather than only at the end.
7.  No unverified AI/model performance claims are embedded in the plan.
8.  Advanced capabilities are clearly separated from MVP work.
9.  Release is blocked by critical workflow/security failures.
10.  The plan can be traced forward into architecture, database, AI/ML and testing documents.

# 24\. Handoff to Subsequent Documents

**Document**

**Development Dependency**

System Architecture

Module boundaries, event flow, WebRTC/signalling, AI-service interaction and deployment topology must refine this plan.

Database Specification

Persistence tasks M09 and event/report flows require the finalized schema.

AI/ML Specification

M07 and AI-related tasks require the selected models, datasets, inference interfaces and evaluation protocol.

Infrastructure Plan

M12 release/deployment work requires actual resource, storage, networking and environment requirements.

Testing & Evaluation Plan

M11 must inherit requirement IDs, scenarios and metrics from the finalized test specification.

Startup/Product Roadmap

Post-MVP modules and future productization should reflect what is actually validated and implemented.

**Final baseline rule  
**Document 7 is an execution plan, not evidence that the planned modules already exist. Implementation status must be tracked separately. When the team completes a module, the status should be supported by code, tests or demonstrable evidence.