import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, MapPin, Phone, Mail, Navigation, Clock, Lock, AlertCircle } from 'lucide-react';
import { RDQ } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RDQCardProps {
  rdq: RDQ;
  onView: (rdq: RDQ) => void;
  onEdit?: (rdq: RDQ) => void;
  onBilan?: (rdq: RDQ) => void;
  showActions?: boolean;
}

export const RDQCard: React.FC<RDQCardProps> = ({ 
  rdq, 
  onView, 
  onEdit, 
  onBilan, 
  showActions = true 
}) => {
  const isPassé = rdq.dateHeure < new Date();
  const bilanCollaborateur = rdq.bilans.find(b => b.auteur === 'collaborateur');
  const bilanManager = rdq.bilans.find(b => b.auteur === 'manager');
  const bilanManquant = isPassé && (!bilanCollaborateur || !bilanManager);

  const handleExternalAction = (action: string, value?: string) => {
    switch (action) {
      case 'maps':
        if (rdq.adresse) {
          window.open(`https://maps.google.com?q=${encodeURIComponent(rdq.adresse)}`, '_blank');
        }
        break;
      case 'phone':
        if (value) {
          window.open(`tel:${value}`, '_self');
        }
        break;
      case 'email':
        if (value) {
          window.open(`mailto:${value}`, '_self');
        }
        break;
      case 'calendar':
        // Simulation d'ajout au calendrier Outlook
        const startDate = format(rdq.dateHeure, "yyyyMMdd'T'HHmmss");
        const endDate = format(new Date(rdq.dateHeure.getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss");
        const calendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(rdq.titre)}&startdt=${startDate}&enddt=${endDate}&location=${encodeURIComponent(rdq.adresse || 'Visioconférence')}`;
        window.open(calendarUrl, '_blank');
        break;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card className={`h-full transition-all duration-300 hover:shadow-lg border-rdq-gray-light/50 ${rdq.statut === 'clos' ? 'opacity-75' : ''} backdrop-blur-sm`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <motion.div
                className="flex items-center space-x-2 mb-2"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <CardTitle className="text-h3">{rdq.titre}</CardTitle>
                {rdq.statut === 'clos' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <Lock className="h-4 w-4 text-rdq-gray-dark" />
                  </motion.div>
                )}
                {bilanManquant && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 }}
                    className="animate-pulse"
                  >
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </motion.div>
                )}
              </motion.div>
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Badge variant={rdq.mode === 'physique' ? 'default' : 'secondary'}>
                    {rdq.mode === 'physique' ? 'Physique' : 'Visio'}
                  </Badge>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Badge variant={rdq.statut === 'clos' ? 'outline' : 'default'}>
                    {rdq.statut === 'clos' ? 'Clôturé' : 'En cours'}
                  </Badge>
                </motion.div>
                {isPassé && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Passé
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </CardHeader>
      
      <CardContent className="space-y-4">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="space-y-2">
            <motion.div
              className="flex items-center space-x-2 text-body"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Calendar className="h-4 w-4 text-rdq-blue-dark" />
              <span>{format(rdq.dateHeure, 'PPp', { locale: fr })}</span>
            </motion.div>
            
            {rdq.adresse && (
              <motion.div
                className="flex items-center space-x-2 text-body"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <MapPin className="h-4 w-4 text-rdq-blue-dark" />
                <span className="truncate">{rdq.adresse}</span>
              </motion.div>
            )}
            
            <motion.div
              className="text-body"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span>Client: </span>
              <span className="text-body-bold text-rdq-navy">{rdq.client.nom}</span>
              {rdq.client.contact && (
                <span className="text-rdq-gray-dark"> ({rdq.client.contact})</span>
              )}
            </motion.div>
          </div>
          
          <div className="space-y-2">
            <motion.div
              className="text-body"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span>Collaborateur: </span>
              <span className="text-body-bold text-rdq-navy">{rdq.collaborateur.prenom} {rdq.collaborateur.nom}</span>
            </motion.div>
            
            {rdq.projet && (
              <motion.div
                className="text-body"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span>Projet: </span>
                <span className="text-body-bold text-rdq-navy">{rdq.projet.nom}</span>
              </motion.div>
            )}
            
            <motion.div
              className="text-body"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <span>Documents: </span>
              <span className="text-body-bold text-rdq-navy">{rdq.documents.length}</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          className="flex flex-wrap gap-2 pt-2 border-t"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {rdq.adresse && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExternalAction('maps')}
                className="flex items-center space-x-1 transition-all duration-200 hover:shadow-md"
              >
                <Navigation className="h-3 w-3" />
                <span className="hidden sm:inline">Maps</span>
              </Button>
            </motion.div>
          )}
          
          {rdq.client.telephone && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExternalAction('phone', rdq.client.telephone)}
                className="flex items-center space-x-1 transition-all duration-200 hover:shadow-md"
              >
                <Phone className="h-3 w-3" />
                <span className="hidden sm:inline">Appeler</span>
              </Button>
            </motion.div>
          )}
          
          {rdq.client.email && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExternalAction('email', rdq.client.email)}
                className="flex items-center space-x-1 transition-all duration-200 hover:shadow-md"
              >
                <Mail className="h-3 w-3" />
                <span className="hidden sm:inline">Email</span>
              </Button>
            </motion.div>
          )}
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExternalAction('calendar')}
              className="flex items-center space-x-1 transition-all duration-200 hover:shadow-md"
            >
              <Calendar className="h-3 w-3" />
              <span className="hidden sm:inline">Agenda</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Boutons d'action */}
        {showActions && (
          <motion.div
            className="flex flex-wrap gap-2 pt-2 border-t"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => onView(rdq)}
                className="transition-all duration-200 hover:shadow-md"
              >
                Consulter
              </Button>
            </motion.div>
            
            {onEdit && rdq.statut === 'en_cours' && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onEdit(rdq)}
                  className="transition-all duration-200 hover:shadow-md"
                >
                  Modifier
                </Button>
              </motion.div>
            )}
            
            {onBilan && isPassé && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={bilanManquant ? { x: [0, -2, 2, 0] } : {}}
                transition={bilanManquant ? { repeat: Infinity, duration: 1.5, repeatDelay: 3 } : {}}
              >
                <Button 
                  variant={bilanManquant ? "destructive" : "secondary"} 
                  size="sm" 
                  onClick={() => onBilan(rdq)}
                  className="transition-all duration-200 hover:shadow-md"
                >
                  {bilanManquant ? 'Bilan requis' : 'Voir bilan'}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
};