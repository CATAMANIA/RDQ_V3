import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { RDQ, Bilan } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BilanModalProps {
  rdq: RDQ;
  onClose: () => void;
  onSaveBilan: (rdq: RDQ) => void;
  isManager: boolean;
}

export const BilanModal: React.FC<BilanModalProps> = ({ 
  rdq, 
  onClose, 
  onSaveBilan, 
  isManager 
}) => {
  const { user } = useAuth();
  const userType = isManager ? 'manager' : 'collaborateur';
  
  const existingBilan = rdq.bilans.find(b => b.auteur === userType);
  const otherBilan = rdq.bilans.find(b => b.auteur !== userType);

  const [note, setNote] = useState<string>(existingBilan?.note.toString() || '');
  const [commentaire, setCommentaire] = useState<string>(existingBilan?.commentaire || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!note || parseInt(note) < 1 || parseInt(note) > 10) {
      newErrors.note = 'La note doit être comprise entre 1 et 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const newBilan: Bilan = {
      idBilan: existingBilan?.idBilan || Math.max(...rdq.bilans.map(b => b.idBilan), 0) + 1,
      note: parseInt(note),
      commentaire: commentaire.trim() || undefined,
      auteur: userType,
      idRDQ: rdq.idRDQ,
      dateCreation: existingBilan?.dateCreation || new Date()
    };

    const updatedBilans = existingBilan 
      ? rdq.bilans.map(b => b.idBilan === existingBilan.idBilan ? newBilan : b)
      : [...rdq.bilans, newBilan];

    const updatedRDQ: RDQ = {
      ...rdq,
      bilans: updatedBilans
    };

    onSaveBilan(updatedRDQ);
    onClose();
  };

  const canSaveBilan = rdq.dateHeure < new Date() && rdq.statut === 'en_cours';

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bilan du RDQ - {rdq.titre}</DialogTitle>
          <DialogDescription>
            Saisissez votre évaluation et vos commentaires sur ce rendez-vous qualifié.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations du RDQ */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Client:</strong> {rdq.client.nom}</p>
                <p><strong>Date:</strong> {format(rdq.dateHeure, 'PPp', { locale: fr })}</p>
              </div>
              <div>
                <p><strong>Collaborateur:</strong> {rdq.collaborateur.prenom} {rdq.collaborateur.nom}</p>
                <p><strong>Mode:</strong> {rdq.mode === 'physique' ? 'Physique' : 'Visioconférence'}</p>
              </div>
            </div>
          </div>

          {/* Bilan de l'autre partie */}
          {otherBilan && (
            <>
              <Separator />
              <div>
                <Label>Bilan {otherBilan.auteur === 'manager' ? 'du manager' : 'du collaborateur'}</Label>
                <div className="mt-2 p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={otherBilan.auteur === 'manager' ? 'default' : 'secondary'}>
                      {otherBilan.auteur === 'manager' ? 'Manager' : 'Collaborateur'}
                    </Badge>
                    <p className="font-medium">Note: {otherBilan.note}/10</p>
                  </div>
                  {otherBilan.commentaire && (
                    <p className="text-sm text-gray-700">{otherBilan.commentaire}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {format(otherBilan.dateCreation, 'PPp', { locale: fr })}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Formulaire de bilan */}
          <Separator />
          <div className="space-y-4">
            <div>
              <Label>Votre bilan ({isManager ? 'Manager' : 'Collaborateur'})</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note sur 10 *</Label>
              <Select value={note || undefined} onValueChange={setNote} disabled={!canSaveBilan}>
                <SelectTrigger className={errors.note ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner une note" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <SelectItem key={n} value={n.toString()}>
                      {n}/10
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.note && <p className="text-sm text-red-500">{errors.note}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="commentaire">Commentaire</Label>
              <Textarea
                id="commentaire"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder={
                  isManager 
                    ? "Votre retour sur l'entretien, points positifs, axes d'amélioration..." 
                    : "Votre impression sur l'entretien, ressenti, difficultés rencontrées..."
                }
                rows={4}
                disabled={!canSaveBilan}
              />
            </div>

            {existingBilan && (
              <div className="text-sm text-gray-500">
                <p>Bilan initialement créé le {format(existingBilan.dateCreation, 'PPp', { locale: fr })}</p>
              </div>
            )}
          </div>

          {!canSaveBilan && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              {rdq.dateHeure > new Date() 
                ? "Le bilan ne peut être saisi qu'après la date du RDQ."
                : "Ce RDQ est clôturé, le bilan ne peut plus être modifié."
              }
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            {canSaveBilan ? 'Annuler' : 'Fermer'}
          </Button>
          {canSaveBilan && (
            <Button onClick={handleSave}>
              {existingBilan ? 'Mettre à jour' : 'Enregistrer'} le bilan
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};