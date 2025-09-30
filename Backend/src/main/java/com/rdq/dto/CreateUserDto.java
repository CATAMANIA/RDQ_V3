package com.rdq.dto;

import com.rdq.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO pour création d'utilisateur selon les instructions Backend
 * - Bean Validation stricte pour sécurité OWASP
 * - Lombok pour réduire le boilerplate
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserDto {
    
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;
    
    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 100, message = "Le prénom doit contenir entre 2 et 100 caractères")
    private String firstName;
    
    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    private String lastName;
    
    @NotNull(message = "Le rôle est obligatoire")
    private UserRole role;
    
    @Size(max = 100, message = "Le département ne peut dépasser 100 caractères")
    private String department;
    
    @Size(max = 20, message = "Le numéro de téléphone ne peut dépasser 20 caractères")
    private String phoneNumber;
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 8, max = 255, message = "Le mot de passe doit contenir entre 8 et 255 caractères")
    private String password;
    
    private Long managerId;
}