from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
import uvicorn
import os

from config import settings
from database import init_db
from routers import auth, public, admin_profile, admin_categories, admin_links

# ─── App ──────────────────────────────────────────────────────
app = FastAPI(
    title="LinksHub API",
    description="API REST pour le site de liens personnalisé",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(public.router)
app.include_router(admin_profile.router)
app.include_router(admin_categories.router)
app.include_router(admin_links.router)

# ─── Static files (build React/Vite) ──────────────────────────
# Le build Vite génère tout dans frontend/dist/
DIST_DIR = os.path.join(os.path.dirname(__file__), "..", "app", "dist")

if os.path.isdir(DIST_DIR):
    # Servir les assets statiques (JS, CSS, images…)
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

    # ── SPA catch-all : toutes les routes non-API → index.html ─
    # Cela permet à React Router de gérer / et /admin/*
    @app.exception_handler(StarletteHTTPException)
    async def spa_handler(request, exc):
        index = os.path.join(DIST_DIR, "index.html")
        if exc.status_code == 404 and os.path.isfile(index):
            return FileResponse(index)
        raise exc

    @app.get("/", include_in_schema=False)
    @app.get("/admin", include_in_schema=False)
    @app.get("/admin/{rest_of_path:path}", include_in_schema=False)
    def serve_spa(rest_of_path: str = ""):
        return FileResponse(os.path.join(DIST_DIR, "index.html"))

else:
    print("⚠️  Dossier app/dist introuvable — lance 'npm run build' dans frontend/")

# ─── Startup ──────────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    init_db()
    print(f"\n🚀  LinksHub Python démarré !")
    print(f"🌐  Site public : http://localhost:{settings.PORT}")
    print(f"⚙   Admin panel : http://localhost:{settings.PORT}/admin")
    print(f"📚  API Docs    : http://localhost:{settings.PORT}/docs")
    print(f"👤  Login : {settings.ADMIN_USERNAME} / {settings.ADMIN_PASSWORD}\n")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)