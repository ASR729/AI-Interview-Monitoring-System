# AI Interview Monitoring and Detection System

## Product Framing
AI Interview Integrity Platform

## Overview
This system provides observable signals, structured events, evidence/context, and integrity-risk indicators for human review during interview sessions. It is **not** a definitive automated cheating/deception judge.

## Architecture
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **AI Service**: Python + FastAPI
- **Database**: MongoDB
- **Real-time**: WebRTC + Socket.io
- **AI/CV**: Open-source/local approaches for MVP

## 24-Phase Implementation Plan

### Foundation
1. [ ] Phase 1 — Requirements Freeze & Repository
2. [ ] Phase 2 — Frontend Foundation
3. [ ] Phase 3 — Node/Express Backend Foundation
4. [ ] Phase 4 — Python/FastAPI AI Service
5. [ ] Phase 5 — MongoDB

### Auth & Interview Workflow
6. [ ] Phase 6 — Authentication & RBAC
7. [ ] Phase 7 — HR Product
8. [ ] Phase 8 — Interviewer Product
9. [ ] Phase 9 — Candidate/Interviewee Product

### Media & Monitoring
10. [ ] Phase 10 — Interview Room
11. [ ] Phase 11 — WebRTC & Socket.io
12. [ ] Phase 12 — Webcam Capture
13. [ ] Phase 13 — Computer Vision
14. [ ] Phase 14 — Selected Observable Behaviour Signals
15. [ ] Phase 15 — Event Engine & Persistence
16. [ ] Phase 16 — Real-Time Alerts

### Evidence & Reports
17. [ ] Phase 17 — Evidence System
18. [ ] Phase 18 — Live Monitoring & Basic Integrity View
19. [ ] Phase 19 — Interview Report

### Evaluation & Validation
20. [ ] Phase 20 — End-to-End MVP Test
21. [ ] Phase 21 — Controlled AI Evaluation
22. [ ] Phase 22 — Internal Validation / Pilot / Feedback

### V2 & Enterprise
23. [ ] Phase 23 — V2 Multimodal Integrity Intelligence
24. [ ] Phase 24 — SaaS Productization & Enterprise Scale

## Documentation
- [PRD](./docs/01-PRD.md)
- [SRS](./docs/02-SRS.md)
- [System Architecture](./docs/03-System-Architecture.md)
- [Database Specification](./docs/04-Database-Specification.md)
- [AI/ML Specification](./docs/05-AI-ML-Specification.md)
- [UI/UX Specification](./docs/06-UI-UX-Specification.md)
- [Development Plan](./docs/07-Development-Plan.md)
- [Zero-Cost Infrastructure Plan](./docs/08-Infrastructure-Plan.md)
- [Testing & Evaluation Plan](./docs/09-Testing-Evaluation.md)
- [Startup/Product Roadmap](./docs/10-Startup-Product-Roadmap.md)

## Project Control
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)
- [Project Status](./PROJECT_STATUS.md)
- [Decision Log](./DECISION_LOG.md)

## Development
```bash
# Install dependencies
cd frontend && npm install
cd ../backend && npm install
cd ../ai-service && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# Run development servers
# Frontend: cd frontend && npm run dev
# Backend: cd backend && npm run dev
# AI Service: cd ai-service && uvicorn main:app --reload
```

## License
Proprietary - All rights reserved.
