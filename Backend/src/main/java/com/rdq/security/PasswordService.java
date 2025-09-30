package com.rdq.security;

import io.quarkus.elytron.security.common.BcryptUtil;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.extern.slf4j.Slf4j;

import java.util.regex.Pattern;

/**
 * Service de gestion des mots de passe selon OWASP A02
 * - Utilisation de Quarkus Security natif pour le hachage
 * - Validation forte des mots de passe
 * - Conformité OWASP pour l'authentification
 */
@ApplicationScoped
@Slf4j
public class PasswordService {
    
    // Pattern pour validation mot de passe fort
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    );
    
    /**
     * Hash sécurisé du mot de passe avec Quarkus Security natif
     * OWASP A02 - Protection contre les mots de passe faibles
     */
    public String hashPassword(String password) {
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Le mot de passe ne peut être vide");
        }
        
        // Utilisation de BCrypt via Quarkus Security (recommandé OWASP)
        String hashedPassword = BcryptUtil.bcryptHash(password);
        
        log.debug("Password hashed successfully");
        return hashedPassword;
    }
    
    /**
     * Vérification du mot de passe avec Quarkus Security natif
     * OWASP A02 - Vérification sécurisée des mots de passe
     */
    public boolean verifyPassword(String password, String hashedPassword) {
        if (password == null || hashedPassword == null) {
            return false;
        }
        
        try {
            boolean isValid = BcryptUtil.matches(password, hashedPassword);
            
            if (!isValid) {
                log.warn("Password verification failed");
            }
            
            return isValid;
        } catch (Exception e) {
            log.error("Error during password verification", e);
            return false;
        }
    }
    
    /**
     * Validation de la force du mot de passe
     * OWASP A02 - Politique de mot de passe forte
     */
    public boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        // Vérification avec pattern regex
        boolean isValid = PASSWORD_PATTERN.matcher(password).matches();
        
        if (!isValid) {
            log.debug("Password validation failed - weak password");
        }
        
        return isValid;
    }
    
    /**
     * Génération d'un mot de passe temporaire sécurisé
     */
    public String generateTemporaryPassword() {
        // Génération d'un mot de passe temporaire de 12 caractères
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";
        StringBuilder password = new StringBuilder();
        
        // Assurer qu'on a au moins un de chaque type requis
        password.append(getRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ")); // Majuscule
        password.append(getRandomChar("abcdefghijklmnopqrstuvwxyz")); // Minuscule
        password.append(getRandomChar("0123456789")); // Chiffre
        password.append(getRandomChar("@$!%*?&")); // Caractère spécial
        
        // Compléter avec caractères aléatoires
        for (int i = 4; i < 12; i++) {
            password.append(getRandomChar(chars));
        }
        
        // Mélanger la chaîne
        return shuffleString(password.toString());
    }
    
    /**
     * Obtient les critères de validation du mot de passe
     */
    public String getPasswordRequirements() {
        return "Le mot de passe doit contenir au moins 8 caractères, " +
               "incluant au moins une majuscule, une minuscule, " +
               "un chiffre et un caractère spécial (@$!%*?&)";
    }
    
    // ========== Méthodes privées ==========
    
    private char getRandomChar(String chars) {
        return chars.charAt((int) (Math.random() * chars.length()));
    }
    
    private String shuffleString(String string) {
        char[] chars = string.toCharArray();
        for (int i = chars.length - 1; i > 0; i--) {
            int j = (int) (Math.random() * (i + 1));
            char temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
        }
        return new String(chars);
    }
}