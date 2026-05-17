# Système de Gestion des Retours — Sujet 6

## Technologies
- **Backend** : Spring Boot 3.2 + Java 17
- **Frontend** : Angular 17
- **Base de données** : MySQL via XAMPP
- **Style** : Bootstrap 5

## Structure du projet
```
gestion-retours/
├── backend/                     ← Spring Boot (Eclipse)
│   └── src/main/java/com/retours/
│       ├── Application.java     ← Point d'entrée
│       ├── config/CorsConfig.java
│       ├── model/               ← Entités (tables MySQL)
│       ├── repository/          ← Accès base de données
│       ├── service/             ← Logique métier
│       └── controller/          ← Endpoints API REST
├── frontend/                    ← Angular
│   └── src/app/
│       ├── models/models.ts     ← Interfaces TypeScript
│       ├── services/services.ts ← Appels HTTP
│       └── components/          ← Pages de l'application
└── database/init.sql            ← Script création MySQL
```

---

## Étape 1 — Créer la base de données (XAMPP)

1. Ouvrir **XAMPP** → cliquer **Start** sur **MySQL**
2. Aller sur **http://localhost/phpmyadmin**
3. Cliquer sur l'onglet **SQL**
4. Copier tout le contenu de **`database/init.sql`** et coller
5. Cliquer **Exécuter**
6. ✅ La base `gestion_retours` est créée avec les tables et données de test

---

## Étape 2 — Lancer le Backend (Eclipse)

1. Ouvrir **Eclipse**
2. `File → Import → Maven → Existing Maven Projects`
3. Sélectionner le dossier **`backend/`**
4. Attendre le téléchargement des dépendances Maven
5. Ouvrir `Application.java` → clic droit → **Run As → Spring Boot App**
6. ✅ Backend disponible sur : **http://localhost:8080**

> Si erreur de connexion MySQL : vérifier `application.properties`
> Par défaut XAMPP : `username=root`, `password=` (vide)

---

## Étape 3 — Lancer le Frontend (Angular)

Ouvrir un terminal dans le dossier `frontend/` :

```bash
# Installer les dépendances (une seule fois)
npm install

# Démarrer le serveur Angular
npm start
```

✅ Application accessible sur : **http://localhost:4200**

---

## APIs disponibles

| URL | Méthode | Description |
|-----|---------|-------------|
| /api/retours | GET | Liste tous les retours |
| /api/retours | POST | Créer un retour |
| /api/retours/{id} | GET | Détail d'un retour |
| /api/retours/{id} | PUT | Modifier un retour |
| /api/retours/{id}/etat | PATCH | Changer l'état |
| /api/retours/{id} | DELETE | Supprimer |
| /api/non-conformites | GET/POST/PUT/DELETE | CRUD non-conformités |
| /api/utilisateurs | GET/POST/PUT/DELETE | CRUD utilisateurs |
| /api/historique/retour/{id} | GET | Historique d'un retour |
