from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db, Category, Link
from schemas import CategoryCreate, CategoryUpdate, CategoryResponse
from security import get_current_user
import uuid

router = APIRouter(prefix="/api/admin/categories", tags=["admin-categories"])


@router.get("", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Category).order_by(Category.order_pos).all()


@router.post("", response_model=CategoryResponse, status_code=201)
def create_category(body: CategoryCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    count = db.query(Category).count()
    cat = Category(
        id=str(uuid.uuid4()),
        label=body.label,
        order_pos=body.order_pos if body.order_pos is not None else count
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/{cat_id}", response_model=CategoryResponse)
def update_category(cat_id: str, body: CategoryUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(404, "Catégorie introuvable")
    if body.label     is not None: cat.label     = body.label
    if body.order_pos is not None: cat.order_pos = body.order_pos
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/{cat_id}")
def delete_category(cat_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    cat = db.query(Category).filter(Category.id == cat_id).first()
    if not cat:
        raise HTTPException(404, "Catégorie introuvable")
    # Cascade: delete associated links
    db.query(Link).filter(Link.category_id == cat_id).delete()
    db.delete(cat)
    db.commit()
    return {"success": True}
