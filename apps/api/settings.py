"""Runtime configuration — everything from env, everything with a keyless default."""

import os
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = Path(os.getenv("EXOBOD_DATA_DIR", REPO_ROOT / "data"))
DATA_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv(
    "DATABASE_URL", f"sqlite+aiosqlite:///{DATA_DIR / 'exobod.db'}"
)

# Body link for console sessions: "local" runs ReflexCore in-process
# (the default — zero infra); "zmq" targets a reflex_sim service.
LINK_KIND = os.getenv("LINK_KIND", "local")
REFLEX_ENDPOINT = os.getenv("REFLEX_ENDPOINT", "tcp://127.0.0.1:5555")

# Clerk (optional). Without these the API runs in dev-auth mode:
# a deterministic local user, so the whole console works keyless.
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL", "")
CLERK_ISSUER = os.getenv("CLERK_ISSUER", "")
DEV_AUTH = os.getenv("DEV_AUTH", "" if CLERK_JWKS_URL else "1") == "1"

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
STRIPE_PREORDER_PRICE_ID = os.getenv("STRIPE_PREORDER_PRICE_ID", "")
PREORDER_AMOUNT_USD = int(os.getenv("PREORDER_AMOUNT_USD", "199"))

CORS_ORIGINS = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    if o.strip()
]

WEB_ORIGIN = os.getenv("WEB_ORIGIN", "http://localhost:3000")

# Cap for anonymous demo sessions so the public landing demo
# can't be used to exhaust the API host.
MAX_ANON_SESSIONS = int(os.getenv("MAX_ANON_SESSIONS", "200"))
SESSION_IDLE_TTL_S = int(os.getenv("SESSION_IDLE_TTL_S", "900"))


def fernet_key() -> bytes:
    """Encryption key for BYOK provider keys. From env in production;
    generated once and persisted under DATA_DIR for local dev."""
    env = os.getenv("FERNET_KEY")
    if env:
        return env.encode()
    keyfile = DATA_DIR / ".fernet_key"
    if keyfile.exists():
        return keyfile.read_bytes().strip()
    from cryptography.fernet import Fernet

    key = Fernet.generate_key()
    keyfile.write_bytes(key)
    keyfile.chmod(0o600)
    return key
