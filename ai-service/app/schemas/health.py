"""Structured response models for service identification and liveness endpoints."""

from datetime import datetime, timezone

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Liveness response. Never reports model/AI readiness."""

    status: str = Field(description="Process status; 'ok' means the service process is alive.")
    service: str = Field(description="Service name from configuration.")
    version: str = Field(description="Service build version from configuration.")
    environment: str = Field(description="Deployment environment from configuration.")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="UTC time when the response was generated.",
    )


class ReadyResponse(BaseModel):
    """Application readiness response.

    Phase 4: reflects application readiness only. No AI models, databases, or
    external dependencies exist yet to be checked.
    """

    status: str = Field(description="'ready' means the application is ready to serve requests.")
    service: str = Field(description="Service name from configuration.")
    version: str = Field(description="Service build version from configuration.")
    components_ready: list[str] = Field(
        description="Names of application components confirmed ready. AI/CV model components do not exist in Phase 4."
    )


class ServiceInfoResponse(BaseModel):
    """Root endpoint: basic service identification for local verification."""

    service: str = Field(description="Service name from configuration.")
    version: str = Field(description="Service build version from configuration.")
    docs: str = Field(default="/docs", description="Interactive API documentation path.")
