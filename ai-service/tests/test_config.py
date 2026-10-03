"""Tests for centralized configuration loading and environment overrides."""

import pytest

from app.core.config import Settings, get_settings


class TestSettingsDefaults:
    def test_defaults(self, monkeypatch: pytest.MonkeyPatch) -> None:
        for name in (
            "AI_SERVICE_NAME",
            "AI_SERVICE_HOST",
            "AI_SERVICE_PORT",
            "AI_SERVICE_ENV",
            "AI_SERVICE_VERSION",
            "LOG_LEVEL",
        ):
            monkeypatch.delenv(name, raising=False)
        settings = Settings(_env_file=None)
        assert settings.service_name == "ai-service"
        assert settings.host == "0.0.0.0"
        assert settings.port == 8000
        assert settings.environment == "development"
        assert settings.version == "0.1.0"
        assert settings.log_level == "INFO"

    def test_environment_override(self, monkeypatch: pytest.MonkeyPatch) -> None:
        monkeypatch.setenv("AI_SERVICE_PORT", "8123")
        monkeypatch.setenv("AI_SERVICE_ENV", "production")
        monkeypatch.setenv("LOG_LEVEL", "DEBUG")
        settings = Settings(_env_file=None)
        assert settings.port == 8123
        assert settings.environment == "production"
        assert settings.log_level == "DEBUG"

    def test_invalid_port_rejected(self, monkeypatch: pytest.MonkeyPatch) -> None:
        monkeypatch.setenv("AI_SERVICE_PORT", "not-a-port")
        with pytest.raises(Exception):
            Settings(_env_file=None)

    def test_get_settings_cached(self) -> None:
        assert get_settings() is get_settings()
