package com.rdq.util;

import com.rdq.entity.UserEntity;
import com.rdq.entity.UserRole;
import com.rdq.entity.RdqEntity;
import com.rdq.entity.RdqStatus;
import com.rdq.entity.RdqType;
import com.rdq.entity.RdqPriority;

import java.time.LocalDateTime;

/**
 * Builder pour les données de test selon les instructions Backend
 * - Création d'objets de test cohérents
 * - Évite la duplication de code dans les tests
 */
public class TestDataBuilder {
    
    /**
     * Crée un utilisateur de test
     */
    public static UserEntity createUser(Long id, String email) {
        var user = new UserEntity();
        user.id = id;
        user.email = email;
        user.firstName = "John";
        user.lastName = "Doe";
        user.role = UserRole.USER;
        user.active = true;
        user.createdAt = LocalDateTime.now();
        user.updatedAt = LocalDateTime.now();
        user.passwordHash = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl.jvKq.L7O"; // "password"
        return user;
    }
    
    /**
     * Crée un manager de test
     */
    public static UserEntity createManager(Long id, String email) {
        var manager = createUser(id, email);
        manager.role = UserRole.MANAGER;
        return manager;
    }
    
    /**
     * Crée un admin de test
     */
    public static UserEntity createAdmin(Long id, String email) {
        var admin = createUser(id, email);
        admin.role = UserRole.ADMIN;
        return admin;
    }
    
    /**
     * Crée une RDQ de test
     */
    public static RdqEntity createRdq(Long id, String title, UserEntity user) {
        var rdq = new RdqEntity();
        rdq.id = id;
        rdq.title = title;
        rdq.description = "Description de test pour la RDQ " + title;
        rdq.type = RdqType.FORMATION;
        rdq.priority = RdqPriority.MEDIUM;
        rdq.status = RdqStatus.DRAFT;
        rdq.user = user;
        rdq.createdAt = LocalDateTime.now();
        rdq.updatedAt = LocalDateTime.now();
        return rdq;
    }
    
    /**
     * Crée une RDQ soumise de test
     */
    public static RdqEntity createSubmittedRdq(Long id, String title, UserEntity user) {
        var rdq = createRdq(id, title, user);
        rdq.status = RdqStatus.SUBMITTED;
        return rdq;
    }
    
    /**
     * Crée une RDQ approuvée de test
     */
    public static RdqEntity createApprovedRdq(Long id, String title, UserEntity user, UserEntity manager) {
        var rdq = createRdq(id, title, user);
        rdq.status = RdqStatus.APPROVED;
        rdq.manager = manager;
        rdq.managerComment = "Approuvé par " + manager.firstName;
        return rdq;
    }
    
    /**
     * Crée une RDQ rejetée de test
     */
    public static RdqEntity createRejectedRdq(Long id, String title, UserEntity user, UserEntity manager) {
        var rdq = createRdq(id, title, user);
        rdq.status = RdqStatus.REJECTED;
        rdq.manager = manager;
        rdq.managerComment = "Rejeté par " + manager.firstName;
        return rdq;
    }
}