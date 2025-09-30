package com.rdq.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO pour la connexion selon les instructions Backend
 * - Bean Validation stricte pour sécurité OWASP A01
 * - Lombok pour réduire le boilerplate
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDto {
    
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format d'email invalide")
    private String email;
    
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 1, max = 255, message = "Le mot de passe est requis")
    private String password;
}