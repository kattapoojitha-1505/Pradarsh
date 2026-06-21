from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth
from typing import Optional


bearer_scheme = HTTPBearer(auto_error=True)
optional_bearer_scheme = HTTPBearer(auto_error=False)


def _decode_firebase_token(token: str) -> dict:
    try:
        return firebase_auth.verify_id_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """
    Dependency for protected routes.
    Extracts and verifies the Firebase ID token from the Authorization header.
    Returns {"user_id": <firebase uid>, "email": ..., "payload": <decoded token>}.
    Raises HTTP 401 if token is missing or invalid.
    """
    decoded_token = _decode_firebase_token(credentials.credentials)

    user_id = decoded_token.get("uid")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is missing user identifier.",
        )

    return {
        "user_id": user_id,
        "email": decoded_token.get("email", ""),
        "payload": decoded_token,
    }


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_bearer_scheme),
) -> Optional[dict]:
    """
    Dependency for public routes that optionally accept an authenticated user.
    Returns user dict if token present and valid, else None.
    """
    if credentials is None:
        return None
    try:
        decoded_token = _decode_firebase_token(credentials.credentials)
        user_id = decoded_token.get("uid")
        if not user_id:
            return None
        return {
            "user_id": user_id,
            "email": decoded_token.get("email", ""),
            "payload": decoded_token,
        }
    except HTTPException:
        return None