"""Tests for the FastAPI application object itself.

Verifies the app imports, instantiates without any external service
(no MongoDB, no AI model), exposes documentation, and handles invalid
routes/errors predictably.
"""

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.main import app


class TestApplication:
    def test_app_is_fastapi_instance(self) -> None:
        assert isinstance(app, FastAPI)

    def test_app_metadata(self) -> None:
        assert app.title
        assert app.description
        assert app.version == "0.1.0"

    def test_app_instantiates_without_external_services(self) -> None:
        with TestClient(app) as client:
            response = client.get("/health")
            assert response.status_code == 200

    def test_metadata_consistent_with_health(self) -> None:
        with TestClient(app) as client:
            response = client.get("/health")
            assert response.json()["version"] == app.version


class TestDocs:
    def test_openapi_schema_available(self) -> None:
        with TestClient(app) as client:
            response = client.get("/openapi.json")
            assert response.status_code == 200
            schema = response.json()
            paths = set(schema["paths"].keys())
            assert "/health" in paths
            assert "/ready" in paths
            assert "/" in paths

    def test_swagger_docs_available(self) -> None:
        with TestClient(app) as client:
            response = client.get("/docs")
            assert response.status_code == 200
            assert "swagger" in response.text.lower()

    def test_redoc_available(self) -> None:
        with TestClient(app) as client:
            response = client.get("/redoc")
            assert response.status_code == 200
            assert "redoc" in response.text.lower()


class TestErrorHandling:
    def test_unknown_route_returns_json_404(self) -> None:
        with TestClient(app) as client:
            response = client.get("/no-such-route")
            assert response.status_code == 404
            assert response.headers["content-type"].startswith("application/json")
            assert "detail" in response.json()

    def test_wrong_method_returns_405(self) -> None:
        with TestClient(app) as client:
            response = client.delete("/health")
            assert response.status_code == 405

    def test_method_not_allowed_is_json(self) -> None:
        with TestClient(app) as client:
            response = client.delete("/health")
            assert response.headers["content-type"].startswith("application/json")


class TestNoExternalDependencies:
    def test_no_mongodb_driver_imported(self) -> None:
        """Phase 4 must not connect to MongoDB (Phase 5)."""
        with pytest.raises(ModuleNotFoundError):
            __import__("pymongo")
        with pytest.raises(ModuleNotFoundError):
            __import__("motor")

    def test_no_cv_framework_imported(self) -> None:
        """Phase 4 must not install or use computer vision frameworks."""
        with pytest.raises(ModuleNotFoundError):
            __import__("cv2")
        with pytest.raises(ModuleNotFoundError):
            __import__("mediapipe")
