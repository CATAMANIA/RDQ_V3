package com.rdq.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * Entité User selon les instructions Backend
 * - Utilise PanacheEntityBase comme classe de base
 * - Lombok OBLIGATOIRE pour réduire le boilerplate
 * - Champs publics pour Panache
 * - Annotations Bean Validation pour sécurité OWASP A01
 * - CreationTimestamp et UpdateTimestamp pour audit
 * - Relations LAZY par défaut
 */
@Entity
@Table(name = "users")
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    @Size(max = 255, message = "L'email ne peut dépasser 255 caractères")
    public String email;

    @Column(name = "first_name", nullable = false)
    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 100, message = "Le prénom ne peut dépasser 100 caractères")
    public String firstName;

    @Column(name = "last_name", nullable = false)
    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100, message = "Le nom ne peut dépasser 100 caractères")
    public String lastName;

    @Column(name = "password_hash", nullable = false)
    @NotBlank(message = "Le hash du mot de passe est obligatoire")
    public String passwordHash;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le rôle est obligatoire")
    public UserRole role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    public UserEntity manager;

    @Column(nullable = false)
    public Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    public LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    public LocalDateTime updatedAt;

    @Column(name = "department")
    @Size(max = 100, message = "Le département ne peut dépasser 100 caractères")
    public String department;

    @Column(name = "phone_number")
    @Size(max = 20, message = "Le numéro de téléphone ne peut dépasser 20 caractères")
    public String phoneNumber;

    /**
     * Méthode utilitaire pour vérifier si l'utilisateur a un rôle spécifique
     */
    public boolean hasRole(UserRole targetRole) {
        return this.role == targetRole;
    }

    /**
     * Méthode pour obtenir le nom complet
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }

    /**
     * ToString sécurisé - ne jamais inclure passwordHash selon OWASP A03
     */
    @Override
    public String toString() {
        return "UserEntity{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", role=" + role +
                ", active=" + active +
                '}';
    }
}