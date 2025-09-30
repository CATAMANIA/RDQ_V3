package com.rdq.util;

import jakarta.ws.rs.core.SecurityContext;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * Utilitaires de sécurité selon les instructions Backend
 * - Extraction d'informations du contexte de sécurité
 * - Gestion des rôles et permissions
 */
@ApplicationScoped
public class SecurityUtils {
    
    /**
     * Extraction de l'ID utilisateur depuis le contexte de sécurité
     */
    public static Long getCurrentUserId(SecurityContext securityContext) {
        if (securityContext == null || securityContext.getUserPrincipal() == null) {
            throw new SecurityException("Utilisateur non authentifié");
        }
        
        // TODO: Adapter selon l'implémentation JWT de Quarkus
        // Pour le moment, simulation - à adapter avec le vrai JWT
        String userPrincipal = securityContext.getUserPrincipal().getName();
        
        // Si le principal contient l'ID utilisateur
        try {
            return Long.parseLong(userPrincipal);
        } catch (NumberFormatException e) {
            // Si le principal est l'email, récupérer l'ID depuis un service
            // Pour le moment, retourner un ID fictif
            return 1L;
        }
    }
    
    /**
     * Vérification si l'utilisateur a un rôle spécifique
     */
    public static boolean hasRole(SecurityContext securityContext, String role) {
        return securityContext != null && securityContext.isUserInRole(role);
    }
    
    /**
     * Vérification si l'utilisateur est un manager
     */
    public static boolean isManager(SecurityContext securityContext) {
        return hasRole(securityContext, "MANAGER") || hasRole(securityContext, "ADMIN");
    }
    
    /**
     * Vérification si l'utilisateur est un admin
     */
    public static boolean isAdmin(SecurityContext securityContext) {
        return hasRole(securityContext, "ADMIN");
    }
    
    /**
     * Obtention du nom d'utilisateur depuis le contexte
     */
    public static String getCurrentUsername(SecurityContext securityContext) {
        if (securityContext == null || securityContext.getUserPrincipal() == null) {
            return null;
        }
        return securityContext.getUserPrincipal().getName();
    }
}