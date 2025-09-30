package com.rdq.entity;

/**
 * Énumération des rôles utilisateur selon les instructions Backend
 * USER : Collaborateur (création/consultation de ses RDQ)
 * MANAGER : Manager (gestion d'équipe, approbation RDQ)
 * ADMIN : Administrateur (configuration système)
 */
public enum UserRole {
    USER("Collaborateur"),
    MANAGER("Manager"),
    ADMIN("Administrateur");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}