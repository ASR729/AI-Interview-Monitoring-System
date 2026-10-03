"""Service identification, liveness, and readiness routes.

These endpoints are intentionally lightweight. They perform NO AI inference,
access NO database, and do NOT depend on the Node.js backend or any AI model.

Accuracy rule (AI/ML Specification v1.0): no AI capability is loaded in
Phase 4, so these endpoints must never report model/detector status.
"""

from fastapi import APIRouter, Depends

from ..core.config import Settings, get_settings
from ..schemas.health import HealthResponse, ReadyResponse, ServiceInfoResponse

router = APIRouter(tags=["service"])


@router.get("/", response_model=ServiceInfoResponse, summary="Service identification")
def read_root(settings: Settings = Depends(get_settings)) -> ServiceInfoResponse:
    """Return basic service identification for local verification."""
    return ServiceInfoResponse(
        service=settings.service_name,
        version=settings.version,
    )


@router.get("/health", response_model=HealthResponse, summary="Liveness check")
def read_health(settings: Settings = Depends(get_settings)) -> HealthResponse:
    """Report that the AI service process is running."""
    return HealthResponse(
        status="ok",
        service=settings.service_name,
        version=settings.version,
        environment=settings.environment,
    )


@router.get("/ready", response_model=ReadyResponse, summary="Application readiness check")
def read_ready(settings: Settings = Depends(get_settings)) -> ReadyResponse:
    """Report application readiness.

    Currently reflects application readiness only. No AI models or external
    services exist in Phase 4, so no model/database components are listed.
    """
    return ReadyResponse(
        status="ready",
        service=settings.service_name,
        version=settings.version,
        components_ready=["api"],
    )
