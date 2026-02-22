from pydantic import BaseModel, HttpUrl, field_validator
from typing import Optional, List
from datetime import datetime


# ─── Auth ──────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    token: str
    message: str


# ─── Profile ───────────────────────────────────────────────────
class ProfileBase(BaseModel):
    name:    Optional[str] = None
    tagline: Optional[str] = None
    emoji:   Optional[str] = None

class ProfileResponse(BaseModel):
    id:      int
    name:    str
    tagline: str
    emoji:   str
    class Config: from_attributes = True


# ─── Category ──────────────────────────────────────────────────
class CategoryCreate(BaseModel):
    label:     str
    order_pos: Optional[int] = 0

class CategoryUpdate(BaseModel):
    label:     Optional[str] = None
    order_pos: Optional[int] = None

class CategoryResponse(BaseModel):
    id:        str
    label:     str
    order_pos: int
    class Config: from_attributes = True


# ─── Link ──────────────────────────────────────────────────────
class LinkCreate(BaseModel):
    category_id: str
    title:       str
    desc:        Optional[str] = ""
    url:         str
    emoji:       Optional[str] = "🔗"
    featured:    Optional[bool] = False
    weight:      Optional[int]  = 5
    active:      Optional[bool] = True

class LinkUpdate(BaseModel):
    category_id: Optional[str]  = None
    title:       Optional[str]  = None
    desc:        Optional[str]  = None
    url:         Optional[str]  = None
    emoji:       Optional[str]  = None
    featured:    Optional[bool] = None
    weight:      Optional[int]  = None
    active:      Optional[bool] = None
    order_pos:   Optional[int]  = None

class LinkResponse(BaseModel):
    id:          str
    category_id: str
    title:       str
    desc:        str
    url:         str
    emoji:       str
    featured:    bool
    weight:      int
    order_pos:   int
    active:      bool
    class Config: from_attributes = True


# ─── Public site ───────────────────────────────────────────────
class PublicSiteResponse(BaseModel):
    profile:    ProfileResponse
    categories: List[CategoryResponse]
    links:      List[LinkResponse]
