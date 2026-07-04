"""Provider-key encryption. Keys are Fernet-encrypted at rest, never logged,
never returned — only a masked tail leaves the server."""

from cryptography.fernet import Fernet, InvalidToken

import settings

_fernet = Fernet(settings.fernet_key())


def encrypt_key(plaintext: str) -> str:
    return _fernet.encrypt(plaintext.encode()).decode()


def decrypt_key(ciphertext: str) -> str | None:
    try:
        return _fernet.decrypt(ciphertext.encode()).decode()
    except (InvalidToken, ValueError):
        return None


def mask_key(plaintext: str) -> str:
    if len(plaintext) <= 6:
        return "•" * len(plaintext)
    return f"{'•' * 8}{plaintext[-4:]}"
