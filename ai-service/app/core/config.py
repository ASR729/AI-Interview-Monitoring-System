"""Centralized, environment-driven configuration for the AI service.

All environment-specific values are read from process environment variables
(and optionally a local untracked ``.env`` file). No secrets are defined here.
"""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """AI service runtime settings.

    Supported environment variables (see ``.env.example``):

    - ``AI_SERVICE_NAME``
    - ``AI_SERVICE_HOST``
    - ``AI_SERVICE_PORT``
    - ``AI_SERVICE_ENV``
    - ``AI_SERVICE_VERSION``
    - ``LOG_LEVEL``
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        populate_by_name=True,
    )

    service_name: str = Field(default="ai-service", alias="AI_SERVICE_NAME")
    host: str = Field(default="0.0.0.0", alias="AI_SERVICE_HOST")
    port: int = Field(default=8000, alias="AI_SERVICE_PORT")
    environment: str = Field(default="development", alias="AI_SERVICE_ENV")
    version: str = Field(default="0.1.0", alias="AI_SERVICE_VERSION")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance for the running process."""
    return Settings()
