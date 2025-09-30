package com.rdq.resource;

import com.rdq.security.JwtService;
import com.rdq.dto.LoginDto;
import com.rdq.exception.BusinessException;

import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import lombok.extern.slf4j.Slf4j;

/**
 * Endpoint d'authentification selon les instructions Backend
 * - Gestion JWT sécurisée selon OWASP A02
 * - Validation des entrées avec Bean Validation
 * - Logging des tentatives de connexion
 */
@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Slf4j
public class AuthResource {
    
    @Inject
    JwtService jwtService;
    
    /**
     * Endpoint de connexion
     * OWASP A02 - Authentification sécurisée
     */
    @POST
    @Path("/login")
    public Response login(@Valid LoginDto loginDto, @Context HttpServletRequest request) {
        
        String clientIP = getClientIP(request);
        log.info("Login attempt for email: {} from IP: {}", loginDto.getEmail(), clientIP);
        
        try {
            // Authentification avec JwtService
            var authResponse = jwtService.authenticate(loginDto.getEmail(), loginDto.getPassword());
            
            log.info("Successful login for user: {} from IP: {}", loginDto.getEmail(), clientIP);
            
            return Response.ok(authResponse).build();
            
        } catch (BusinessException e) {
            log.warn("Failed login attempt for email: {} from IP: {} - {}", 
                    loginDto.getEmail(), clientIP, e.getMessage());
            
            return Response.status(Response.Status.UNAUTHORIZED)
                          .entity(ErrorResponse.of(e.getCode(), "Identifiants invalides"))
                          .build();
                          
        } catch (Exception e) {
            log.error("Unexpected error during login for email: {} from IP: {}", 
                     loginDto.getEmail(), clientIP, e);
            
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                          .entity(ErrorResponse.of("LOGIN_ERROR", "Erreur de connexion"))
                          .build();
        }
    }
    
    /**
     * Endpoint de refresh token
     */
    @POST
    @Path("/refresh")
    public Response refreshToken(@HeaderParam("Authorization") String authHeader) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Response.status(Response.Status.UNAUTHORIZED)
                          .entity(ErrorResponse.of("MISSING_TOKEN", "Token manquant"))
                          .build();
        }
        
        try {
            String token = authHeader.substring(7);
            String newToken = jwtService.refreshToken(token);
            
            return Response.ok(new TokenResponse(newToken)).build();
            
        } catch (BusinessException e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                          .entity(ErrorResponse.of(e.getCode(), e.getMessage()))
                          .build();
        }
    }
    
    /**
     * Endpoint de déconnexion (logout)
     */
    @POST
    @Path("/logout")
    public Response logout(@Context SecurityContext securityContext) {
        
        // Pour le moment, logout côté client (suppression du token)
        // TODO: Implémenter une blacklist de tokens si nécessaire
        
        log.info("User logged out successfully");
        return Response.ok(new MessageResponse("Déconnexion réussie")).build();
    }
    
    // ========== Méthodes utilitaires ==========
    
    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty()) {
            return xRealIP;
        }
        
        return request.getRemoteAddr();
    }
    
    // ========== Classes DTO internes ==========
    
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class TokenResponse {
        private String token;
    }
    
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class MessageResponse {
        private String message;
    }
    
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ErrorResponse {
        private String code;
        private String message;
        private long timestamp;
        
        public static ErrorResponse of(String code, String message) {
            return new ErrorResponse(code, message, System.currentTimeMillis());
        }
    }
}