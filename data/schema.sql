-- ─────────────────────────────────────────────────────────
--  LinksHub — Initialisation de la base de données MySQL
-- ─────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS linkshub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE linkshub;

-- Profil du site
CREATE TABLE IF NOT EXISTS profile (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(120) NOT NULL DEFAULT 'Votre Nom',
    tagline VARCHAR(255) NOT NULL DEFAULT 'Tous mes projets & sites web',
    emoji   VARCHAR(10)  NOT NULL DEFAULT '✦'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Catégories
CREATE TABLE IF NOT EXISTS categories (
    id         VARCHAR(64)  NOT NULL PRIMARY KEY,
    label      VARCHAR(120) NOT NULL,
    order_pos  INT          NOT NULL DEFAULT 0,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Liens
CREATE TABLE IF NOT EXISTS links (
    id          VARCHAR(64)  NOT NULL PRIMARY KEY,
    category_id VARCHAR(64)  NOT NULL,
    title       VARCHAR(120) NOT NULL,
    `desc`      VARCHAR(255) NOT NULL DEFAULT '',
    url         TEXT         NOT NULL,
    emoji       VARCHAR(10)  NOT NULL DEFAULT '🔗',
    featured    TINYINT(1)   NOT NULL DEFAULT 0,
    weight      INT          NOT NULL DEFAULT 5,
    order_pos   INT          NOT NULL DEFAULT 0,
    active      TINYINT(1)   NOT NULL DEFAULT 1,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index utiles
CREATE INDEX IF NOT EXISTS idx_links_category ON links(category_id);
CREATE INDEX IF NOT EXISTS idx_links_active   ON links(active);
