import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Calendar as CalendarIcon } from 'lucide-react';
import { RDQ } from '../types';

// Fonctions de date simplifiées sans dépendance externe
const format = (date: Date, formatString: string, options?: { locale?: any }): string => {
  // Implémentation simple pour les formats utilisés
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  if (formatString === 'yyyy-MM-dd') {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
  if (formatString === 'd') {
    return day.toString();
  }
  if (formatString === 'HH:mm') {
    return `${hours}:${minutes}`;
  }
  if (formatString === 'EEEE d MMMM yyyy') {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    return `${days[date.getDay()]} ${day} ${months[date.getMonth()]} ${year}`;
  }
  return date.toLocaleDateString();
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

const isPast = (date: Date): boolean => {
  return date < new Date();
};

interface RDQCalendarProps {
  rdqs: RDQ[];
  onRDQClick: (rdq: RDQ) => void;
}

export const RDQCalendar: React.FC<RDQCalendarProps> = ({ rdqs, onRDQClick }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Obtenir les noms localisés des jours et mois
  const getLocalizedDayName = (date: Date): string => {
    const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return dayNames[date.getDay()];
  };

  const getLocalizedMonthName = (date: Date): string => {
    const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    return monthNames[date.getMonth()];
  };

  // Grouper les RDQ par date
  const rdqsByDate = useMemo(() => {
    const grouped = new Map<string, RDQ[]>();
    
    rdqs.forEach(rdq => {
      const dateKey = format(rdq.dateHeure, 'yyyy-MM-dd');
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(rdq);
    });
    
    return grouped;
  }, [rdqs]);

  // Obtenir les RDQ pour une date donnée
  const getRDQsForDate = (date: Date): RDQ[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return rdqsByDate.get(dateKey) || [];
  };

  // Obtenir les RDQ du jour sélectionné
  const selectedDateRDQs = getRDQsForDate(selectedDate);

  const getStatusColor = (statut: string, dateHeure: Date) => {
    if (isPast(dateHeure) && statut !== 'clos') {
      return 'destructive';
    }
    switch (statut) {
      case 'planifie':
        return 'default';
      case 'en_cours':
        return 'secondary';
      case 'clos':
        return 'outline';
      case 'annule':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusText = (statut: string) => {
    return t(`rdq.status.${statut}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendrier principal */}
      <motion.div 
        className="lg:col-span-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-rdq-gray-light/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-rdq-blue-light" />
              Calendrier RDQ
            </CardTitle>
            <div className="flex items-center gap-4 text-body">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rdq-blue-light" />
                <span>RDQ à venir</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rdq-gray-dark" />
                <span>RDQ passés</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rdq-yellow" />
                <span>Plusieurs RDQ</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="w-full"
              modifiers={{
                hasRdq: (date) => getRDQsForDate(date).length > 0,
                hasPastRdq: (date) => getRDQsForDate(date).some(rdq => isPast(rdq.dateHeure)),
                hasUpcomingRdq: (date) => getRDQsForDate(date).some(rdq => !isPast(rdq.dateHeure))
              }}
              modifiersStyles={{
                hasRdq: { position: 'relative' },
                hasPastRdq: { 
                  borderBottom: '3px solid var(--rdq-gray-dark)'
                },
                hasUpcomingRdq: {
                  borderBottom: '3px solid var(--rdq-blue-light)'
                }
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Panel des RDQ du jour sélectionné */}
      <motion.div 
        className="lg:col-span-1"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-rdq-gray-light/50">
          <CardHeader className="pb-3">
            <CardTitle>
              {isToday(selectedDate) 
                ? "Aujourd'hui"
                : `${getLocalizedDayName(selectedDate)} ${selectedDate.getDate()} ${getLocalizedMonthName(selectedDate)} ${selectedDate.getFullYear()}`
              }
            </CardTitle>
            {selectedDateRDQs.length > 0 && (
              <p className="text-body text-rdq-gray-dark">
                {selectedDateRDQs.length} RDQ {selectedDateRDQs.length > 1 ? 'prévus' : 'prévu'}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {selectedDateRDQs.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-rdq-gray-light mx-auto mb-3" />
                <p className="text-body text-rdq-gray-dark">
                  Aucun RDQ prévu pour cette date
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateRDQs
                  .sort((a, b) => a.dateHeure.getTime() - b.dateHeure.getTime())
                  .map((rdq) => (
                    <motion.div
                      key={rdq.idRDQ}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border border-rdq-gray-light/50 rounded-lg p-3 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => onRDQClick(rdq)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-rdq-navy line-clamp-1">
                          {rdq.titre}
                        </h4>
                        <Badge 
                          variant={getStatusColor(rdq.statut, rdq.dateHeure)}
                          className="text-xs"
                        >
                          {getStatusText(rdq.statut)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-body text-rdq-gray-dark">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{format(rdq.dateHeure, 'HH:mm')}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span className="truncate">
                            {rdq.collaborateur.prenom} {rdq.collaborateur.nom}
                          </span>
                        </div>
                        
                        {rdq.mode === 'physique' && rdq.adresse && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate text-xs">
                              {rdq.adresse}
                            </span>
                          </div>
                        )}
                        
                        {rdq.mode !== 'physique' && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-rdq-blue-light/10 text-rdq-blue-dark rounded">
                              {rdq.mode === 'visio' ? 'Visioconférence' : 'Téléphone'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-rdq-gray-light/30">
                        <p className="text-xs text-rdq-gray-dark">
                          <strong>{rdq.client.nom}</strong>
                          {rdq.projet && ` • ${rdq.projet.nom}`}
                        </p>
                      </div>
                    </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};