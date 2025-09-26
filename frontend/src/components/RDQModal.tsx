import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calendar, MapPin, Phone, Mail, Navigation, FileText, User, Building, Clock, Lock } from 'lucide-react';
import { RDQ } from '../types';
import { mockCollaborateurs, mockClients, mockProjets } from '../data/mockData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RDQModalProps {
  rdq: RDQ;
  onClose: () => void;
  onUpdate?: (rdq: RDQ) => void;
  onCloseRDQ?: (rdqId: number) => void;
  isManager: boolean;
}

export const RDQModal: React.FC<RDQModalProps> = ({ 
  rdq: initialRdq, 
  onClose, 
  onUpdate, 
  onCloseRDQ,
  isManager 
}) => {
  const [rdq, setRdq] = useState<RDQ>(initialRdq);
  const [isEditing, setIsEditing] = useState(false);

  const canEdit = isManager && rdq.statut === 'en_cours';
  const canClose = isManager && rdq.bilans.length === 2 && rdq.statut === 'en_cours';

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(rdq);
    }
    setIsEditing(false);
  };

  const handleCloseRDQ = () => {
    if (onCloseRDQ) {
      onCloseRDQ(rdq.idRDQ);
    }
    onClose();
  };

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
        const startDate = format(rdq.dateHeure, "yyyyMMdd'T'HHmmss");
        const endDate = format(new Date(rdq.dateHeure.getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss");
        const calendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(rdq.titre)}&startdt=${startDate}&enddt=${endDate}&location=${encodeURIComponent(rdq.adresse || 'Visioconférence')}`;
        window.open(calendarUrl, '_blank');
        break;
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center space-x-2">
                {rdq.statut === 'clos' && <Lock className="h-5 w-5 text-gray-500" />}
                <span>{rdq.titre}</span>
              </DialogTitle>
              <DialogDescription>
                Détails et gestion du rendez-vous qualifié
              </DialogDescription>
            </div>
            <div className="flex space-x-2">
              <Badge variant={rdq.mode === 'physique' ? 'default' : 'secondary'}>
                {rdq.mode === 'physique' ? 'Physique' : 'Visio'}
              </Badge>
              <Badge variant={rdq.statut === 'clos' ? 'outline' : 'default'}>
                {rdq.statut === 'clos' ? 'Clôturé' : 'En cours'}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Titre</Label>
                {isEditing ? (
                  <Input
                    value={rdq.titre}
                    onChange={(e) => setRdq({ ...rdq, titre: e.target.value })}
                  />
                ) : (
                  <p className="mt-1">{rdq.titre}</p>
                )}
              </div>

              <div>
                <Label>Date et heure</Label>
                {isEditing ? (
                  <Input
                    type="datetime-local"
                    value={format(rdq.dateHeure, "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => setRdq({ ...rdq, dateHeure: new Date(e.target.value) })}
                  />
                ) : (
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{format(rdq.dateHeure, 'PPPp', { locale: fr })}</span>
                  </div>
                )}
              </div>

              <div>
                <Label>Mode</Label>
                {isEditing ? (
                  <Select value={rdq.mode} onValueChange={(value) => setRdq({ ...rdq, mode: value as 'physique' | 'visio' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physique">Physique</SelectItem>
                      <SelectItem value="visio">Visioconférence</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1">{rdq.mode === 'physique' ? 'Physique' : 'Visioconférence'}</p>
                )}
              </div>

              {(rdq.adresse || isEditing) && (
                <div>
                  <Label>Adresse</Label>
                  {isEditing ? (
                    <Textarea
                      value={rdq.adresse || ''}
                      onChange={(e) => setRdq({ ...rdq, adresse: e.target.value })}
                      placeholder="Adresse du rendez-vous"
                    />
                  ) : (
                    <div className="flex items-start space-x-2 mt-1">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span>{rdq.adresse}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label>Client</Label>
                {isEditing ? (
                  <Select value={rdq.idClient.toString()} onValueChange={(value) => {
                    const client = mockClients.find(c => c.idClient.toString() === value)!;
                    setRdq({ ...rdq, idClient: parseInt(value), client });
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockClients.map(client => (
                        <SelectItem key={client.idClient} value={client.idClient.toString()}>
                          {client.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="space-y-1 mt-1">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span>{rdq.client.nom}</span>
                    </div>
                    {rdq.client.contact && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{rdq.client.contact}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label>Collaborateur</Label>
                {isEditing ? (
                  <Select value={rdq.idCollaborateur.toString()} onValueChange={(value) => {
                    const collaborateur = mockCollaborateurs.find(c => c.id.toString() === value)!;
                    setRdq({ ...rdq, idCollaborateur: parseInt(value), collaborateur });
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCollaborateurs.map(collaborateur => (
                        <SelectItem key={collaborateur.id} value={collaborateur.id.toString()}>
                          {collaborateur.prenom} {collaborateur.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1">{rdq.collaborateur.prenom} {rdq.collaborateur.nom}</p>
                )}
              </div>

              <div>
                <Label>Projet</Label>
                {isEditing ? (
                  <Select value={rdq.idProjet ? rdq.idProjet.toString() : 'none'} onValueChange={(value) => {
                    if (value && value !== 'none') {
                      const projet = mockProjets.find(p => p.idProjet.toString() === value)!;
                      setRdq({ ...rdq, idProjet: parseInt(value), projet });
                    } else {
                      setRdq({ ...rdq, idProjet: undefined, projet: undefined });
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun projet</SelectItem>
                      {mockProjets.map(projet => (
                        <SelectItem key={projet.idProjet} value={projet.idProjet.toString()}>
                          {projet.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1">{rdq.projet?.nom || 'Aucun projet associé'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Indications manager */}
          {(rdq.indicationsManager || isEditing) && (
            <>
              <Separator />
              <div>
                <Label>Indications du manager</Label>
                {isEditing ? (
                  <Textarea
                    value={rdq.indicationsManager || ''}
                    onChange={(e) => setRdq({ ...rdq, indicationsManager: e.target.value })}
                    placeholder="Indications particulières pour ce RDQ..."
                    rows={3}
                  />
                ) : (
                  <p className="mt-1 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
                    {rdq.indicationsManager}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Actions rapides */}
          <Separator />
          <div>
            <Label>Actions rapides</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {rdq.adresse && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExternalAction('maps')}
                  className="flex items-center space-x-2"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Ouvrir dans Maps</span>
                </Button>
              )}
              
              {rdq.client.telephone && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExternalAction('phone', rdq.client.telephone)}
                  className="flex items-center space-x-2"
                >
                  <Phone className="h-4 w-4" />
                  <span>Appeler client</span>
                </Button>
              )}
              
              {rdq.client.email && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExternalAction('email', rdq.client.email)}
                  className="flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email client</span>
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExternalAction('calendar')}
                className="flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Ajouter à l'agenda</span>
              </Button>
            </div>
          </div>

          {/* Documents */}
          <Separator />
          <div>
            <Label>Documents joints ({rdq.documents.length})</Label>
            {rdq.documents.length > 0 ? (
              <div className="space-y-2 mt-2">
                {rdq.documents.map(doc => (
                  <div key={doc.idDocument} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{doc.nomFichier}</p>
                      <p className="text-xs text-gray-500">{doc.type}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">Aucun document joint</p>
            )}
          </div>

          {/* Bilans */}
          {rdq.bilans.length > 0 && (
            <>
              <Separator />
              <div>
                <Label>Bilans</Label>
                <div className="space-y-3 mt-2">
                  {rdq.bilans.map(bilan => (
                    <div key={bilan.idBilan} className="p-3 bg-gray-50 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={bilan.auteur === 'manager' ? 'default' : 'secondary'}>
                          {bilan.auteur === 'manager' ? 'Manager' : 'Collaborateur'}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">Note: {bilan.note}/10</p>
                          <p className="text-xs text-gray-500">
                            {format(bilan.dateCreation, 'PPp', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      {bilan.commentaire && (
                        <p className="text-sm text-gray-700">{bilan.commentaire}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Informations système */}
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <p><strong>Créé le:</strong> {format(rdq.dateCreation, 'PPp', { locale: fr })}</p>
            </div>
            <div>
              <p><strong>Modifié le:</strong> {format(rdq.dateModification, 'PPp', { locale: fr })}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <div>
            {canClose && (
              <Button variant="outline" onClick={handleCloseRDQ}>
                <Lock className="h-4 w-4 mr-2" />
                Clôturer le RDQ
              </Button>
            )}
          </div>
          
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSave}>
                  Enregistrer
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onClose}>
                  Fermer
                </Button>
                {canEdit && (
                  <Button onClick={() => setIsEditing(true)}>
                    Modifier
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};