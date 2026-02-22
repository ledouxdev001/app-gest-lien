from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, Profile, Category, Link
from schemas import PublicSiteResponse

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/site", response_model=PublicSiteResponse)
def get_site(db: Session = Depends(get_db)):
    profile    = db.query(Profile).first()
    categories = db.query(Category).order_by(Category.order_pos).all()
    links      = db.query(Link).filter(Link.active == True).order_by(
                     Link.category_id, Link.order_pos).all()
    return {"profile": profile, "categories": categories, "links": links}
