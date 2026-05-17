-- ============================================================
-- SCRIPT SQL - GESTION DES RETOURS
-- Instructions :
--   1. Ouvrez XAMPP → démarrez Apache et MySQL
--   2. Allez sur http://localhost/phpmyadmin
--   3. Cliquez sur l'onglet "SQL"
--   4. Copiez-collez tout ce fichier et cliquez "Exécuter"
-- ============================================================

-- Créer la base de données si elle n'existe pas encore
CREATE DATABASE IF NOT EXISTS gestion_retours
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Sélectionner cette base de données pour la suite
USE gestion_retours;

-- ============================================================
-- TABLE : retour_produit
-- ============================================================
CREATE TABLE IF NOT EXISTS retour_produit (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    produit          VARCHAR(200) NOT NULL,
    client           VARCHAR(150) NOT NULL,
    email_client     VARCHAR(150),
    raison           TEXT         NOT NULL,
    etat_traitement  VARCHAR(50)  NOT NULL DEFAULT 'EN_ATTENTE',
    date             DATE,
    quantite         INT          NOT NULL DEFAULT 1,
    commentaire      TEXT
);

-- ============================================================
-- TABLE : non_conformite
-- ============================================================
CREATE TABLE IF NOT EXISTS non_conformite (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    description          TEXT        NOT NULL,
    gravite              VARCHAR(50) NOT NULL,
    date                 DATE,
    produit              VARCHAR(200) NOT NULL,
    statut               VARCHAR(50)  NOT NULL DEFAULT 'OUVERTE',
    actions_correctives  TEXT,
    retour_id            BIGINT
);

-- ============================================================
-- TABLE : utilisateur
-- ============================================================
CREATE TABLE IF NOT EXISTS utilisateur (
    id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom   VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role  VARCHAR(50)  NOT NULL
);

-- ============================================================
-- TABLE : historique_retour
-- ============================================================
CREATE TABLE IF NOT EXISTS historique_retour (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    retour_id   BIGINT       NOT NULL,
    action      TEXT         NOT NULL,
    employe     VARCHAR(150) NOT NULL,
    date        DATETIME,
    commentaire TEXT
);

-- ============================================================
-- DONNÉES DE TEST
-- (insérées pour tester l'application dès le démarrage)
-- ============================================================

INSERT INTO utilisateur (nom, email, role) VALUES
('Admin Système',  'admin@retours.com',  'ADMIN'),
('Marie Dupont',   'marie@retours.com',  'AGENT_SAV'),
('Jean Martin',    'jean@retours.com',   'AGENT_SAV'),
('Sophie Lambert', 'sophie@retours.com', 'QUALITE');

INSERT INTO retour_produit (produit, client, email_client, raison, etat_traitement, date, quantite) VALUES
('Samsung Galaxy A54',  'Ahmed Ben Ali',   'ahmed@email.com',  'Écran cassé à la réception',          'EN_ATTENTE', CURDATE() - INTERVAL 2 DAY,  1),
('Laptop Dell Inspiron','Fatima Trabelsi', 'fatima@email.com', 'Ne démarre pas',                       'EN_COURS',   CURDATE() - INTERVAL 5 DAY,  1),
('Casque Sony WH-1000', 'Mohamed Sassi',   'med@email.com',    'Son de mauvaise qualité',              'VALIDE',     CURDATE() - INTERVAL 7 DAY,  1),
('Montre Nike Sport',   'Leila Mansouri',  'leila@email.com',  'Bracelet cassé',                       'REMBOURSE',  CURDATE() - INTERVAL 10 DAY, 2),
('Clavier Logitech',    'Karim Bouaziz',   'karim@email.com',  'Plusieurs touches ne fonctionnent pas','REJETE',     CURDATE() - INTERVAL 3 DAY,  1);

INSERT INTO non_conformite (description, gravite, date, produit, statut, retour_id) VALUES
('Écran fissuré malgré emballage intact',        'ELEVEE',   CURDATE() - INTERVAL 2 DAY,  'Samsung Galaxy A54',   'OUVERTE',  1),
('Batterie non conforme aux spécifications',     'CRITIQUE', CURDATE() - INTERVAL 5 DAY,  'Laptop Dell Inspiron', 'EN_COURS', 2),
('Défaut de fabrication sur le joint du casque', 'MOYENNE',  CURDATE() - INTERVAL 7 DAY,  'Casque Sony WH-1000',  'RESOLUE',  3),
('Bracelet en plastique cassé prématurément',    'FAIBLE',   CURDATE() - INTERVAL 10 DAY, 'Montre Nike Sport',    'FERMEE',   4);

INSERT INTO historique_retour (retour_id, action, employe, date) VALUES
(1, 'Retour créé pour le produit : Samsung Galaxy A54',    'Système',        NOW() - INTERVAL 2 DAY),
(2, 'Retour créé pour le produit : Laptop Dell Inspiron',  'Système',        NOW() - INTERVAL 5 DAY),
(2, 'Statut changé : EN_ATTENTE → EN_COURS',               'Marie Dupont',   NOW() - INTERVAL 4 DAY),
(3, 'Retour créé pour le produit : Casque Sony WH-1000',   'Système',        NOW() - INTERVAL 7 DAY),
(3, 'Statut changé : EN_ATTENTE → VALIDE',                 'Sophie Lambert', NOW() - INTERVAL 5 DAY),
(4, 'Statut changé : EN_COURS → REMBOURSE',                'Marie Dupont',   NOW() - INTERVAL 8 DAY),
(5, 'Statut changé : EN_ATTENTE → REJETE',                 'Jean Martin',    NOW() - INTERVAL 2 DAY);

SELECT 'Base de données créée avec succès !' AS message;
