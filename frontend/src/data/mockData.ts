import { RDQ, Client, Projet, User, Document, Bilan } from '../types';

export const mockAdmins: User[] = [
  {
    id: 0,
    nom: 'Admin',
    prenom: 'Système',
    email: 'admin@rdq.com',
    telephone: '01.00.00.00.00',
    role: 'admin'
  }
];

export const mockManagers: User[] = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'manager@example.com',
    telephone: '01.23.45.67.89',
    role: 'manager'
  },
  {
    id: 4,
    nom: 'Rousseau',
    prenom: 'Marie',
    email: 'marie.rousseau@example.com',
    telephone: '01.22.33.44.55',
    role: 'manager'
  }
];

export const mockCollaborateurs: User[] = [
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'collaborateur@example.com',
    telephone: '01.98.76.54.32',
    role: 'collaborateur'
  },
  {
    id: 3,
    nom: 'Bernard',
    prenom: 'Pierre',
    email: 'pierre.bernard@example.com',
    telephone: '01.11.22.33.44',
    role: 'collaborateur'
  }
];

export const mockClients: Client[] = [
  {
    idClient: 1,
    nom: 'ACME Corp',
    contact: 'M. Durand',
    telephone: '01.55.66.77.88',
    email: 'durand@acme.com'
  },
  {
    idClient: 2,
    nom: 'TechSolutions',
    contact: 'Mme Leblanc',
    telephone: '01.44.55.66.77',
    email: 'leblanc@techsolutions.com'
  },
  {
    idClient: 3,
    nom: 'Digital Innovations',
    contact: 'M. Martin',
    telephone: '01.33.44.55.66',
    email: 'martin@digital-innovations.com'
  },
  {
    idClient: 4,
    nom: 'StartupX',
    contact: 'Mme Garcia',
    telephone: '01.22.33.44.55',
    email: 'garcia@startupx.com'
  },
  {
    idClient: 5,
    nom: 'Global Systems',
    contact: 'M. Rodriguez',
    telephone: '01.11.22.33.44',
    email: 'rodriguez@global-systems.com'
  }
];

export const mockProjets: Projet[] = [
  {
    idProjet: 1,
    nom: 'Migration Cloud'
  },
  {
    idProjet: 2,
    nom: 'Appel d\'offre AO-2024-001'
  },
  {
    idProjet: 3,
    nom: 'Développement mobile'
  },
  {
    idProjet: 4,
    nom: 'Refonte site web'
  },
  {
    idProjet: 5,
    nom: 'Audit de sécurité'
  },
  {
    idProjet: 6,
    nom: 'Formation équipe'
  },
  {
    idProjet: 7,
    nom: 'Support technique'
  },
  {
    idProjet: 8,
    nom: 'Intégration API'
  }
];

export const mockDocuments: Document[] = [
  {
    idDocument: 1,
    nomFichier: 'CV_Sophie_Martin.pdf',
    type: 'CV',
    url: '/documents/cv_sophie_martin.pdf',
    idRDQ: 1
  },
  {
    idDocument: 2,
    nomFichier: 'Fiche_poste_dev_senior.pdf',
    type: 'fiche_poste',
    url: '/documents/fiche_poste_dev_senior.pdf',
    idRDQ: 1
  }
];

export const mockBilans: Bilan[] = [
  {
    idBilan: 1,
    note: 8,
    commentaire: 'Entretien très positif, candidat motivé',
    auteur: 'collaborateur',
    idRDQ: 2,
    dateCreation: new Date('2024-01-15T16:00:00')
  },
  {
    idBilan: 2,
    note: 7,
    commentaire: 'Profil intéressant, à suivre',
    auteur: 'manager',
    idRDQ: 2,
    dateCreation: new Date('2024-01-15T17:00:00')
  }
];

// Fonction pour générer des RDQ de test
const generateMockRDQs = (): RDQ[] => {
  const rdqs: RDQ[] = [];
  const titres = [
    'Entretien Développeur Senior',
    'AO TechSolutions - Chef de projet',
    'Présentation solution ACME',
    'Entretien Développeur Frontend',
    'Réunion de suivi client',
    'Présentation technique',
    'Audit sécurité',
    'Migration données',
    'Formation utilisateur',
    'Support technique',
    'Analyse besoins',
    'Recettage application',
    'Déploiement solution',
    'Maintenance corrective',
    'Évolution fonctionnelle',
    'Entretien UX Designer',
    'Présentation architecture',
    'Validation cahier des charges',
    'Suivi projet agile',
    'Réunion de cadrage'
  ];
  
  const adresses = [
    '123 Rue de la Paix, 75001 Paris',
    '456 Avenue des Champs, 75008 Paris',
    '789 Boulevard Saint-Germain, 75007 Paris',
    '321 Rue de Rivoli, 75004 Paris',
    '654 Avenue Montaigne, 75008 Paris',
    '147 Rue du Faubourg Saint-Honoré, 75008 Paris',
    '258 Boulevard Haussmann, 75008 Paris',
    '369 Rue de la République, 69002 Lyon',
    '741 Avenue Victor Hugo, 75016 Paris',
    '852 Rue de Belleville, 75020 Paris',
    ''
  ];
  
  const modes: ('physique' | 'visio' | 'telephone')[] = ['physique', 'visio', 'telephone'];
  const statuts: ('planifie' | 'en_cours' | 'clos' | 'annule')[] = ['planifie', 'en_cours', 'clos', 'annule'];
  
  const indications = [
    'Entretien technique prévu, préparer les questions sur React',
    'RDQ déjà effectué, compléter le bilan',
    'Présentation commerciale, apporter la démo',
    'Rendez-vous de suivi, vérifier les livrables',
    'Première rencontre client, présenter l\'équipe',
    'Point d\'avancement projet, préparer le reporting',
    'Validation des spécifications techniques',
    'Formation sur les nouveaux outils',
    'Réunion de clôture de phase',
    'Présentation des résultats d\'audit'
  ];

  for (let i = 1; i <= 100; i++) {
    const dateCreation = new Date(2024, 0, Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 10) + 8);
    const dateRDQ = new Date(dateCreation.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    const mode = modes[Math.floor(Math.random() * modes.length)];
    
    rdqs.push({
      idRDQ: i,
      titre: `${titres[Math.floor(Math.random() * titres.length)]} #${i}`,
      dateHeure: dateRDQ,
      adresse: mode === 'visio' || mode === 'telephone' ? '' : adresses[Math.floor(Math.random() * (adresses.length - 1))],
      mode,
      indicationsManager: indications[Math.floor(Math.random() * indications.length)],
      statut: statuts[Math.floor(Math.random() * statuts.length)],
      idManager: 1, // Tous assignés au manager principal pour le test
      idCollaborateur: mockCollaborateurs[Math.floor(Math.random() * mockCollaborateurs.length)].id,
      idClient: mockClients[Math.floor(Math.random() * mockClients.length)].idClient,
      idProjet: mockProjets[Math.floor(Math.random() * mockProjets.length)].idProjet,
      dateCreation,
      dateModification: new Date(dateCreation.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000),
      manager: mockManagers[0],
      collaborateur: mockCollaborateurs[Math.floor(Math.random() * mockCollaborateurs.length)],
      client: mockClients[Math.floor(Math.random() * mockClients.length)],
      projet: mockProjets[Math.floor(Math.random() * mockProjets.length)],
      documents: Math.random() > 0.7 ? mockDocuments.slice(0, Math.floor(Math.random() * 2) + 1) : [],
      bilans: Math.random() > 0.8 ? mockBilans.slice(0, Math.floor(Math.random() * 2) + 1) : []
    });
  }
  
  return rdqs;
};

export const mockRDQs: RDQ[] = generateMockRDQs();