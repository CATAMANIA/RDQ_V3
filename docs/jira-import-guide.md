# Import JIRA - RDQ_V3 User Stories

## Instructions d'import

Ce document contient les User Stories formatées pour l'import dans JIRA. Utilisez les champs suivants lors de la création des issues :

### Configuration JIRA recommandée

**Types d'issues** :
- `Epic` : Gestion des RDQ, Infrastructure et Backend
- `Story` : User Stories fonctionnelles (US-xxx)
- `Task` : User Stories techniques (TS-xxx)

**Champs personnalisés** :
- `Story Points` : Estimation en points
- `Priorité` : Must Have, Should Have, Could Have
- `Critères d'acceptation` : Checklist dans la description

## Epics à créer

### Epic 1 : Gestion des RDQ
- **Résumé** : Gestion complète des Rendez-vous Qualifiés
- **Description** : Epic regroupant toutes les fonctionnalités de gestion des RDQ (CRUD, attribution, bilans, clôture)
- **Components** : Frontend, Backend
- **Labels** : rdq, fonctionnel

### Epic 2 : Infrastructure et Backend
- **Résumé** : Architecture technique et backend Quarkus
- **Description** : Epic regroupant l'infrastructure, l'API REST, les tests et la CI/CD
- **Components** : Backend, DevOps
- **Labels** : backend, technique, infrastructure

## Import CSV Format

Voici le format CSV pour l'import en masse :

```csv
Issue Type,Summary,Priority,Story Points,Epic Link,Components,Labels,Description
Epic,Gestion des RDQ,Must Have,,,"Frontend,Backend","rdq,fonctionnel","Epic regroupant toutes les fonctionnalités de gestion des RDQ"
Epic,Infrastructure et Backend,Must Have,,,"Backend,DevOps","backend,technique","Epic regroupant l'infrastructure, l'API REST, les tests et la CI/CD"
Story,Authentification Manager,Must Have,5,Gestion des RDQ,"Frontend,Security","auth,manager","En tant que Manager, je veux me connecter à l'application..."
Story,Authentification Collaborateur,Must Have,5,Gestion des RDQ,"Frontend,Security","auth,collaborateur","En tant que Collaborateur, je veux me connecter..."
Story,Création d'un RDQ,Must Have,8,Gestion des RDQ,"Frontend,Backend","rdq,creation","En tant que Manager, je veux créer un nouveau RDQ..."
Task,Initialisation du projet Quarkus,Must Have,5,Infrastructure et Backend,Backend,"backend,quarkus","En tant que Développeur, je veux créer la structure de base..."
Task,Configuration Base de Données,Must Have,8,Infrastructure et Backend,"Backend,Database","backend,database","En tant que Développeur, je veux configurer la connexion BDD..."
```

## Scripts d'import automatique

### Option 1 : JIRA REST API
```bash
# Script pour créer les epics et stories via API REST
curl -X POST \
  'https://your-domain.atlassian.net/rest/api/3/issue' \
  -H 'Authorization: Basic <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "fields": {
      "project": {"key": "RDQ"},
      "issuetype": {"name": "Epic"},
      "summary": "Gestion des RDQ",
      "description": "Epic regroupant toutes les fonctionnalités de gestion des RDQ"
    }
  }'
```

### Option 2 : Import CSV via Interface JIRA
1. Aller dans Project Settings > Import
2. Sélectionner "CSV Import"
3. Utiliser le template CSV ci-dessus
4. Mapper les colonnes aux champs JIRA

## Liens entre Issues

Après l'import, configurer les liens suivants :

### Stories → Epic Links
- US-001 à US-019 → Epic "Gestion des RDQ"
- TS-001 à TS-021 → Epic "Infrastructure et Backend"

### Dépendances techniques importantes
- TS-001 (Quarkus) → Bloque → TS-004, TS-005, TS-006
- TS-002 (BDD) → Bloque → TS-004, TS-005, TS-006
- TS-003 (Auth) → Bloque → Tous les endpoints API
- TS-016 à TS-019 (Migration Mock) → Nécessite → API correspondantes

## Jalons et Releases

### Version 1.0 - MVP (Must Have)
- Toutes les stories US-001 à US-016
- Stories techniques TS-001 à TS-007, TS-010, TS-011, TS-013, TS-016 à TS-019

### Version 1.1 - Intégrations (Should Have)
- US-017, US-018
- TS-008, TS-009, TS-014

### Version 1.2 - Monitoring (Could Have)
- US-019
- TS-012, TS-015

---
*Document créé le 26 septembre 2025 pour l'import JIRA RDQ_V3*