package com.rdq.config;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

/**
 * Configuration des headers de sécurité selon OWASP A06
 * - Headers de sécurité obligatoires
 * - Protection contre les attaques communes
 */
@Provider
@ApplicationScoped
public class SecurityHeadersFilter implements ContainerResponseFilter {
    
    @Override
    public void filter(ContainerRequestContext requestContext, 
                      ContainerResponseContext responseContext) {
        
        // OWASP A06 - Headers de sécurité obligatoires
        responseContext.getHeaders().add("X-Frame-Options", "DENY");
        responseContext.getHeaders().add("X-Content-Type-Options", "nosniff");
        responseContext.getHeaders().add("X-XSS-Protection", "1; mode=block");
        responseContext.getHeaders().add("Strict-Transport-Security", 
                                        "max-age=31536000; includeSubDomains");
        responseContext.getHeaders().add("Referrer-Policy", "strict-origin-when-cross-origin");
        responseContext.getHeaders().add("Permissions-Policy", 
                                        "geolocation=(), microphone=(), camera=()");
        
        // CSP basique - à adapter selon les besoins
        responseContext.getHeaders().add("Content-Security-Policy", 
                                        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';");
    }
}