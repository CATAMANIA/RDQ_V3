package com.rdq.repository;

import com.rdq.entity.UserEntity;
import com.rdq.entity.UserRole;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

/**
 * Repository pour UserEntity selon les instructions Backend
 * - Utilise PanacheRepositoryBase
 * - ApplicationScoped pour injection CDI
 * - Requêtes paramétrées pour sécurité OWASP A01
 */
@ApplicationScoped
public class UserRepository implements PanacheRepositoryBase<UserEntity, Long> {

    /**
     * Recherche un utilisateur par email
     * OWASP A01 - Requête paramétrée pour éviter injection SQL
     */
    public Optional<UserEntity> findByEmail(String email) {
        return find("email = ?1", email).firstResultOptional();
    }

    /**
     * Recherche des utilisateurs par rôle
     */
    public List<UserEntity> findByRole(UserRole role) {
        return find("role = ?1", role).list();
    }

    /**
     * Recherche des utilisateurs actifs
     */
    public List<UserEntity> findActiveUsers() {
        return find("active = true").list();
    }

    /**
     * Recherche les collaborateurs d'un manager
     */
    public List<UserEntity> findByManager(Long managerId) {
        return find("manager.id = ?1", managerId).list();
    }

    /**
     * Recherche par nom ou prénom (case insensitive)
     */
    public List<UserEntity> searchByName(String searchTerm) {
        String pattern = "%" + searchTerm.toLowerCase() + "%";
        return find("LOWER(firstName) LIKE ?1 OR LOWER(lastName) LIKE ?1", pattern).list();
    }

    /**
     * Recherche des collaborateurs d'un manager
     */
    public List<UserEntity> findByManagerId(Long managerId) {
        return find("manager.id = ?1", managerId).list();
    }

    /**
     * Compte le nombre d'utilisateurs par rôle
     */
    public long countByRole(UserRole role) {
        return count("role = ?1", role);
    }

    /**
     * Vérifie si un email existe déjà
     */
    public boolean emailExists(String email) {
        return count("email = ?1", email) > 0;
    }

    /**
     * Vérifie si un email existe pour un autre utilisateur
     */
    public boolean emailExistsForOtherUser(String email, Long userId) {
        return count("email = ?1 AND id != ?2", email, userId) > 0;
    }
}