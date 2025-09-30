package com.rdq.exception;

/**
 * Exception levée quand un compte est verrouillé
 */
public class AccountLockedException extends BusinessException {
    public AccountLockedException() {
        super("ACCOUNT_LOCKED", "Account is temporarily locked due to too many failed login attempts");
    }
    
    public AccountLockedException(String message) {
        super("ACCOUNT_LOCKED", message);
    }
}