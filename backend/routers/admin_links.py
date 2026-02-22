from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db, Link, Category
from schemas import LinkCreate, LinkUpdate, LinkResponse
from security import get_current_user
import uuid

router = APIRouter(prefix="/api/admin/links", tags=["admin-links"])


@router.get("", response_model=List[LinkResponse])
def list_links(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Link).order_by(Link.category_id, Link.order_pos).all()


@router.post("", response_model=LinkResponse, status_code=201)
def create_link(body: LinkCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    # Validate category exists
    if not db.query(Category).filter(Category.id == body.category_id).first():
        raise HTTPException(400, "Catégorie introuvable")
    order = db.query(Link).filter(Link.category_id == body.category_id).count()
    link = Link(
        id=str(uuid.uuid4()),
        category_id=body.category_id,
        title=body.title,
        desc=body.desc or "",
        url=body.url,
        emoji=body.emoji or "🔗",
        featured=body.featured or False,
        weight=body.weight or 5,
        order_pos=order,
        active=body.active if body.active is not None else True,
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


@router.put("/{link_id}", response_model=LinkResponse)
def update_link(link_id: str, body: LinkUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    link = db.query(Link).filter(Link.id == link_id).first()
    if not link:
        raise HTTPException(404, "Lien introuvable")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(link, field, value)
    db.commit()
    db.refresh(link)
    return link


@router.delete("/{link_id}")
def delete_link(link_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    link = db.query(Link).filter(Link.id == link_id).first()
    if not link:
        raise HTTPException(404, "Lien introuvable")
    db.delete(link)
    db.commit()
    return {"success": True}


@router.patch("/{link_id}/toggle", response_model=LinkResponse)
def toggle_link(link_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    link = db.query(Link).filter(Link.id == link_id).first()
    if not link:
        raise HTTPException(404, "Lien introuvable")
    link.active = not link.active
    db.commit()
    db.refresh(link)
    return link
