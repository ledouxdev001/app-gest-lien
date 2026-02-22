from fastapi import APIRouter, HTTPException, Depends
from schemas import LoginRequest, TokenResponse
from security import verify_password, create_token, get_current_user, hash_password
from config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Hash admin password once at startup
_admin_hash = hash_password(settings.ADMIN_PASSWORD)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    if body.username != settings.ADMIN_USERNAME:
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    if not verify_password(body.password, _admin_hash):
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    token = create_token({"username": body.username, "role": "admin"})
    return {"token": token, "message": "Connecté avec succès"}


@router.get("/me")
def me(user=Depends(get_current_user)):
    return {"user": user}
