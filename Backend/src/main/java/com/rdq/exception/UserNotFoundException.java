package com.rdq.exception;

/**
 * Exception levée quand un utilisateur n'est pas trouvé
 */
public class UserNotFoundException extends BusinessException {
    public UserNotFoundException(Long userId) {
        super("USER_NOT_FOUND", "User with id " + userId + " not found");
    }
    
    public UserNotFoundException(String email) {
        super("USER_NOT_FOUND", "User with email " + email + " not found");
    }
}