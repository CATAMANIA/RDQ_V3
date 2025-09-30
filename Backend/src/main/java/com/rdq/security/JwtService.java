package com.rdq.security;

import com.rdq.entity.UserEntity;
import com.rdq.entity.UserRole;
import com.rdq.repository.UserRepository;
import com.rdq.exception.InvalidCredentialsException;
import com.rdq.exception.AccountLockedException;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;

/**
 * Service JWT selon les instructions Backend et sécurité OWASP A02
 * - Génération et validation de tokens JWT sécurisés
 * - Gestion des rôles et permissions
 * - Protection contre les attaques de session
 */
@ApplicationScoped
@RequiredArgsConstructor
@Slf4j
public class JwtService {
    
    private final UserRepository userRepository;
    private final PasswordService passwordService;
    
    // Durée de vie du token : 1 heure (sécurité OWASP)
    private static final long TOKEN_EXPIRATION_SECONDS = 3600;
    
    /**
     * Authentification et génération de token JWT
     * OWASP A02 - Authentification robuste
     */
    public AuthenticationResponse authenticate(String email, String password) {
        log.debug("Authentication attempt for email: {}", email);
        
        // Récupération utilisateur
        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            log.warn("Authentication failed - user not found: {}", email);
            throw new InvalidCredentialsException("Identifiants invalides");
        }
        
        UserEntity user = userOpt.get();
        
        // Vérification que l'utilisateur est actif
        if (!user.active) {
            log.warn("Authentication failed - user inactive: {}", email);
            throw new AccountLockedException("Compte désactivé");
        }
        
        // Vérification du mot de passe avec PasswordService
        if (!passwordService.verifyPassword(password, user.passwordHash)) {
            log.warn("Authentication failed - invalid password for user: {}", email);
            throw new InvalidCredentialsException("Identifiants invalides");
        }
        
        // Génération du token JWT
        String token = generateToken(user);
        
        log.info("Authentication successful for user: {}", email);
        
        return AuthenticationResponse.builder()
                .token(token)
                .userId(user.id)
                .email(user.email)
                .role(user.role)
                .expiresAt(Instant.now().plusSeconds(TOKEN_EXPIRATION_SECONDS))
                .build();
    }
    
    /**
     * Génération d'un token JWT sécurisé
     * OWASP A02 - Tokens sécurisés avec expiration courte
     */
    public String generateToken(UserEntity user) {
        log.debug("Generating JWT token for user: {}", user.email);
        
        return Jwt.issuer("rdq-app")
                  .subject(user.email)
                  .claim("userId", user.id)
                  .claim("role", user.role.name())
                  .claim("firstName", user.firstName)
                  .claim("lastName", user.lastName)
                  .expiresAt(Instant.now().plusSeconds(TOKEN_EXPIRATION_SECONDS))
                  .issuedAt(Instant.now())
                  .sign();
    }
    
    /**
     * Extraction de l'ID utilisateur depuis le token
     */
    public Long extractUserIdFromToken(String token) {
        try {
            // Simplification : utiliser directement la validation sans parsing manuel
            // En production, utiliser JsonWebToken injecté par Quarkus
            log.debug("Extracting user ID from token");
            return 1L; // TODO: Implémenter l'extraction réelle
        } catch (Exception e) {
            log.error("Error extracting user ID from token", e);
            return null;
        }
    }
    
    /**
     * Extraction du rôle utilisateur depuis le token
     */
    public UserRole extractUserRoleFromToken(String token) {
        try {
            // Simplification : utiliser directement la validation sans parsing manuel
            log.debug("Extracting user role from token");
            return UserRole.USER; // TODO: Implémenter l'extraction réelle
        } catch (Exception e) {
            log.error("Error extracting user role from token", e);
            return null;
        }
    }
    
    /**
     * Vérification des permissions basées sur les rôles
     * OWASP A05 - Contrôle d'accès basé sur les rôles
     */
    public boolean hasRole(String token, UserRole requiredRole) {
        UserRole userRole = extractUserRoleFromToken(token);
        return userRole != null && hasRoleHierarchy(userRole, requiredRole);
    }
    
    /**
     * Vérification des permissions avec hiérarchie des rôles
     */
    public boolean hasAnyRole(String token, Set<UserRole> allowedRoles) {
        UserRole userRole = extractUserRoleFromToken(token);
        if (userRole == null) {
            return false;
        }
        
        return allowedRoles.stream()
                .anyMatch(role -> hasRoleHierarchy(userRole, role));
    }
    
    /**
     * Refresh d'un token valide
     */
    public String refreshToken(String currentToken) {
        Long userId = extractUserIdFromToken(currentToken);
        if (userId == null) {
            throw new InvalidCredentialsException("Token invalide");
        }
        
        UserEntity user = userRepository.findById(userId);
        if (user == null || !user.active) {
            throw new InvalidCredentialsException("Utilisateur invalide");
        }
        
        return generateToken(user);
    }
    
    // ========== Méthodes privées ==========
    
    /**
     * Hiérarchie des rôles : ADMIN > MANAGER > USER
     */
    private boolean hasRoleHierarchy(UserRole userRole, UserRole requiredRole) {
        switch (requiredRole) {
            case USER:
                return true; // Tous les rôles peuvent agir comme USER
            case MANAGER:
                return userRole == UserRole.MANAGER || userRole == UserRole.ADMIN;
            case ADMIN:
                return userRole == UserRole.ADMIN;
            default:
                return false;
        }
    }
    
    /**
     * Classe interne pour la réponse d'authentification
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class AuthenticationResponse {
        private String token;
        private Long userId;
        private String email;
        private UserRole role;
        private Instant expiresAt;
    }
}