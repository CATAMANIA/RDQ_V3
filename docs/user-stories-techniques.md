# User Stories Techniques - RDQ_V3

## Epic : Infrastructure et Backend

### 🏗️ User Stories - Architecture Backend

**TS-001** : Initialisation du projet Quarkus
- **En tant que** Développeur
- **Je veux** créer la structure de base du backend Quarkus
- **Afin de** démarrer le développement de l'API REST
- **Critères d'acceptation** :
  - [ ] Projet Quarkus initialisé avec Java 21
  - [ ] Configuration Maven avec dépendances de base
  - [ ] Structure de packages organisée (controller, service, repository, entity)
  - [ ] Configuration application.properties (dev/prod)
  - [ ] Premier endpoint de santé (/health)
- **Priorité** : Must Have
- **Points** : 5

**TS-002** : Configuration Base de Données
- **En tant que** Développeur
- **Je veux** configurer la connexion à la base de données
- **Afin de** persister les données de l'application
- **Critères d'acceptation** :
  - [ ] Configuration Hibernate/Panache
  - [ ] Scripts de création des tables (migration Flyway/Liquibase)
  - [ ] Entités JPA selon le modèle de données SFD
  - [ ] Configuration des profils dev/test/prod
  - [ ] Jeu de données de test
- **Priorité** : Must Have
- **Points** : 8

**TS-003** : Authentification et Sécurité JWT
- **En tant que** Développeur
- **Je veux** implémenter l'authentification JWT
- **Afin de** sécuriser les endpoints de l'API
- **Critères d'acceptation** :
  - [ ] Extension Quarkus Security JWT
  - [ ] Endpoints /auth/login et /auth/refresh
  - [ ] Gestion des rôles MANAGER/COLLABORATEUR
  - [ ] Protection des endpoints par annotation @RolesAllowed
  - [ ] Gestion des erreurs 401/403
- **Priorité** : Must Have
- **Points** : 8

### 🔌 User Stories - API REST

**TS-004** : API Gestion des RDQ
- **En tant que** Développeur
- **Je veux** créer les endpoints CRUD pour les RDQ
- **Afin de** permettre la gestion complète des rendez-vous
- **Critères d'acceptation** :
  - [ ] GET /api/rdq (liste avec filtres)
  - [ ] GET /api/rdq/{id} (détail)
  - [ ] POST /api/rdq (création)
  - [ ] PUT /api/rdq/{id} (modification)
  - [ ] DELETE /api/rdq/{id} (suppression logique)
  - [ ] Validation des données d'entrée
  - [ ] Gestion des erreurs HTTP standard
- **Priorité** : Must Have
- **Points** : 13

**TS-005** : API Gestion des Documents
- **En tant que** Développeur
- **Je veux** créer les endpoints pour les documents joints
- **Afin de** permettre l'upload et le téléchargement de fichiers
- **Critères d'acceptation** :
  - [ ] POST /api/rdq/{id}/documents (upload)
  - [ ] GET /api/rdq/{id}/documents (liste)
  - [ ] GET /api/documents/{id}/download (téléchargement)
  - [ ] DELETE /api/documents/{id} (suppression)
  - [ ] Validation des types de fichiers
  - [ ] Limitation de taille des fichiers
  - [ ] Stockage sécurisé (filesystem ou cloud)
- **Priorité** : Must Have
- **Points** : 8

**TS-006** : API Gestion des Bilans
- **En tant que** Développeur
- **Je veux** créer les endpoints pour les bilans
- **Afin de** permettre la saisie et consultation des retours d'expérience
- **Critères d'acceptation** :
  - [ ] POST /api/rdq/{id}/bilan (saisie bilan)
  - [ ] GET /api/rdq/{id}/bilans (consultation)
  - [ ] PUT /api/rdq/{id}/bilans/{bilanId} (modification)
  - [ ] POST /api/rdq/{id}/cloture (clôture RDQ)
  - [ ] Validation des règles métier (2 bilans pour clôturer)
- **Priorité** : Must Have
- **Points** : 8

**TS-007** : API Utilisateurs et Authentification
- **En tant que** Développeur
- **Je veux** créer les endpoints de gestion des utilisateurs
- **Afin de** gérer les managers et collaborateurs
- **Critères d'acceptation** :
  - [ ] GET /api/users/managers (liste managers)
  - [ ] GET /api/users/collaborateurs (liste collaborateurs)
  - [ ] GET /api/users/me (profil utilisateur connecté)
  - [ ] PUT /api/users/me (mise à jour profil)
  - [ ] POST /api/auth/login (authentification)
  - [ ] POST /api/auth/logout (déconnexion)
- **Priorité** : Must Have
- **Points** : 8

### 📊 User Stories - Intégrations

**TS-008** : Intégration Outlook/Exchange
- **En tant que** Développeur
- **Je veux** intégrer l'API Microsoft Graph
- **Afin de** synchroniser les RDQ avec l'agenda Outlook
- **Critères d'acceptation** :
  - [ ] Configuration Microsoft Graph API
  - [ ] Création d'événements calendrier
  - [ ] Invitation des participants
  - [ ] Gestion des erreurs d'intégration
  - [ ] Configuration OAuth2 Microsoft
- **Priorité** : Should Have
- **Points** : 13

**TS-009** : Intégration Email (SMTP)
- **En tant que** Développeur
- **Je veux** configurer l'envoi d'emails
- **Afin de** notifier les utilisateurs des actions importantes
- **Critères d'acceptation** :
  - [ ] Configuration SMTP Quarkus Mailer
  - [ ] Templates d'emails (nouveau RDQ, bilan à saisir)
  - [ ] Service d'envoi asynchrone
  - [ ] Gestion des erreurs d'envoi
  - [ ] Configuration par environnement
- **Priorité** : Should Have
- **Points** : 8

### 🧪 User Stories - Tests

**TS-010** : Tests Unitaires Backend
- **En tant que** Développeur
- **Je veux** créer une suite de tests unitaires complète
- **Afin d'** assurer la qualité et la fiabilité du code
- **Critères d'acceptation** :
  - [ ] Tests unitaires pour tous les services métier
  - [ ] Tests des repositories avec @QuarkusTest
  - [ ] Tests des contrôleurs REST
  - [ ] Mocking des dépendances externes
  - [ ] Couverture de code > 90%
  - [ ] Configuration JaCoCo pour le reporting
- **Priorité** : Must Have
- **Points** : 13

**TS-011** : Tests d'Intégration
- **En tant que** Développeur
- **Je veux** créer des tests d'intégration
- **Afin de** valider les interactions entre composants
- **Critères d'acceptation** :
  - [ ] Tests d'intégration REST avec TestContainers
  - [ ] Tests de la base de données avec profil test
  - [ ] Tests des workflows complets (création RDQ -> bilan -> clôture)
  - [ ] Tests de sécurité et authentification
  - [ ] Tests de performance sur les endpoints critiques
- **Priorité** : Must Have
- **Points** : 13

**TS-012** : Tests End-to-End (E2E)
- **En tant que** Développeur
- **Je veux** créer des tests E2E
- **Afin de** valider l'application complète frontend + backend
- **Critères d'acceptation** :
  - [ ] Framework de test E2E (Playwright/Cypress)
  - [ ] Scénarios utilisateur complets
  - [ ] Tests cross-browser
  - [ ] Tests sur données de référence
  - [ ] Intégration dans la CI/CD
- **Priorité** : Should Have
- **Points** : 13

### 🚀 User Stories - CI/CD et DevOps

**TS-013** : Pipeline CI/CD GitHub Actions
- **En tant que** DevOps/Développeur
- **Je veux** automatiser le build et le déploiement
- **Afin d'** assurer une livraison continue de qualité
- **Critères d'acceptation** :
  - [ ] Workflow GitHub Actions pour les PR
  - [ ] Build automatique frontend + backend
  - [ ] Exécution des tests unitaires et d'intégration
  - [ ] Analyse de code statique (SonarQube/CodeQL)
  - [ ] Déploiement automatique sur l'environnement de dev
- **Priorité** : Must Have
- **Points** : 13

**TS-014** : Containerisation Docker
- **En tant que** DevOps/Développeur
- **Je veux** containeriser l'application
- **Afin de** faciliter le déploiement et la scalabilité
- **Critères d'acceptation** :
  - [ ] Dockerfile pour le backend Quarkus
  - [ ] Dockerfile pour le frontend React
  - [ ] Docker-compose pour l'environnement local
  - [ ] Configuration multi-stage builds
  - [ ] Images optimisées (native Quarkus si possible)
- **Priorité** : Should Have
- **Points** : 8

**TS-015** : Monitoring et Observabilité
- **En tant que** DevOps/Développeur
- **Je veux** implémenter le monitoring de l'application
- **Afin de** surveiller la santé et les performances
- **Critères d'acceptation** :
  - [ ] Métriques Quarkus (Micrometer)
  - [ ] Health checks (/health/ready, /health/live)
  - [ ] Logs structurés (JSON)
  - [ ] Tracing distribué (OpenTelemetry)
  - [ ] Dashboard de monitoring (Grafana/Prometheus)
- **Priorité** : Could Have
- **Points** : 8

### 🔄 User Stories - Migration des données Mock

**TS-016** : Remplacement des données Mock - Authentification
- **En tant que** Développeur Frontend
- **Je veux** remplacer l'authentification mock par les vraies API
- **Afin d'** utiliser le vrai système d'authentification
- **Critères d'acceptation** :
  - [ ] Remplacement de AuthContext mock
  - [ ] Intégration avec /api/auth/login
  - [ ] Gestion des tokens JWT côté client
  - [ ] Redirection selon les rôles utilisateur
  - [ ] Gestion des erreurs d'authentification
- **Priorité** : Must Have
- **Points** : 8

**TS-017** : Remplacement des données Mock - RDQ
- **En tant que** Développeur Frontend
- **Je veux** remplacer les données RDQ mock par les vraies API
- **Afin d'** afficher les vraies données depuis le backend
- **Critères d'acceptation** :
  - [ ] Remplacement du fichier mockData.ts
  - [ ] Services API pour les RDQ (GET, POST, PUT, DELETE)
  - [ ] Gestion des états de chargement
  - [ ] Gestion des erreurs API
  - [ ] Mise à jour des interfaces TypeScript
- **Priorité** : Must Have
- **Points** : 13

**TS-018** : Remplacement des données Mock - Documents
- **En tant que** Développeur Frontend
- **Je veux** intégrer l'upload et téléchargement de documents
- **Afin de** gérer les vraies pièces jointes
- **Critères d'acceptation** :
  - [ ] Service d'upload de fichiers
  - [ ] Composant de gestion des documents
  - [ ] Prévisualisation des documents
  - [ ] Téléchargement sécurisé
  - [ ] Gestion des erreurs d'upload
- **Priorité** : Must Have
- **Points** : 8

**TS-019** : Remplacement des données Mock - Bilans
- **En tant que** Développeur Frontend
- **Je veux** intégrer la vraie gestion des bilans
- **Afin de** sauvegarder les bilans en base de données
- **Critères d'acceptation** :
  - [ ] Formulaires de saisie des bilans
  - [ ] Services API pour les bilans
  - [ ] Affichage des bilans existants
  - [ ] Logique de clôture des RDQ
  - [ ] Notifications visuelles (bilans manquants)
- **Priorité** : Must Have
- **Points** : 8

### 🔧 User Stories - Configuration et Sécurité

**TS-020** : Configuration Multi-Environnements
- **En tant que** DevOps/Développeur
- **Je veux** configurer les différents environnements
- **Afin d'** adapter l'application selon le contexte (dev/test/prod)
- **Critères d'acceptation** :
  - [ ] Profils Quarkus (dev, test, prod)
  - [ ] Variables d'environnement sécurisées
  - [ ] Configuration base de données par environnement
  - [ ] Configuration des intégrations externes
  - [ ] Documentation des configurations
- **Priorité** : Must Have
- **Points** : 5

**TS-021** : Sécurité OWASP
- **En tant que** Développeur
- **Je veux** implémenter les bonnes pratiques de sécurité
- **Afin de** protéger l'application contre les vulnérabilités courantes
- **Critères d'acceptation** :
  - [ ] Protection CSRF
  - [ ] Validation des entrées (XSS, injection SQL)
  - [ ] Headers de sécurité HTTP
  - [ ] Chiffrement des données sensibles
  - [ ] Audit de sécurité automatisé
- **Priorité** : Must Have
- **Points** : 8

---

## Récapitulatif Sprint Planning

### Sprint 1 - Fondations (TS-001 à TS-007)
- **Objectif** : API REST fonctionnelle avec authentification
- **Story Points** : 66 points
- **Durée estimée** : 2-3 semaines

### Sprint 2 - Tests et Qualité (TS-010, TS-011, TS-013, TS-020, TS-021)
- **Objectif** : Couverture de tests et CI/CD
- **Story Points** : 52 points
- **Durée estimée** : 2 semaines

### Sprint 3 - Migration Mock → Real Data (TS-016 à TS-019)
- **Objectif** : Intégration frontend ↔ backend
- **Story Points** : 37 points
- **Durée estimée** : 2 semaines

### Sprint 4 - Intégrations et DevOps (TS-008, TS-009, TS-012, TS-014, TS-015)
- **Objectif** : Intégrations externes et monitoring
- **Story Points** : 50 points
- **Durée estimée** : 2-3 semaines

**Total estimé** : 205 Story Points sur 4 sprints (8-10 semaines)

---
*Créé le 26 septembre 2025 - User Stories Techniques RDQ_V3*