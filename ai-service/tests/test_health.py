"""Tests for health, readiness and root endpoints.

These tests are deterministic and require no MongoDB, no network calls, no
GPU, no webcam and no interview media. Settings are pinned through FastAPI
dependency overrides so a developer's local ``.env`` cannot change results.
"""

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings, get_settings
from app.main import app


@pytest.fixture()
def pinned_settings() -> Settings:
    return Settings(
        service_name="ai-service",
        version="0.1.0",
        environment="development",
    )


@pytest.fixture()
def client(pinned_settings: Settings) -> TestClient:
    app.dependency_overrides[get_settings] = lambda: pinned_settings
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


class TestHealth:
    def test_returns_200(self, client: TestClient) -> None:
        response = client.get("/health")
        assert response.status_code == 200

    def test_response_shape(self, client: TestClient) -> None:
        response = client.get("/health")
        body = response.json()
        assert body["status"] == "ok"
        assert body["service"] == "ai-service"
        assert body["version"] == "0.1.0"
        assert body["environment"] == "development"
        assert "timestamp" in body

    def test_no_ai_capability_claims(self, client: TestClient) -> None:
        """Health must not claim AI model/detector status (none exist)."""
        response = client.get("/health")
        text = response.text.lower()
        for forbidden in (
            "ai ready",
            "face detection",
            "behavior",
            "model loaded",
            "cheating",
            "deception",
            "suspicious",
        ):
            assert forbidden not in text

    def test_json_content_type(self, client: TestClient) -> None:
        response = client.get("/health")
        assert response.headers["content-type"].startswith("application/json")


class TestReady:
    def test_returns_200(self, client: TestClient) -> None:
        response = client.get("/ready")
        assert response.status_code == 200

    def test_response_shape(self, client: TestClient) -> None:
        response = client.get("/ready")
        body = response.json()
        assert body["status"] == "ready"
        assert body["service"] == "ai-service"
        assert body["version"] == "0.1.0"
        assert body["components_ready"] == ["api"]


class TestRoot:
    def test_returns_200(self, client: TestClient) -> None:
        response = client.get("/")
        assert response.status_code == 200

    def test_response_shape(self, client: TestClient) -> None:
        response = client.get("/")
        body = response.json()
        assert body["service"] == "ai-service"
        assert body["version"] == "0.1.0"
        assert body["docs"] == "/docs"
