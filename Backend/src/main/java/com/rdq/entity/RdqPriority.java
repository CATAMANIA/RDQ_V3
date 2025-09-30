package com.rdq.entity;

/**
 * Priorités pour les RDQ
 */
public enum RdqPriority {
    LOW("Faible"),
    MEDIUM("Moyenne"),
    HIGH("Haute"),
    URGENT("Urgente");

    private final String displayName;

    RdqPriority(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}