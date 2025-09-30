package com.rdq.exception;

/**
 * Exception de validation
 */
public class ValidationException extends BusinessException {
    public ValidationException(String message) {
        super("VALIDATION_ERROR", message);
    }
}