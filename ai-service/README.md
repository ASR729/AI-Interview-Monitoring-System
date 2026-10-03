# AI Service — AI Interview Monitoring and Detection System

Python/FastAPI microservice-layer foundation of the monorepo AI pipeline.

## 1. Purpose

This service will eventually host the AI/CV inference layer of the system.
Its role in the approved architecture (System Architecture v1.0):

```
React + Vite Frontend
        |
        v
Node.js + Express application backend  (primary authorization boundary)
        |
        v    internal HTTP (proposed; not yet implemented)
Python + FastAPI AI Service   <-- this directory
        |
        v
Future CV / audio / NLP / ML modules
```

**Phase 4 scope = development foundation only.** The service starts, exposes
health/readiness endpoints, has centralized environment-driven configuration,
structured logging, predictable JSON error handling, OpenAPI documentation,
and automated tests. No AI capability exists in this phase.

## 2. Currently Implemented (Phase 4)

- FastAPI application factory with metadata, lifespan startup/shutdown logging
- Centralized configuration via `pydantic-settings` (environment variables,
  optional untracked `.env`)
- `GET /health` — lightweight liveness (no model/database/network dependency)
- `GET /ready` — application readiness (application components only)
- `GET /` — service identification for local verification
- OpenAPI docs at `/docs` and `/redoc`
- JSON error handling (404/405 defaults + unhandled-error handler without
  stack traces)
- Basic consistent logging (startup, shutdown, unexpected errors)
- Automated tests (`pytest` + FastAPI `TestClient`, deterministic, offline)

## 3. Intentionally NOT Implemented (Phase 4)

By approved scope, this phase has **no**:

- computer vision (OpenCV/MediaPipe/YOLO/face detection/gaze/head pose)
- behavioural analysis, emotion or "cheating"/"deception" logic
- audio analysis, speech-to-text, NLP, LLM calls
- deepfake detection, identity verification, face recognition
- risk/fraud scoring, alerts, reports
- MongoDB or any persistence (Phase 5)
- authentication/RBAC, WebRTC, Socket.io, webcam capture
- Node.js backend integration (integration is a later phase boundary)

Per the AI/ML Specification v1.0, the system identifies observable signals
with confidence and context for human review; it never claims to determine
cheating, deception, intent, guilt, or employment suitability.

## 4. Python Environment

- Python: **3.11.2** (system `/usr/bin/python3`)
- Package manager: `pip` inside a project-local virtual environment
- Virtual environment: `ai-service/.venv/` (not committed)

> Note: the host Python was created without `ensurepip`, so the venv was
> created with `python3 -m venv --without-pip .venv` and pip was bootstrapped
> inside the venv. System Python was not modified. On a standard machine,
> plain `python3 -m venv .venv` is sufficient.

### Setup

```bash
cd ai-service

# create the environment (one time)
python3 -m venv .venv

# activate
source .venv/bin/activate

# install pinned dependencies
pip install -r requirements.txt

# optional local overrides (non-secret only)
cp .env.example .env
```

## 5. Configuration

Configuration is centralized in `app/core/config.py` and driven by
environment variables:

| Variable             | Default       | Meaning                                  |
| -------------------- | ------------- | ---------------------------------------- |
| `AI_SERVICE_NAME`    | `ai-service`  | Service name                             |
| `AI_SERVICE_HOST`    | `0.0.0.0`     | Bind host                                |
| `AI_SERVICE_PORT`    | `8000`        | Bind port                                |
| `AI_SERVICE_ENV`     | `development` | Environment name                         |
| `AI_SERVICE_VERSION` | `0.1.0`       | Service build version                    |
| `LOG_LEVEL`          | `INFO`        | Logging level                            |

Do not commit a real `.env`; `.env.example` contains non-secret defaults only.

## 6. Run the service

```bash
cd ai-service
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Default local port: **8000** (verified free in the development environment).

Then verify:

- `GET http://localhost:8000/health` →
  `{"status":"ok","service":"ai-service","version":"0.1.0",
  "environment":"development","timestamp":"..."}`
- `GET http://localhost:8000/ready` → application readiness
  (`"components_ready":["api"]` — no AI/model components exist yet)
- `GET http://localhost:8000/` → service identification
- Docs: `http://localhost:8000/docs` (Swagger UI) and
  `http://localhost:8000/redoc` (ReDoc)

## 7. Run tests

```bash
cd ai-service
source .venv/bin/activate
python -m pytest -v
```

Tests are deterministic and fully local: no MongoDB, no external APIs, no
GPU, no webcam, no interview media.

## 8. Project structure

```
ai-service/
├── app/
│   ├── __init__.py
│   ├── main.py                 # app composition only (factory + wiring)
│   ├── core/
│   │   ├── config.py           # environment-driven Settings
│   │   └── logging.py          # logging configuration
│   ├── routes/
│   │   └── health.py           # GET /, /health, /ready
│   ├── schemas/
│   │   └── health.py           # response models for implemented endpoints
│   └── services/
│       └── analysis/           # documented extension point (empty by design)
├── tests/                      # pytest (TestClient, deterministic)
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## 9. Future integration boundary

Reserved for later phases:

- **Node.js backend integration**: the application API will call this service
  over internal HTTP (proposed path `Application -> AI Service`). No proxy
  routes or Axios calls exist yet; do not call this service from the browser.
- **Analysis modules**: new detectors plug in under
  `app/services/analysis/` following
  `API route -> analysis service -> detector/module -> structured result`.
  See the package docstring in `app/services/analysis/`.

Future analysis results must:

- carry observable signal + confidence + context (never verdicts/intent),
- include `model_version` / `rule_version` metadata (reserved concept; no
  model exists or is claimed in Phase 4),
- be transformable into normalized monitoring events for later persistence,
- fail independently without terminating an interview (graceful degradation;
  a failed analysis must not return a fake result).

## 10. AI integrity limitations (Phase 4)

- No AI model is loaded; nothing is "active", "ready", or "detecting".
- Health endpoints report process status only.
- No precision/recall/F1, latency, or capacity measurements exist yet; the
  approved documents mark performance targets as TBD pending benchmarking.
