package com.rdq.dto;

import com.rdq.entity.RdqStatus;
import com.rdq.entity.RdqType;
import com.rdq.entity.RdqPriority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * DTO pour RdqEntity selon les instructions Backend
 * - Lombok pour réduire le boilerplate
 * - Bean Validation pour sécurité
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RdqDto {
    
    private Long id;
    
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
    
    @NotNull(message = "Le statut est obligatoire")
    private RdqStatus status;
    
    private String justification;
    
    private String managerComment;
    
    private LocalDateTime requestedDate;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private UserDto userDto;
    
    private UserDto managerDto;
}