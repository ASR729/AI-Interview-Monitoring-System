**PRODUCT REQUIREMENTS DOCUMENT**

**AI Interview Monitoring and Detection System**

**AI Interview Integrity Platform**

PRD Version 1.0 | Baseline Product Specification

**One-line product definition  
**An AI-powered platform that monitors online interviews in real time, analyzes multimodal candidate behaviour, detects and correlates suspicious signals associated with potential interview fraud or AI assistance, and provides evidence-based integrity risk indicators and reports for human review.

**Document Field**

**Value**

Project

AI Interview Monitoring and Detection System

Product Category

AI Interview Integrity / Remote Interview Monitoring

Document

Product Requirements Document (PRD)

Version

1.0

Status

Baseline / Initial Product Definition

Primary Product Users

Recruiters and HR teams

Additional Users

Companies, universities/placement cells, online assessment and hiring platforms

Primary Product Goal

Improve visibility into interview-integrity signals during remote interviews

Development Principle

Evidence + Risk Indicators + Human Review

Current Scope

MVP-focused product definition; advanced capabilities remain future/TBD until validated

**Team / Role**

**Name / Identifier**

Team ID

ASIP-24EDAI01

Team Lead

Asifur Rahman — 1AT24CD017

Team Member

Aakash Raj — 1AT24CS001

Team Member

Aarav Singh — 1AT24CS002

Team Member

Ayush — 1AT24CS032

Team Member

Ashwani Kumar Mishra — 1AT24CD030

Team Member

Mohit Kumar — 1AT24CD122

Faculty Guide

Professor Aishwarya Bagalkoti

**This PRD is the baseline for the SRS and all subsequent project documents.**

# 1\. Executive Summary

The AI Interview Monitoring and Detection System is proposed as a startup-like SaaS product focused on interview integrity for remote and online hiring or assessment workflows. The system is intended to provide recruiters and other authorized users with structured visibility into observable interview events and potential integrity risks while an interview is taking place.

The product combines multiple analysis areas rather than depending on a single cheating detector. The product direction includes webcam/video monitoring, screen/activity monitoring, audio and speech analysis, NLP-based response analysis, and a risk/evidence layer that correlates signals into alerts and an interview integrity report.

**Core product principle  
**The system should surface evidence, confidence and risk indicators for human review. It should not represent an AI-generated risk score as definitive proof that a candidate cheated or deceived an interviewer.

# 2\. Product Vision

Build a trustworthy interview-integrity platform that helps organizations conduct remote interviews with greater visibility, consistent monitoring, and evidence-based review—while keeping the candidate experience transparent and avoiding unsupported claims about intent or deception.

## 2.1 Product Mission

Provide a structured monitoring and analysis layer around online interviews so recruiters can identify potentially suspicious events, review supporting evidence, and make their own informed hiring decisions.

## 2.2 Product Positioning

**Dimension**

**Product Position**

Primary problem

Interview integrity and visibility during remote interviews

Primary user

Recruiter / HR professional

Core value

Real-time monitoring, correlated integrity signals, alerts, and evidence-based reporting

Differentiation direction

Multimodal integrity analysis rather than relying only on tab switching, snapshots, or a single detector

Decision model

Human decision supported by AI-generated evidence and risk indicators

Business direction

Potential SaaS for organizations and institutional hiring/assessment workflows; monetization is future scope

# 3\. Problem Statement

Remote hiring makes it possible to conduct interviews without requiring the candidate and interviewer to share the same physical environment. This creates an integrity challenge: a recruiter may have limited visibility into external assistance, unusual screen activity, multiple-person presence, or other observable events occurring during an interview.

Basic monitoring mechanisms can provide individual signals such as tab switching, webcam presence, or screen status, but these signals can be fragmented and difficult to interpret together. Recruiters therefore need a system that can collect relevant events, analyze them in context, surface potentially suspicious patterns, and preserve evidence for review.

**Problem  
**Recruiters conducting remote interviews need a practical way to monitor interview-integrity signals in real time and review potentially suspicious events without relying on a single, definitive automated judgment.

## 3.1 Consequences

-   Reduced visibility into the candidate's interview environment.
-   Difficulty identifying and correlating multiple suspicious signals during a live interview.
-   Manual effort required to review recordings or scattered monitoring information.
-   Risk of inconsistent interpretation when evidence is not timestamped or structured.
-   Potential for false accusations when a single ambiguous behaviour is treated as proof of cheating.

# 4\. Product Goals and Non-Goals

## 4.1 Product Goals

1.  Provide real-time monitoring of selected interview-integrity signals.
2.  Detect and surface potentially suspicious observable events during an interview.
3.  Correlate multiple signals into an interpretable integrity-risk view.
4.  Provide recruiters with timely alerts for events that may require attention.
5.  Preserve timestamped evidence and contextual information for post-interview review.
6.  Generate an interview integrity report that summarizes relevant signals and events.
7.  Provide a foundation that can later scale into a SaaS product and integrate with hiring/assessment platforms.

## 4.2 Non-Goals for Initial Product

-   Complete ATS.
-   Autonomous recruiter or hiring decision-maker.
-   Full online coding/assessment platform.
-   Payroll, HRMS, or employee-management functionality.
-   Custom large language model.
-   Guarantee of detecting cheating.
-   Using facial expression, gaze, voice stress, or similar signals as standalone proof of deception.
-   Mobile application in initial scope.
-   Microservices solely for appearance of scalability.
-   Payments/subscriptions before core product validation.

# 5\. End Users and Stakeholders

**User / Stakeholder**

**Needs**

**Product Value**

Recruiter / HR

Monitor an interview and identify events requiring review

Live alerts, evidence, integrity view, report

Hiring Manager / Interviewer

Conduct an interview with integrity context

Contextual signals without replacing human judgment

Company / Organization

Standardize remote interview-integrity processes

Consistent workflow and auditable evidence

University / Placement Cell

Conduct online placement interviews

Structured monitoring and post-interview review

Online assessment / hiring platform

Add interview-integrity capabilities

Potential future API/integration layer

Candidate

Understand monitoring and complete interview transparently

Clear system checks, notice and non-punitive UX

System Administrator

Manage authorized users/configuration

Access control and operational visibility; detailed admin scope TBD

# 6\. Primary User Personas

## 6.1 Recruiter Persona

**Attribute**

**Description**

Role

Recruiter / HR professional

Objective

Conduct and review remote interviews with integrity visibility

Pain points

Limited visibility, scattered signals, manual review, uncertainty around suspicious events

Key actions

Create interview, invite candidate, monitor, review alerts/evidence, view report

Success condition

Can quickly understand what happened and decide what requires human review

## 6.2 Candidate Persona

**Attribute**

**Description**

Role

Candidate participating in an online interview

Objective

Complete interview successfully in a transparent and stable environment

Pain points

Unclear technical requirements, connectivity/device issues, concern about opaque monitoring

Key actions

Open invite, system check, permissions, join, complete interview

Success condition

Understands the monitoring process and completes the interview without unnecessary friction

# 7\. Core Use Cases

**ID**

**Use Case**

**Primary Actor**

**Outcome**

UC-001

Create Interview

Recruiter

Interview session is configured and invitation details are generated.

UC-002

Candidate System Check

Candidate

Camera, microphone, connectivity and relevant browser capabilities are checked.

UC-003

Join Interview

Candidate

Candidate enters interview environment after required checks.

UC-004

Monitor Interview

Recruiter/System

Selected video, audio and activity signals are processed during the session.

UC-005

Detect Suspicious Event

AI Monitoring System

Potentially suspicious event is generated with timestamp and confidence/context.

UC-006

Alert Recruiter

System/Recruiter

Relevant live alert is displayed for recruiter review.

UC-007

Review Evidence

Recruiter

Recruiter inspects event context and supporting evidence.

UC-008

Generate Interview Report

System/Recruiter

Post-interview integrity summary is produced.

# 8\. User Journeys

## 8.1 Recruiter Journey

1.  Recruiter signs in.
2.  Recruiter opens dashboard.
3.  Recruiter creates interview and configures required details.
4.  System creates an interview session and invitation mechanism.
5.  Candidate joins through invitation.
6.  Candidate completes required system check.
7.  Interview begins.
8.  Monitoring components collect permitted signals.
9.  Analysis components identify potentially suspicious events.
10.  Risk/evidence layer correlates relevant events.
11.  Recruiter receives live alerts where configured.
12.  Recruiter reviews event evidence during or after interview.
13.  Interview ends.
14.  System produces a structured integrity report.

## 8.2 Candidate Journey

1.  Candidate opens invitation.
2.  Candidate sees relevant instructions and monitoring disclosure.
3.  Candidate completes system check.
4.  Candidate grants required browser/device permissions where necessary.
5.  Candidate enters interview room.
6.  Candidate completes interview.
7.  Candidate receives completion confirmation.

# 9\. MVP Definition

The MVP is deliberately narrower than the long-term product vision. Its objective is to prove that a usable interview workflow can capture selected monitoring signals, identify suspicious events, and provide useful real-time alerts and evidence.

**ID**

**Capability**

**Priority**

**Definition**

MVP-001

Authentication / roles

P0

Basic authorized access for recruiter and candidate workflows.

MVP-002

Interview creation

P0

Recruiter can create and manage an interview session.

MVP-003

Candidate system check

P0

Pre-interview checks for camera/microphone/connectivity/browser capabilities.

MVP-004

Interview room

P0

Candidate can enter and participate in the online interview workflow.

MVP-005

Webcam monitoring

P0

Capture/analyze selected observable video signals during the interview.

MVP-006

Suspicious behaviour events

P0

Generate structured events from supported monitoring signals.

MVP-007

Real-time alerts

P0

Surface selected high-priority events to recruiter.

MVP-008

Evidence/event history

P0

Store timestamped event information needed for review.

MVP-009

Basic integrity view/report

P1

Summarize observed events and risk indicators after the interview.

## 9.1 Deferred from MVP

-   Advanced audio/voice analysis.
-   Advanced NLP-based AI-assistance analysis.
-   Deepfake detection.
-   Advanced identity verification.
-   ATS integrations.
-   Enterprise organization management.
-   Subscription/payment infrastructure.
-   Large-scale multi-tenant production infrastructure.
-   Advanced analytics and benchmarking.

# 10\. Product Functional Requirements

These are product-level baseline requirements. The SRS will convert them into detailed software requirements, acceptance criteria, data requirements, interfaces and technical constraints.

**ID**

**Requirement**

**Description**

**Scope**

PRD-FR-001

Authentication and Roles

Support authorized access for defined user roles, at minimum recruiter and candidate workflows.

MVP

PRD-FR-002

Interview Creation

Recruiter can create an interview session with information required to invite/manage a candidate.

MVP

PRD-FR-003

Candidate System Check

Provide pre-interview checks for required camera, microphone, connectivity and relevant browser capabilities.

MVP

PRD-FR-004

Interview Room

Provide a controlled online environment in which the candidate can participate.

MVP

PRD-FR-005

Video Monitoring

Process selected observable webcam signals relevant to interview integrity.

MVP

PRD-FR-006

Suspicious Event Detection

Generate structured events when supported monitoring logic identifies potentially suspicious observable behaviour.

MVP

PRD-FR-007

Real-Time Alerts

Provide real-time alerts for configured events requiring recruiter attention.

MVP

PRD-FR-008

Evidence Context

Associate detected events with timestamps and available supporting context/evidence.

MVP

PRD-FR-009

Risk / Integrity View

Provide an interpretable view of relevant integrity signals and risk indicators.

MVP/P1

PRD-FR-010

Interview Report

Provide a post-interview summary of relevant monitoring events, evidence and integrity indicators.

P1

PRD-FR-011

Audio Analysis

May analyze selected audio/speech signals to support integrity analysis.

Future/Proposed

PRD-FR-012

NLP Analysis

May analyze transcripts and response characteristics for potential AI-assistance signals.

Future/Proposed

PRD-FR-013

Screen Activity Monitoring

May capture technically accessible screen/window/activity signals relevant to interview integrity.

Proposed

PRD-FR-014

Review Workflow

Should allow recruiter to inspect individual events rather than relying only on an aggregate score.

P1

# 11\. AI and Integrity-Analysis Requirements

The AI layer is a product capability, not a claim that automated models can directly observe intent. The initial direction uses specialized signal detectors and a correlation/risk layer.

**Analysis Area**

**Potential Signals**

**Product Treatment**

Computer Vision

Face presence, multiple faces, head/gaze direction, selected movement/activity signals

Observable signals with confidence and timestamp

Audio / Speech

Speech capture, transcript, pauses, speaking-rate or other supported audio features

Contextual signals; not standalone deception proof

NLP

Transcript characteristics, response timing, linguistic patterns, technical relevance

Potential AI-assistance indicators; requires validation

Screen / Activity

Window/tab focus, screen-sharing state, technically accessible activity events

Event-based evidence where technically and ethically appropriate

Integrity / Risk Engine

Combination of multiple events and confidence values

Risk indicator and evidence summary for human review

**AI safety and fairness requirement  
**No individual signal—such as looking away, pausing, facial expression, voice characteristics, or unusual wording—should be treated as conclusive evidence of cheating or deception. The product should communicate uncertainty and preserve a human-review step.

# 12\. Alert Requirements

**Alert Attribute**

**Requirement**

Event ID

Each alert/event should have a unique identifier.

Interview ID

Each alert must be associated with its interview session.

Timestamp

Each alert should identify when the event occurred.

Event Type

Alert should identify the observable event category.

Severity

Severity should use a defined scale; exact thresholds are TBD until validated.

Confidence

Model-based confidence should be preserved separately from severity.

Evidence Reference

Alert should point to available supporting evidence/context where applicable.

Model Version

Model-generated events should record relevant model/rule version where applicable.

Review Status

Later versions should support a review state such as unreviewed/reviewed/needs investigation.

# 13\. Reporting Requirements

A post-interview report is intended to summarize evidence rather than issue an automatic hiring verdict.

-   Interview identification and timing.
-   Candidate/interview metadata permitted by the workflow.
-   Detected events with timestamps.
-   Event severity and confidence where available.
-   Supporting evidence references.
-   Aggregate integrity-risk indicators, if implemented.
-   Summary of notable events.
-   Human review notes/status where implemented.

**Report boundary  
**The report should not state that a candidate definitely cheated solely because an AI model produced a risk signal.

# 14\. UI/UX Product Requirements

**Screen**

**Primary User**

**Purpose**

**Priority**

Landing / Welcome

All

Explain product and entry points

P1

Login

Recruiter

Secure access

P0

Recruiter Dashboard

Recruiter

Overview of interviews and alerts

P0

Create Interview

Recruiter

Configure interview session

P0

Interview List

Recruiter

View/manage interviews

P1

Live Interview Monitoring

Recruiter

Observe live signals, alerts and evidence

P0

Alert Details

Recruiter

Inspect event context/evidence

P0/P1

Interview Report

Recruiter

Review post-interview summary

P1

Candidate Dashboard

Candidate

Access upcoming/completed interview flow

P1

Pre-Interview System Check

Candidate

Validate device/browser conditions

P0

Interview Room

Candidate

Participate in interview

P0

Interview Completion

Candidate

Confirm completion and next steps

P1

## 14.1 UX Principles

-   Transparency: clearly explain what is being monitored and why.
-   Evidence-first: show underlying event/context instead of only an opaque score.
-   Non-punitive candidate experience.
-   Low cognitive load for recruiters.
-   Consistent severity, confidence and event terminology.
-   Accessibility and usability considered during UI/UX design.

# 15\. Product Data Requirements

**Concept**

**Product Purpose**

User

Represents an authorized person using the system.

Recruiter

Represents recruiter/HR profile and permissions.

Candidate

Represents interview participant.

Interview Session

Central entity connecting recruiter, candidate, timing and interview state.

Monitoring Event

Timestamped observable event produced by a monitoring component.

AI Analysis Result

Model/rule output associated with an interview or event.

Alert

Recruiter-facing notification generated from relevant events.

Evidence Reference

Reference to supporting media/context associated with an event.

Final Report

Post-interview summary of relevant integrity information.

**Data design principle  
**Prefer event-based evidence and references over retaining every raw frame indefinitely. Retention, storage duration and exact media handling are technical/privacy decisions for later documents.

# 16\. Security, Privacy and Trust Requirements

-   Use role-based access so users can access only appropriate information.
-   Protect authentication credentials using standard secure password-storage practices when passwords are used.
-   Protect sensitive interview information and evidence in transit and at rest where applicable.
-   Provide candidate-facing monitoring disclosure and required permissions explicitly.
-   Define data-retention policy before production deployment.
-   Audit access to interview recordings/evidence in production-grade implementation.
-   Minimize unnecessary collection and retention of personal data.
-   Do not allow AI-generated integrity indicators to automatically determine employment outcomes.

Detailed security controls, privacy requirements, retention periods, encryption implementation, authentication protocol and compliance requirements will be specified in the SRS and architecture documents.

# 17\. Product-Level Non-Functional Requirements

**ID**

**Area**

**Requirement**

**Status**

PRD-NFR-001

Usability

Core recruiter workflows should be understandable without extensive training.

Confirmed

PRD-NFR-002

Performance

Live monitoring should operate with sufficiently low delay for practical alerts; exact target latency is TBD until benchmarking.

TBD

PRD-NFR-003

Security

Authorized access and role separation are required.

Confirmed

PRD-NFR-004

Privacy

Monitoring disclosure, data minimization and retention controls are required.

Confirmed

PRD-NFR-005

Reliability

Monitoring should degrade gracefully when a non-critical analysis component fails.

Proposed

PRD-NFR-006

Scalability

Architecture should permit future concurrent interviews without a complete rewrite.

Confirmed

PRD-NFR-007

Maintainability

AI and monitoring modules should be separable enough to evolve independently.

Confirmed

PRD-NFR-008

Observability

Production implementation should provide logs/metrics sufficient to diagnose monitoring failures.

Future/Proposed

# 18\. Initial Technology Direction

This is the current technology direction established during project planning. It is a baseline for architecture work, not a claim that every component has already been implemented.

**Layer**

**Current Direction**

**Status / Notes**

Frontend

React + Vite + Tailwind CSS

Baseline direction

Application Backend

Node.js + Express.js

Baseline direction

AI Service

Python + FastAPI

Baseline direction

Database

MongoDB

Baseline direction

Computer Vision

OpenCV + MediaPipe

Baseline direction

NLP

Transformers / BERT-family tooling where justified

Proposed; model selection requires validation

Speech / Audio

Local speech-to-text model + Librosa where useful

Proposed; exact model TBD

Real-Time Communication

WebRTC + Socket.io

Baseline direction; exact architecture TBD

Containerization

Docker

Baseline direction

Deployment

Cloud/free-tier options during validation; production provider TBD

Do not treat free tiers as guaranteed production infrastructure

**Architecture constraint  
**Do not introduce microservices, Kubernetes, paid infrastructure, or many AI models merely to make the project appear enterprise-grade. Prioritize a modular, testable system that can later be decomposed if actual scale requires it.

# 19\. Product Success Criteria

Success criteria are measurable validation goals. No value below is claimed as already achieved.

**Area**

**Success Criterion**

**Status**

Workflow

Recruiter can create an interview and candidate can complete the intended flow.

To validate

Monitoring

Supported monitoring signals can be captured consistently during a test interview.

To validate

Detection

Supported suspicious-event scenarios can be detected under controlled test conditions.

To measure

Alerts

Relevant events can be surfaced to recruiter during interview with measured latency.

To measure

Evidence

Detected events can be linked to timestamps and available evidence/context.

To validate

Reporting

Post-interview report summarizes detected events understandably.

To validate

Model quality

Precision, recall, F1 and false-positive/false-negative behaviour are measured on a defined test set.

To measure

Usability

Target users can complete core workflows with acceptable friction in pilot testing.

To validate

Scalability

Concurrent-interview capacity is benchmarked rather than assumed.

Future validation

# 20\. Assumptions

1.  The initial product will operate in a browser-based environment.
2.  Candidates will use devices with a supported camera, microphone and browser.
3.  Required browser permissions can be obtained where selected functionality needs them.
4.  Initial prototype will use a controlled development/testing environment before production-scale deployment.
5.  Open-source/local AI models may be used during the prototype stage to reduce development cost.
6.  Exact detectable events depend on browser capabilities, OS constraints, model performance and available datasets.
7.  Real-time monitoring will require efficient sampling and event processing rather than necessarily running expensive inference on every frame.
8.  Model performance must be measured on representative, consent-based test scenarios before claims are made.

# 21\. Product Risks and Mitigations

**Risk**

**Impact**

**Mitigation / Product Response**

False positives

Legitimate behaviour may be flagged.

Use confidence, evidence and human review; do not treat single signals as proof.

False negatives

Some suspicious behaviour may not be detected.

Use multiple signal sources, continuous testing and clear limitations.

AI arms race

Candidates/tools may adapt.

Use layered signals and replaceable detection modules.

Privacy concerns

Video/audio/screen monitoring may involve sensitive data.

Transparent disclosure, minimization, retention controls and access control.

Browser limitations

Some monitoring capabilities may not be accessible.

Define capability matrix and graceful degradation.

Dataset limitations

Poor/non-representative data can reduce validity.

Use controlled, consent-based scenarios and report limitations.

Real-time performance

Heavy inference may cause delay/resource use.

Event-driven processing, sampling and benchmarking.

Overreliance on score

Users may treat risk score as hiring verdict.

Evidence-first UX, uncertainty and human review.

Infrastructure cost

Media processing/concurrency can exceed free tiers.

Prototype locally; benchmark actual resource needs before production.

# 22\. Responsible AI and Ethical Requirements

-   The system should not make an automatic employment decision.
-   Distinguish observable behaviour from inferred intent.
-   Risk indicators should have supporting evidence and, where applicable, confidence.
-   Ambiguous signals should not be represented as certain findings.
-   Candidate-facing disclosure should explain relevant monitoring at an understandable level.
-   Evaluate false positives and false negatives, not accuracy alone.
-   Potential bias from facial, voice, language or behavioural signals is a validation risk.
-   Human review remains part of the integrity decision process.

# 23\. Product Boundaries

**Inside Product Boundary**

**Outside Initial Boundary**

Remote interview monitoring

Full ATS

Observable integrity signals

Automated hiring decisions

Real-time alerts

Payroll / HRMS

Evidence/event tracking

Full online coding platform

Interview integrity report

Custom foundation model

Candidate system checks

Mobile application

Modular AI analysis

Payments/subscriptions in MVP

# 24\. High-Level Product Roadmap

**Stage**

**Focus**

**Indicative Capabilities**

**Status**

Stage 1 — MVP

Prove core workflow

Authentication, interview creation, system check, interview room, webcam monitoring, suspicious events, live alerts

Current

Stage 2 — Integrity Intelligence

Increase signal coverage

Audio/speech analysis, NLP analysis, richer evidence, integrity reporting

Future

Stage 3 — Productization

Improve recruiter workflow

Advanced dashboards, review workflows, analytics, organization management

Future

Stage 4 — Integrations

Connect hiring ecosystems

ATS/API integrations, scheduling and platform integrations

Future

Stage 5 — Enterprise

Scale and governance

Multi-tenant architecture, enterprise controls, deployment options, advanced analytics

Future

# 25\. Initial Requirement Traceability Baseline

**PRD Requirement**

**Next Document Mapping**

**Later Validation**

PRD-FR-001 Authentication

SRS authentication requirements

TEST-AUTH-\*

PRD-FR-002 Interview Creation

SRS interview-management requirements

TEST-INT-\*

PRD-FR-003 System Check

SRS candidate pre-check requirements

TEST-CHECK-\*

PRD-FR-004 Interview Room

SRS interview-room requirements

TEST-ROOM-\*

PRD-FR-005 Video Monitoring

SRS + AI/CV specification

TEST-CV-\*

PRD-FR-006 Suspicious Event Detection

SRS + AI specification

TEST-DETECT-\*

PRD-FR-007 Real-Time Alerts

SRS + architecture

TEST-ALERT-\*

PRD-FR-008 Evidence Context

SRS + database specification

TEST-EVIDENCE-\*

PRD-FR-009 Risk / Integrity View

SRS + AI + UI/UX

TEST-RISK-\*

PRD-FR-010 Interview Report

SRS + database + UI/UX

TEST-REPORT-\*

# 26\. Open Decisions / TBD Items

**ID**

**Decision Needed**

**Why It Matters**

**Target Document**

TBD-001

Exact list of MVP suspicious events

Defines CV/event detection scope

SRS + AI/ML

TBD-002

Exact severity levels and thresholds

Controls alert behaviour

SRS + AI/ML

TBD-003

Exact risk-score formula, if used

Defines integrity aggregation

AI/ML

TBD-004

Exact speech-to-text model

Affects audio/NLP architecture

AI/ML

TBD-005

Exact NLP model(s)

Affects inference, accuracy and cost

AI/ML

TBD-006

Browser-accessible screen/activity signals

Feasibility varies by browser/platform

Architecture

TBD-007

Media retention period

Privacy, storage and cost

SRS + Infrastructure

TBD-008

Exact cloud/deployment provider

Depends on benchmark and budget

Infrastructure

TBD-009

Production concurrency target

Required for scalability planning

Architecture + Testing

TBD-010

Pilot population and evaluation protocol

Needed for meaningful validation

Testing + Roadmap

# 27\. Dependencies and Constraints

-   Browser permissions and platform APIs constrain monitoring capabilities.
-   AI model quality depends on training/evaluation data and selected model architecture.
-   Real-time processing depends on CPU/GPU resources and optimization.
-   Audio/video evidence increases storage and privacy requirements.
-   Production deployment cost depends on concurrency, inference, storage and retention.
-   Third-party services must be evaluated for cost, availability, privacy and terms before production adoption.

# 28\. PRD Acceptance Baseline

1.  Core problem and target users are clearly defined.
2.  MVP scope is distinguishable from future scope.
3.  Product requirements have stable IDs.
4.  Candidate and recruiter journeys are defined.
5.  AI capabilities are described as signals/risk indicators rather than definitive proof.
6.  Success criteria are measurable and contain no fabricated results.
7.  Security, privacy and responsible-AI considerations are included.
8.  Open technical decisions are explicitly marked TBD rather than silently assumed.
9.  Requirement traceability can be carried into the SRS.

# 29\. Handoff to Document 2 — SRS

The SRS must derive its software requirements from this PRD. It should not introduce unrelated product capabilities. It will expand this baseline into precise functional and non-functional requirements, actors, system behaviour, interfaces, validation rules, error handling, security requirements, data requirements and acceptance criteria.

**Baseline handoff  
**PRD v1.0 is the product baseline. Any contradiction discovered during SRS creation should be surfaced explicitly and resolved as a documented product decision before it propagates into architecture, database, AI/ML, UI/UX, development or testing documents.