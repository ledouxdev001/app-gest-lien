import os
from sqlalchemy import (
    create_engine, Column, Integer, String,
    Boolean, Text, DateTime, func
)
from sqlalchemy.orm import declarative_base, sessionmaker
from config import settings
import time

DATABASE_URL = (
    f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASSWORD}"
    f"@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
    f"?charset=utf8mb4"
)

# Retry loop – MySQL may take a few seconds to start
for attempt in range(10):
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        engine.connect()
        break
    except Exception as e:
        if attempt == 9:
            raise
        print(f"[DB] Waiting for MySQL... ({attempt+1}/10)")
        time.sleep(3)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ─── Models ───────────────────────────────────────────────────
class Profile(Base):
    __tablename__ = "profile"
    id      = Column(Integer, primary_key=True, index=True)
    name    = Column(String(120), default="Votre Nom")
    tagline = Column(String(255), default="Tous mes projets & sites web")
    emoji   = Column(String(10),  default="✦")


class Category(Base):
    __tablename__ = "categories"
    id         = Column(String(64),  primary_key=True, index=True)
    label      = Column(String(120), nullable=False)
    order_pos  = Column(Integer,     default=0)
    created_at = Column(DateTime, server_default=func.now())


class Link(Base):
    __tablename__ = "links"
    id          = Column(String(64),  primary_key=True, index=True)
    category_id = Column(String(64),  nullable=False, index=True)
    title       = Column(String(120), nullable=False)
    desc        = Column(String(255), default="")
    url         = Column(Text,        nullable=False)
    emoji       = Column(String(10),  default="🔗")
    featured    = Column(Boolean,     default=False)
    weight      = Column(Integer,     default=5)
    order_pos   = Column(Integer,     default=0)
    active      = Column(Boolean,     default=True)
    created_at  = Column(DateTime, server_default=func.now())
    updated_at  = Column(DateTime, server_default=func.now(), onupdate=func.now())


# ─── Dependency ───────────────────────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create tables and seed initial data."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed profile if empty
        if not db.query(Profile).first():
            db.add(Profile(name="Votre Nom", tagline="Tous mes projets & sites web", emoji="✦"))

        # Seed categories
        if not db.query(Category).first():
            cats = [
                Category(id="cat-1", label="Principal", order_pos=0),
                Category(id="cat-2", label="Projets",   order_pos=1),
                Category(id="cat-3", label="Réseaux",   order_pos=2),
            ]
            db.add_all(cats)

        # Seed links
        if not db.query(Link).first():
            seed_links = [
                Link(id="lnk-1", category_id="cat-1", title="Site Principal",
                     desc="votre-site.com", url="https://votre-site.com",
                     emoji="🌐", featured=True,  weight=40),
                Link(id="lnk-2", category_id="cat-1", title="Portfolio",
                     desc="Mes créations & projets", url="https://portfolio.com",
                     emoji="🎨", featured=False, weight=30, order_pos=1),
                Link(id="lnk-3", category_id="cat-2", title="Projet 1",
                     desc="Application web", url="https://projet1.com",
                     emoji="🚀", featured=False, weight=15),
                Link(id="lnk-4", category_id="cat-2", title="Projet 2",
                     desc="Outil de productivité", url="https://projet2.com",
                     emoji="⚡", featured=False, weight=10, order_pos=1),
                Link(id="lnk-5", category_id="cat-3", title="LinkedIn",
                     desc="Profil professionnel", url="https://linkedin.com",
                     emoji="💼", featured=False, weight=3),
                Link(id="lnk-6", category_id="cat-3", title="GitHub",
                     desc="Code & repositories", url="https://github.com",
                     emoji="🐙", featured=False, weight=2, order_pos=1),
            ]
            db.add_all(seed_links)

        db.commit()
        print("[DB] Tables créées et données initiales insérées ✓")
    except Exception as e:
        db.rollback()
        print(f"[DB] Erreur seed: {e}")
    finally:
        db.close()
