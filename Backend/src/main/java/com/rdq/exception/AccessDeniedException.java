package com.rdq.exception;

/**
 * Exception levée en cas d'accès refusé
 */
public class AccessDeniedException extends BusinessException {
    public AccessDeniedException() {
        super("ACCESS_DENIED", "Access denied to this resource");
    }
    
    public AccessDeniedException(String message) {
        super("ACCESS_DENIED", message);
    }
}