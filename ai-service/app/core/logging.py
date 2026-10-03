"""Basic application logging for local development.

Scope (Phase 4): startup, shutdown, and unexpected error visibility.
The log output must never contain raw candidate media, audio, webcam frames,
passwords, tokens, secrets, or other sensitive interview content.
"""

import logging


def configure_logging(level: str) -> None:
    """Configure simple, consistent process logging."""
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
