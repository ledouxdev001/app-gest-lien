# 🔗 LinksHub — Python + MySQL

Site de liens personnalisé avec panel d'administration.
**Stack : FastAPI · SQLAlchemy · MySQL · D3.js · Docker**

---

## 🚀 Démarrage en une commande (Docker)

```bash
# 1. Extraire le zip
unzip linkshub-py.zip && cd linkshub-py

# 2. Lancer tout (MySQL + API Python)
docker compose up --build
```

**C'est tout !** Le projet est accessible sur :

| Page | URL |
|------|-----|
| 🌐 Site public | http://localhost:8000 |
| ⚙ Panel admin | http://localhost:8000/admin |
| 📚 API Docs (Swagger) | http://localhost:8000/docs |

**Identifiants par défaut :** `admin` / `admin123`

---

## 🐍 Sans Docker (développement local)

### 1. Prérequis
- Python 3.10+
- MySQL 8.0 en cours d'exécution en local

### 2. Créer la base de données

```sql
-- Dans MySQL :
CREATE DATABASE linkshub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'linkshub'@'localhost' IDENTIFIED BY 'linkshub_pass';
GRANT ALL PRIVILEGES ON linkshub.* TO 'linkshub'@'localhost';
```

### 3. Configurer l'environnement

```bash
cd backend
cp .env .env.local  # optionnel
```

Éditez `.env` :
```env
DB_HOST=localhost      # ← changer depuis 'db' si pas Docker
DB_PORT=3306
DB_USER=linkshub
DB_PASSWORD=linkshub_pass
DB_NAME=linkshub
JWT_SECRET=mon_secret_tres_long
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
PORT=8000
```

### 4. Installer et lancer

```bash
cd backend
pip install -r requirements.txt
python main.py
```

---

## 📁 Structure du projet

```
linkshub-py/
├── docker-compose.yml          → Orchestration Docker
├── init.sql                    → Schéma MySQL initial
├── backend/
│   ├── main.py                 → Point d'entrée FastAPI
│   ├── config.py               → Settings (pydantic-settings)
│   ├── database.py             → SQLAlchemy models + init_db
│   ├── schemas.py              → Schémas Pydantic (validation)
│   ├── security.py             → JWT + bcrypt
│   ├── requirements.txt
│   ├── Dockerfile
│   └── routers/
│       ├── auth.py             → POST /api/auth/login
│       ├── public.py           → GET  /api/site
│       ├── admin_profile.py    → GET/PUT /api/admin/profile
│       ├── admin_categories.py → CRUD /api/admin/categories
│       └── admin_links.py      → CRUD /api/admin/links
└── frontend/
    ├── public/index.html       → Site D3.js (public)
    └── admin/index.html        → Panel d'administration
```

---

## 🔌 API REST — Référence

### Public
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/site` | Profil + catégories + liens actifs |

### Auth
| Méthode | Route | Body | Description |
|---------|-------|------|-------------|
| `POST` | `/api/auth/login` | `{username, password}` | → JWT |
| `GET`  | `/api/auth/me` | — | Vérifie le token |

### Admin *(Authorization: Bearer <token>)*
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` `PUT` | `/api/admin/profile` | Lire / modifier le profil |
| `GET` `POST` | `/api/admin/categories` | Lister / créer |
| `PUT` `DELETE` | `/api/admin/categories/{id}` | Modifier / supprimer |
| `GET` `POST` | `/api/admin/links` | Lister / créer |
| `PUT` `DELETE` | `/api/admin/links/{id}` | Modifier / supprimer |
| `PATCH` | `/api/admin/links/{id}/toggle` | Activer / masquer |

La documentation Swagger interactive est disponible sur `/docs`.

---

## 🔐 Sécurité (production)

Avant de déployer, modifiez dans `.env` ou `docker-compose.yml` :

```env
JWT_SECRET=une_chaine_aleatoire_longue_et_complexe
ADMIN_PASSWORD=un_mot_de_passe_fort
```

---

## 🛠 Panel d'administration

- **Dashboard** — Statistiques en temps réel
- **Profil** — Nom, tagline, emoji avec prévisualisation live
- **Liens** — Créer, modifier, masquer, supprimer + badge featured
- **Catégories** — Organiser par ordre d'affichage
