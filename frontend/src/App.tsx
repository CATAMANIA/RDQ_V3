import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { ManagerDashboard } from './components/ManagerDashboard';
import { CollaborateurDashboard } from './components/CollaborateurDashboard';
import { AdminDashboard } from './components/AdminDashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div
          key="login"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <LoginForm />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="min-h-screen bg-gradient-to-br from-white to-rdq-gray-light/20"
        >
          <Header />
          <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              {user?.role === 'admin' ? (
                <AdminDashboard />
              ) : user?.role === 'manager' ? (
                <ManagerDashboard />
              ) : (
                <CollaborateurDashboard />
              )}
            </motion.div>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}