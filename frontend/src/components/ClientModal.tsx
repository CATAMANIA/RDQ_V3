import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Client } from '../types';
import { Save, X, Building2, Edit3 } from 'lucide-react';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
}

export const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, client }) => {
  const [formData, setFormData] = useState({
    nom: '',
    contact: '',
    telephone: '',
    email: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = !!client;

  useEffect(() => {
    if (client) {
      setFormData({
        nom: client.nom,
        contact: client.contact || '',
        telephone: client.telephone || '',
        email: client.email || ''
      });
    } else {
      setFormData({
        nom: '',
        contact: '',
        telephone: '',
        email: ''
      });
    }
    setErrors({});
  }, [client, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom de l\'entreprise est requis';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (formData.telephone && !/^(\+33|0)[1-9](\.[0-9]{2}){4}$/.test(formData.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = 'Format de téléphone invalide (ex: 01.23.45.67.89)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Simulation de la sauvegarde
    console.log(isEditing ? 'Mise à jour client:' : 'Création client:', formData);
    
    // TODO: Intégrer avec l'API
    // if (isEditing) {
    //   updateClient(client.idClient, formData);
    // } else {
    //   createClient(formData);
    // }

    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Edit3 className="h-5 w-5 text-rdq-blue-light" />
                Modifier le client
              </>
            ) : (
              <>
                <Building2 className="h-5 w-5 text-rdq-green" />
                Ajouter un client
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 
              'Modifiez les informations de ce client. Les changements seront appliqués après validation.' :
              'Ajoutez un nouveau client en renseignant au minimum le nom de l\'entreprise.'
            }
          </DialogDescription>
        </DialogHeader>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Information sur les clients */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-rdq-blue-light" />
                <Label className="text-body-bold">Information client</Label>
              </div>
              <p className="text-body">
                Les clients représentent les entreprises partenaires pour lesquelles des RDQ sont organisés.
                Assurez-vous de renseigner au minimum le nom de l'entreprise.
              </p>
            </CardContent>
          </Card>

          {/* Nom de l'entreprise */}
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de l'entreprise *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => handleChange('nom', e.target.value)}
              placeholder="Ex: ACME Corporation"
              className={errors.nom ? 'border-destructive' : ''}
            />
            {errors.nom && (
              <p className="text-xs text-destructive">{errors.nom}</p>
            )}
          </div>

          {/* Contact principal */}
          <div className="space-y-2">
            <Label htmlFor="contact">Contact principal</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => handleChange('contact', e.target.value)}
              placeholder="Ex: M. Durand, Directeur RH"
            />
            <p className="text-xs text-rdq-gray-dark">
              Nom et fonction de la personne de contact principal
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="contact@acme.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => handleChange('telephone', e.target.value)}
                placeholder="01.23.45.67.89"
                className={errors.telephone ? 'border-destructive' : ''}
              />
              {errors.telephone && (
                <p className="text-xs text-destructive">{errors.telephone}</p>
              )}
            </div>
          </div>

          {/* Aperçu */}
          {formData.nom && (
            <Card className="border-rdq-blue-light/30 bg-rdq-blue-light/5">
              <CardContent className="pt-4">
                <Label className="text-body-bold text-rdq-blue-dark">Aperçu</Label>
                <div className="mt-2">
                  <h3 className="text-h3 text-rdq-navy">{formData.nom}</h3>
                  {formData.contact && <p className="text-body">Contact: {formData.contact}</p>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.email && (
                      <span className="text-xs bg-rdq-blue-light/20 text-rdq-blue-dark rounded px-2 py-1">
                        📧 {formData.email}
                      </span>
                    )}
                    {formData.telephone && (
                      <span className="text-xs bg-rdq-green/20 text-rdq-green rounded px-2 py-1">
                        📞 {formData.telephone}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" className="bg-rdq-green hover:bg-rdq-green/90">
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Mettre à jour' : 'Créer le client'}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};