package com.rdq.dto;

import com.rdq.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * DTO pour mise à jour d'utilisateur selon les instructions Backend
 * - Tous les champs optionnels pour mise à jour partielle
 * - Bean Validation pour sécurité
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserDto {
    
    @Email(message = "Format d'email invalide")
    private String email;
    
    @Size(min = 2, max = 100, message = "Le prénom doit contenir entre 2 et 100 caractères")
    private String firstName;
    
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    private String lastName;
    
    private UserRole role;
    
    @Size(max = 100, message = "Le département ne peut dépasser 100 caractères")
    private String department;
    
    @Size(max = 20, message = "Le numéro de téléphone ne peut dépasser 20 caractères")
    private String phoneNumber;
    
    private Boolean active;
    
    private Long managerId;
}