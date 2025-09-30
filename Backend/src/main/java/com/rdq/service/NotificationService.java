package com.rdq.service;

import com.rdq.entity.RdqEntity;
import com.rdq.entity.UserEntity;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.extern.slf4j.Slf4j;

/**
 * Service de notification selon les instructions Backend
 * - @ApplicationScoped pour CDI
 * - @Slf4j (Lombok) pour logging automatique
 * - Simulation des notifications (à implémenter selon les besoins)
 */
@ApplicationScoped
@Slf4j
public class NotificationService {
    
    /**
     * Notification de création de RDQ
     */
    public void sendRdqCreatedNotification(RdqEntity rdq) {
        log.info("Sending RDQ created notification: rdqId={}, user={}", 
                rdq.id, rdq.user.email);
        
        // TODO: Implémenter l'envoi d'email/notification
        // Exemple: envoi d'email à l'utilisateur confirmant la création
    }
    
    /**
     * Notification de soumission de RDQ au manager
     */
    public void sendRdqSubmittedNotification(RdqEntity rdq) {
        if (rdq.user.manager != null) {
            log.info("Sending RDQ submitted notification: rdqId={}, manager={}", 
                    rdq.id, rdq.user.manager.email);
            
            // TODO: Implémenter l'envoi d'email au manager
            // Exemple: notification au manager qu'une RDQ attend son approbation
        }
    }
    
    /**
     * Notification d'approbation de RDQ
     */
    public void sendRdqApprovedNotification(RdqEntity rdq) {
        log.info("Sending RDQ approved notification: rdqId={}, user={}", 
                rdq.id, rdq.user.email);
        
        // TODO: Implémenter l'envoi d'email à l'utilisateur
        // Exemple: notification d'approbation de la RDQ
    }
    
    /**
     * Notification de rejet de RDQ
     */
    public void sendRdqRejectedNotification(RdqEntity rdq) {
        log.info("Sending RDQ rejected notification: rdqId={}, user={}", 
                rdq.id, rdq.user.email);
        
        // TODO: Implémenter l'envoi d'email à l'utilisateur
        // Exemple: notification de rejet avec commentaire du manager
    }
    
    /**
     * Notification de demande d'informations complémentaires
     */
    public void sendRdqPendingInfoNotification(RdqEntity rdq) {
        log.info("Sending RDQ pending info notification: rdqId={}, user={}", 
                rdq.id, rdq.user.email);
        
        // TODO: Implémenter l'envoi d'email à l'utilisateur
        // Exemple: demande d'informations complémentaires
    }
    
    /**
     * Notification de rappel pour RDQ en attente
     */
    public void sendRdqReminderNotification(RdqEntity rdq) {
        if (rdq.user.manager != null) {
            log.info("Sending RDQ reminder notification: rdqId={}, manager={}", 
                    rdq.id, rdq.user.manager.email);
            
            // TODO: Implémenter l'envoi de rappel au manager
            // Exemple: rappel pour RDQ en attente depuis X jours
        }
    }
    
    /**
     * Notification de bienvenue pour nouvel utilisateur
     */
    public void sendWelcomeNotification(UserEntity user) {
        log.info("Sending welcome notification: user={}", user.email);
        
        // TODO: Implémenter l'envoi d'email de bienvenue
        // Exemple: email de bienvenue avec instructions de première connexion
    }
}