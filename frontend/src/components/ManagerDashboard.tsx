import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Plus, Search, Filter, Calendar as CalendarIcon } from 'lucide-react';
import { RDQCard } from './RDQCard';
import { RDQModal } from './RDQModal';
import { CreateRDQModal } from './CreateRDQModal';
import { BilanModal } from './BilanModal';
import { AnimatedGrid } from './AnimatedGrid';
import { PaginationControls } from './ui/pagination-controls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SimpleCalendar } from './SimpleCalendar';
import { mockRDQs, mockCollaborateurs, mockClients } from '../data/mockData';
import { RDQ } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [rdqs, setRdqs] = useState<RDQ[]>(mockRDQs);
  const [selectedRDQ, setSelectedRDQ] = useState<RDQ | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBilanModal, setShowBilanModal] = useState(false);
  const [showHistorique, setShowHistorique] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCollaborateur, setFilterCollaborateur] = useState<string>('all');
  const [filterClient, setFilterClient] = useState<string>('all');
  
  // États de pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('list');

  // Filtrage et pagination des RDQ
  const { filteredRDQs, paginatedRDQs, totalPages } = useMemo(() => {
    // Filtrage
    const filtered = rdqs.filter(rdq => {
      const matchesSearch = rdq.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rdq.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rdq.collaborateur.nom.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCollaborateur = filterCollaborateur === 'all' || 
                                  rdq.idCollaborateur.toString() === filterCollaborateur;
      
      const matchesClient = filterClient === 'all' || 
                           rdq.idClient.toString() === filterClient;
      
      const matchesStatut = showHistorique || rdq.statut === 'en_cours';
      
      return matchesSearch && matchesCollaborateur && matchesClient && matchesStatut;
    });

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return {
      filteredRDQs: filtered,
      paginatedRDQs: paginated,
      totalPages
    };
  }, [rdqs, searchTerm, filterCollaborateur, filterClient, showHistorique, currentPage, itemsPerPage]);

  // Réinitialiser la page lors du changement de filtres
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCollaborateur, filterClient, showHistorique]);

  const handleCreateRDQ = (newRDQ: Omit<RDQ, 'idRDQ' | 'dateCreation' | 'dateModification' | 'manager' | 'collaborateur' | 'client' | 'projet' | 'documents' | 'bilans'>) => {
    const collaborateur = mockCollaborateurs.find(c => c.id === newRDQ.idCollaborateur)!;
    const client = mockClients.find(c => c.idClient === newRDQ.idClient)!;
    
    const rdq: RDQ = {
      ...newRDQ,
      idRDQ: Math.max(...rdqs.map(r => r.idRDQ)) + 1,
      dateCreation: new Date(),
      dateModification: new Date(),
      manager: user!,
      collaborateur,
      client,
      documents: [],
      bilans: []
    };
    
    setRdqs([rdq, ...rdqs]);
    setShowCreateModal(false);
  };

  const handleUpdateRDQ = (updatedRDQ: RDQ) => {
    setRdqs(rdqs.map(rdq => 
      rdq.idRDQ === updatedRDQ.idRDQ 
        ? { ...updatedRDQ, dateModification: new Date() }
        : rdq
    ));
    setSelectedRDQ(null);
  };

  const handleCloseRDQ = (rdqId: number) => {
    setRdqs(rdqs.map(rdq => 
      rdq.idRDQ === rdqId 
        ? { ...rdq, statut: 'clos' as const, dateModification: new Date() }
        : rdq
    ));
  };

  const rdqsEnCours = filteredRDQs.filter(rdq => rdq.statut === 'en_cours').length;
  const rdqsClos = filteredRDQs.filter(rdq => rdq.statut === 'clos').length;
  const rdqsAvecBilanManquant = filteredRDQs.filter(rdq => {
    const isPassé = rdq.dateHeure < new Date();
    const bilanCollaborateur = rdq.bilans.find(b => b.auteur === 'collaborateur');
    const bilanManager = rdq.bilans.find(b => b.auteur === 'manager');
    return isPassé && (!bilanCollaborateur || !bilanManager);
  }).length;

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <motion.div
        className="flex flex-col lg:flex-row justify-between items-start gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2>Tableau de bord Manager</h2>
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
              <Badge variant="default" className="bg-rdq-blue-dark text-white">
                {rdqsEnCours} RDQ en cours
              </Badge>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Badge variant="outline" className="border-rdq-gray-dark text-rdq-gray-dark">
                {rdqsClos} RDQ clôturés
              </Badge>
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
                <Badge variant="destructive">
                  {rdqsAvecBilanManquant} bilan(s) manquant(s)
                </Badge>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => setShowCreateModal(true)} 
            className="flex items-center space-x-2 transition-all duration-200 hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Créer un RDQ</span>
            <span className="sm:hidden">Créer</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Filtres et recherche */}
      <motion.div
        className="flex flex-wrap gap-4 p-4 bg-rdq-gray-light/20 rounded-lg border border-rdq-gray-light/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <motion.div
          className="flex-1 min-w-48 sm:min-w-64"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-rdq-gray-dark" />
            <Input
              placeholder="Rechercher par titre, client ou collaborateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 transition-all duration-200 focus:scale-[1.02] hover:shadow-md"
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Select value={filterCollaborateur} onValueChange={setFilterCollaborateur}>
            <SelectTrigger className="w-full sm:w-48 transition-all duration-200 hover:shadow-md">
              <SelectValue placeholder="Collaborateur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les collaborateurs</SelectItem>
              {mockCollaborateurs.map(collaborateur => (
                <SelectItem key={collaborateur.id} value={collaborateur.id.toString()}>
                  {collaborateur.prenom} {collaborateur.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
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
          transition={{ duration: 0.3, delay: 0.8 }}
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

      {/* Navigation par onglets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white border border-rdq-gray-light/50">
            <TabsTrigger 
              value="list" 
              className="flex items-center gap-2 text-rdq-gray-dark data-[state=active]:bg-rdq-blue-dark data-[state=active]:text-white data-[state=active]:border-rdq-blue-dark hover:bg-rdq-gray-light/10 transition-all duration-200"
            >
              <Filter className="h-4 w-4" />
              Liste des RDQ
            </TabsTrigger>
            <TabsTrigger 
              value="calendar"
              className="flex items-center gap-2 text-rdq-gray-dark data-[state=active]:bg-rdq-blue-dark data-[state=active]:text-white data-[state=active]:border-rdq-blue-dark hover:bg-rdq-gray-light/10 transition-all duration-200"
            >
              <CalendarIcon className="h-4 w-4" />
              Calendrier
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Informations de pagination */}
            <div className="flex justify-between items-center text-body text-rdq-gray-dark">
              <span>
                Affichage de {filteredRDQs.length} résultats
                {filteredRDQs.length !== rdqs.length && ` (${rdqs.length} au total)`}
              </span>
              <span>
                Page {currentPage} sur {totalPages}
              </span>
            </div>

            {/* Liste des RDQ avec pagination */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <AnimatePresence mode="wait">
                {paginatedRDQs.map((rdq, index) => (
                  <motion.div
                    key={`${rdq.idRDQ}-${currentPage}`}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <RDQCard
                      rdq={rdq}
                      onView={(rdq) => setSelectedRDQ(rdq)}
                      onEdit={(rdq) => setSelectedRDQ(rdq)}
                      onBilan={(rdq) => {
                        setSelectedRDQ(rdq);
                        setShowBilanModal(true);
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Contrôles de pagination */}
            {filteredRDQs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.1 }}
              >
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredRDQs.length}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                  showItemsPerPage={true}
                />
              </motion.div>
            )}

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
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <SimpleCalendar
              rdqs={rdqs}
              onRDQClick={(rdq) => setSelectedRDQ(rdq)}
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Modales */}
      {selectedRDQ && !showBilanModal && (
        <RDQModal
          rdq={selectedRDQ}
          onClose={() => setSelectedRDQ(null)}
          onUpdate={handleUpdateRDQ}
          onCloseRDQ={handleCloseRDQ}
          isManager={true}
        />
      )}

      {showCreateModal && (
        <CreateRDQModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRDQ}
        />
      )}

      {selectedRDQ && showBilanModal && (
        <BilanModal
          rdq={selectedRDQ}
          onClose={() => {
            setShowBilanModal(false);
            setSelectedRDQ(null);
          }}
          onSaveBilan={(rdq) => handleUpdateRDQ(rdq)}
          isManager={true}
        />
      )}
    </div>
  );
};