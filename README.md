# RDQ_V3

Version 3 du système RDQ - Application full-stack avec React et Java/Quarkus.

## Architecture

- **Frontend**: React (LTS) dans le dossier `frontend/`
- **Backend**: Java 21 + Quarkus dans le dossier `Backend/`
- **Documentation**: Spécifications fonctionnelles (SFD) dans `docs/`
- **Historique**: Actions AI et développement dans `.prompts/`

## Démarrage rapide

### Prérequis
- Node.js (LTS)
- Java 21
- Maven

### Installation et lancement

```bash
# Frontend
cd frontend
npm install
npm start

# Backend (dans un autre terminal)
cd Backend
./mvnw compile quarkus:dev
```

## Documentation

Consultez le fichier `.github/copilot-instructions.md` pour les instructions détaillées destinées aux agents AI.

## Contribution

- Organisation GitHub: **Catamania**
- Branche principale: **main**
- Workflow: Feature branches puis merge vers main

---
*Projet initié le 26 septembre 2025*