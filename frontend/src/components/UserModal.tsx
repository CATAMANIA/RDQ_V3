import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { User, UserRole } from '../types';
import { Save, X, UserPlus, Edit3 } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: 'collaborateur' as UserRole
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone || '',
        role: user.role
      });
    } else {
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        role: 'collaborateur'
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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
    console.log(isEditing ? 'Mise à jour utilisateur:' : 'Création utilisateur:', formData);
    
    // TODO: Intégrer avec l'API
    // if (isEditing) {
    //   updateUser(user.id, formData);
    // } else {
    //   createUser(formData);
    // }

    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-rdq-yellow text-rdq-navy';
      case 'manager': return 'bg-rdq-blue-dark text-white';
      case 'collaborateur': return 'bg-rdq-blue-light text-white';
      default: return 'bg-rdq-gray-light text-rdq-navy';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'manager': return 'Manager';
      case 'collaborateur': return 'Collaborateur';
      default: return role;
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
                Modifier l'utilisateur
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 text-rdq-green" />
                Ajouter un utilisateur
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 
              'Modifiez les informations de cet utilisateur. Les modifications seront sauvegardées après validation.' :
              'Créez un nouvel utilisateur en remplissant les informations ci-dessous. Le rôle détermine les permissions d\'accès.'
            }
          </DialogDescription>
        </DialogHeader>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Aperçu du rôle */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-body-bold">Rôle sélectionné</Label>
                  <p className="text-body mt-1">
                    {formData.role === 'admin' && 'Accès complet au backoffice et à toutes les fonctionnalités'}
                    {formData.role === 'manager' && 'Création et gestion des RDQ, attribution aux collaborateurs'}
                    {formData.role === 'collaborateur' && 'Consultation des RDQ assignés et saisie des bilans'}
                  </p>
                </div>
                <Badge className={getRoleColor(formData.role)}>
                  {getRoleLabel(formData.role)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prénom */}
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => handleChange('prenom', e.target.value)}
                placeholder="Ex: Jean"
                className={errors.prenom ? 'border-destructive' : ''}
              />
              {errors.prenom && (
                <p className="text-xs text-destructive">{errors.prenom}</p>
              )}
            </div>

            {/* Nom */}
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                placeholder="Ex: Dupont"
                className={errors.nom ? 'border-destructive' : ''}
              />
              {errors.nom && (
                <p className="text-xs text-destructive">{errors.nom}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="jean.dupont@exemple.com"
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
            <p className="text-xs text-rdq-gray-dark">Format: 01.23.45.67.89</p>
          </div>

          {/* Rôle */}
          <div className="space-y-2">
            <Label htmlFor="role">Rôle *</Label>
            <Select value={formData.role} onValueChange={(value: UserRole) => handleChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-rdq-yellow rounded-full"></div>
                    Administrateur
                  </div>
                </SelectItem>
                <SelectItem value="manager">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-rdq-blue-dark rounded-full"></div>
                    Manager
                  </div>
                </SelectItem>
                <SelectItem value="collaborateur">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-rdq-blue-light rounded-full"></div>
                    Collaborateur
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" className="bg-rdq-blue-dark hover:bg-rdq-blue-dark/90">
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Mettre à jour' : 'Créer l\'utilisateur'}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};