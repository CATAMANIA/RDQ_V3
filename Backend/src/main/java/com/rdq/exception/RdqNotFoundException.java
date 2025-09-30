package com.rdq.exception;

/**
 * Exception pour RDQ non trouvée
 */
public class RdqNotFoundException extends BusinessException {
    public RdqNotFoundException(Long rdqId) {
        super("RDQ_NOT_FOUND", "RDQ avec l'ID " + rdqId + " non trouvée");
    }
}