import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from './ui/badge';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white border-b border-rdq-gray-light px-4 sm:px-6 py-4 shadow-sm sticky top-0 z-50 backdrop-blur-sm"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <motion.div
          className="flex items-center space-x-2 sm:space-x-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-lg sm:text-xl lg:text-2xl">RDQ - Rendez-vous Qualifiés</h1>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3, type: "spring" }}
          >
            <Badge variant={user?.role === 'manager' ? 'default' : 'secondary'}>
              {user?.role === 'admin' ? 'Administrateur' : 
               user?.role === 'manager' ? 'Manager' : 'Collaborateur'}
            </Badge>
          </motion.div>
        </motion.div>
        
        <motion.div
          className="flex items-center space-x-2 sm:space-x-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 hidden sm:flex">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <User className="h-4 w-4 text-rdq-gray-dark" aria-hidden="true" />
            </motion.div>
            <span className="text-body-bold">
              {user?.prenom} {user?.nom}
            </span>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-1 sm:space-x-2 transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-rdq-blue-light focus:ring-offset-2"
              aria-label="Se déconnecter"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
};