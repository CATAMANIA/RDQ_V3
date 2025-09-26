import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

// Données mockées pour les utilisateurs
const mockUsers: User[] = [
  {
    id: 0,
    nom: 'Admin',
    prenom: 'Système',
    email: 'admin@rdq.com',
    telephone: '01.00.00.00.00',
    role: 'admin'
  },
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'manager@example.com',
    telephone: '01.23.45.67.89',
    role: 'manager'
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'collaborateur@example.com',
    telephone: '01.98.76.54.32',
    role: 'collaborateur'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    // Simulation de l'authentification
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};