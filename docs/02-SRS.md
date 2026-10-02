**SOFTWARE REQUIREMENTS SPECIFICATION**

**AI Interview Monitoring and Detection System**

**AI Interview Integrity Platform**

SRS Version 1.0 | Derived from PRD Version 1.0

**Purpose of this document  
**This SRS converts the approved product-level requirements in PRD v1.0 into precise software requirements, system behaviours, interfaces, data requirements, security requirements, error-handling expectations, non-functional requirements and verification criteria. It is the engineering baseline for the architecture and implementation documents.

**Document Field**

**Value**

Project

AI Interview Monitoring and Detection System

Source Baseline

AI Interview Monitoring and Detection System — PRD v1.0

Document

Software Requirements Specification (SRS)

Version

1.0

Status

Baseline / Initial Software Specification

Primary Users

Recruiter / HR; Candidate

System Type

Browser-based online interview monitoring and integrity platform

Core Principle

Evidence + Risk Indicators + Human Review

Primary Development Scope

MVP requirements from PRD v1.0

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

**This SRS must remain traceable to PRD v1.0 and will be the baseline for the system architecture.**

# Document Control and Traceability Rules

The SRS expands the PRD without silently adding unrelated product capabilities. Where the PRD leaves a technical detail unresolved, this document records the requirement without inventing an implementation value.

**Rule**

**Application**

Source traceability

Every major software requirement is mapped to one or more PRD requirements/use cases.

Stable IDs

SRS requirements use stable IDs such as SRS-FR-001 and SRS-NFR-001.

No fabricated performance

Latency, accuracy, throughput and concurrency targets remain TBD unless measured or explicitly approved.

No fabricated AI capability

AI components generate signals/risk indicators; they do not establish intent or definitive cheating.

Status handling

MVP requirements are separated from proposed/future requirements.

Change control

Contradictions discovered later must be explicitly resolved and documented.

## Requirement Status Vocabulary

**Status**

**Meaning**

MUST

Required for the defined scope unless the requirement is formally changed.

SHOULD

Required directionally but implementation details may be refined.

MAY / Future

Optional or deferred capability, not required for the MVP.

TBD

Insufficiently defined in PRD; must be decided or validated before dependent implementation.

# 1\. Introduction

## 1.1 Purpose

The purpose of this SRS is to define what the AI Interview Monitoring and Detection System shall do, how users and system components shall interact with it, what information shall be maintained, and what quality and security properties the software shall satisfy.

## 1.2 Scope

The system is a browser-based interview-integrity platform. Its MVP provides authentication/role workflows, interview creation, candidate system checks, an interview room, selected webcam monitoring, suspicious-event generation, real-time alerts, timestamped evidence/event history, and a basic integrity view/report.

## 1.3 Intended Audience

-   Project team and developers.
-   AI/ML and computer-vision developers.
-   UI/UX designers.
-   QA/test engineers.
-   Faculty guide and project reviewers.
-   Future maintainers or product stakeholders.

## 1.4 Reference Document

**Reference**

**Purpose**

PRD v1.0

Authoritative product baseline from which this SRS is derived.

# 2\. Overall System Description

## 2.1 Product Perspective

The system consists of a browser-based user interface, application/backend functions, monitoring and analysis functions, persistent data storage, an alert mechanism, and reporting/review functions. The initial technology direction in the PRD is React + Vite + Tailwind CSS for the frontend, Node.js + Express.js for the application backend, Python + FastAPI for the AI service, MongoDB for data, OpenCV + MediaPipe for computer vision, WebRTC + Socket.io for real-time communication, and Docker for containerization.

These technologies are baseline directions rather than proof of completed implementation. Exact service boundaries, protocols and deployment details are specified only where the PRD supports them.

## 2.2 Product Context

**Context**

**System Responsibility**

Recruiter workflow

Create/manage interviews, monitor active interviews, receive alerts, review events and reports.

Candidate workflow

Open invitation, understand monitoring, complete system check, enter interview room and complete interview.

Monitoring

Capture and process selected permitted signals during the interview.

Analysis

Generate potentially suspicious observable events with context/confidence where applicable.

Risk/evidence

Correlate relevant events and expose interpretable risk indicators/evidence.

Reporting

Summarize interview-integrity information after the interview.

## 2.3 Product Boundaries

**Inside MVP Boundary**

**Outside MVP Boundary**

Remote interview monitoring

Full ATS

Selected observable webcam signals

Automated hiring decisions

Real-time alerts

Payroll / HRMS

Timestamped event/evidence information

Full online coding platform

Basic integrity view/report

Custom foundation model

Candidate system checks

Mobile application

Modular AI analysis foundation

Payments/subscriptions

# 3\. User Classes and Characteristics

**User Class**

**Capabilities / Responsibilities**

Recruiter / HR

Authenticate, create interviews, monitor interviews, receive alerts, review evidence, view reports.

Candidate

Access interview invitation, review monitoring disclosure, complete system check, participate in interview, complete session.

Hiring Manager / Interviewer

May consume integrity context and reports; exact permissions are TBD.

System Administrator

Administrative access/configuration is recognized in PRD, but detailed administrator scope is TBD.

The MVP implementation shall prioritize recruiter and candidate workflows. Additional role permissions shall not be invented until defined.

# 4\. Assumptions and Constraints

-   Browser-based initial product.
-   Candidate device has supported camera, microphone and browser.
-   Required browser permissions can be obtained where needed.
-   Initial prototype/testing is controlled before production-scale deployment.
-   Open-source/local AI models may be used during prototype development.
-   Detectable events depend on browser/OS capabilities, model performance and available data.
-   Real-time analysis should use efficient sampling/event processing where appropriate.
-   Models must be evaluated on representative, consent-based test scenarios before performance claims.

## 4.1 External Constraints

-   Browser security and permission models.
-   Device hardware and camera/microphone availability.
-   Network connectivity.
-   CPU/GPU resources for inference.
-   Storage and privacy requirements for media/evidence.
-   Third-party service availability and terms where external services are eventually used.

# 5\. Functional Requirements

The following requirements derive directly from PRD-FR-001 through PRD-FR-014 and the PRD use cases. Each requirement includes a traceability reference.

**ID**

**Function**

**Software Requirement**

**Traceability**

SRS-FR-001

User authentication and role handling

The system shall provide an authenticated access workflow for supported user roles, at minimum recruiter and candidate workflows.

PRD-FR-001 / MVP-001 / UC-001, UC-003

SRS-FR-002

Role-aware access

The system shall restrict protected functions according to the user's authorized role.

PRD-FR-001 / PRD-NFR-003

SRS-FR-003

Interview creation

The system shall allow an authorized recruiter to create an interview session using the information required by the configured workflow.

PRD-FR-002 / MVP-002 / UC-001

SRS-FR-004

Interview management

The system shall allow the recruiter to access and manage interview sessions supported by the MVP workflow.

PRD-FR-002 / MVP-002

SRS-FR-005

Candidate invitation mechanism

The system shall provide the mechanism required for a candidate to access the configured interview session.

PRD-FR-002 / UC-001, UC-003

SRS-FR-006

Candidate system check

The system shall provide a pre-interview system check for required camera, microphone, connectivity and relevant browser capabilities.

PRD-FR-003 / MVP-003 / UC-002

SRS-FR-007

Permission handling

The system shall communicate when a required browser/device permission is needed and shall handle unavailable permissions as a system-check condition.

PRD-FR-003 / PRD-NFR-004

SRS-FR-008

Interview room entry

The system shall allow a candidate who satisfies required preconditions to enter the interview environment.

PRD-FR-004 / MVP-004 / UC-003

SRS-FR-009

Interview state

The system shall maintain the state of an interview session sufficiently to distinguish relevant lifecycle stages such as configured, active and completed.

PRD-FR-002, PRD-FR-004

SRS-FR-010

Webcam signal processing

During an active interview, the system shall process selected observable webcam signals defined by the implemented monitoring module.

PRD-FR-005 / MVP-005 / UC-004

SRS-FR-011

Video event generation

The system shall generate a structured monitoring event when supported video-monitoring logic identifies a configured potentially suspicious observable condition.

PRD-FR-006 / MVP-006 / UC-005

SRS-FR-012

Event timestamp

Each generated monitoring event shall include the time at which the event occurred or was detected, using a consistent timestamp representation.

PRD-FR-008 / PRD alert requirements

SRS-FR-013

Event confidence

Where model-based detection supplies a confidence value, the system shall preserve it separately from event severity.

PRD alert requirements / PRD-FR-006

SRS-FR-014

Event type

Each generated monitoring event shall identify the observable event category.

PRD alert requirements

SRS-FR-015

Interview association

Each monitoring event shall be associated with its interview session.

PRD-FR-008 / alert requirements

SRS-FR-016

Evidence reference

Where supporting evidence/context is available, the system shall associate the event with an evidence reference.

PRD-FR-008 / MVP-008

SRS-FR-017

Model/rule version

For model- or rule-generated events, the system shall preserve the applicable model/rule version where technically applicable.

PRD alert requirements

SRS-FR-018

Real-time alert generation

The system shall generate a recruiter-facing alert for configured events that meet the defined alert conditions.

PRD-FR-007 / MVP-007 / UC-006

SRS-FR-019

Alert severity

Alerts shall support a severity representation. Exact severity levels and thresholds shall remain TBD until defined and validated.

PRD-FR-007 / TBD-002

SRS-FR-020

Alert delivery

The system shall deliver configured real-time alerts to the recruiter through the active monitoring interface.

PRD-FR-007 / UC-006

SRS-FR-021

Evidence review

The system shall allow an authorized recruiter to inspect an individual detected event and its available supporting context.

PRD-FR-014 / MVP-009 / UC-007

SRS-FR-022

Integrity view

The system shall provide an interpretable view of relevant integrity signals and risk indicators where this capability is enabled.

PRD-FR-009

SRS-FR-023

Post-interview report

The system shall generate or provide a post-interview summary containing relevant monitoring events, evidence and integrity indicators where implemented.

PRD-FR-010 / UC-008

SRS-FR-024

Report event listing

The report shall identify relevant detected events and their timestamps.

PRD-FR-010

SRS-FR-025

Report confidence/severity

The report shall present event confidence and severity where those values are available.

PRD-FR-010

SRS-FR-026

Human review status

Where implemented, the system shall support a review status for events, such as unreviewed/reviewed/needs investigation.

PRD alert requirements / PRD-FR-014

SRS-FR-027

Monitoring disclosure

The candidate workflow shall present relevant monitoring disclosure before monitoring-dependent interview participation.

PRD-NFR-004 / PRD UX principles

SRS-FR-028

Interview completion

The candidate shall receive a completion state after the interview workflow ends.

PRD candidate journey

SRS-FR-029

Future audio support boundary

The architecture shall not prevent later addition of audio/speech analysis, but audio analysis is not mandatory for the MVP.

PRD-FR-011 / deferred scope

SRS-FR-030

Future NLP support boundary

The architecture shall not prevent later addition of NLP-based AI-assistance analysis, but advanced NLP analysis is not mandatory for the MVP.

PRD-FR-012 / deferred scope

SRS-FR-031

Future screen-activity support boundary

The architecture shall permit later addition of technically accessible screen/window/activity signals; exact capabilities remain TBD.

PRD-FR-013 / TBD-006

# 6\. Detailed System Workflows

## 6.1 Recruiter Authentication

1.  Recruiter accesses the protected product interface.
2.  System requests/validates authentication information using the selected authentication implementation.
3.  System establishes an authenticated session when validation succeeds.
4.  System associates the session with the recruiter's authorized role.
5.  Unauthorized access is denied and an appropriate error state is displayed.

## 6.2 Create Interview

1.  Recruiter opens the interview-creation workflow.
2.  System displays the required configuration fields defined by the implementation.
3.  Recruiter submits valid interview information.
4.  System validates required information.
5.  System creates an interview session.
6.  System generates the candidate-access mechanism required by the workflow.
7.  Interview becomes available to the recruiter for management.

## 6.3 Candidate System Check

1.  Candidate opens the interview access mechanism.
2.  System displays relevant monitoring disclosure/instructions.
3.  System checks required browser/device capabilities.
4.  System reports the result of each required check.
5.  If a required condition is unavailable, system provides an appropriate failure state and next-step guidance.
6.  When required conditions are satisfied, candidate may continue to the interview room.

## 6.4 Interview Start and Monitoring

1.  Candidate enters the interview room.
2.  System establishes the required real-time communication/session state.
3.  Monitoring components begin processing the configured permitted signals.
4.  Analysis logic evaluates supported signals.
5.  When a configured potentially suspicious condition is detected, a structured event is created.
6.  The event is associated with the active interview and timestamp.
7.  If alert conditions are satisfied, a recruiter-facing alert is generated.

## 6.5 Evidence and Review

1.  Recruiter sees the alert in the live monitoring interface.
2.  Recruiter opens the event when review is required.
3.  System displays available event metadata and evidence/context.
4.  Recruiter can review the event without being forced to accept an automated conclusion.
5.  Where review status is implemented, recruiter can update the status.

## 6.6 Interview Completion and Report

1.  Interview ends through the supported completion workflow.
2.  System records the interview's completed state.
3.  Relevant monitoring events remain associated with the interview.
4.  System prepares the post-interview integrity summary where report functionality is enabled.
5.  Recruiter can access the report.

# 7\. Monitoring Event Requirements

The event model is central to the integrity-monitoring workflow. It is derived from the PRD's alert and data requirements.

**Field**

**Requirement**

**Status**

event\_id

Unique identifier for the monitoring event.

Required

interview\_id

Identifier linking the event to the interview session.

Required

timestamp

Time of the event/detection.

Required

event\_type

Observable event category.

Required

severity

Severity representation; exact scale/threshold TBD.

Required / value TBD

confidence

Model/rule confidence where available; must remain distinct from severity.

Conditional

evidence\_reference

Reference to supporting evidence/context where available.

Conditional

model\_version

Model/rule version where applicable.

Conditional

review\_status

Review state where the review workflow is implemented.

P1 / Future refinement

**Important distinction  
**Severity indicates the configured importance of an event for the product workflow; confidence indicates the model/rule's confidence where such a value exists. The two must not be conflated.

# 8\. Data Requirements

**Entity / Data Concept**

**Required Relationship / Purpose**

User

Represents an authorized system user.

Recruiter

Represents recruiter/HR profile and permissions.

Candidate

Represents interview participant.

Interview Session

Central entity connecting recruiter, candidate, timing and interview state.

Monitoring Event

Timestamped observable event associated with an interview.

AI Analysis Result

Model/rule output associated with an interview or event.

Alert

Recruiter-facing notification generated from relevant events.

Evidence Reference

Reference to supporting media/context associated with an event.

Final Report

Post-interview summary of relevant integrity information.

## 8.1 Data Relationships

The minimum conceptual relationship is:

User → Recruiter/Candidate → Interview Session → Monitoring Events / AI Analysis Results → Alerts / Evidence → Final Report

The Interview Session is the central product entity. The detailed MongoDB collection structure, indexes, field types and retention implementation belong to Document 4 — Database Specification.

# 9\. External and User Interfaces

## 9.1 User Interface Requirements

**Interface**

**Requirements**

Recruiter Dashboard

Show interview-related information and alerts needed for recruiter workflow.

Create Interview

Provide fields/actions required to configure an interview session.

Live Interview Monitoring

Present active interview context, live signals, alerts and available evidence.

Alert Details

Show event type, timestamp, severity/confidence where available, and evidence/context.

Interview Report

Present post-interview integrity summary and relevant events.

Candidate System Check

Present checks, statuses, permission requirements and next steps.

Interview Room

Provide the candidate's interview participation environment.

Completion

Confirm interview completion.

## 9.2 Real-Time Interface

The PRD identifies WebRTC and Socket.io as the baseline real-time communication direction. The exact signaling, event-channel names, message formats and reconnection strategy are architecture-level decisions and shall be defined in Document 3 without contradicting this SRS.

## 9.3 Browser/Device Interface

-   Camera access may be required for webcam monitoring.
-   Microphone access is part of the system check and future audio direction.
-   Relevant browser capabilities and permissions shall be checked before interview participation.
-   The system shall handle unsupported or denied capabilities through explicit states rather than silently assuming access.

# 10\. Non-Functional Requirements

**ID**

**Area**

**Requirement**

**Traceability**

SRS-NFR-001

Usability

Core recruiter workflows shall be understandable without extensive training.

PRD-NFR-001

SRS-NFR-002

Candidate usability

Candidate system-check and interview-entry flows should minimize unnecessary friction.

PRD UX principles

SRS-NFR-003

Performance

Live monitoring shall operate with sufficiently low delay for practical alerts; exact target latency is TBD until benchmarking.

PRD-NFR-002

SRS-NFR-004

Security

Protected system functions shall require appropriate authorization.

PRD-NFR-003

SRS-NFR-005

Role separation

A user shall not access functions/data outside the permissions associated with the user's role.

PRD-NFR-003

SRS-NFR-006

Privacy

Monitoring disclosure, data minimization and retention controls shall be incorporated.

PRD-NFR-004

SRS-NFR-007

Data protection

Sensitive interview information/evidence shall be protected in transit and at rest where applicable.

PRD security requirements

SRS-NFR-008

Reliability

The monitoring workflow should degrade gracefully when a non-critical analysis component fails.

PRD-NFR-005

SRS-NFR-009

Scalability

The system architecture shall permit future concurrent interviews without requiring a complete rewrite.

PRD-NFR-006

SRS-NFR-010

Maintainability

Monitoring and AI modules should be sufficiently separated to evolve independently.

PRD-NFR-007

SRS-NFR-011

Observability

A production implementation should provide sufficient logs/metrics to diagnose monitoring failures.

PRD-NFR-008

SRS-NFR-012

AI transparency

Model-derived findings shall be presented as signals/risk indicators rather than definitive proof of cheating or deception.

PRD responsible-AI requirements

# 11\. Security Requirements

**ID**

**Requirement**

SRS-SEC-001

The system shall enforce authenticated access to protected recruiter functions.

SRS-SEC-002

The system shall enforce role-aware authorization for protected resources and operations.

SRS-SEC-003

Authentication credentials, when passwords are used, shall be stored using standard secure password-storage practices.

SRS-SEC-004

Sensitive interview information and evidence shall be protected in transit and at rest where applicable.

SRS-SEC-005

Access to interview evidence shall be restricted to authorized users.

SRS-SEC-006

Production access to interview recordings/evidence should be auditable.

SRS-SEC-007

The system shall minimize unnecessary collection and retention of personal data.

SRS-SEC-008

Candidate monitoring disclosure shall be presented before relevant monitoring-dependent participation.

SRS-SEC-009

The system shall not automatically convert an AI integrity indicator into an employment decision.

SRS-SEC-010

Detailed encryption algorithms, token/session mechanism, retention duration and compliance controls shall be specified only after the corresponding architecture/privacy decisions are made.

# 12\. Privacy, Trust and Responsible AI Requirements

-   The system shall distinguish observable events from inferred intent.
-   A single ambiguous signal shall not be treated as conclusive evidence of cheating or deception.
-   Risk indicators should include supporting evidence/context and confidence where available.
-   Candidate-facing monitoring information shall be understandable.
-   Model evaluation shall consider false positives and false negatives, not accuracy alone.
-   Potential bias associated with facial, voice, language or behavioural signals shall be treated as a validation risk.
-   Human review shall remain part of the integrity decision process.
-   Raw media retention shall be minimized according to the later-defined retention policy.

**System behaviour requirement  
**The product must be designed so that a recruiter can inspect the underlying event/evidence instead of being forced to rely on an aggregate integrity score.

# 13\. Error Handling and Failure States

**Scenario**

**Required System Behaviour**

Invalid authentication

Reject access and show an appropriate authentication error.

Unauthorized resource/function

Deny access; do not expose protected data.

Missing camera

System check identifies camera as unavailable/failed and prevents continuation if camera is mandatory for the configured interview.

Missing microphone

System check identifies microphone condition; whether it blocks entry depends on the configured interview requirements.

Permission denied

Display clear status and guidance to resolve permission requirements.

Connectivity failure

Display an explicit connection/system state and avoid falsely reporting successful monitoring.

Monitoring component failure

Record/log the failure where applicable and allow graceful degradation when the component is non-critical.

AI inference failure

Do not fabricate an event or confidence value; preserve system/error state and continue other supported functions where possible.

Evidence unavailable

Display the event without inventing evidence; identify that supporting evidence is unavailable.

Alert delivery failure

Record/log delivery failure where applicable and avoid claiming the recruiter received an alert.

Report generation failure

Preserve interview/event data and present an explicit report-generation error.

# 14\. Functional Acceptance Criteria

**ID**

**Area**

**Acceptance Criterion**

**Requirement Trace**

AC-001

Authentication

Authorized recruiter/candidate workflow can authenticate and unauthorized access is rejected.

SRS-FR-001,002

AC-002

Interview creation

Recruiter can create a valid interview session and obtain the configured candidate-access mechanism.

SRS-FR-003,004,005

AC-003

System check

Candidate receives results for required camera/microphone/connectivity/browser checks.

SRS-FR-006,007

AC-004

Interview entry

Candidate meeting required preconditions can enter the interview room.

SRS-FR-008

AC-005

Monitoring

Configured webcam signals are processed during an active test interview.

SRS-FR-010

AC-006

Event generation

A controlled test scenario that matches a supported detection condition produces a structured event.

SRS-FR-011

AC-007

Event metadata

Generated event contains required interview association, timestamp and event type; confidence/severity appear where applicable.

SRS-FR-012–019

AC-008

Alert

A configured alert condition results in a recruiter-visible alert in the monitoring interface.

SRS-FR-018–020

AC-009

Evidence review

Recruiter can inspect an individual event and available supporting context.

SRS-FR-021

AC-010

Report

Completed interview can produce the configured integrity summary/report when reporting is enabled.

SRS-FR-022–026

AC-011

Candidate transparency

Monitoring disclosure appears before monitoring-dependent participation.

SRS-FR-027

AC-012

Completion

Candidate receives a completion state after the interview workflow ends.

SRS-FR-028

# 15\. Testability and Evaluation Requirements

The SRS does not claim model performance. The testing document will define the detailed protocol, datasets and test cases.

**Evaluation Area**

**Requirement**

Functional testing

Core workflows shall be tested against the acceptance criteria.

Detection testing

Supported suspicious-event scenarios shall be evaluated using controlled, consent-based test scenarios.

Model metrics

Precision, recall and F1 shall be measured where a model is evaluated.

Error analysis

False-positive and false-negative behaviour shall be examined.

Latency

Real-time alert latency shall be measured rather than assumed.

Usability

Target users should be evaluated on core workflow friction and comprehension.

Scalability

Concurrent-interview capacity shall be benchmarked before production claims.

Limitations

Evaluation results shall document dataset and environment limitations.

# 16\. AI/ML Software Requirements

## 16.1 Computer Vision

-   The CV module shall process selected observable webcam signals defined for the MVP.
-   Potential signal categories may include face presence, multiple-face presence, head/gaze direction and selected movement/activity signals, consistent with the PRD.
-   Each model-derived event should preserve timestamp and confidence where available.
-   CV findings shall be treated as observable signals, not proof of intent or deception.

## 16.2 Audio and Speech

Advanced audio/speech analysis is deferred from the MVP. The SRS therefore defines an extensibility boundary rather than mandatory model behaviour. Future implementation may include speech capture, transcript generation, pauses, speaking rate or other supported audio features, subject to validation.

## 16.3 NLP

Advanced NLP-based AI-assistance analysis is deferred from the MVP. Future implementation may analyze transcripts, response timing, linguistic patterns and technical relevance for potential AI-assistance signals, subject to validation.

## 16.4 Risk / Integrity Layer

-   The integrity layer may correlate multiple events and confidence values.
-   The resulting output shall be presented as a risk indicator and evidence summary.
-   Exact scoring formula and thresholds are TBD-003 and shall be defined in the AI/ML specification.
-   The system shall not represent the score as definitive proof of cheating.

# 17\. Logging and Observability Requirements

-   The system should log material application and monitoring failures in a production implementation.
-   Logs should contain enough contextual information to diagnose a failure without unnecessarily duplicating sensitive interview content.
-   Model/rule version should be preserved for model-generated events where applicable.
-   Operational logs and candidate evidence should be treated as separate concerns; the architecture should avoid exposing sensitive evidence through generic logs.
-   Exact log schema, retention and monitoring stack are TBD for the architecture/infrastructure documents.

# 18\. Deployment and Environment Requirements

The PRD establishes local/open-source development as a cost-conscious prototype direction and identifies Docker as the containerization baseline. It does not approve a specific production cloud provider.

**Environment**

**Requirement**

Development

System should be runnable in a controlled local development environment.

Testing

System should support controlled test interviews and consent-based monitoring scenarios.

Validation deployment

A free-tier/cloud option may be used where suitable and permitted; exact provider is TBD.

Production

Production deployment shall be selected after performance, privacy, concurrency and cost requirements are benchmarked.

Containers

Docker is the baseline containerization direction.

# 19\. Configuration Requirements

-   Interview configuration shall determine which required pre-interview checks apply.
-   Monitoring modules should be configurable enough to support the defined MVP event set.
-   Alert severity thresholds shall not be hard-coded as final product policy until TBD-002 is resolved.
-   AI model/rule versions should be identifiable for generated events where applicable.
-   Exact configuration schema belongs to architecture/database documents.

# 20\. Requirements Traceability Matrix

**PRD Requirement**

**SRS Mapping**

**Future Test Mapping**

PRD-FR-001

SRS-FR-001,002

TEST-AUTH-\*

PRD-FR-002

SRS-FR-003,004,005,009

TEST-INT-\*

PRD-FR-003

SRS-FR-006,007

TEST-CHECK-\*

PRD-FR-004

SRS-FR-008,009

TEST-ROOM-\*

PRD-FR-005

SRS-FR-010

TEST-CV-\*

PRD-FR-006

SRS-FR-011,013,014,019

TEST-DETECT-\*

PRD-FR-007

SRS-FR-018,020

TEST-ALERT-\*

PRD-FR-008

SRS-FR-012,015,016,017

TEST-EVIDENCE-\*

PRD-FR-009

SRS-FR-022

TEST-RISK-\*

PRD-FR-010

SRS-FR-023,024,025,026

TEST-REPORT-\*

PRD-FR-011

SRS-FR-029

Future TEST-AUDIO-\*

PRD-FR-012

SRS-FR-030

Future TEST-NLP-\*

PRD-FR-013

SRS-FR-031

Future TEST-SCREEN-\*

PRD-FR-014

SRS-FR-021,026

TEST-REVIEW-\*

# 21\. Open Decisions Carried Forward

**ID**

**Open Decision**

**Impact on SRS / Next Document**

TBD-001

Exact list of MVP suspicious events

Must be finalized before detailed CV/event implementation.

TBD-002

Exact severity levels and thresholds

Controls alert conditions; must be resolved before final alert logic.

TBD-003

Exact risk-score formula, if used

Defines integrity aggregation; belongs to AI/ML specification.

TBD-004

Exact speech-to-text model

Future audio architecture/model decision.

TBD-005

Exact NLP model(s)

Future NLP architecture/model decision.

TBD-006

Browser-accessible screen/activity signals

Requires technical feasibility validation.

TBD-007

Media retention period

Required for database/privacy/infrastructure design.

TBD-008

Exact cloud/deployment provider

Required after benchmark and budget evaluation.

TBD-009

Production concurrency target

Required for architecture and scalability testing.

TBD-010

Pilot population and evaluation protocol

Required for meaningful product validation.

# 22\. Explicitly Out of Scope for SRS v1.0 Implementation

-   Complete ATS functionality.
-   Autonomous hiring decisions.
-   Payroll/HRMS.
-   Full coding assessment platform.
-   Custom foundation model.
-   Mobile application.
-   Payments/subscriptions.
-   Enterprise multi-tenant production infrastructure.
-   Advanced analytics/benchmarking.
-   Advanced audio/voice analysis.
-   Advanced NLP-based AI-assistance analysis.
-   Deepfake detection.
-   Advanced identity verification.
-   ATS/API integrations.

# 23\. Implementation Constraints for Architecture Handoff

-   Use a modular architecture rather than premature microservices.
-   Keep AI/monitoring modules replaceable and independently testable.
-   Use the interview session as the central association for monitoring data.
-   Prefer timestamped event/evidence records over indefinite retention of every raw frame.
-   Keep confidence and severity as separate fields/concepts.
-   Design for graceful degradation of non-critical analysis components.
-   Do not claim production scalability until concurrency is benchmarked.
-   Do not hard-code unvalidated AI thresholds as factual product policy.

# 24\. Handoff to Document 3 — System Architecture

The next document shall translate this SRS into a concrete architecture. It must identify components, responsibilities, data flows, communication paths, deployment boundaries and security boundaries while preserving the requirement IDs and product scope established here.

**Architecture Work Item**

**Must Trace To**

Frontend modules/screens

SRS-FR-001 through SRS-FR-028; UI/UX requirements

Application backend

SRS-FR-001 through SRS-FR-009 and supporting workflows

Real-time layer

SRS-FR-010 through SRS-FR-020

AI/CV layer

SRS-FR-010 through SRS-FR-017; AI requirements

Evidence/event storage

SRS-FR-012 through SRS-FR-017; data requirements

Alert layer

SRS-FR-018 through SRS-FR-020

Reporting layer

SRS-FR-022 through SRS-FR-026

Security boundary

SRS-SEC-\* and SRS-NFR-004 through SRS-NFR-007

Scalability/observability

SRS-NFR-008 through SRS-NFR-011

**Baseline handoff  
**SRS v1.0 is the software-requirements baseline derived from PRD v1.0. Document 3 must not silently change product requirements. Any architecture decision that requires a product-scope change must be recorded as an explicit decision and traced back to the PRD/SRS.