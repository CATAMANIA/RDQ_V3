package com.rdq.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entité RDQ selon les instructions Backend
 * - Utilise PanacheEntityBase comme classe de base
 * - Lombok OBLIGATOIRE pour réduire le boilerplate
 * - Champs publics pour Panache
 * - Annotations Bean Validation pour sécurité OWASP A01
 * - Relations LAZY par défaut
 */
@Entity
@Table(name = "rdq")
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class RdqEntity extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 5, max = 255, message = "Le titre doit contenir entre 5 et 255 caractères")
    public String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "La description est obligatoire")
    @Size(min = 20, message = "La description doit contenir au moins 20 caractères")
    public String description;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le type est obligatoire")
    public RdqType type;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le statut est obligatoire")
    public RdqStatus status;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "La priorité est obligatoire")
    public RdqPriority priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "L'utilisateur est obligatoire")
    public UserEntity user;

    @Column(name = "requested_date")
    public LocalDate requestedDate;

    @Column(columnDefinition = "TEXT")
    public String justification;

    @Column(name = "manager_comment", columnDefinition = "TEXT")
    public String managerComment;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    public LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    public LocalDateTime updatedAt;

    /**
     * Méthode utilitaire pour vérifier si la RDQ peut être modifiée
     */
    public boolean canBeModified() {
        return status == RdqStatus.DRAFT || status == RdqStatus.PENDING_INFO;
    }

    /**
     * Méthode utilitaire pour vérifier si la RDQ peut être traitée par un manager
     */
    public boolean canBeTreated() {
        return status == RdqStatus.SUBMITTED || status == RdqStatus.PENDING_INFO;
    }

    /**
     * Méthode pour approuver la RDQ
     */
    public void approve(String comment) {
        this.status = RdqStatus.APPROVED;
        this.managerComment = comment;
    }

    /**
     * Méthode pour rejeter la RDQ
     */
    public void reject(String comment) {
        this.status = RdqStatus.REJECTED;
        this.managerComment = comment;
    }

    /**
     * Méthode pour demander des informations complémentaires
     */
    public void requestMoreInfo(String comment) {
        this.status = RdqStatus.PENDING_INFO;
        this.managerComment = comment;
    }
}