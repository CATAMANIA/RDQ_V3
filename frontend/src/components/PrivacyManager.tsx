import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarInitials } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { 
  Shield, 
  Search, 
  Trash2, 
  AlertTriangle, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Database,
  FileText,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { User as UserType } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PrivacyManagerProps {
  users: UserType[];
}

interface PersonalData {
  userId: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  dateCreation: Date;
  derniereConnexion?: Date;
  dataTypes: {
    profil: boolean;
    communications: boolean;
    documents: boolean;
    historique: boolean;
    geolocalisation: boolean;
  };
  rdqCount: number;
  documentCount: number;
}

interface PurgeConfirmation {
  userId: number;
  userName: string;
  stage: 'initial' | 'typing' | 'final';
  confirmationText: string;
}

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

export const PrivacyManager: React.FC<PrivacyManagerProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<PersonalData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [purgeConfirmation, setPurgeConfirmation] = useState<PurgeConfirmation | null>(null);
  const [isPurging, setIsPurging] = useState(false);

  const getDateLocale = () => {
    switch (language) {
      case 'en': return enUS;
      case 'de': return de;
      case 'es': return es;
      default: return fr;
    }
  };

  // Transformation des données utilisateurs en données personnelles
  const personalDataList: PersonalData[] = users.map(user => ({
    userId: user.idUtilisateur,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    adresse: user.adresse,
    dateCreation: new Date('2024-01-15'), // Mock date
    derniereConnexion: new Date(),
    dataTypes: {
      profil: true,
      communications: !!user.email,
      documents: Math.random() > 0.5,
      historique: true,
      geolocalisation: !!user.adresse
    },
    rdqCount: Math.floor(Math.random() * 50) + 1,
    documentCount: Math.floor(Math.random() * 20)
  }));

  const filteredData = personalDataList.filter(data => 
    `${data.prenom} ${data.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (data: PersonalData) => {
    setSelectedUser(data);
    setIsDetailModalOpen(true);
  };

  const handleInitiatePurge = (data: PersonalData) => {
    setPurgeConfirmation({
      userId: data.userId,
      userName: `${data.prenom} ${data.nom}`,
      stage: 'initial',
      confirmationText: ''
    });
  };

  const handleConfirmPurge = () => {
    if (!purgeConfirmation) return;

    if (purgeConfirmation.stage === 'initial') {
      setPurgeConfirmation(prev => prev ? { ...prev, stage: 'typing' } : null);
    } else if (purgeConfirmation.stage === 'typing') {
      const expectedText = `SUPPRIMER ${purgeConfirmation.userName.toUpperCase()}`;
      if (purgeConfirmation.confirmationText === expectedText) {
        setPurgeConfirmation(prev => prev ? { ...prev, stage: 'final' } : null);
      }
    } else if (purgeConfirmation.stage === 'final') {
      setIsPurging(true);
      // Simulation de la purge
      setTimeout(() => {
        setIsPurging(false);
        setPurgeConfirmation(null);
        // Ici, on supprimerait réellement les données
        console.log(`Données de l'utilisateur ${purgeConfirmation.userName} supprimées`);
      }, 2000);
    }
  };

  const getTotalDataSize = (data: PersonalData) => {
    let size = 0.5; // Données de profil de base
    if (data.dataTypes.communications) size += 0.2;
    if (data.dataTypes.documents) size += data.documentCount * 0.1;
    if (data.dataTypes.historique) size += data.rdqCount * 0.05;
    if (data.dataTypes.geolocalisation) size += 0.1;
    return size.toFixed(1);
  };

  const getDataTypeIcon = (type: string) => {
    switch (type) {
      case 'profil': return <User className="h-4 w-4" aria-hidden="true" />;
      case 'communications': return <Mail className="h-4 w-4" aria-hidden="true" />;
      case 'documents': return <FileText className="h-4 w-4" aria-hidden="true" />;
      case 'historique': return <Clock className="h-4 w-4" aria-hidden="true" />;
      case 'geolocalisation': return <MapPin className="h-4 w-4" aria-hidden="true" />;
      default: return <Database className="h-4 w-4" aria-hidden="true" />;
    }
  };

  const getDataTypeName = (type: string) => {
    switch (type) {
      case 'profil': return t('privacy.profileDataCategory');
      case 'communications': return t('privacy.communicationsCategory');
      case 'documents': return t('privacy.documentsCategory');
      case 'historique': return t('privacy.historyCategory');
      case 'geolocalisation': return t('privacy.geolocationCategory');
      default: return type;
    }
  };

  const getDataTypeDescription = (type: string, data: PersonalData) => {
    switch (type) {
      case 'profil': return t('privacy.profileDataDesc');
      case 'communications': return t('privacy.communicationsDesc');
      case 'documents': return `${data.documentCount} ${t('privacy.documentsDesc')}`;
      case 'historique': return `${data.rdqCount} ${t('privacy.historyDesc')}`;
      case 'geolocalisation': return t('privacy.geolocationDesc');
      default: return '';
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header avec statistiques */}
      <motion.div variants={itemVariants}>
        <Card className="border-rdq-yellow/50 bg-gradient-to-r from-rdq-yellow/10 to-rdq-navy/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-rdq-yellow" aria-hidden="true" />
              <div>
                <CardTitle className="text-rdq-navy" id="privacy-title">
                  {t('privacy.title')}
                </CardTitle>
                <p className="text-body" id="privacy-description">
                  {t('privacy.description')}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" role="group" aria-labelledby="stats-heading">
              <div className="sr-only" id="stats-heading">Statistiques des données personnelles</div>
              <div className="text-center p-4 bg-white/80 rounded-lg border-2 border-rdq-gray-light/50 shadow-sm">
                <div className="text-h2 text-rdq-blue-dark" aria-label={`${personalDataList.length} ${t('privacy.users')}`}>
                  {personalDataList.length}
                </div>
                <p className="text-body">{t('privacy.users')}</p>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-lg border-2 border-rdq-gray-light/50 shadow-sm">
                <div className="text-h2 text-rdq-green" aria-label={`${personalDataList.reduce((acc, data) => acc + data.rdqCount, 0)} ${t('privacy.rdqCreated')}`}>
                  {personalDataList.reduce((acc, data) => acc + data.rdqCount, 0)}
                </div>
                <p className="text-body">{t('privacy.rdqCreated')}</p>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-lg border-2 border-rdq-gray-light/50 shadow-sm">
                <div className="text-h2 text-rdq-blue-light" aria-label={`${personalDataList.reduce((acc, data) => acc + data.documentCount, 0)} ${t('privacy.documents')}`}>
                  {personalDataList.reduce((acc, data) => acc + data.documentCount, 0)}
                </div>
                <p className="text-body">{t('privacy.documents')}</p>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-lg border-2 border-rdq-gray-light/50 shadow-sm">
                <div className="text-h2 text-rdq-yellow" aria-label={`${personalDataList.reduce((acc, data) => acc + parseFloat(getTotalDataSize(data)), 0).toFixed(1)} MB ${t('privacy.totalVolume')}`}>
                  {personalDataList.reduce((acc, data) => acc + parseFloat(getTotalDataSize(data)), 0).toFixed(1)} MB
                </div>
                <p className="text-body">{t('privacy.totalVolume')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section principale */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2" id="registry-title">
                  <Database className="h-5 w-5 text-rdq-blue-dark" aria-hidden="true" />
                  {t('privacy.registry')}
                </CardTitle>
                <p className="text-body" id="registry-description">
                  {t('privacy.registryDescription')}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recherche */}
            <div className="relative">
              <Label htmlFor="search-input" className="sr-only">
                {t('privacy.search')}
              </Label>
              <Search className="absolute left-3 top-3 h-4 w-4 text-rdq-gray-dark pointer-events-none" aria-hidden="true" />
              <Input
                id="search-input"
                placeholder={t('privacy.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 focus:border-rdq-blue-light focus:ring-2 focus:ring-rdq-blue-light/20"
                aria-describedby="search-help"
              />
              <div id="search-help" className="sr-only">
                Utilisez ce champ pour filtrer la liste des utilisateurs par nom ou adresse email
              </div>
            </div>

            {/* Liste des données */}
            <div className="space-y-3" role="list" aria-labelledby="registry-title">
              <AnimatePresence>
                {filteredData.map((data) => (
                  <motion.div
                    key={data.userId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-4 border-2 border-rdq-gray-light/40 rounded-lg hover:shadow-lg hover:border-rdq-blue-light/50 transition-all duration-200 bg-white focus-within:ring-2 focus-within:ring-rdq-blue-light focus-within:border-rdq-blue-light"
                    role="listitem"
                    aria-labelledby={`user-${data.userId}-name`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          <AvatarInitials name={`${data.prenom} ${data.nom}`} />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-h3" id={`user-${data.userId}-name`}>
                            {data.prenom} {data.nom}
                          </h3>
                          <Badge variant="outline" className="text-xs bg-rdq-blue-light/10 border-rdq-blue-light text-rdq-blue-dark">
                            {getTotalDataSize(data)} MB
                          </Badge>
                        </div>
                        <p className="text-body mb-2" aria-label={`Email: ${data.email}`}>
                          {data.email}
                        </p>
                        
                        <div className="flex flex-wrap gap-1" role="list" aria-label="Types de données stockées">
                          {Object.entries(data.dataTypes).map(([type, hasData]) => (
                            hasData && (
                              <Badge 
                                key={type} 
                                variant="secondary" 
                                className="text-xs flex items-center gap-1 bg-rdq-gray-light/20 border-rdq-gray-light text-rdq-navy hover:bg-rdq-gray-light/30"
                                role="listitem"
                              >
                                {getDataTypeIcon(type)}
                                <span>{getDataTypeName(type)}</span>
                              </Badge>
                            )
                          ))}
                        </div>
                      </div>

                      <div className="text-right text-body" aria-label="Statistiques utilisateur">
                        <p aria-label={`${data.rdqCount} RDQ créés`}>
                          {data.rdqCount} RDQ
                        </p>
                        <p aria-label={`${data.documentCount} documents`}>
                          {data.documentCount} docs
                        </p>
                        {data.derniereConnexion && (
                          <p className="text-xs" aria-label={`Dernière connexion: ${format(data.derniereConnexion, 'dd/MM/yyyy', { locale: getDateLocale() })}`}>
                            {format(data.derniereConnexion, 'dd/MM/yyyy', { locale: getDateLocale() })}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4" role="group" aria-label="Actions utilisateur">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(data)}
                        className="flex items-center gap-1 border-2 border-rdq-blue-light text-rdq-blue-dark hover:bg-rdq-blue-light hover:text-white focus:ring-2 focus:ring-rdq-blue-light focus:ring-offset-2"
                        aria-label={`${t('privacy.details')} pour ${data.prenom} ${data.nom}`}
                      >
                        <Database className="h-4 w-4" aria-hidden="true" />
                        {t('privacy.details')}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleInitiatePurge(data)}
                            className="flex items-center gap-1 bg-destructive hover:bg-destructive/90 border-2 border-destructive focus:ring-2 focus:ring-destructive focus:ring-offset-2"
                            aria-label={`${t('privacy.purge')} les données de ${data.prenom} ${data.nom}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            {t('privacy.purge')}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md" role="alertdialog" aria-labelledby="purge-dialog-title" aria-describedby="purge-dialog-description">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-destructive" id="purge-dialog-title">
                              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                              {t('privacy.purgeTitle')}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="space-y-2" id="purge-dialog-description">
                              {purgeConfirmation?.stage === 'initial' && (
                                <div>
                                  <p>{t('privacy.purgeWarning')}</p>
                                  <div className="bg-destructive/10 p-3 rounded-md my-3 border-2 border-destructive/20">
                                    <p className="font-semibold text-destructive">{data.prenom} {data.nom}</p>
                                    <p className="text-sm text-rdq-gray-dark">{data.email}</p>
                                  </div>
                                  <p className="text-sm font-medium">{t('privacy.purgeIncludes')}</p>
                                  <ul className="text-sm list-disc list-inside space-y-1 ml-2">
                                    <li>{data.rdqCount} {t('privacy.rdqAndHistory')}</li>
                                    <li>{data.documentCount} {t('privacy.attachedDocuments')}</li>
                                    <li>{t('privacy.profileData')}</li>
                                    <li>{t('privacy.connectionHistory')}</li>
                                  </ul>
                                  <div className="bg-destructive/10 p-3 rounded-md border-2 border-destructive/30">
                                    <p className="text-destructive font-bold text-center">
                                      ⚠️ {t('privacy.irreversible')}
                                    </p>
                                  </div>
                                </div>
                              )}
                              
                              {purgeConfirmation?.stage === 'typing' && (
                                <div>
                                  <p className="font-medium">{t('privacy.confirmText')}</p>
                                  <div className="bg-muted p-3 rounded-md font-mono text-sm my-3 border-2 border-rdq-gray-light">
                                    {t('common.delete').toUpperCase()} {data.prenom.toUpperCase()} {data.nom.toUpperCase()}
                                  </div>
                                  <Label htmlFor="confirmation-input" className="sr-only">
                                    Champ de confirmation de suppression
                                  </Label>
                                  <Input
                                    id="confirmation-input"
                                    value={purgeConfirmation.confirmationText}
                                    onChange={(e) => setPurgeConfirmation(prev => 
                                      prev ? { ...prev, confirmationText: e.target.value } : null
                                    )}
                                    placeholder={t('privacy.typeConfirmation')}
                                    className="font-mono border-2 border-rdq-gray-light focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                                    aria-describedby="confirmation-help"
                                  />
                                  <div id="confirmation-help" className="text-xs text-rdq-gray-dark mt-1">
                                    Saisissez exactement le texte affiché ci-dessus pour confirmer
                                  </div>
                                </div>
                              )}
                              
                              {purgeConfirmation?.stage === 'final' && (
                                <div>
                                  <div className="flex items-center gap-2 text-destructive mb-3 p-3 bg-destructive/10 rounded-md border-2 border-destructive/30">
                                    <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                                    <p className="font-bold">{t('privacy.finalConfirmation')}</p>
                                  </div>
                                  <p className="font-medium">
                                    {t('privacy.confirmDelete')} <strong className="text-destructive">{data.prenom} {data.nom}</strong> ?
                                  </p>
                                  <div className="bg-muted p-3 rounded-md mt-3 border-2 border-rdq-gray-light">
                                    <p className="text-sm text-rdq-gray-dark">
                                      {t('privacy.actionLogged')}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel 
                              onClick={() => setPurgeConfirmation(null)}
                              className="border-2 border-rdq-gray-light hover:bg-rdq-gray-light/20 focus:ring-2 focus:ring-rdq-gray-light focus:ring-offset-2"
                            >
                              {t('privacy.cancel')}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleConfirmPurge}
                              disabled={
                                isPurging ||
                                (purgeConfirmation?.stage === 'typing' && 
                                 purgeConfirmation.confirmationText !== `${t('common.delete').toUpperCase()} ${data.prenom.toUpperCase()} ${data.nom.toUpperCase()}`)
                              }
                              className="bg-destructive hover:bg-destructive/90 border-2 border-destructive focus:ring-2 focus:ring-destructive focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-describedby={isPurging ? "purge-progress" : undefined}
                            >
                              {isPurging ? (
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" 
                                    aria-hidden="true"
                                  />
                                  <span id="purge-progress">{t('privacy.deleting')}</span>
                                </div>
                              ) : purgeConfirmation?.stage === 'initial' ? (
                                t('privacy.continue')
                              ) : purgeConfirmation?.stage === 'typing' ? (
                                t('privacy.validate')
                              ) : (
                                t('privacy.deleteDefinitely')
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal de détails */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" role="dialog" aria-labelledby="details-dialog-title" aria-describedby="details-dialog-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" id="details-dialog-title">
              <Database className="h-5 w-5 text-rdq-blue-dark" aria-hidden="true" />
              {t('privacy.detailsTitle')}
            </DialogTitle>
            <DialogDescription id="details-dialog-description">
              {t('privacy.detailsDescription')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* En-tête utilisateur */}
              <div className="flex items-center gap-4 p-4 bg-rdq-gray-light/10 rounded-lg border-2 border-rdq-gray-light/30">
                <Avatar className="h-16 w-16" role="img" aria-label={`Avatar de ${selectedUser.prenom} ${selectedUser.nom}`}>
                  <AvatarFallback>
                    <AvatarInitials name={`${selectedUser.prenom} ${selectedUser.nom}`} />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-h3" id="selected-user-name">
                    {selectedUser.prenom} {selectedUser.nom}
                  </h3>
                  <p className="text-body" aria-label={`Email: ${selectedUser.email}`}>
                    {selectedUser.email}
                  </p>
                  <Badge className="mt-1 bg-rdq-blue-light/20 text-rdq-blue-dark border-rdq-blue-light">
                    {t('privacy.totalVolumeBadge')} {getTotalDataSize(selectedUser)} MB
                  </Badge>
                </div>
              </div>

              {/* Catégories de données */}
              <div className="space-y-4">
                <h4 className="text-h4 flex items-center gap-2" id="data-categories-heading">
                  <Shield className="h-4 w-4" aria-hidden="true" />
                  {t('privacy.storedDataCategories')}
                </h4>
                
                <div className="grid gap-3" role="list" aria-labelledby="data-categories-heading">
                  {Object.entries(selectedUser.dataTypes).map(([type, hasData]) => (
                    <div 
                      key={type} 
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                        hasData 
                          ? 'bg-rdq-green/10 border-rdq-green/30 text-rdq-green' 
                          : 'bg-rdq-gray-light/10 border-rdq-gray-light/30 text-rdq-gray-dark'
                      }`}
                      role="listitem"
                      aria-labelledby={`data-type-${type}-title`}
                    >
                      <div className="flex items-center gap-3">
                        {getDataTypeIcon(type)}
                        <div>
                          <p className="font-medium text-rdq-navy" id={`data-type-${type}-title`}>
                            {getDataTypeName(type)}
                          </p>
                          <p className="text-sm text-rdq-gray-dark">
                            {getDataTypeDescription(type, selectedUser)}
                          </p>
                        </div>
                      </div>
                      {hasData ? (
                        <CheckCircle2 
                          className="h-5 w-5 text-rdq-green" 
                          aria-label="Données présentes"
                        />
                      ) : (
                        <XCircle 
                          className="h-5 w-5 text-rdq-gray-dark" 
                          aria-label="Aucune donnée"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Métadonnées */}
              <div className="space-y-4">
                <h4 className="text-h4 flex items-center gap-2" id="metadata-heading">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {t('privacy.metadata')}
                </h4>
                
                <div className="grid grid-cols-2 gap-4" role="list" aria-labelledby="metadata-heading">
                  <div className="p-3 bg-muted rounded-lg border-2 border-rdq-gray-light/30" role="listitem">
                    <p className="text-sm font-medium text-rdq-navy">{t('privacy.creationDate')}</p>
                    <p className="text-sm text-rdq-gray-dark">
                      {format(selectedUser.dateCreation, 'dd MMMM yyyy', { locale: getDateLocale() })}
                    </p>
                  </div>
                  {selectedUser.derniereConnexion && (
                    <div className="p-3 bg-muted rounded-lg border-2 border-rdq-gray-light/30" role="listitem">
                      <p className="text-sm font-medium text-rdq-navy">{t('privacy.lastConnection')}</p>
                      <p className="text-sm text-rdq-gray-dark">
                        {format(selectedUser.derniereConnexion, 'dd MMMM yyyy à HH:mm', { locale: getDateLocale() })}
                      </p>
                    </div>
                  )}
                  <div className="p-3 bg-muted rounded-lg border-2 border-rdq-gray-light/30" role="listitem">
                    <p className="text-sm font-medium text-rdq-navy">{t('privacy.rdqCreatedCount')}</p>
                    <p className="text-sm text-rdq-gray-dark">{selectedUser.rdqCount}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg border-2 border-rdq-gray-light/30" role="listitem">
                    <p className="text-sm font-medium text-rdq-navy">{t('privacy.attachedDocsCount')}</p>
                    <p className="text-sm text-rdq-gray-dark">{selectedUser.documentCount}</p>
                  </div>
                </div>
              </div>

              {/* Note RGPD */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Conformité RGPD</p>
                    <p className="text-sm text-blue-700 mt-1">
                      L'utilisateur a le droit de demander l'accès, la rectification ou la suppression 
                      de ses données personnelles. Toute action de purge sera journalisée conformément 
                      aux obligations légales.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};