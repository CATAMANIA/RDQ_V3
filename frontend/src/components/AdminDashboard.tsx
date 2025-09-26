import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarInitials } from './ui/avatar';
import { Plus, Users, Building2, UserCheck, Search, Edit, Trash2, MoreVertical, Shield } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { mockManagers, mockCollaborateurs, mockClients, mockAdmins } from '../data/mockData';
import { User, Client } from '../types';
import { UserModal } from './UserModal';
import { ClientModal } from './ClientModal';
import { PrivacyManager } from './PrivacyManager';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const AdminDashboard: React.FC = () => {
  const [allUsers] = useState<User[]>([...mockAdmins, ...mockManagers, ...mockCollaborateurs]);
  const [allClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<'all' | 'admin' | 'manager' | 'collaborateur'>('all');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = `${user.prenom} ${user.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedUserType === 'all' || user.role === selectedUserType;
    return matchesSearch && matchesType;
  });

  const filteredClients = allClients.filter(client =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.contact && client.contact.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsClientModalOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setIsClientModalOpen(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-rdq-yellow text-rdq-navy';
      case 'manager': return 'bg-rdq-blue-dark text-white';
      case 'collaborateur': return 'bg-rdq-blue-light text-white';
      default: return 'bg-rdq-gray-light text-rdq-navy';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'manager': return 'Manager';
      case 'collaborateur': return 'Collaborateur';
      default: return role;
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="mb-2">Administration RDQ</h1>
        <p>Gestion centralisée des utilisateurs, clients et collaborateurs de l'application RDQ</p>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-h4">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-rdq-blue-light" />
          </CardHeader>
          <CardContent>
            <div className="text-h2">{allUsers.length}</div>
            <p className="text-xs text-rdq-gray-dark">
              {mockAdmins.length} admin • {mockManagers.length} managers • {mockCollaborateurs.length} collaborateurs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-h4">Clients</CardTitle>
            <Building2 className="h-4 w-4 text-rdq-green" />
          </CardHeader>
          <CardContent>
            <div className="text-h2">{allClients.length}</div>
            <p className="text-xs text-rdq-gray-dark">Partenaires commerciaux</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-h4">Managers Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-rdq-blue-dark" />
          </CardHeader>
          <CardContent>
            <div className="text-h2">{mockManagers.length}</div>
            <p className="text-xs text-rdq-gray-dark">Gérant des RDQ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-h4">Collaborateurs</CardTitle>
            <Users className="h-4 w-4 text-rdq-blue-light" />
          </CardHeader>
          <CardContent>
            <div className="text-h2">{mockCollaborateurs.length}</div>
            <p className="text-xs text-rdq-gray-dark">Exécutant les entretiens</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">Gestion des Utilisateurs</TabsTrigger>
            <TabsTrigger value="clients">Gestion des Clients</TabsTrigger>
            <TabsTrigger value="privacy">Données Personnelles</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Utilisateurs</CardTitle>
                    <p className="text-body">Gérez les administrateurs, managers et collaborateurs</p>
                  </div>
                  <Button onClick={handleAddUser} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un utilisateur
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-rdq-gray-dark" />
                    <Input
                      placeholder="Rechercher par nom ou email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedUserType} onValueChange={(value: any) => setSelectedUserType(value)}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filtrer par rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les rôles</SelectItem>
                      <SelectItem value="admin">Administrateurs</SelectItem>
                      <SelectItem value="manager">Managers</SelectItem>
                      <SelectItem value="collaborateur">Collaborateurs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users list */}
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            <AvatarInitials name={`${user.prenom} ${user.nom}`} />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-h3">{user.prenom} {user.nom}</h3>
                            <Badge className={getRoleColor(user.role)}>
                              {getRoleLabel(user.role)}
                            </Badge>
                          </div>
                          <p className="text-body">{user.email}</p>
                          {user.telephone && (
                            <p className="text-body">{user.telephone}</p>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Clients</CardTitle>
                    <p className="text-body">Gérez les entreprises clientes et leurs contacts</p>
                  </div>
                  <Button onClick={handleAddClient} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un client
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-rdq-gray-dark" />
                  <Input
                    placeholder="Rechercher par nom d'entreprise ou contact..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Clients list */}
                <div className="space-y-3">
                  {filteredClients.map((client) => (
                    <motion.div
                      key={client.idClient}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-rdq-blue-light/10 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-rdq-blue-light" />
                        </div>
                        <div>
                          <h3 className="text-h3">{client.nom}</h3>
                          {client.contact && <p className="text-body">Contact: {client.contact}</p>}
                          {client.email && <p className="text-body">{client.email}</p>}
                          {client.telephone && <p className="text-body">{client.telephone}</p>}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClient(client)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <PrivacyManager users={allUsers} />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Modals */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
      />
    </motion.div>
  );
};