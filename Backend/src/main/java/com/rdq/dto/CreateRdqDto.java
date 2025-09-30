package com.rdq.dto;

import com.rdq.entity.RdqType;
import com.rdq.entity.RdqPriority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Future;
import java.time.LocalDateTime;

/**
 * DTO pour création de RDQ selon les instructions Backend
 * - Bean Validation stricte pour sécurité OWASP A01
 * - Lombok pour réduire le boilerplate
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRdqDto {
    
    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 5, max = 255, message = "Le titre doit contenir entre 5 et 255 caractères")
    private String title;
    
    @NotBlank(message = "La description est obligatoire")
    @Size(min = 20, max = 2000, message = "La description doit contenir entre 20 et 2000 caractères")
    private String description;
    
    @NotNull(message = "Le type est obligatoire")
    private RdqType type;
    
    @NotNull(message = "La priorité est obligatoire")
    private RdqPriority priority;
    
    @Size(max = 1000, message = "La justification ne peut dépasser 1000 caractères")
    private String justification;
    
    @Future(message = "La date demandée doit être future")
    private LocalDateTime requestedDate;
}