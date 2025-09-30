package com.rdq.entity;

/**
 * Statuts possibles pour une RDQ
 */
public enum RdqStatus {
    DRAFT("Brouillon"),
    SUBMITTED("Soumise"),
    APPROVED("Approuvée"),
    REJECTED("Rejetée"),
    PENDING_INFO("En attente d'informations");

    private final String displayName;

    RdqStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}