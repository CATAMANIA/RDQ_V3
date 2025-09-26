import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'fr' | 'en' | 'de' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Traductions
const translations = {
  fr: {
    // App
    'app.title': 'Application RDQ',
    'app.roleAdmin': 'Administrateur',
    'app.roleManager': 'Manager',
    'app.roleCollaborator': 'Collaborateur',
    
    // Header
    'header.logout': 'Se déconnecter',
    'header.profile': 'Profil',
    'header.settings': 'Paramètres',
    
    // Login
    'login.title': 'Connexion à l\'Application RDQ',
    'login.subtitle': 'Connectez-vous pour accéder à votre espace de travail',
    'login.email': 'Adresse email',
    'login.password': 'Mot de passe',
    'login.connect': 'Se connecter',
    'login.connecting': 'Connexion...',
    'login.invalidCredentials': 'Identifiants invalides',
    'login.emailPlaceholder': 'Saisissez votre email...',
    'login.passwordPlaceholder': 'Saisissez votre mot de passe...',
    
    // Dashboard - Manager
    'manager.title': 'Tableau de Bord Manager',
    'manager.overview': 'Vue d\'ensemble',
    'manager.rdqManagement': 'Gestion des RDQ',
    'manager.stats.totalRdq': 'Total RDQ',
    'manager.stats.pendingRdq': 'En attente',
    'manager.stats.completedRdq': 'Terminés',
    'manager.stats.activeCollaborators': 'Collaborateurs actifs',
    'manager.createRdq': 'Créer un RDQ',
    'manager.recentRdq': 'RDQ Récents',
    'manager.viewAll': 'Voir tout',
    'manager.quickStats': 'Statistiques Rapides',
    'manager.searchPlaceholder': 'Rechercher par titre, client ou collaborateur...',
    'manager.rdqList': 'Liste des RDQ',
    
    // Dashboard - Collaborator
    'collaborator.title': 'Tableau de Bord Collaborateur',
    'collaborator.myRdq': 'Mes RDQ',
    'collaborator.stats.assigned': 'Assignés',
    'collaborator.stats.completed': 'Complétés',
    'collaborator.stats.pending': 'En attente',
    'collaborator.upcomingRdq': 'RDQ à venir',
    'collaborator.completedRdq': 'RDQ terminés',
    
    // RDQ
    'rdq.title': 'Rendez-vous Qualifié',
    'rdq.create': 'Créer un RDQ',
    'rdq.edit': 'Modifier le RDQ',
    'rdq.details': 'Détails du RDQ',
    'rdq.delete': 'Supprimer le RDQ',
    'rdq.assign': 'Assigner',
    'rdq.status.pending': 'En attente',
    'rdq.status.inProgress': 'En cours',
    'rdq.status.completed': 'Terminé',
    'rdq.status.cancelled': 'Annulé',
    'rdq.clientName': 'Nom du client',
    'rdq.project': 'Projet',
    'rdq.date': 'Date',
    'rdq.time': 'Heure',
    'rdq.location': 'Lieu',
    'rdq.description': 'Description',
    'rdq.collaborator': 'Collaborateur',
    'rdq.attachments': 'Pièces jointes',
    'rdq.priority': 'Priorité',
    'rdq.priority.low': 'Faible',
    'rdq.priority.medium': 'Moyenne',
    'rdq.priority.high': 'Élevée',
    'rdq.priority.urgent': 'Urgent',
    
    // Forms
    'form.save': 'Enregistrer',
    'form.cancel': 'Annuler',
    'form.required': 'Champ obligatoire',
    'form.optional': 'Optionnel',
    'form.choose': 'Choisir...',
    'form.selectFile': 'Sélectionner un fichier',
    'form.noFileSelected': 'Aucun fichier sélectionné',
    
    // Clients
    'client.name': 'Nom du client',
    'client.company': 'Entreprise',
    'client.contact': 'Contact',
    'client.add': 'Ajouter un client',
    'client.edit': 'Modifier le client',
    'client.delete': 'Supprimer le client',
    'client.details': 'Détails du client',
    
    // Users
    'user.add': 'Ajouter un utilisateur',
    'user.edit': 'Modifier l\'utilisateur',
    'user.delete': 'Supprimer l\'utilisateur',
    'user.role': 'Rôle',
    'user.status': 'Statut',
    'user.active': 'Actif',
    'user.inactive': 'Inactif',
    
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.rdq': 'RDQ',
    'nav.clients': 'Clients',
    'nav.users': 'Utilisateurs',
    'nav.reports': 'Rapports',
    'nav.settings': 'Paramètres',
    
    // Actions
    'action.view': 'Voir',
    'action.edit': 'Modifier',
    'action.delete': 'Supprimer',
    'action.assign': 'Assigner',
    'action.complete': 'Terminer',
    'action.cancel': 'Annuler',
    'action.export': 'Exporter',
    'action.import': 'Importer',
    'action.duplicate': 'Dupliquer',
    
    // Filters
    'filter.all': 'Tous',
    'filter.active': 'Actif',
    'filter.completed': 'Terminé',
    'filter.pending': 'En attente',
    'filter.byDate': 'Par date',
    'filter.byStatus': 'Par statut',
    'filter.byCollaborator': 'Par collaborateur',
    
    // Privacy Manager
    'privacy.title': 'Gestion des Données Personnelles (RGPD)',
    'privacy.description': 'Consultez et gérez les données personnelles des utilisateurs en conformité avec le RGPD',
    'privacy.users': 'Utilisateurs',
    'privacy.rdqCreated': 'RDQ créés',
    'privacy.documents': 'Documents',
    'privacy.totalVolume': 'Volume total',
    'privacy.registry': 'Registre des Données Personnelles',
    'privacy.registryDescription': 'Visualisez et gérez les données stockées pour chaque utilisateur',
    'privacy.search': 'Rechercher par nom ou email...',
    'privacy.details': 'Détails',
    'privacy.purge': 'Purger',
    'privacy.purgeTitle': 'Purge des Données Personnelles',
    'privacy.purgeWarning': 'Vous êtes sur le point de supprimer définitivement toutes les données personnelles de :',
    'privacy.purgeIncludes': 'Cette action inclut :',
    'privacy.rdqAndHistory': 'RDQ et historiques associés',
    'privacy.attachedDocuments': 'documents joints',
    'privacy.profileData': 'Toutes les données de profil',
    'privacy.connectionHistory': 'Historique des connexions',
    'privacy.irreversible': 'Cette action est irréversible !',
    'privacy.confirmText': 'Pour confirmer la suppression, tapez exactement :',
    'privacy.typeConfirmation': 'Tapez la confirmation...',
    'privacy.finalConfirmation': 'Dernière confirmation',
    'privacy.confirmDelete': 'Confirmez-vous la suppression définitive de toutes les données de',
    'privacy.actionLogged': 'Cette action sera journalisée et irréversible.',
    'privacy.cancel': 'Annuler',
    'privacy.continue': 'Continuer',
    'privacy.validate': 'Valider',
    'privacy.deleteDefinitely': 'Supprimer Définitivement',
    'privacy.deleting': 'Suppression...',
    'privacy.detailsTitle': 'Détail des Données Personnelles',
    'privacy.detailsDescription': 'Inventaire complet des données stockées pour cet utilisateur',
    'privacy.totalVolumeBadge': 'Volume total :',
    'privacy.storedDataCategories': 'Catégories de Données Stockées',
    'privacy.profileDataCategory': 'Données de Profil',
    'privacy.communicationsCategory': 'Communications',
    'privacy.documentsCategory': 'Documents',
    'privacy.historyCategory': 'Historique d\'Activité',
    'privacy.geolocationCategory': 'Données de Géolocalisation',
    'privacy.profileDataDesc': 'Nom, prénom, email, téléphone, adresse',
    'privacy.communicationsDesc': 'Emails envoyés et reçus',
    'privacy.documentsDesc': 'fichiers joints',
    'privacy.historyDesc': 'RDQ et interactions',
    'privacy.geolocationDesc': 'Adresses et coordonnées GPS',
    'privacy.metadata': 'Métadonnées',
    'privacy.creationDate': 'Date de création',
    'privacy.lastConnection': 'Dernière connexion',
    'privacy.rdqCreatedCount': 'RDQ créés',
    'privacy.attachedDocsCount': 'Documents joints',
    'privacy.rgpdCompliance': 'Conformité RGPD',
    'privacy.rgpdNote': 'L\'utilisateur a le droit de demander l\'accès, la rectification ou la suppression de ses données personnelles. Toute action de purge sera journalisée conformément aux obligations légales.',
    
    // Admin Dashboard
    'admin.title': 'Tableau de Bord Administrateur',
    'admin.users': 'Gestion des Utilisateurs',
    'admin.clients': 'Gestion des Clients',
    'admin.personalData': 'Données Personnelles',
    'admin.stats.partners': 'Entreprises partenaires',
    'admin.stats.activeManagers': 'Gérant des RDQ',
    'admin.stats.collaborators': 'Exécutant les entretiens',
    
    // Common
    'common.email': 'Email',
    'common.phone': 'Téléphone',
    'common.address': 'Adresse',
    'common.name': 'Nom',
    'common.firstName': 'Prénom',
    'common.close': 'Fermer',
    'common.save': 'Enregistrer',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.add': 'Ajouter',
    'common.search': 'Rechercher',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.warning': 'Attention',
    'common.info': 'Information',
    'common.all': 'Tous',
    
    // Languages
    'language.french': 'Français',
    'language.english': 'English',
    'language.german': 'Deutsch',
    'language.spanish': 'Español',
    
    // Dates
    'date.today': 'Aujourd\'hui',
    'date.yesterday': 'Hier',
    'date.tomorrow': 'Demain',
    'date.thisWeek': 'Cette semaine',
    'date.nextWeek': 'La semaine prochaine',
    'date.thisMonth': 'Ce mois-ci',
    'date.nextMonth': 'Le mois prochain',
    
    // Time
    'time.morning': 'Matin',
    'time.afternoon': 'Après-midi',
    'time.evening': 'Soir',
    'time.night': 'Nuit',
    
    // Notifications
    'notification.success': 'Succès',
    'notification.error': 'Erreur',
    'notification.warning': 'Attention',
    'notification.info': 'Information',
    'notification.rdqCreated': 'RDQ créé avec succès',
    'notification.rdqUpdated': 'RDQ mis à jour avec succès',
    'notification.rdqDeleted': 'RDQ supprimé avec succès',
    'notification.userCreated': 'Utilisateur créé avec succès',
    'notification.userUpdated': 'Utilisateur mis à jour avec succès',
    'notification.userDeleted': 'Utilisateur supprimé avec succès',
    
    // Admin
    'admin.title': 'Administration',
    'admin.stats.partners': 'Entreprises partenaires',
    
    // Pagination
    'pagination.previous': 'Précédent',
    'pagination.next': 'Suivant',
    'pagination.page': 'Page',
    'pagination.of': 'sur',
    'pagination.showing': 'Affichage de',
    'pagination.to': 'à',
    'pagination.results': 'résultats',
    
    // Calendar
    'calendar.title': 'Calendrier des RDQ',
    'calendar.today': 'Aujourd\'hui',
    'calendar.upcomingRdq': 'RDQ à venir',
    'calendar.pastRdq': 'RDQ passés',
    'calendar.multipleRdq': 'Plusieurs RDQ',
    'calendar.noRdqForDay': 'Aucun RDQ prévu ce jour',
    
    // RDQ Status
    'rdq.status.planifie': 'Planifié',
    'rdq.status.en_cours': 'En cours',
    'rdq.status.clos': 'Clos',
    'rdq.status.annule': 'Annulé',
  },
  en: {
    // App
    'app.title': 'RDQ Application',
    'app.roleAdmin': 'Administrator',
    'app.roleManager': 'Manager',
    'app.roleCollaborator': 'Collaborator',
    // Header
    'header.logout': 'Logout',
    'header.profile': 'Profile',
    'header.settings': 'Settings',
    
    // Login
    'login.title': 'RDQ Application Login',
    'login.subtitle': 'Sign in to access your workspace',
    'login.email': 'Email address',
    'login.password': 'Password',
    'login.connect': 'Sign in',
    'login.connecting': 'Signing in...',
    'login.invalidCredentials': 'Invalid credentials',
    'login.emailPlaceholder': 'Enter your email...',
    'login.passwordPlaceholder': 'Enter your password...',
    
    // Dashboard - Manager
    'manager.title': 'Manager Dashboard',
    'manager.overview': 'Overview',
    'manager.rdqManagement': 'RDQ Management',
    'manager.stats.totalRdq': 'Total RDQ',
    'manager.stats.pendingRdq': 'Pending',
    'manager.stats.completedRdq': 'Completed',
    'manager.stats.activeCollaborators': 'Active collaborators',
    'manager.createRdq': 'Create RDQ',
    'manager.recentRdq': 'Recent RDQ',
    'manager.viewAll': 'View all',
    'manager.quickStats': 'Quick Stats',
    'manager.searchPlaceholder': 'Search by title, client or collaborator...',
    'manager.rdqList': 'RDQ List',
    
    // Dashboard - Collaborator
    'collaborator.title': 'Collaborator Dashboard',
    'collaborator.myRdq': 'My RDQ',
    'collaborator.stats.assigned': 'Assigned',
    'collaborator.stats.completed': 'Completed',
    'collaborator.stats.pending': 'Pending',
    'collaborator.upcomingRdq': 'Upcoming RDQ',
    'collaborator.completedRdq': 'Completed RDQ',
    
    // RDQ
    'rdq.title': 'Qualified Appointment',
    'rdq.create': 'Create RDQ',
    'rdq.edit': 'Edit RDQ',
    'rdq.details': 'RDQ Details',
    'rdq.delete': 'Delete RDQ',
    'rdq.assign': 'Assign',
    'rdq.status.pending': 'Pending',
    'rdq.status.inProgress': 'In Progress',
    'rdq.status.completed': 'Completed',
    'rdq.status.cancelled': 'Cancelled',
    'rdq.clientName': 'Client name',
    'rdq.project': 'Project',
    'rdq.date': 'Date',
    'rdq.time': 'Time',
    'rdq.location': 'Location',
    'rdq.description': 'Description',
    'rdq.collaborator': 'Collaborator',
    'rdq.attachments': 'Attachments',
    'rdq.priority': 'Priority',
    'rdq.priority.low': 'Low',
    'rdq.priority.medium': 'Medium',
    'rdq.priority.high': 'High',
    'rdq.priority.urgent': 'Urgent',
    
    // Forms
    'form.save': 'Save',
    'form.cancel': 'Cancel',
    'form.required': 'Required field',
    'form.optional': 'Optional',
    'form.choose': 'Choose...',
    'form.selectFile': 'Select file',
    'form.noFileSelected': 'No file selected',
    
    // Clients
    'client.name': 'Client name',
    'client.company': 'Company',
    'client.contact': 'Contact',
    'client.add': 'Add client',
    'client.edit': 'Edit client',
    'client.delete': 'Delete client',
    'client.details': 'Client details',
    
    // Users
    'user.add': 'Add user',
    'user.edit': 'Edit user',
    'user.delete': 'Delete user',
    'user.role': 'Role',
    'user.status': 'Status',
    'user.active': 'Active',
    'user.inactive': 'Inactive',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.rdq': 'RDQ',
    'nav.clients': 'Clients',
    'nav.users': 'Users',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    
    // Actions
    'action.view': 'View',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.assign': 'Assign',
    'action.complete': 'Complete',
    'action.cancel': 'Cancel',
    'action.export': 'Export',
    'action.import': 'Import',
    'action.duplicate': 'Duplicate',
    
    // Filters
    'filter.all': 'All',
    'filter.active': 'Active',
    'filter.completed': 'Completed',
    'filter.pending': 'Pending',
    'filter.byDate': 'By date',
    'filter.byStatus': 'By status',
    'filter.byCollaborator': 'By collaborator',
    
    // Privacy Manager
    'privacy.title': 'Personal Data Management (GDPR)',
    'privacy.description': 'View and manage users\' personal data in compliance with GDPR',
    'privacy.users': 'Users',
    'privacy.rdqCreated': 'RDQ created',
    'privacy.documents': 'Documents',
    'privacy.totalVolume': 'Total volume',
    'privacy.registry': 'Personal Data Registry',
    'privacy.registryDescription': 'View and manage stored data for each user',
    'privacy.search': 'Search by name or email...',
    'privacy.details': 'Details',
    'privacy.purge': 'Purge',
    'privacy.purgeTitle': 'Personal Data Purge',
    'privacy.purgeWarning': 'You are about to permanently delete all personal data of:',
    'privacy.purgeIncludes': 'This action includes:',
    'privacy.rdqAndHistory': 'RDQ and associated history',
    'privacy.attachedDocuments': 'attached documents',
    'privacy.profileData': 'All profile data',
    'privacy.connectionHistory': 'Connection history',
    'privacy.irreversible': 'This action is irreversible!',
    'privacy.confirmText': 'To confirm deletion, type exactly:',
    'privacy.typeConfirmation': 'Type confirmation...',
    'privacy.finalConfirmation': 'Final confirmation',
    'privacy.confirmDelete': 'Do you confirm the permanent deletion of all data for',
    'privacy.actionLogged': 'This action will be logged and irreversible.',
    'privacy.cancel': 'Cancel',
    'privacy.continue': 'Continue',
    'privacy.validate': 'Validate',
    'privacy.deleteDefinitely': 'Delete Permanently',
    'privacy.deleting': 'Deleting...',
    'privacy.detailsTitle': 'Personal Data Details',
    'privacy.detailsDescription': 'Complete inventory of data stored for this user',
    'privacy.totalVolumeBadge': 'Total volume:',
    'privacy.storedDataCategories': 'Stored Data Categories',
    'privacy.profileDataCategory': 'Profile Data',
    'privacy.communicationsCategory': 'Communications',
    'privacy.documentsCategory': 'Documents',
    'privacy.historyCategory': 'Activity History',
    'privacy.geolocationCategory': 'Geolocation Data',
    'privacy.profileDataDesc': 'Name, first name, email, phone, address',
    'privacy.communicationsDesc': 'Emails sent and received',
    'privacy.documentsDesc': 'attached files',
    'privacy.historyDesc': 'RDQ and interactions',
    'privacy.geolocationDesc': 'Addresses and GPS coordinates',
    'privacy.metadata': 'Metadata',
    'privacy.creationDate': 'Creation date',
    'privacy.lastConnection': 'Last connection',
    'privacy.rdqCreatedCount': 'RDQ created',
    'privacy.attachedDocsCount': 'Attached documents',
    'privacy.rgpdCompliance': 'GDPR Compliance',
    'privacy.rgpdNote': 'The user has the right to request access, rectification or deletion of their personal data. Any purge action will be logged in accordance with legal obligations.',
    
    // Admin Dashboard
    'admin.title': 'Administrator Dashboard',
    'admin.users': 'User Management',
    'admin.clients': 'Client Management',
    'admin.personalData': 'Personal Data',
    'admin.stats.partners': 'Partner companies',
    'admin.stats.activeManagers': 'Managing RDQ',
    'admin.stats.collaborators': 'Conducting interviews',
    
    // Common
    'common.email': 'Email',
    'common.phone': 'Phone',
    'common.address': 'Address',
    'common.name': 'Name',
    'common.firstName': 'First Name',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Information',
    'common.all': 'All',
    
    // Languages
    'language.french': 'Français',
    'language.english': 'English',
    'language.german': 'Deutsch',
    'language.spanish': 'Español',
    
    // Dates
    'date.today': 'Today',
    'date.yesterday': 'Yesterday',
    'date.tomorrow': 'Tomorrow',
    'date.thisWeek': 'This week',
    'date.nextWeek': 'Next week',
    'date.thisMonth': 'This month',
    'date.nextMonth': 'Next month',
    
    // Time
    'time.morning': 'Morning',
    'time.afternoon': 'Afternoon',
    'time.evening': 'Evening',
    'time.night': 'Night',
    
    // Notifications
    'notification.success': 'Success',
    'notification.error': 'Error',
    'notification.warning': 'Warning',
    'notification.info': 'Information',
    'notification.rdqCreated': 'RDQ created successfully',
    'notification.rdqUpdated': 'RDQ updated successfully',
    'notification.rdqDeleted': 'RDQ deleted successfully',
    'notification.userCreated': 'User created successfully',
    'notification.userUpdated': 'User updated successfully',
    'notification.userDeleted': 'User deleted successfully',
    
    // Admin
    'admin.title': 'Administration',
    'admin.stats.partners': 'Partner companies',
    
    // Pagination
    'pagination.previous': 'Previous',
    'pagination.next': 'Next',
    'pagination.page': 'Page',
    'pagination.of': 'of',
    'pagination.showing': 'Showing',
    'pagination.to': 'to',
    'pagination.results': 'results',
    
    // Calendar
    'calendar.title': 'RDQ Calendar',
    'calendar.today': 'Today',
    'calendar.upcomingRdq': 'Upcoming RDQ',
    'calendar.pastRdq': 'Past RDQ',
    'calendar.multipleRdq': 'Multiple RDQ',
    'calendar.noRdqForDay': 'No RDQ scheduled for this day',
    
    // RDQ Status
    'rdq.status.planifie': 'Scheduled',
    'rdq.status.en_cours': 'In Progress',
    'rdq.status.clos': 'Closed',
    'rdq.status.annule': 'Cancelled',
  },
  de: {
    // App
    'app.title': 'RDQ-Anwendung',
    'app.roleAdmin': 'Administrator',
    'app.roleManager': 'Manager',
    'app.roleCollaborator': 'Mitarbeiter',
    // Header
    'header.logout': 'Abmelden',
    'header.profile': 'Profil',
    'header.settings': 'Einstellungen',
    
    // Login
    'login.title': 'RDQ-Anwendung Anmeldung',
    'login.subtitle': 'Melden Sie sich an, um auf Ihren Arbeitsplatz zuzugreifen',
    'login.email': 'E-Mail-Adresse',
    'login.password': 'Passwort',
    'login.connect': 'Anmelden',
    'login.connecting': 'Anmelden...',
    'login.invalidCredentials': 'Ungültige Anmeldedaten',
    'login.emailPlaceholder': 'Geben Sie Ihre E-Mail ein...',
    'login.passwordPlaceholder': 'Geben Sie Ihr Passwort ein...',
    
    // Dashboard - Manager
    'manager.title': 'Manager-Dashboard',
    'manager.overview': 'Übersicht',
    'manager.rdqManagement': 'RDQ-Verwaltung',
    'manager.stats.totalRdq': 'Gesamt RDQ',
    'manager.stats.pendingRdq': 'Ausstehend',
    'manager.stats.completedRdq': 'Abgeschlossen',
    'manager.stats.activeCollaborators': 'Aktive Mitarbeiter',
    'manager.createRdq': 'RDQ erstellen',
    'manager.recentRdq': 'Aktuelle RDQ',
    'manager.viewAll': 'Alle anzeigen',
    'manager.quickStats': 'Schnellstatistiken',
    
    // Dashboard - Collaborator
    'collaborator.title': 'Mitarbeiter-Dashboard',
    'collaborator.myRdq': 'Meine RDQ',
    'collaborator.stats.assigned': 'Zugewiesen',
    'collaborator.stats.completed': 'Abgeschlossen',
    'collaborator.stats.pending': 'Ausstehend',
    'collaborator.upcomingRdq': 'Bevorstehende RDQ',
    'collaborator.completedRdq': 'Abgeschlossene RDQ',
    
    // Manager
    'manager.title': 'Manager-Dashboard',
    'manager.overview': 'Übersicht',
    'manager.rdqManagement': 'RDQ-Verwaltung',
    'manager.stats.totalRdq': 'Gesamt RDQ',
    'manager.stats.pendingRdq': 'Ausstehend',
    'manager.stats.completedRdq': 'Abgeschlossen',
    'manager.stats.activeCollaborators': 'Aktive Mitarbeiter',
    'manager.createRdq': 'RDQ erstellen',
    'manager.recentRdq': 'Aktuelle RDQ',
    'manager.viewAll': 'Alle anzeigen',
    'manager.quickStats': 'Schnellstatistiken',
    'manager.searchPlaceholder': 'Suche nach Titel, Kunde oder Mitarbeiter...',
    'manager.rdqList': 'RDQ Liste',
    
    // Calendar
    'calendar.title': 'RDQ Kalender',
    'calendar.today': 'Heute',
    'calendar.upcomingRdq': 'Kommende RDQ',
    'calendar.pastRdq': 'Vergangene RDQ',
    'calendar.multipleRdq': 'Mehrere RDQ',
    'calendar.noRdqForDay': 'Keine RDQ für diesen Tag geplant',
    
    // Privacy Manager
    'privacy.title': 'Personendatenverwaltung (DSGVO)',
    'privacy.description': 'Personendaten der Benutzer DSGVO-konform einsehen und verwalten',
    'privacy.users': 'Benutzer',
    'privacy.rdqCreated': 'RDQ erstellt',
    'privacy.documents': 'Dokumente',
    'privacy.totalVolume': 'Gesamtvolumen',
    'privacy.registry': 'Personendatenregister',
    'privacy.registryDescription': 'Gespeicherte Daten für jeden Benutzer einsehen und verwalten',
    'privacy.search': 'Nach Name oder E-Mail suchen...',
    'privacy.details': 'Details',
    'privacy.purge': 'Löschen',
    'privacy.purgeTitle': 'Personendaten löschen',
    'privacy.purgeWarning': 'Sie sind dabei, alle persönlichen Daten von folgender Person dauerhaft zu löschen:',
    'privacy.purgeIncludes': 'Diese Aktion umfasst:',
    'privacy.rdqAndHistory': 'RDQ und zugehörige Historie',
    'privacy.attachedDocuments': 'angehängte Dokumente',
    'privacy.profileData': 'Alle Profildaten',
    'privacy.connectionHistory': 'Verbindungshistorie',
    'privacy.irreversible': 'Diese Aktion ist unumkehrbar!',
    'privacy.confirmText': 'Zur Bestätigung der Löschung geben Sie genau ein:',
    'privacy.typeConfirmation': 'Bestätigung eingeben...',
    'privacy.finalConfirmation': 'Letzte Bestätigung',
    'privacy.confirmDelete': 'Bestätigen Sie die endgültige Löschung aller Daten von',
    'privacy.actionLogged': 'Diese Aktion wird protokolliert und ist unumkehrbar.',
    'privacy.cancel': 'Abbrechen',
    'privacy.continue': 'Fortfahren',
    'privacy.validate': 'Bestätigen',
    'privacy.deleteDefinitely': 'Endgültig löschen',
    'privacy.deleting': 'Löschen...',
    'privacy.detailsTitle': 'Personendaten-Details',
    'privacy.detailsDescription': 'Vollständiges Inventar der für diesen Benutzer gespeicherten Daten',
    'privacy.totalVolumeBadge': 'Gesamtvolumen:',
    'privacy.storedDataCategories': 'Gespeicherte Datenkategorien',
    'privacy.profileDataCategory': 'Profildaten',
    'privacy.communicationsCategory': 'Kommunikation',
    'privacy.documentsCategory': 'Dokumente',
    'privacy.historyCategory': 'Aktivitätsverlauf',
    'privacy.geolocationCategory': 'Standortdaten',
    'privacy.profileDataDesc': 'Name, Vorname, E-Mail, Telefon, Adresse',
    'privacy.communicationsDesc': 'Gesendete und erhaltene E-Mails',
    'privacy.documentsDesc': 'angehängte Dateien',
    'privacy.historyDesc': 'RDQ und Interaktionen',
    'privacy.geolocationDesc': 'Adressen und GPS-Koordinaten',
    'privacy.metadata': 'Metadaten',
    'privacy.creationDate': 'Erstellungsdatum',
    'privacy.lastConnection': 'Letzte Verbindung',
    'privacy.rdqCreatedCount': 'RDQ erstellt',
    'privacy.attachedDocsCount': 'Angehängte Dokumente',
    'privacy.rgpdCompliance': 'DSGVO-Konformität',
    'privacy.rgpdNote': 'Der Benutzer hat das Recht, Zugang, Berichtigung oder Löschung seiner personenbezogenen Daten zu verlangen. Jede Löschaktion wird gemäß den gesetzlichen Verpflichtungen protokolliert.',
    
    // Admin Dashboard
    'admin.title': 'Administrator-Dashboard',
    'admin.users': 'Benutzerverwaltung',
    'admin.clients': 'Kundenverwaltung',
    'admin.personalData': 'Personendaten',
    'admin.stats.partners': 'Partnerunternehmen',
    'admin.stats.activeManagers': 'RDQ verwalten',
    'admin.stats.collaborators': 'Interviews durchführen',
    
    // Common
    'common.email': 'E-Mail',
    'common.phone': 'Telefon',
    'common.address': 'Adresse',
    'common.name': 'Name',
    'common.firstName': 'Vorname',
    'common.close': 'Schließen',
    'common.save': 'Speichern',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.add': 'Hinzufügen',
    'common.search': 'Suchen',
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.warning': 'Warnung',
    'common.info': 'Information',
    'common.all': 'Alle',
    
    // RDQ
    'rdq.title': 'Qualifizierter Termin',
    'rdq.create': 'RDQ erstellen',
    'rdq.edit': 'RDQ bearbeiten',
    'rdq.details': 'RDQ-Details',
    'rdq.delete': 'RDQ löschen',
    'rdq.assign': 'Zuweisen',
    'rdq.status.pending': 'Ausstehend',
    'rdq.status.inProgress': 'In Bearbeitung',
    'rdq.status.completed': 'Abgeschlossen',
    'rdq.status.cancelled': 'Storniert',
    'rdq.clientName': 'Kundenname',
    'rdq.project': 'Projekt',
    'rdq.date': 'Datum',
    'rdq.time': 'Zeit',
    'rdq.location': 'Ort',
    'rdq.description': 'Beschreibung',
    'rdq.collaborator': 'Mitarbeiter',
    'rdq.attachments': 'Anhänge',
    'rdq.priority': 'Priorität',
    'rdq.priority.low': 'Niedrig',
    'rdq.priority.medium': 'Mittel',
    'rdq.priority.high': 'Hoch',
    'rdq.priority.urgent': 'Dringend',
    
    // Forms
    'form.save': 'Speichern',
    'form.cancel': 'Abbrechen',
    'form.required': 'Pflichtfeld',
    'form.optional': 'Optional',
    'form.choose': 'Wählen...',
    'form.selectFile': 'Datei auswählen',
    'form.noFileSelected': 'Keine Datei ausgewählt',
    
    // Clients
    'client.name': 'Kundenname',
    'client.company': 'Unternehmen',
    'client.contact': 'Kontakt',
    'client.add': 'Kunde hinzufügen',
    'client.edit': 'Kunde bearbeiten',
    'client.delete': 'Kunde löschen',
    'client.details': 'Kundendetails',
    
    // Users
    'user.add': 'Benutzer hinzufügen',
    'user.edit': 'Benutzer bearbeiten',
    'user.delete': 'Benutzer löschen',
    'user.role': 'Rolle',
    'user.status': 'Status',
    'user.active': 'Aktiv',
    'user.inactive': 'Inaktiv',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.rdq': 'RDQ',
    'nav.clients': 'Kunden',
    'nav.users': 'Benutzer',
    'nav.reports': 'Berichte',
    'nav.settings': 'Einstellungen',
    
    // Actions
    'action.view': 'Anzeigen',
    'action.edit': 'Bearbeiten',
    'action.delete': 'Löschen',
    'action.assign': 'Zuweisen',
    'action.complete': 'Abschließen',
    'action.cancel': 'Abbrechen',
    'action.export': 'Exportieren',
    'action.import': 'Importieren',
    'action.duplicate': 'Duplizieren',
    
    // Filters
    'filter.all': 'Alle',
    'filter.active': 'Aktiv',
    'filter.completed': 'Abgeschlossen',
    'filter.pending': 'Ausstehend',
    'filter.byDate': 'Nach Datum',
    'filter.byStatus': 'Nach Status',
    'filter.byCollaborator': 'Nach Mitarbeiter',
    
    // Languages
    'language.french': 'Français',
    'language.english': 'English',
    'language.german': 'Deutsch',
    'language.spanish': 'Español',
    
    // Dates
    'date.today': 'Heute',
    'date.yesterday': 'Gestern',
    'date.tomorrow': 'Morgen',
    'date.thisWeek': 'Diese Woche',
    'date.nextWeek': 'Nächste Woche',
    'date.thisMonth': 'Diesen Monat',
    'date.nextMonth': 'Nächsten Monat',
    
    // Time
    'time.morning': 'Morgen',
    'time.afternoon': 'Nachmittag',
    'time.evening': 'Abend',
    'time.night': 'Nacht',
    
    // Notifications
    'notification.success': 'Erfolg',
    'notification.error': 'Fehler',
    'notification.warning': 'Warnung',
    'notification.info': 'Information',
    'notification.rdqCreated': 'RDQ erfolgreich erstellt',
    'notification.rdqUpdated': 'RDQ erfolgreich aktualisiert',
    'notification.rdqDeleted': 'RDQ erfolgreich gelöscht',
    'notification.userCreated': 'Benutzer erfolgreich erstellt',
    'notification.userUpdated': 'Benutzer erfolgreich aktualisiert',
    'notification.userDeleted': 'Benutzer erfolgreich gelöscht',
    
    // Admin
    'admin.title': 'Verwaltung',
    'admin.stats.partners': 'Partnerunternehmen',
    
    // Pagination
    'pagination.previous': 'Vorherige',
    'pagination.next': 'Nächste',
    'pagination.page': 'Seite',
    'pagination.of': 'von',
    'pagination.showing': 'Anzeige von',
    'pagination.to': 'bis',
    'pagination.results': 'Ergebnisse',
    
    // Calendar
    'calendar.title': 'RDQ Kalender',
    'calendar.today': 'Heute',
    'calendar.upcomingRdq': 'Kommende RDQ',
    'calendar.pastRdq': 'Vergangene RDQ',
    'calendar.multipleRdq': 'Mehrere RDQ',
    'calendar.noRdqForDay': 'Keine RDQ für diesen Tag geplant',
    
    // RDQ Status
    'rdq.status.planifie': 'Geplant',
    'rdq.status.en_cours': 'In Bearbeitung',
    'rdq.status.clos': 'Abgeschlossen',
    'rdq.status.annule': 'Storniert',
  },
  es: {
    // App
    'app.title': 'Aplicación RDQ',
    'app.roleAdmin': 'Administrador',
    'app.roleManager': 'Gerente',
    'app.roleCollaborator': 'Colaborador',
    // Header
    'header.logout': 'Cerrar sesión',
    'header.profile': 'Perfil',
    'header.settings': 'Configuración',
    
    // Login
    'login.title': 'Inicio de Sesión Aplicación RDQ',
    'login.subtitle': 'Inicie sesión para acceder a su espacio de trabajo',
    'login.email': 'Dirección de correo',
    'login.password': 'Contraseña',
    'login.connect': 'Iniciar sesión',
    'login.connecting': 'Iniciando sesión...',
    'login.invalidCredentials': 'Credenciales inválidas',
    'login.emailPlaceholder': 'Ingrese su correo...',
    'login.passwordPlaceholder': 'Ingrese su contraseña...',
    
    // Dashboard - Manager
    'manager.title': 'Panel de Gerente',
    'manager.overview': 'Resumen',
    'manager.rdqManagement': 'Gestión de RDQ',
    'manager.stats.totalRdq': 'Total RDQ',
    'manager.stats.pendingRdq': 'Pendientes',
    'manager.stats.completedRdq': 'Completados',
    'manager.stats.activeCollaborators': 'Colaboradores activos',
    'manager.createRdq': 'Crear RDQ',
    'manager.recentRdq': 'RDQ Recientes',
    'manager.viewAll': 'Ver todo',
    'manager.quickStats': 'Estadísticas Rápidas',
    
    // Dashboard - Collaborator
    'collaborator.title': 'Panel de Colaborador',
    'collaborator.myRdq': 'Mis RDQ',
    'collaborator.stats.assigned': 'Asignados',
    'collaborator.stats.completed': 'Completados',
    'collaborator.stats.pending': 'Pendientes',
    'collaborator.upcomingRdq': 'RDQ próximos',
    'collaborator.completedRdq': 'RDQ completados',
    
    // Manager
    'manager.title': 'Panel de Gerente',
    'manager.overview': 'Resumen',
    'manager.rdqManagement': 'Gestión de RDQ',
    'manager.stats.totalRdq': 'Total RDQ',
    'manager.stats.pendingRdq': 'Pendientes',
    'manager.stats.completedRdq': 'Completados',
    'manager.stats.activeCollaborators': 'Colaboradores activos',
    'manager.createRdq': 'Crear RDQ',
    'manager.recentRdq': 'RDQ Recientes',
    'manager.viewAll': 'Ver todo',
    'manager.quickStats': 'Estadísticas Rápidas',
    'manager.searchPlaceholder': 'Buscar por título, cliente o colaborador...',
    
    // RDQ
    'rdq.title': 'Cita Calificada',
    'rdq.create': 'Crear RDQ',
    'rdq.edit': 'Editar RDQ',
    'rdq.details': 'Detalles del RDQ',
    'rdq.delete': 'Eliminar RDQ',
    'rdq.assign': 'Asignar',
    'rdq.status.pending': 'Pendiente',
    'rdq.status.inProgress': 'En progreso',
    'rdq.status.completed': 'Completado',
    'rdq.status.cancelled': 'Cancelado',
    'rdq.clientName': 'Nombre del cliente',
    'rdq.project': 'Proyecto',
    'rdq.date': 'Fecha',
    'rdq.time': 'Hora',
    'rdq.location': 'Ubicación',
    'rdq.description': 'Descripción',
    'rdq.collaborator': 'Colaborador',
    'rdq.attachments': 'Adjuntos',
    'rdq.priority': 'Prioridad',
    'rdq.priority.low': 'Baja',
    'rdq.priority.medium': 'Media',
    'rdq.priority.high': 'Alta',
    'rdq.priority.urgent': 'Urgente',
    
    // Forms
    'form.save': 'Guardar',
    'form.cancel': 'Cancelar',
    'form.required': 'Campo obligatorio',
    'form.optional': 'Opcional',
    'form.choose': 'Elegir...',
    'form.selectFile': 'Seleccionar archivo',
    'form.noFileSelected': 'Ningún archivo seleccionado',
    
    // Clients
    'client.name': 'Nombre del cliente',
    'client.company': 'Empresa',
    'client.contact': 'Contacto',
    'client.add': 'Agregar cliente',
    'client.edit': 'Editar cliente',
    'client.delete': 'Eliminar cliente',
    'client.details': 'Detalles del cliente',
    
    // Users
    'user.add': 'Agregar usuario',
    'user.edit': 'Editar usuario',
    'user.delete': 'Eliminar usuario',
    'user.role': 'Rol',
    'user.status': 'Estado',
    'user.active': 'Activo',
    'user.inactive': 'Inactivo',
    
    // Navigation
    'nav.dashboard': 'Panel',
    'nav.rdq': 'RDQ',
    'nav.clients': 'Clientes',
    'nav.users': 'Usuarios',
    'nav.reports': 'Informes',
    'nav.settings': 'Configuración',
    
    // Actions
    'action.view': 'Ver',
    'action.edit': 'Editar',
    'action.delete': 'Eliminar',
    'action.assign': 'Asignar',
    'action.complete': 'Completar',
    'action.cancel': 'Cancelar',
    'action.export': 'Exportar',
    'action.import': 'Importar',
    'action.duplicate': 'Duplicar',
    
    // Filters
    'filter.all': 'Todos',
    'filter.active': 'Activo',
    'filter.completed': 'Completado',
    'filter.pending': 'Pendiente',
    'filter.byDate': 'Por fecha',
    'filter.byStatus': 'Por estado',
    'filter.byCollaborator': 'Por colaborador',
    
    // Languages
    'language.french': 'Français',
    'language.english': 'English',
    'language.german': 'Deutsch',
    'language.spanish': 'Español',
    
    // Dates
    'date.today': 'Hoy',
    'date.yesterday': 'Ayer',
    'date.tomorrow': 'Mañana',
    'date.thisWeek': 'Esta semana',
    'date.nextWeek': 'La próxima semana',
    'date.thisMonth': 'Este mes',
    'date.nextMonth': 'El próximo mes',
    
    // Time
    'time.morning': 'Mañana',
    'time.afternoon': 'Tarde',
    'time.evening': 'Noche',
    'time.night': 'Madrugada',
    
    // Notifications
    'notification.success': 'Éxito',
    'notification.error': 'Error',
    'notification.warning': 'Advertencia',
    'notification.info': 'Información',
    'notification.rdqCreated': 'RDQ creado exitosamente',
    'notification.rdqUpdated': 'RDQ actualizado exitosamente',
    'notification.rdqDeleted': 'RDQ eliminado exitosamente',
    'notification.userCreated': 'Usuario creado exitosamente',
    'notification.userUpdated': 'Usuario actualizado exitosamente',
    'notification.userDeleted': 'Usuario eliminado exitosamente',
    
    // Privacy Manager
    'privacy.title': 'Gestión de Datos Personales (RGPD)',
    'privacy.description': 'Consulte y gestione los datos personales de los usuarios en cumplimiento del RGPD',
    'privacy.users': 'Usuarios',
    'privacy.rdqCreated': 'RDQ creados',
    'privacy.documents': 'Documentos',
    'privacy.totalVolume': 'Volumen total',
    'privacy.registry': 'Registro de Datos Personales',
    'privacy.registryDescription': 'Visualice y gestione los datos almacenados para cada usuario',
    'privacy.search': 'Buscar por nombre o correo...',
    'privacy.details': 'Detalles',
    'privacy.purge': 'Purgar',
    'privacy.purgeTitle': 'Purga de Datos Personales',
    'privacy.purgeWarning': 'Está a punto de eliminar permanentemente todos los datos personales de:',
    'privacy.purgeIncludes': 'Esta acción incluye:',
    'privacy.rdqAndHistory': 'RDQ e historial asociado',
    'privacy.attachedDocuments': 'documentos adjuntos',
    'privacy.profileData': 'Todos los datos del perfil',
    'privacy.connectionHistory': 'Historial de conexiones',
    'privacy.irreversible': '¡Esta acción es irreversible!',
    'privacy.confirmText': 'Para confirmar la eliminación, escriba exactamente:',
    'privacy.typeConfirmation': 'Escriba la confirmación...',
    'privacy.finalConfirmation': 'Confirmación final',
    'privacy.confirmDelete': '¿Confirma la eliminación permanente de todos los datos de',
    'privacy.actionLogged': 'Esta acción será registrada e irreversible.',
    'privacy.cancel': 'Cancelar',
    'privacy.continue': 'Continuar',
    'privacy.validate': 'Validar',
    'privacy.deleteDefinitely': 'Eliminar Definitivamente',
    'privacy.deleting': 'Eliminando...',
    'privacy.detailsTitle': 'Detalles de Datos Personales',
    'privacy.detailsDescription': 'Inventario completo de datos almacenados para este usuario',
    'privacy.totalVolumeBadge': 'Volumen total:',
    'privacy.storedDataCategories': 'Categorías de Datos Almacenados',
    'privacy.profileDataCategory': 'Datos del Perfil',
    'privacy.communicationsCategory': 'Comunicaciones',
    'privacy.documentsCategory': 'Documentos',
    'privacy.historyCategory': 'Historial de Actividad',
    'privacy.geolocationCategory': 'Datos de Geolocalización',
    'privacy.profileDataDesc': 'Nombre, apellido, correo, teléfono, dirección',
    'privacy.communicationsDesc': 'Correos enviados y recibidos',
    'privacy.documentsDesc': 'archivos adjuntos',
    'privacy.historyDesc': 'RDQ e interacciones',
    'privacy.geolocationDesc': 'Direcciones y coordenadas GPS',
    'privacy.metadata': 'Metadatos',
    'privacy.creationDate': 'Fecha de creación',
    'privacy.lastConnection': 'Última conexión',
    'privacy.rdqCreatedCount': 'RDQ creados',
    'privacy.attachedDocsCount': 'Documentos adjuntos',
    'privacy.rgpdCompliance': 'Cumplimiento RGPD',
    'privacy.rgpdNote': 'El usuario tiene derecho a solicitar acceso, rectificación o eliminación de sus datos personales. Cualquier acción de purga será registrada de acuerdo con las obligaciones legales.',
    
    // Admin Dashboard
    'admin.title': 'Panel de Administrador',
    'admin.users': 'Gestión de Usuarios',
    'admin.clients': 'Gestión de Clientes',
    'admin.personalData': 'Datos Personales',
    'admin.stats.partners': 'Empresas asociadas',
    'admin.stats.activeManagers': 'Gestionando RDQ',
    'admin.stats.collaborators': 'Realizando entrevistas',
    
    // Common
    'common.email': 'Correo',
    'common.phone': 'Teléfono',
    'common.address': 'Dirección',
    'common.name': 'Nombre',
    'common.firstName': 'Apellido',
    'common.close': 'Cerrar',
    'common.save': 'Guardar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.add': 'Agregar',
    'common.search': 'Buscar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.warning': 'Advertencia',
    'common.info': 'Información',
    'common.all': 'Todos',
    
    // Languages
    'language.french': 'Français',
    'language.english': 'English',
    'language.german': 'Deutsch',
    'language.spanish': 'Español',
    
    // Manager
    'manager.title': 'Panel de Gerente',
    'manager.overview': 'Resumen',
    'manager.rdqManagement': 'Gestión de RDQ',
    'manager.stats.totalRdq': 'Total RDQ',
    'manager.stats.pendingRdq': 'Pendientes',
    'manager.stats.completedRdq': 'Completados',
    'manager.stats.activeCollaborators': 'Colaboradores activos',
    'manager.createRdq': 'Crear RDQ',
    'manager.recentRdq': 'RDQ Recientes',
    'manager.viewAll': 'Ver todo',
    'manager.quickStats': 'Estadísticas Rápidas',
    'manager.searchPlaceholder': 'Buscar por título, cliente o colaborador...',
    'manager.rdqList': 'Lista de RDQ',
    
    // Pagination
    'pagination.previous': 'Anterior',
    'pagination.next': 'Siguiente',
    'pagination.page': 'Página',
    'pagination.of': 'de',
    'pagination.showing': 'Mostrando',
    'pagination.to': 'a',
    'pagination.results': 'resultados',
    
    // Calendar
    'calendar.title': 'Calendario RDQ',
    'calendar.today': 'Hoy',
    'calendar.upcomingRdq': 'RDQ próximos',
    'calendar.pastRdq': 'RDQ pasados',
    'calendar.multipleRdq': 'Múltiples RDQ',
    'calendar.noRdqForDay': 'No hay RDQ programados para este día',
    
    // RDQ Status
    'rdq.status.planifie': 'Programado',
    'rdq.status.en_cours': 'En progreso',
    'rdq.status.clos': 'Cerrado',
    'rdq.status.annule': 'Cancelado',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};