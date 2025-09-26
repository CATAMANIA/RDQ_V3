import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Search } from 'lucide-react';
import { RDQCard } from './RDQCard';
import { RDQModal } from './RDQModal';
import { BilanModal } from './BilanModal';
import { mockRDQs, mockClients } from '../data/mockData';
import { RDQ } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const CollaborateurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [rdqs, setRdqs] = useState<RDQ[]>(
    mockRDQs.filter(rdq => rdq.idCollaborateur === user?.id)
  );
  const [selectedRDQ, setSelectedRDQ] = useState<RDQ | null>(null);
  const [showBilanModal, setShowBilanModal] = useState(false);
  const [showHistorique, setShowHistorique] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClient, setFilterClient] = useState<string>('all');

  // Filtrage des RDQ
  const filteredRDQs = rdqs.filter(rdq => {
    const matchesSearch = rdq.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rdq.client.nom.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClient = filterClient === 'all' || 
                         rdq.idClient.toString() === filterClient;
    
    const matchesStatut = showHistorique || rdq.statut === 'en_cours';
    
    return matchesSearch && matchesClient && matchesStatut;
  });

  const handleUpdateBilan = (updatedRDQ: RDQ) => {
    setRdqs(rdqs.map(rdq => 
      rdq.idRDQ === updatedRDQ.idRDQ ? updatedRDQ : rdq
    ));
  };

  const rdqsEnCours = filteredRDQs.filter(rdq => rdq.statut === 'en_cours').length;
  const rdqsClos = filteredRDQs.filter(rdq => rdq.statut === 'clos').length;
  const rdqsAvecBilanManquant = filteredRDQs.filter(rdq => {
    const isPassé = rdq.dateHeure < new Date();
    const bilanCollaborateur = rdq.bilans.find(b => b.auteur === 'collaborateur');
    return isPassé && !bilanCollaborateur && rdq.statut === 'en_cours';
  }).length;

  const rdqsProchains = filteredRDQs
    .filter(rdq => rdq.dateHeure > new Date() && rdq.statut === 'en_cours')
    .sort((a, b) => a.dateHeure.getTime() - b.dateHeure.getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2>Mes Rendez-vous Qualifiés</h2>
        </motion.div>
        <motion.div
          className="flex flex-wrap gap-2 sm:gap-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Badge variant="default">{rdqsEnCours} RDQ en cours</Badge>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Badge variant="outline">{rdqsClos} RDQ clôturés</Badge>
          </motion.div>
          {rdqsAvecBilanManquant > 0 && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              animate={{ x: [0, -2, 2, 0] }}
              transition={{ 
                scale: { type: "spring", stiffness: 400 },
                x: { repeat: Infinity, duration: 1.5, repeatDelay: 3 }
              }}
            >
              <Badge variant="destructive">{rdqsAvecBilanManquant} bilan(s) à compléter</Badge>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Prochains RDQ - Section mise en avant */}
      {rdqsProchains.length > 0 && (
        <motion.div
          className="bg-rdq-blue-light/10 p-4 rounded-lg border border-rdq-blue-light/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.h3
            className="text-h3 text-rdq-blue-dark mb-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            Prochains RDQ
          </motion.h3>
          <div className="space-y-3">
            {rdqsProchains.map((rdq, index) => (
              <motion.div
                key={rdq.idRDQ}
                className="bg-white p-3 rounded border-l-4 border-rdq-blue-dark shadow-sm hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 4, scale: 1.02 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-body-bold text-rdq-navy">{rdq.titre}</p>
                    <p className="text-body text-rdq-gray-dark">
                      {rdq.client.nom} • {rdq.dateHeure.toLocaleDateString('fr-FR')} à {rdq.dateHeure.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Badge variant={rdq.mode === 'physique' ? 'default' : 'secondary'}>
                      {rdq.mode === 'physique' ? 'Physique' : 'Visio'}
                    </Badge>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Filtres et recherche */}
      <motion.div
        className="flex flex-wrap gap-4 p-4 bg-rdq-gray-light/20 rounded-lg border border-rdq-gray-light/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <motion.div
          className="flex-1 min-w-48 sm:min-w-64"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-rdq-gray-dark" />
            <Input
              placeholder="Rechercher par titre ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 transition-all duration-200 focus:scale-[1.02] hover:shadow-md"
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <Select value={filterClient} onValueChange={setFilterClient}>
            <SelectTrigger className="w-full sm:w-48 transition-all duration-200 hover:shadow-md">
              <SelectValue placeholder="Client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les clients</SelectItem>
              {mockClients.map(client => (
                <SelectItem key={client.idClient} value={client.idClient.toString()}>
                  {client.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        
        <motion.div
          className="flex items-center space-x-2"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <Checkbox
            id="historique"
            checked={showHistorique}
            onCheckedChange={setShowHistorique}
          />
          <label htmlFor="historique" className="text-sm">
            Afficher l'historique
          </label>
        </motion.div>
      </motion.div>

      {/* Liste des RDQ */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <AnimatePresence>
          {filteredRDQs.map((rdq, index) => (
            <motion.div
              key={rdq.idRDQ}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <RDQCard
                rdq={rdq}
                onView={(rdq) => setSelectedRDQ(rdq)}
                onBilan={(rdq) => {
                  setSelectedRDQ(rdq);
                  setShowBilanModal(true);
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredRDQs.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-rdq-gray-dark">Aucun RDQ trouvé avec les filtres actuels.</p>
        </motion.div>
      )}

      {/* Modales */}
      {selectedRDQ && !showBilanModal && (
        <RDQModal
          rdq={selectedRDQ}
          onClose={() => setSelectedRDQ(null)}
          isManager={false}
        />
      )}

      {selectedRDQ && showBilanModal && (
        <BilanModal
          rdq={selectedRDQ}
          onClose={() => {
            setShowBilanModal(false);
            setSelectedRDQ(null);
          }}
          onSaveBilan={(rdq) => handleUpdateBilan(rdq)}
          isManager={false}
        />
      )}
    </div>
  );
};