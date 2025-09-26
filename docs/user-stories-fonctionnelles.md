# User Stories - RDQ_V3

## Epic : Gestion des RDQ (Rendez-vous Qualifiés)

### 🔐 User Stories - Authentification et Sécurité

**US-001** : Authentification Manager
- **En tant que** Manager
- **Je veux** me connecter à l'application avec mes identifiants
- **Afin de** gérer les RDQ de mon équipe
- **Critères d'acceptation** :
  - [ ] Écran de login sécurisé
  - [ ] Gestion des erreurs d'authentification
  - [ ] Redirection vers le dashboard Manager
  - [ ] Session sécurisée (JWT/OAuth2)
- **Priorité** : Must Have
- **Points** : 5

**US-002** : Authentification Collaborateur
- **En tant que** Collaborateur
- **Je veux** me connecter à l'application avec mes identifiants
- **Afin de** consulter mes RDQ assignés
- **Critères d'acceptation** :
  - [ ] Écran de login sécurisé
  - [ ] Gestion des erreurs d'authentification
  - [ ] Redirection vers le dashboard Collaborateur
  - [ ] Session sécurisée (JWT/OAuth2)
- **Priorité** : Must Have
- **Points** : 5

### 📋 User Stories - Gestion des RDQ (Manager)

**US-003** : Création d'un RDQ
- **En tant que** Manager
- **Je veux** créer un nouveau RDQ
- **Afin de** organiser un entretien commercial pour un collaborateur
- **Critères d'acceptation** :
  - [ ] Formulaire de création avec tous les champs obligatoires
  - [ ] Sélection du collaborateur dans une liste
  - [ ] Sélection du client et du projet
  - [ ] Définition de la date/heure et du lieu (physique/visio)
  - [ ] Ajout d'indications manager
  - [ ] Validation et sauvegarde
- **Priorité** : Must Have
- **Points** : 8

**US-004** : Attribution d'un RDQ
- **En tant que** Manager
- **Je veux** attribuer un RDQ à un collaborateur
- **Afin de** déléguer la préparation et la réalisation de l'entretien
- **Critères d'acceptation** :
  - [ ] Possibilité d'attribuer à tout collaborateur (même hors portefeuille)
  - [ ] Notification automatique au collaborateur
  - [ ] RDQ visible dans la liste du collaborateur
  - [ ] Ajout automatique à l'agenda Outlook si configuré
- **Priorité** : Must Have
- **Points** : 5

**US-005** : Modification d'un RDQ
- **En tant que** Manager
- **Je veux** modifier un RDQ existant
- **Afin de** corriger ou mettre à jour les informations
- **Critères d'acceptation** :
  - [ ] Modification possible uniquement si RDQ non clos
  - [ ] Tous les champs modifiables (sauf historique)
  - [ ] Sauvegarde des modifications
  - [ ] Notification au collaborateur si changements importants
- **Priorité** : Must Have
- **Points** : 5

**US-006** : Gestion des documents joints
- **En tant que** Manager
- **Je veux** joindre des documents à un RDQ (CV, fiche de poste)
- **Afin de** fournir toutes les informations nécessaires au collaborateur
- **Critères d'acceptation** :
  - [ ] Upload de fichiers (PDF, DOCX, JPEG, etc.)
  - [ ] Catégorisation des documents (CV, fiche de poste, autre)
  - [ ] Visualisation/téléchargement des documents
  - [ ] Gestion des erreurs d'upload
- **Priorité** : Must Have
- **Points** : 8

**US-007** : Clôture d'un RDQ
- **En tant que** Manager
- **Je veux** clôturer un RDQ après les bilans
- **Afin de** finaliser le processus et archiver le RDQ
- **Critères d'acceptation** :
  - [ ] Clôture possible uniquement si les 2 bilans sont saisis
  - [ ] RDQ clos devient non modifiable
  - [ ] Passage en historique
  - [ ] Affichage du statut "clos" avec cadenas
- **Priorité** : Must Have
- **Points** : 5

### 👤 User Stories - Gestion des RDQ (Collaborateur)

**US-008** : Consultation des RDQ assignés
- **En tant que** Collaborateur
- **Je veux** voir la liste de mes RDQ
- **Afin de** préparer mes entretiens commerciaux
- **Critères d'acceptation** :
  - [ ] Liste filtrée sur mes RDQ uniquement
  - [ ] Affichage par défaut des RDQ non clos
  - [ ] Possibilité d'afficher l'historique
  - [ ] Tri par date, client, statut
- **Priorité** : Must Have
- **Points** : 5

**US-009** : Consultation détaillée d'un RDQ
- **En tant que** Collaborateur
- **Je veux** consulter tous les détails d'un RDQ
- **Afin de** préparer efficacement mon entretien
- **Critères d'acceptation** :
  - [ ] Affichage de toutes les informations du RDQ
  - [ ] Accès aux documents joints
  - [ ] Informations client et projet
  - [ ] Indications du manager
  - [ ] Boutons d'actions rapides
- **Priorité** : Must Have
- **Points** : 5

**US-010** : Saisie du bilan collaborateur
- **En tant que** Collaborateur
- **Je veux** saisir mon bilan après un RDQ
- **Afin de** partager mon retour d'expérience
- **Critères d'acceptation** :
  - [ ] Formulaire de bilan (note 1-10, commentaire)
  - [ ] Saisie possible uniquement après la date du RDQ
  - [ ] Sauvegarde du bilan
  - [ ] Notification au manager
  - [ ] Indicateur visuel si bilan manquant
- **Priorité** : Must Have
- **Points** : 5

### 🔗 User Stories - Débranchements externes

**US-011** : Débranchement Email
- **En tant qu'** Utilisateur (Manager/Collaborateur)
- **Je veux** envoyer un email directement depuis l'application
- **Afin de** contacter rapidement le client ou le commercial
- **Critères d'acceptation** :
  - [ ] Bouton email sur la fiche RDQ
  - [ ] Ouverture du client email avec destinataires pré-remplis
  - [ ] Gestion des erreurs si pas de client email configuré
- **Priorité** : Must Have
- **Points** : 3

**US-012** : Débranchement Téléphone
- **En tant qu'** Utilisateur (Manager/Collaborateur)
- **Je veux** appeler directement depuis l'application
- **Afin de** contacter rapidement les interlocuteurs
- **Critères d'acceptation** :
  - [ ] Boutons d'appel pour manager, client, commercial
  - [ ] Ouverture de l'application téléphone avec numéro pré-composé
  - [ ] Validation du format des numéros
- **Priorité** : Must Have
- **Points** : 3

**US-013** : Débranchement GPS
- **En tant qu'** Utilisateur (Manager/Collaborateur)
- **Je veux** ouvrir l'adresse du RDQ dans Google Maps
- **Afin de** me rendre facilement au rendez-vous
- **Critères d'acceptation** :
  - [ ] Bouton GPS sur la fiche RDQ
  - [ ] Ouverture de Google Maps avec adresse pré-remplie
  - [ ] Validation de l'adresse avant ouverture
- **Priorité** : Must Have
- **Points** : 3

**US-014** : Débranchement Agenda
- **En tant qu'** Utilisateur (Manager/Collaborateur)
- **Je veux** ajouter le RDQ à mon agenda Outlook
- **Afin de** ne pas oublier le rendez-vous
- **Critères d'acceptation** :
  - [ ] Bouton agenda sur la fiche RDQ
  - [ ] Création d'événement Outlook avec tous les détails
  - [ ] Invitation automatique aux participants
- **Priorité** : Must Have
- **Points** : 5

### 📊 User Stories - Historique et Bilans

**US-015** : Gestion de l'historique
- **En tant qu'** Utilisateur (Manager/Collaborateur)
- **Je veux** consulter l'historique des RDQ
- **Afin de** suivre les entretiens passés
- **Critères d'acceptation** :
  - [ ] Option "Afficher l'historique" dans la liste
  - [ ] RDQ clos visibles avec statut
  - [ ] Filtre par période, collaborateur, client
  - [ ] Consultation des bilans passés
- **Priorité** : Must Have
- **Points** : 5

**US-016** : Saisie du bilan manager
- **En tant que** Manager
- **Je veux** saisir mon bilan sur un RDQ
- **Afin d'** évaluer la performance du collaborateur
- **Critères d'acceptation** :
  - [ ] Formulaire de bilan manager (note 1-10, commentaire)
  - [ ] Consultation du bilan collaborateur
  - [ ] Sauvegarde du bilan
  - [ ] Possibilité de clôture après les 2 bilans
- **Priorité** : Must Have
- **Points** : 5

### 🎯 User Stories - Fonctionnalités avancées

**US-017** : Réouverture d'un RDQ
- **En tant que** Manager
- **Je veux** rouvrir un RDQ clos
- **Afin de** corriger ou compléter des informations
- **Critères d'acceptation** :
  - [ ] Bouton "Rouvrir" sur RDQ clos
  - [ ] Confirmation de l'action
  - [ ] RDQ redevient modifiable
  - [ ] Retour dans la liste principale
- **Priorité** : Should Have
- **Points** : 3

**US-018** : Notifications
- **En tant qu'** Utilisateur
- **Je veux** recevoir des notifications
- **Afin d'** être informé des actions importantes
- **Critères d'acceptation** :
  - [ ] Notification nouveau RDQ assigné
  - [ ] Notification bilan à saisir
  - [ ] Notification RDQ modifié
  - [ ] Préférences de notification
- **Priorité** : Should Have
- **Points** : 8

**US-019** : Export des données
- **En tant que** Manager
- **Je veux** exporter les données RDQ
- **Afin de** créer des rapports externes
- **Critères d'acceptation** :
  - [ ] Export CSV/PDF de la liste des RDQ
  - [ ] Filtres sur l'export
  - [ ] Export des bilans et statistiques
- **Priorité** : Could Have
- **Points** : 5

---
*Créé le 26 septembre 2025 - Basé sur SFD RDQ_V3*