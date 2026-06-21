from fastapi import HTTPException, status
import jwt as pyjwt
from app.core.config import settings

# Automatically fetches Supabase's public keys to verify modern asymmetric tokens
jwks_url = f"{settings.supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json"
jwks_client = pyjwt.PyJWKClient(jwks_url)

def verify_jwt(token: str) -> dict:
    """
    Verify a Supabase JWT token.
    Uses Supabase's JWKS endpoint for secure ECC (P-256) verification.
    """
    try:
        # Retrieve the correct public key for this specific token
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        # Decode and rigorously verify the signature
        payload = pyjwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256", "RS256", "HS256"],
            options={"verify_aud": False},
        )
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_user_id_from_token(token: str) -> str:
    """Extract user ID (sub) from a verified JWT token."""
    payload = verify_jwt(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing subject claim",
        )
    return user_id