import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from '../contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate login delay for better UX
    setTimeout(() => {
      if (!login(email, password)) {
        setError('Identifiants invalides. Veuillez vérifier votre email et mot de passe.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rdq-blue-light/10 to-rdq-blue-dark/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-rdq-gray-light/30 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardHeader className="text-center">
              <CardTitle id="login-title">Connexion RDQ</CardTitle>
              <CardDescription className="text-body" id="login-description">
                Connectez-vous à votre espace de gestion des rendez-vous qualifiés
              </CardDescription>
            </CardHeader>
          </motion.div>
          
          <CardContent>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                className="space-y-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="transition-all duration-200 focus:scale-[1.02] hover:shadow-md border-2 focus:border-rdq-blue-light focus:ring-2 focus:ring-rdq-blue-light/20"
                  required
                  aria-describedby="email-help"
                  disabled={isLoading}
                />
                <div id="email-help" className="sr-only">
                  Saisissez votre adresse email pour vous connecter
                </div>
              </motion.div>
              
              <motion.div
                className="space-y-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="transition-all duration-200 focus:scale-[1.02] hover:shadow-md border-2 focus:border-rdq-blue-light focus:ring-2 focus:ring-rdq-blue-light/20"
                  required
                  aria-describedby="password-help"
                  disabled={isLoading}
                />
                <div id="password-help" className="sr-only">
                  Saisissez votre mot de passe pour vous connecter
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive" className="border-2 border-destructive/50 bg-destructive/10">
                    <AlertDescription className="text-destructive font-medium">
                      {error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <Button
                  type="submit"
                  className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-2 border-rdq-blue-dark focus:ring-2 focus:ring-rdq-blue-light focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  aria-describedby="login-status"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                      <span id="login-status">Connexion en cours...</span>
                    </div>
                  ) : (
                    <span id="login-status">Se connecter</span>
                  )}
                </Button>
              </motion.div>
            </motion.form>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-6 p-4 bg-rdq-gray-light/20 rounded-lg border border-rdq-gray-light/50"
            >
              <p className="text-body-bold mb-2">Comptes de démonstration :</p>
              <div className="space-y-1">
                <motion.p
                  className="text-body"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <strong className="text-rdq-yellow bg-rdq-navy px-1 rounded text-xs">Administrateur :</strong> admin@rdq.com / password
                </motion.p>
                <motion.p
                  className="text-body"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                >
                  <strong className="text-rdq-blue-dark">Manager :</strong> manager@example.com / password
                </motion.p>
                <motion.p
                  className="text-body"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 1.0 }}
                >
                  <strong className="text-rdq-blue-light">Collaborateur :</strong> collaborateur@example.com / password
                </motion.p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};