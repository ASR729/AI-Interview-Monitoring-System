**ZERO-COST INFRASTRUCTURE PLAN**

AI Interview Monitoring and Detection System

**Document 8 — Zero-Cost Infrastructure Plan**

Version 1.0 | Derived from PRD v1.0 + UI/UX Specification v1.0

**Infrastructure principle  
**₹0 development and validation is the target for the initial project stage. This does not mean that a production SaaS handling continuous video/audio, multiple concurrent interviews, long-term evidence storage and AI inference can remain permanently free. The architecture therefore starts local-first and uses free tiers only where their current terms and limits are appropriate.

**Document Field**

**Value**

Product

AI Interview Monitoring and Detection System

Document

Document 8 — Zero-Cost Infrastructure Plan

Baseline

PRD v1.0; UI/UX Specification v1.0

Infrastructure objective

Build, test and demonstrate the MVP with no mandatory recurring infrastructure spend

Primary strategy

Local-first development + selective free-tier deployment

Primary database direction

MongoDB; local for development, MongoDB Atlas Free for suitable prototype use

Frontend direction

React + Vite + Tailwind CSS

Backend direction

Node.js + Express.js

AI service direction

Python + FastAPI; local inference preferred during MVP

Production status

Not production-ready by default; free tiers are prototype/validation infrastructure

# 1\. Purpose and Scope

This document defines the infrastructure strategy for developing, testing, demonstrating and initially deploying the AI Interview Monitoring and Detection System while minimizing infrastructure cost. It covers local development, environments, database, storage, deployment, networking, secrets, security, backups, monitoring, resource constraints, free-tier boundaries and the transition to paid infrastructure.

The plan is intentionally conservative. A service is not described as 'free production infrastructure' merely because a provider offers a free tier. Current provider limits and terms are treated as constraints.

# 2\. Relationship to Previous Documents

**Source**

**Infrastructure Dependency**

PRD-FR-001

Authentication requires secure session/token handling and secret management.

PRD-FR-003

System Check requires browser/media capabilities and a reachable application.

PRD-FR-004

Interview Room requires real-time browser communication.

PRD-FR-005

Video Monitoring requires media capture and AI/CV processing.

PRD-FR-006

Suspicious Event Detection requires AI/event processing.

PRD-FR-007

Real-Time Alerts require low-latency event delivery.

PRD-FR-008

Evidence Context requires persistent event/evidence storage.

PRD-FR-009

Risk/Integrity View requires an analysis service and persistent results.

PRD-FR-010

Interview Reports require persistent interview/event data and report generation.

UI/UX UX-INT-002

Live Monitoring requires WebRTC/media + real-time event delivery.

UI/UX UX-CAN-002

System Check requires browser/media capability checks.

# 3\. Zero-Cost Definition

**Definition used in this project  
**Zero-cost means the team should be able to develop and validate the MVP without paying for cloud infrastructure, paid AI APIs, commercial model inference, dedicated servers, or a custom domain. Local hardware, open-source software and free-tier services may be used.

The following are explicitly different:

**Term**

**Meaning**

₹0 Development

Developers run most services locally using existing machines.

₹0 Validation

A prototype can be demonstrated using local infrastructure and/or free-tier services within their limits.

₹0 Hosting

A provider happens to offer a free hosting tier; this does not imply production suitability.

Production SaaS

A reliable, scalable, privacy-conscious service with concurrency, storage, observability and support requirements; this will eventually require paid resources.

# 4\. Target Infrastructure Architecture

The initial infrastructure should use a modular architecture rather than microservices.

**Layer**

**MVP Infrastructure**

**Future Production Direction**

Browser

User's browser

Browser + CDN/edge delivery

Frontend

React/Vite served locally or as a static deployment

CDN/static hosting

Application API

Node.js + Express locally

Managed/containerized web service

AI API

Python + FastAPI locally

Dedicated CPU/GPU service or managed inference

Real-time

WebRTC + Socket.io locally

Scalable signalling + media architecture

Database

MongoDB local or Atlas Free for prototype

Paid managed MongoDB or equivalent

Evidence

Local filesystem during development

Object storage with lifecycle/retention controls

Source control

Git + GitHub

GitHub with CI/CD and protected branches

Secrets

.env locally, never committed

Managed secrets/environment variables

Monitoring

Application logs + local debugging

Centralized logs, metrics, alerts

# 5\. Local Development Environment

Local development is the primary zero-cost environment because video/audio AI workloads are resource-intensive and free cloud compute is not guaranteed.

**Component**

**Recommended Local Setup**

**Purpose**

OS

Existing Windows/Linux/macOS development machine

Development workstation

Editor

VS Code

Source-code development

Runtime

Node.js LTS + npm

Frontend/backend JavaScript runtime

Python

Python 3.x compatible with selected AI packages

AI service

Frontend

React + Vite + Tailwind CSS

Web UI

Backend

Node.js + Express.js

Application/API layer

AI service

Python + FastAPI

AI/CV processing API

Database

MongoDB Community/local

Development persistence

Version control

Git + GitHub

Source control

Containers

Docker Desktop, optional initially

Environment consistency

Testing

Browser dev tools + automated tests

Validation

## 5.1 Local Network Model

For development, the services can run on the same machine:

1.  React/Vite development server serves the frontend.
2.  Node/Express runs the application API.
3.  Python/FastAPI runs AI analysis endpoints.
4.  MongoDB runs locally or is accessed through a prototype Atlas cluster.
5.  Socket.io provides application-level real-time event delivery.
6.  WebRTC handles browser media communication according to the implemented interview architecture.

**Local-first rule  
**Do not upload real candidate video/audio to an external free service merely to avoid local compute. Use synthetic/consent-based test data during development and validate third-party data handling before any external storage.

# 6\. Environment Strategy

**Environment**

**Purpose**

**Data**

**Infrastructure**

**Cost Target**

Local

Daily development

Synthetic/test data

Developer machine

₹0

Development

Shared integration testing

Synthetic/consent-based test data

Free-tier or local shared environment

₹0 target

Demo/Staging

Faculty/demo/pilot preparation

Controlled test data only until privacy controls are validated

Free-tier services where suitable

₹0 target

Production

Real organizational usage

Real user/candidate data

Paid/managed infrastructure after validation

Not expected to remain ₹0

## 6.1 Environment Separation Rules

-   Never use production secrets in local development.
-   Never copy real candidate evidence into public repositories.
-   Development and demo databases should be logically separate from any production database.
-   Production credentials must not be stored in source code.
-   Use separate environment variables for each environment.
-   Do not treat a free-tier demo deployment as production merely because it has a public URL.

# 7\. Free-Tier Service Strategy

Current provider information was checked on 16 September 2026. Free-tier limits can change; verify the provider's current terms before deployment.

**Service**

**Use**

**Current Free Capability / Constraint**

**Project Decision**

MongoDB Atlas Free

Prototype database

$0/hour; 512 MB storage; shared RAM/vCPU; MongoDB positions it for learning/exploring.

Suitable for prototype data; not assumed to be production database.

Cloudflare Pages Free

Static frontend

Free plan supports Pages builds; current docs list 500 builds/month and 1 concurrent build.

Preferred candidate for static frontend deployment.

Render Free Web Service

Prototype backend

Free web services exist, but spin down after 15 minutes without inbound traffic; 750 free instance hours/month; ephemeral filesystem.

Suitable for demos/testing; not production backend.

GitHub Free

Source control

Use for repository, version control and collaboration; exact current limits should be checked in the account.

Core development service.

Hugging Face Hub

Model/dataset repository

Use as a source/repository for open models and datasets where licensing permits.

Use for model artifacts/research; prefer local inference for MVP.

# 8\. Frontend Deployment

## 8.1 Preferred Zero-Cost Pattern

1.  Build React/Vite frontend.
2.  Push source code to GitHub.
3.  Connect the repository to a static hosting provider.
4.  Use Cloudflare Pages as the primary candidate for the public/static frontend.
5.  Configure the frontend to call the backend through a public HTTPS API endpoint.
6.  Keep secrets out of frontend source; browser-exposed variables are not secrets.

Cloudflare's current Pages documentation lists 500 builds/month and one concurrent build on the Free plan. This is adequate for a student/demo deployment but does not guarantee unlimited bandwidth or production capacity. citeturn0search3

# 9\. Backend Deployment

The backend is more difficult to host for free because the product requires APIs, real-time events and potentially AI processing.

## 9.1 Prototype Option — Render Free

-   Node.js/Express can be deployed as a Render web service.
-   Environment variables can be configured in the service.
-   WebSocket traffic is supported, but the free service still has sleep/resource limitations.
-   The free service spins down after 15 minutes without inbound HTTP requests or WebSocket messages and can take about a minute to start again.
-   The local filesystem is ephemeral; uploaded evidence must not be treated as durable storage.

Render explicitly describes Free services as suitable for testing, hobby projects and previews, and says not to use them for production applications. citeturn0search1

Therefore, Render Free is a \*\*prototype/demo option\*\*, not the final production architecture.

# 10\. AI/ML Compute Strategy

The AI layer is the largest infrastructure risk for a zero-cost architecture.

**Workload**

**₹0 Strategy**

**Reason**

OpenCV/MediaPipe

Run locally on CPU

Suitable for lightweight CV processing in a controlled prototype.

Small NLP models

Run locally when hardware permits

Avoid per-request API cost.

Speech-to-text

Run locally for controlled tests where hardware permits

Avoid paid transcription APIs.

Audio features

Run locally

Low recurring infrastructure cost.

Risk/fusion engine

Run in Python service

Rules/calculations can remain local and deterministic.

Large model inference

Defer or use selectively

Free cloud GPU is not a reliable production assumption.

Training

Use local/small experiments or temporary free resources if available

Training requirements vary and may exceed free resources.

**AI infrastructure boundary  
**Do not design the MVP around a permanently free GPU. Local inference is the default. If a selected model requires GPU resources that the team does not have, that model becomes an infrastructure/cost decision rather than an assumption.

# 11\. Database Strategy

## 11.1 Development Database

-   Use MongoDB Community Server locally where practical.
-   Use seed data and synthetic interviews for development.
-   Do not commit database files or dumps containing personal data to GitHub.
-   Back up only synthetic/approved data to shared development storage.

## 11.2 Prototype Cloud Database — MongoDB Atlas Free

MongoDB currently lists its Atlas Free tier at $0/hour with 512 MB storage and shared RAM/vCPU, and describes it as intended for learning and exploring MongoDB in a cloud environment. citeturn0search4

-   Use Atlas Free only for prototype/shared development data.
-   Monitor storage usage.
-   Do not store long-term raw interview video/audio in the database.
-   Store structured interview/event metadata in MongoDB; use object storage for large evidence files later.
-   Before production, move to an appropriately sized paid/managed database and define backup/retention requirements.

# 12\. Evidence and Media Storage

Video/audio is fundamentally different from structured database data and should not be stored as large binary blobs in MongoDB.

**Stage**

**Storage**

**Recommended Content**

Local development

Local filesystem

Short synthetic/consent-based clips, test screenshots and temporary recordings.

Prototype demo

Controlled object/file storage if available

Only required demo evidence; keep retention short.

Production

Managed object storage

Encrypted media/evidence with lifecycle policies.

## 12.1 Evidence Storage Principle

-   Store structured event metadata in MongoDB.
-   Store large media separately.
-   Reference evidence from the event record rather than embedding raw media in every event.
-   Avoid recording/storing every frame indefinitely.
-   Define retention before collecting real candidate data.

# 13\. Storage and Bandwidth Planning

Exact storage requirements cannot be honestly fixed before recording settings, codecs, duration, concurrency and retention are selected.

**Variable**

**Why It Matters**

Video resolution

Higher resolution increases storage and bandwidth.

Frame rate

Higher FPS increases media volume and processing.

Audio bitrate

Affects audio storage and transfer.

Interview duration

Longer interviews require more storage.

Concurrent interviews

Multiplies real-time bandwidth and compute.

Retention period

Determines long-term storage growth.

Evidence sampling

Event-based clips can reduce storage compared with full recordings.

**Sizing rule  
**No storage-cost number is presented as a fact until the team measures the actual media format and retention strategy. This will be finalized during architecture/testing.

# 14\. Real-Time Communication Infrastructure

The UI/UX specification requires a live monitoring experience. The infrastructure therefore separates media transport from application events.

**Channel**

**Technology Direction**

**Purpose**

Audio/video media

WebRTC

Real-time interview media.

Application events

Socket.io

Alerts, monitoring events and live UI updates.

HTTP API

Node.js + Express

Authentication, interview management, reports and other application requests.

AI service

Python + FastAPI

Model inference and analysis requests.

Exact WebRTC topology, TURN requirements and production media scaling are architecture decisions for the System Architecture document. They are not assumed to be solved by a free hosting tier.

# 15\. Network and Domain Strategy

-   Local development can use localhost endpoints.
-   Prototype deployment can use provider-managed HTTPS domains.
-   A custom domain is not required for the ₹0 prototype.
-   HTTPS should be used for any public deployment.
-   WebRTC/browser media permissions should be tested under the actual deployment origin.
-   Production should use a controlled domain, TLS, DNS management and appropriate security headers.

# 16\. Secrets and Configuration Management

**Secret / Configuration**

**Local**

**Prototype Cloud**

**Production**

Database URI

.env

Provider environment variable

Managed secret store / protected environment

JWT/session secret

.env

Provider environment variable

Managed secret

API keys

.env

Provider environment variable

Managed secret

CORS origins

.env/config

Environment variable

Explicit production allowlist

Model configuration

.env/config

Environment variable

Versioned configuration + controlled secrets

-   Never commit .env files containing secrets.
-   Maintain a .env.example containing variable names only.
-   Rotate compromised credentials immediately.
-   Do not put server-side API keys into React/Vite client bundles.

# 17\. Infrastructure Security Baseline

**Control**

**Minimum Requirement**

Transport

Use HTTPS for public deployment.

Authentication

Secure password handling and session/token management.

Authorization

Backend-enforced role and resource authorization.

Database

Restricted network access and strong credentials.

Secrets

Environment variables/managed secrets; never source-controlled.

CORS

Allow only required frontend origins in deployed environments.

Logging

Do not log passwords, tokens, raw audio/video or unnecessary personal data.

Evidence

Restrict access by interview/user authorization.

Dependencies

Keep dependencies updated and audit important security advisories.

Backups

Define backup strategy before production data is collected.

# 18\. Privacy and Data Protection Infrastructure

-   Collect only the media/events needed for defined product functionality.
-   Obtain appropriate user/candidate notice and permissions before monitoring.
-   Use synthetic or consent-based data during development and testing.
-   Separate production data from development data.
-   Define retention and deletion workflows.
-   Restrict evidence access by role and interview authorization.
-   Do not use real candidate recordings in public demos.
-   Do not expose evidence URLs publicly without access control.

# 19\. Backup and Recovery

**Environment**

**Backup Strategy**

Local

Git for source code; export only approved synthetic test data where needed.

Prototype DB

Periodic logical export of non-sensitive prototype data if supported/needed; do not assume free-tier backups.

Prototype media

Short-lived demo copies; manually controlled backup if necessary.

Production

Automated database backups, object-storage versioning/lifecycle and tested recovery procedures.

**Important  
**Free-tier services may have limited/no backup guarantees. Production recovery must not depend on a free-tier provider's best-effort behaviour.

# 20\. Logging, Monitoring and Observability

**Level**

**Zero-Cost Approach**

**Production Evolution**

Application logs

Console/file logs locally

Centralized structured logs

Errors

Developer console + backend logs

Error tracking/alerting service

Metrics

Local counters/basic instrumentation

Service metrics and dashboards

AI inference

Log model version + timing locally

Inference latency/error metrics

Real-time

Socket/WebRTC connection diagnostics

Connection quality and service metrics

Database

Local DB inspection / Atlas dashboard

Database monitoring and alerts

# 21\. CI/CD and Source Control

1.  Use GitHub as the central repository.
2.  Use separate branches for features and fixes.
3.  Keep the main branch deployable where practical.
4.  Run linting and automated tests before merging.
5.  Build frontend and backend in CI where resource limits permit.
6.  Deploy prototype frontend/backend only after the relevant checks pass.
7.  Never include secrets in CI logs or repository files.

The exact GitHub Actions workflow and branch policy will be specified in the Development Plan.

# 22\. Docker Strategy

Docker is recommended for reproducibility but is not mandatory for the first local development step.

**Use**

**Decision**

Frontend container

Optional; static build can be served directly.

Node backend container

Recommended when shared development environments are introduced.

Python AI container

Recommended to isolate AI dependencies.

MongoDB container

Optional; local MongoDB installation is also acceptable.

Docker Compose

Recommended for a reproducible multi-service local environment.

# 23\. What Is Realistically Free vs What Will Eventually Cost Money

**Capability**

**₹0 Prototype**

**Likely Paid at Scale**

**Why**

Source control

Yes

Usually still low/free for small teams

Repository size/team needs may grow.

Frontend hosting

Yes

Possibly

Traffic/build/domain requirements.

Backend hosting

Yes for prototype

Yes

Always-on compute, concurrency and reliability.

Database

Yes for small prototype

Yes

Storage, performance, backups and availability.

AI inference

Local ₹0

Often yes

CPU/GPU compute becomes significant.

GPU inference

Not reliably free

Yes

GPU capacity is expensive and demand-dependent.

Video/audio storage

Local/small demo

Yes

Media volume grows rapidly.

Bandwidth

Small demo

Yes

Concurrent media and evidence transfer.

Backups

Manual/basic

Yes

Reliable production recovery requires durable storage.

Monitoring

Basic logs

Likely

Centralized observability at scale.

Custom domain

Not required

Usually paid

Domain registration is generally not a free infrastructure assumption.

Email/SMS

Manual/local

Yes

Transactional messaging providers have usage costs.

TURN servers

Limited/testing

Likely

WebRTC connectivity across restrictive networks may require relay infrastructure.

CDN/edge

Free tier possible

Possibly

Traffic and advanced controls grow.

# 24\. Current Provider Evidence and Constraints

The following facts were verified from provider documentation during preparation of this document.

**Provider**

**Verified Point**

MongoDB Atlas

Atlas Free is listed at $0/hour with 512 MB storage and shared RAM/vCPU; MongoDB describes it for learning/exploration.

Cloudflare Pages

Current Pages limits list 500 builds/month and one concurrent build on Free.

Render

Free web services exist but can spin down after 15 minutes of inactivity, have 750 free instance hours/month, and use ephemeral filesystems.

Render

Render explicitly states free services are not for production applications.

Vercel

Current Hobby terms state the Hobby plan is for personal, non-commercial use. It should therefore not be selected as the default commercial startup hosting plan.

Sources: MongoDB pricing documentation; Cloudflare Pages limits documentation; Render free-service documentation; Vercel Terms of Service. citeturn0search4turn0search3turn0search1turn0search0

# 25\. Recommended Zero-Cost Deployment Blueprint

**Component**

**Recommended Prototype Option**

**Reason**

Frontend

Cloudflare Pages Free

Static React/Vite deployment fits the product frontend.

Node API

Render Free Web Service OR local

Useful for demo API; not production.

Python AI

Local machine

Avoids free-cloud compute/GPU uncertainty.

Database

MongoDB Atlas Free OR local MongoDB

Small structured prototype data.

Media

Local/short-lived demo storage

Avoid large recurring cloud storage costs.

Source

GitHub

Central version control.

Real-time

WebRTC + Socket.io

Matches UI/UX and product architecture.

Domain

Provider subdomain

Avoid domain purchase during prototype.

# 26\. Alternative All-Local Demo Blueprint

If free cloud deployment introduces reliability issues, the complete product can be demonstrated locally.

1.  Run React/Vite locally.
2.  Run Node/Express locally.
3.  Run Python/FastAPI locally.
4.  Run MongoDB locally.
5.  Run WebRTC/Socket.io locally.
6.  Use localhost HTTPS or an appropriate development setup when browser media permissions require secure context.
7.  Use a controlled LAN or presentation machine for demonstrations.

**Why this matters  
**A local end-to-end demo is still a valid engineering demonstration. Cloud deployment should demonstrate deployment capability, not determine whether the product architecture is correct.

# 27\. Production Scaling Path

**Stage**

**Infrastructure Change**

**Trigger**

MVP

Local-first + free tiers

Current stage

Pilot

Paid/stable backend + managed DB + durable object storage

Real external users/data

Early SaaS

Separate AI compute and scalable API

Increasing concurrent interviews

Growth

Queue/event processing + autoscaling + stronger observability

Sustained workload

Enterprise

Multi-tenant isolation, advanced security, backups, governance and deployment options

Enterprise requirements

# 28\. Main Future Cost Drivers

-   Concurrent live interviews.
-   Video/audio ingress and egress bandwidth.
-   Object storage for recordings/evidence.
-   AI inference CPU/GPU time.
-   Speech-to-text processing.
-   Database capacity and performance.
-   Real-time signalling/media infrastructure.
-   TURN relay bandwidth for WebRTC.
-   Backups and disaster recovery.
-   Centralized logging and monitoring.
-   Transactional email/SMS.
-   Custom domains and enterprise networking.

# 29\. Capacity Planning Rules

The project must not claim a concurrency number before benchmarking.

**Metric**

**Current Status**

**Required Measurement**

Concurrent interviews

TBD

Load test end-to-end session handling.

AI inference latency

TBD

Measure per model/task on target hardware.

Alert latency

TBD

Measure event generation to UI display.

Database operations

TBD

Measure under representative interview event load.

Storage per interview

TBD

Measure using actual recording/evidence settings.

Bandwidth per interview

TBD

Measure actual WebRTC/evidence traffic.

# 30\. Disaster Recovery and Failure Behaviour

-   If AI analysis fails, the core interview should not automatically be treated as fraudulent.
-   If a non-critical analysis module fails, the UI should indicate degraded analysis status where possible.
-   If the application API fails, users should receive a clear error/reconnect state.
-   If real-time event delivery fails, the system should not silently present stale 'live' information.
-   If evidence storage fails, the event should record the failure status rather than pretending evidence exists.
-   Production recovery objectives must be defined before real organizational deployment.

# 31\. Pre-Deployment Security Checklist

1.  Remove development secrets from code and configuration.
2.  Set production environment variables.
3.  Restrict CORS to the required frontend origin(s).
4.  Enable HTTPS.
5.  Verify role-based backend authorization.
6.  Verify database credentials and network restrictions.
7.  Verify no sensitive data is written to logs.
8.  Verify candidate monitoring disclosure is visible.
9.  Verify evidence access permissions.
10.  Verify backup/retention strategy before real candidate data is used.
11.  Run dependency/security checks.

# 32\. Infrastructure Acceptance Criteria

1.  A developer can run the complete MVP locally without paid infrastructure.
2.  Frontend, Node backend, Python AI service and database can communicate in the local environment.
3.  Environment variables are separated from source code.
4.  A prototype can be deployed using free-tier services without treating them as production guarantees.
5.  The database stores structured interview/event data without relying on it as raw media storage.
6.  Real-time interview functionality can be tested under the selected WebRTC/Socket.io architecture.
7.  AI inference can run locally for the selected MVP models/tasks.
8.  The team has documented what will require paid infrastructure before real production use.
9.  No unsupported claim is made about free-tier capacity or production reliability.

# 33\. Infrastructure Open Decisions / TBD

**ID**

**Decision**

**Owner/Source Document**

INFRA-TBD-001

Exact production cloud provider

Architecture + Development

INFRA-TBD-002

Exact production database tier

Database + Testing

INFRA-TBD-003

Object storage provider

Architecture + Privacy

INFRA-TBD-004

TURN provider/self-hosted strategy

Architecture

INFRA-TBD-005

Production concurrency target

Testing

INFRA-TBD-006

AI GPU requirement

AI/ML + Benchmarking

INFRA-TBD-007

Retention period

SRS + Privacy

INFRA-TBD-008

Backup/recovery targets

Production readiness

INFRA-TBD-009

Monitoring provider

Production readiness

INFRA-TBD-010

Custom domain

Product/Startup roadmap

# 34\. Final Recommended ₹0 MVP Stack

**Layer**

**Choice**

**Cost Target**

**Reason**

Source control

Git + GitHub

₹0

Version control and collaboration.

Frontend

React + Vite + Tailwind CSS

₹0

Matches UI/UX baseline.

Frontend deployment

Cloudflare Pages Free

₹0 within limits

Static web deployment.

Backend

Node.js + Express

₹0 locally

Core API.

Backend demo hosting

Render Free or local

₹0 within limits

Prototype only.

AI service

Python + FastAPI

₹0 locally

Local inference.

CV

OpenCV + MediaPipe

₹0 software cost

Open-source/local processing.

NLP

Open-source Transformers models as validated

₹0 software cost

Avoid paid API dependence.

Audio

Local speech/audio tooling as validated

₹0 software cost

Avoid paid transcription dependency.

Database

MongoDB local / Atlas Free

₹0 within limits

Structured prototype data.

Real-time

WebRTC + Socket.io

₹0 software cost

Core live workflow.

Containers

Docker

₹0 for appropriate local use

Reproducibility.

Documentation

Notion / project docs

Depends on account tier

Knowledge management.

# 35\. Transition from ₹0 Prototype to Production

The transition should be driven by measured workload rather than by arbitrary infrastructure upgrades.

1.  Measure actual interview media volume and AI inference requirements.
2.  Measure concurrent sessions and real-time alert latency.
3.  Measure database growth and evidence storage growth.
4.  Define retention and privacy requirements.
5.  Select durable object storage.
6.  Select an appropriately sized managed database.
7.  Move backend to an always-on production service.
8.  Move AI inference to dedicated compute where local inference is insufficient.
9.  Introduce queue/event processing if workload requires it.
10.  Introduce centralized observability, backups and recovery procedures.
11.  Perform security and load testing before real production launch.

# 36\. Handoff to Other Project Documents

**Document**

**Infrastructure Dependency**

SRS

Security, availability, performance, retention and environment requirements.

System Architecture

Service topology, WebRTC, AI service, networking and scaling architecture.

Database Specification

Database tier, connection/security, persistence and backup assumptions.

AI/ML Specification

Model size, inference latency, CPU/GPU needs and deployment constraints.

UI/UX Specification

Frontend hosting, real-time connectivity, media permissions and degraded states.

Development Plan

Local setup, Docker, CI/CD and environment setup tasks.

Testing Plan

Load, latency, concurrency, failure recovery and infrastructure benchmarks.

Startup/Product Roadmap

Pilot-to-SaaS transition and infrastructure cost drivers.

**Final infrastructure baseline  
**The project can realistically target ₹0 for development and early validation by keeping AI inference local, using local or small free-tier database/storage resources, deploying the static frontend on a suitable free tier, and using free backend hosting only for demonstrations. Permanent zero-cost production should not be assumed.

# 37\. Verified Provider Sources

The following sources were checked while preparing this document; provider limits and terms can change.

-   MongoDB Atlas Pricing — current Free tier information.
-   Cloudflare Pages Limits — current Free plan build limits.
-   Render Free Services Documentation — current free web-service limitations.
-   Vercel Terms of Service — current Hobby plan commercial-use restriction.