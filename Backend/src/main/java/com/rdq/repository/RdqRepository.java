package com.rdq.repository;

import com.rdq.entity.RdqEntity;
import com.rdq.entity.RdqStatus;
import com.rdq.entity.RdqType;
import com.rdq.entity.RdqPriority;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;

import jakarta.enterprise.context.ApplicationScoped;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository pour RdqEntity selon les instructions Backend
 * - Requêtes paramétrées pour sécurité OWASP A01
 * - Pagination pour performance
 */
@ApplicationScoped
public class RdqRepository implements PanacheRepositoryBase<RdqEntity, Long> {

    /**
     * Recherche des RDQ par utilisateur et statut
     */
    public List<RdqEntity> findByUserAndStatus(Long userId, RdqStatus status) {
        return find("user.id = ?1 and status = ?2", userId, status).list();
    }

    /**
     * Recherche textuelle dans titre et description
     * OWASP A01 - Paramètres sécurisés
     */
    public List<RdqEntity> searchByText(String searchTerm) {
        String pattern = "%" + searchTerm.toLowerCase() + "%";
        return find("LOWER(title) LIKE ?1 OR LOWER(description) LIKE ?1", pattern).list();
    }

    /**
     * Recherche des RDQ urgentes en attente
     */
    public List<RdqEntity> findUrgentPendingRdq() {
        return find("priority = ?1 AND (status = ?2 OR status = ?3)", 
                RdqPriority.URGENT, RdqStatus.SUBMITTED, RdqStatus.PENDING_INFO).list();
    }

    /**
     * Statistiques par statut
     */
    public long countByStatus(RdqStatus status) {
        return count("status = ?1", status);
    }

    /**
     * Statistiques par type
     */
    public long countByType(RdqType type) {
        return count("type = ?1", type);
    }

    /**
     * RDQ créées dans une période
     */
    public List<RdqEntity> findByDateRange(LocalDate from, LocalDate to) {
        return find("createdAt >= ?1 AND createdAt <= ?2", 
                from.atStartOfDay(), to.atTime(23, 59, 59)).list();
    }

    /**
     * RDQ d'un utilisateur modifiables
     */
    public List<RdqEntity> findModifiableByUser(Long userId) {
        return find("user.id = ?1 AND (status = ?2 OR status = ?3)", 
                userId, RdqStatus.DRAFT, RdqStatus.PENDING_INFO).list();
    }
}