package com.rdq.exception;

/**
 * Exception levée en cas d'identifiants de connexion invalides
 */
public class InvalidCredentialsException extends BusinessException {
    public InvalidCredentialsException() {
        super("INVALID_CREDENTIALS", "Invalid email or password");
    }
    
    public InvalidCredentialsException(String message) {
        super("INVALID_CREDENTIALS", message);
    }
}