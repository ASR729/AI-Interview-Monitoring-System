"""FastAPI application composition for the AI service.

Phase 4 scope: service foundation only. No AI/CV models, no database, no
authentication middleware, no CORS requirement. The application API in the
Node.js backend is the future boundary that will call this service internally
(``Application -> AI Service``, internal HTTP, proposed in System
Architecture v1.0); browsers must not call this service directly.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from .core.config import get_settings
from .core.logging import configure_logging
from .routes import health as health_routes

logger = logging.getLogger("ai-service")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    configure_logging(settings.log_level)
    logger.info(
        "Starting %s v%s (environment=%s, port=%s)",
        settings.service_name,
        settings.version,
        settings.environment,
        settings.port,
    )
    yield
    logger.info("Shutting down %s", settings.service_name)


def register_exception_handlers(app: FastAPI) -> None:
    """Convert unhandled errors into JSON responses without stack traces."""

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.error("Unhandled application error on %s %s", request.method, request.url.path)
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()
    app = FastAPI(
        title="AI Interview Monitoring — AI Service",
        description=(
            "Independent Python/FastAPI AI service for the AI Interview Monitoring "
            "and Detection System. Phase 4 foundation: service lifecycle, "
            "configuration, health and readiness endpoints. No AI/CV/analytics "
            "capability is loaded in this phase; analysis results, when implemented "
            "in later phases, will be observable signals with confidence and "
            "context for human review."
        ),
        version=settings.version,
        lifespan=lifespan,
    )
    register_exception_handlers(app)
    app.include_router(health_routes.router)
    return app


app = create_app()
