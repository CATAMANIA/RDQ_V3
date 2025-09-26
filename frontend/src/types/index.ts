export type UserRole = 'admin' | 'manager' | 'collaborateur';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: UserRole;
}

export interface Client {
  idClient: number;
  nom: string;
  contact?: string;
  telephone?: string;
  email?: string;
}

export interface Projet {
  idProjet: number;
  nom: string;
}

export interface Document {
  idDocument: number;
  nomFichier: string;
  type: 'CV' | 'fiche_poste' | 'autre';
  url: string;
  idRDQ: number;
}

export interface Bilan {
  idBilan: number;
  note: number; // 1 à 10
  commentaire?: string;
  auteur: 'manager' | 'collaborateur';
  idRDQ: number;
  dateCreation: Date;
}

export interface RDQ {
  idRDQ: number;
  titre: string;
  dateHeure: Date;
  adresse?: string;
  mode: 'physique' | 'visio';
  indicationsManager?: string;
  statut: 'en_cours' | 'clos';
  idManager: number;
  idCollaborateur: number;
  idClient: number;
  idProjet?: number;
  dateCreation: Date;
  dateModification: Date;
  manager: User;
  collaborateur: User;
  client: Client;
  projet?: Projet;
  documents: Document[];
  bilans: Bilan[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface AdminUser extends User {
  role: 'admin';
  dateCreation?: Date;
  statut?: 'actif' | 'inactif';
}