from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db, Profile
from schemas import ProfileBase, ProfileResponse
from security import get_current_user

router = APIRouter(prefix="/api/admin/profile", tags=["admin-profile"])


@router.get("", response_model=ProfileResponse)
def get_profile(db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = db.query(Profile).first()
    if not p:
        raise HTTPException(404, "Profil introuvable")
    return p


@router.put("", response_model=ProfileResponse)
def update_profile(body: ProfileBase, db: Session = Depends(get_db), _=Depends(get_current_user)):
    p = db.query(Profile).first()
    if not p:
        p = Profile()
        db.add(p)
    if body.name    is not None: p.name    = body.name
    if body.tagline is not None: p.tagline = body.tagline
    if body.emoji   is not None: p.emoji   = body.emoji
    db.commit()
    db.refresh(p)
    return p
