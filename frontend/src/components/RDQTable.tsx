import React from 'react';
import { motion } from 'motion/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, MapPin, Phone, Mail, Navigation, Clock, Lock, AlertCircle, Eye, Edit, FileText } from 'lucide-react';
import { RDQ } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RDQTableProps {
  rdqs: RDQ[];
  onView: (rdq: RDQ) => void;
  onEdit?: (rdq: RDQ) => void;
  onBilan?: (rdq: RDQ) => void;
  showActions?: boolean;
}

export const RDQTable: React.FC<RDQTableProps> = ({ 
  rdqs, 
  onView, 
  onEdit, 
  onBilan, 
  showActions = true 
}) => {
  const handleExternalAction = (rdq: RDQ, action: string, value?: string) => {
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
        const startDate = format(rdq.dateHeure, "yyyyMMdd'T'HHmmss");
        const endDate = format(new Date(rdq.dateHeure.getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss");
        const calendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(rdq.titre)}&startdt=${startDate}&enddt=${endDate}&location=${encodeURIComponent(rdq.adresse || 'Visioconférence')}`;
        window.open(calendarUrl, '_blank');
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-rdq-gray-light/50 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-rdq-gray-light/10 hover:bg-rdq-gray-light/10">
            <TableHead className="text-rdq-navy font-semibold">Titre</TableHead>
            <TableHead className="text-rdq-navy font-semibold">Date & Heure</TableHead>
            <TableHead className="text-rdq-navy font-semibold">Client</TableHead>
            <TableHead className="text-rdq-navy font-semibold">Collaborateur</TableHead>
            <TableHead className="text-rdq-navy font-semibold">Mode</TableHead>
            <TableHead className="text-rdq-navy font-semibold">Statut</TableHead>
            <TableHead className="text-rdq-navy font-semibold">Lieu</TableHead>
            {showActions && <TableHead className="text-rdq-navy font-semibold text-center">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rdqs.map((rdq, index) => {
            const isPassé = rdq.dateHeure < new Date();
            const bilanCollaborateur = rdq.bilans.find(b => b.auteur === 'collaborateur');
            const bilanManager = rdq.bilans.find(b => b.auteur === 'manager');
            const bilanManquant = isPassé && (!bilanCollaborateur || !bilanManager);

            return (
              <motion.tr
                key={rdq.idRDQ}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`hover:bg-rdq-gray-light/5 transition-colors ${rdq.statut === 'clos' ? 'opacity-75' : ''}`}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <span className="text-rdq-navy">{rdq.titre}</span>
                    {rdq.statut === 'clos' && (
                      <Lock className="h-4 w-4 text-rdq-gray-dark" />
                    )}
                    {bilanManquant && (
                      <motion.div
                        animate={{ x: [0, -2, 2, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 3 }}
                      >
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </motion.div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-rdq-blue-dark" />
                    <div className="flex flex-col">
                      <span className="text-body text-rdq-navy">
                        {format(rdq.dateHeure, 'dd/MM/yyyy', { locale: fr })}
                      </span>
                      <span className="text-body text-rdq-gray-dark">
                        {format(rdq.dateHeure, 'HH:mm', { locale: fr })}
                      </span>
                    </div>
                    {isPassé && (
                      <Badge variant="secondary" className="ml-2">
                        <Clock className="h-3 w-3 mr-1" />
                        Passé
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-body-bold text-rdq-navy">{rdq.client.nom}</span>
                    {rdq.client.contact && (
                      <span className="text-body text-rdq-gray-dark">{rdq.client.contact}</span>
                    )}
                    <div className="flex space-x-1 mt-1">
                      {rdq.client.telephone && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExternalAction(rdq, 'phone', rdq.client.telephone)}
                          className="h-6 w-6 p-0 hover:bg-rdq-blue-light/10"
                        >
                          <Phone className="h-3 w-3 text-rdq-blue-dark" />
                        </Button>
                      )}
                      {rdq.client.email && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExternalAction(rdq, 'email', rdq.client.email)}
                          className="h-6 w-6 p-0 hover:bg-rdq-blue-light/10"
                        >
                          <Mail className="h-3 w-3 text-rdq-blue-dark" />
                        </Button>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-body text-rdq-navy">
                    {rdq.collaborateur.prenom} {rdq.collaborateur.nom}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={rdq.mode === 'physique' ? 'default' : 'secondary'}>
                    {rdq.mode === 'physique' ? 'Physique' : 'Visio'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={rdq.statut === 'clos' ? 'outline' : 'default'}>
                    {rdq.statut === 'clos' ? 'Clôturé' : 'En cours'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {rdq.adresse ? (
                      <>
                        <MapPin className="h-4 w-4 text-rdq-blue-dark" />
                        <span className="text-body text-rdq-navy truncate max-w-32">
                          {rdq.adresse}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExternalAction(rdq, 'maps')}
                          className="h-6 w-6 p-0 hover:bg-rdq-blue-light/10"
                        >
                          <Navigation className="h-3 w-3 text-rdq-blue-dark" />
                        </Button>
                      </>
                    ) : (
                      <span className="text-body text-rdq-gray-dark">Visioconférence</span>
                    )}
                  </div>
                </TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(rdq)}
                        className="h-8 w-8 p-0 hover:bg-rdq-blue-light/10"
                        title="Consulter"
                      >
                        <Eye className="h-4 w-4 text-rdq-blue-dark" />
                      </Button>
                      {onEdit && rdq.statut === 'en_cours' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(rdq)}
                          className="h-8 w-8 p-0 hover:bg-rdq-blue-light/10"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4 text-rdq-blue-dark" />
                        </Button>
                      )}
                      {onBilan && isPassé && (
                        <motion.div
                          animate={bilanManquant ? { x: [0, -1, 1, 0] } : {}}
                          transition={bilanManquant ? { repeat: Infinity, duration: 1.5, repeatDelay: 3 } : {}}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onBilan(rdq)}
                            className={`h-8 w-8 p-0 ${bilanManquant ? 'hover:bg-red-50 text-red-600' : 'hover:bg-rdq-blue-light/10'}`}
                            title={bilanManquant ? 'Bilan requis' : 'Voir bilan'}
                          >
                            <FileText className={`h-4 w-4 ${bilanManquant ? 'text-red-600' : 'text-rdq-blue-dark'}`} />
                          </Button>
                        </motion.div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExternalAction(rdq, 'calendar')}
                        className="h-8 w-8 p-0 hover:bg-rdq-blue-light/10"
                        title="Ajouter au calendrier"
                      >
                        <Calendar className="h-4 w-4 text-rdq-blue-dark" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
      {rdqs.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-rdq-gray-dark">Aucun RDQ trouvé avec les filtres actuels.</p>
        </div>
      )}
    </div>
  );
};