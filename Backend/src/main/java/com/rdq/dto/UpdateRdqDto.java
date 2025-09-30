package com.rdq.dto;

import com.rdq.entity.RdqStatus;
import com.rdq.entity.RdqType;
import com.rdq.entity.RdqPriority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * DTO pour mise à jour de RDQ selon les instructions Backend
 * - Tous les champs optionnels pour mise à jour partielle
 * - Bean Validation pour sécurité
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRdqDto {
    
    @Size(min = 5, max = 255, message = "Le titre doit contenir entre 5 et 255 caractères")
    private String title;
    
    @Size(min = 20, max = 2000, message = "La description doit contenir entre 20 et 2000 caractères")
    private String description;
    
    private RdqType type;
    
    private RdqPriority priority;
    
    private RdqStatus status;
    
    @Size(max = 1000, message = "La justification ne peut dépasser 1000 caractères")
    private String justification;
    
    @Size(max = 1000, message = "Le commentaire manager ne peut dépasser 1000 caractères")
    private String managerComment;
    
    private LocalDateTime requestedDate;
}