package com.rdq.entity;

/**
 * Types de RDQ selon le métier
 */
public enum RdqType {
    FORMATION("Formation"),
    MATERIEL("Matériel"),
    LOGICIEL("Logiciel"),
    AUTRE("Autre");

    private final String displayName;

    RdqType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}