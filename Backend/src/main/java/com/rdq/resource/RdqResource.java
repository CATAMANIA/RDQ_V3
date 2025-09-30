package com.rdq.resource;

import com.rdq.dto.RdqDto;
import com.rdq.dto.CreateRdqDto;
import com.rdq.dto.UpdateRdqDto;
import com.rdq.dto.PageDto;
import com.rdq.entity.RdqStatus;
import com.rdq.entity.RdqType;
import com.rdq.entity.RdqPriority;
import com.rdq.service.RdqService;
import com.rdq.exception.BusinessException;
import com.rdq.util.SecurityUtils;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.List;

/**
 * Endpoint REST pour RDQ selon les instructions Backend
 * - Validation avec Bean Validation (@Valid)
 * - Gestion des erreurs avec des DTOs d'erreur standardisés
 * - Pagination avec paramètres validés
 * - Sécurité avec @RolesAllowed
 * - Protection OWASP A01 avec validation des paramètres
 */
@Path("/api/rdq")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({"USER", "MANAGER", "ADMIN"})
@Slf4j
public class RdqResource {
    
    @Inject
    RdqService rdqService;
    
    /**
     * Liste des RDQ de l'utilisateur connecté
     * OWASP A01 - Validation des paramètres de requête
     */
    @GET
    @RolesAllowed({"USER", "MANAGER"})
    public Response getRdqList(@QueryParam("status") RdqStatus status,
                               @QueryParam("type") RdqType type,
                               @QueryParam("priority") RdqPriority priority,
                               @QueryParam("dateFrom") String dateFromStr,
                               @QueryParam("dateTo") String dateToStr,
                               @QueryParam("page") @DefaultValue("0") @Min(0) int page,
                               @QueryParam("size") @DefaultValue("20") @Min(1) int size,
                               @Context SecurityContext securityContext) {
        
        try {
            Long userId = SecurityUtils.getCurrentUserId(securityContext);
            
            // Validation et conversion des dates
            LocalDate dateFrom = dateFromStr != null ? LocalDate.parse(dateFromStr) : null;
            LocalDate dateTo = dateToStr != null ? LocalDate.parse(dateToStr) : null;
            
            PageDto<RdqDto> result = rdqService.searchRdq(userId, status, type, priority, 
                                                          dateFrom, dateTo, page, size);
            
            return Response.ok(result).build();
            
        } catch (BusinessException e) {
            log.warn("Business error in getRdqList: {}", e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST)
                          .entity(ErrorResponse.of(e.getCode(), e.getMessage()))
                          .build();
        } catch (Exception e) {
            log.error("Unexpected error in getRdqList", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                          .entity(ErrorResponse.of("INTERNAL_ERROR", "Erreur interne"))
                          .build();
        }
    }
    
    /**
     * Récupération d'une RDQ par ID
     */
    @GET
    @Path("/{id}")
    @RolesAllowed({"USER", "MANAGER"})
    public Response getRdqById(@PathParam("id") @Min(1) Long id,
                               @Context SecurityContext securityContext) {
        
        try {
            Long userId = SecurityUtils.getCurrentUserId(securityContext);
            RdqDto result = rdqService.getRdqById(id, userId);
            
            return Response.ok(result).build();
            
        } catch (BusinessException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                          .entity(ErrorResponse.of(e.getCode(), e.getMessage()))
                          .build();
        }
    }
    
    /**
     * Création d'une nouvelle RDQ
     * OWASP A01 - Validation stricte avec Bean Validation
     */
    @POST
    @RolesAllowed("USER")
    public Response createRdq(@Valid CreateRdqDto createDto,
                              @Context SecurityContext securityContext) {
        
        try {
            Long userId = SecurityUtils.getCurrentUserId(securityContext);
            
            // Validation supplémentaire XSS (OWASP A07)
            validateInputForXss(createDto.getTitle());
            validateInputForXss(createDto.getDescription());
            
            RdqDto created = rdqService.createRdq(createDto, userId);
            
            return Response.status(Response.Status.CREATED)
                          .entity(created)
                          .build();
                          
        } catch (BusinessException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                          .entity(ErrorResponse.of(e.getCode(), e.getMessage()))
                          .build();
        }
    }
    
    /**
     * Mise à jour d'une RDQ
     */
    @PUT
    @Path("/{id}")
    @RolesAllowed("USER")
    public Response updateRdq(@PathParam("id") @Min(1) Long id,
                              @Valid UpdateRdqDto updateDto,
                              @Context SecurityContext securityContext) {
        
        try {
            Long userId = SecurityUtils.getCurrentUserId(securityContext);
            
            // Validation XSS si des champs texte sont modifiés
            if (updateDto.getTitle() != null) {
                validateInputForXss(updateDto.getTitle());
            }
            if (updateDto.getDescription() != null) {
                validateInputForXss(updateDto.getDescription());
            }
            
            RdqDto updated = rdqService.updateRdq(id, updateDto, userId);
            
            return Response.ok(updated).build();
            
        } catch (BusinessException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                          .entity(ErrorResponse.of(e.getCode(), e.getMessage()))
                          .build();
        }
    }
    
    /**
     * Soumission d'une RDQ pour approbation
     */
    @POST
    @Path("/{id}/submit")
    @RolesAllowed("USER")
    public Response submitRdq(@PathParam("id") @Min(1) Long id,
                              @Context SecurityContext securityContext) {
        
        try {
            Long userId = SecurityUtils.getCurrentUserId(securityContext);
            RdqDto submitted = rdqService.submitRdq(id, userId);
            
            return Response.ok(submitted).build();
            
        } catch (BusinessException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                          .entity(ErrorResponse.of(e.getCode(), e.getMessage()))
                          .build();
        }
    }
    
    /**
     * Approbation d'une RDQ par un manager
     */
    @POST
    @Path("/{id}/approve")
    @RolesAllowed({"MANAGER", "ADMIN"})
    public Response approveRdq(@PathParam("id") @Min(1) Long id,
                               @Valid ApprovalDto approvalDto,
                               @Context SecurityContext securityContext) {
        
        try {
            Long managerId = SecurityUtils.getCurrentUserId(securityContext);
            
            // Validation XSS du commentaire
            if (approvalDto.getComment() != null) {
                validateInputForXss(approvalDto.getComment());
            }
            
            RdqDto approved = rdqService.approveRdq(id, approvalDto.getComment(), managerId);
            
            return Response.ok(approved).build();
            
        } catch (BusinessException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                          .entity(ErrorResponse.of(e.getCode(), e.getMessage()))
                          .build();
        }
    }
    
    /**
     * Rejet d'une RDQ par un manager
     */
    @POST
    @Path("/{id}/reject")
    @RolesAllowed({"MANAGER", "ADMIN"})
    public Response rejectRdq(@PathParam("id") @Min(1) Long id,
                              @Valid RejectionDto rejectionDto,
                              @Context SecurityContext securityContext) {
        
        try {
            Long managerId = SecurityUtils.getCurrentUserId(securityContext);
            
            // Validation XSS du commentaire
            validateInputForXss(rejectionDto.getComment());
            
            RdqDto rejected = rdqService.rejectRdq(id, rejectionDto.getComment(), managerId);
            
            return Response.ok(rejected).build();
            
        } catch (BusinessException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                          .entity(ErrorResponse.of(e.getCode(), e.getMessage()))
                          .build();
        }
    }
    
    /**
     * Suppression d'une RDQ
     */
    @DELETE
    @Path("/{id}")
    @RolesAllowed("USER")
    public Response deleteRdq(@PathParam("id") @Min(1) Long id,
                              @Context SecurityContext securityContext) {
        
        try {
            Long userId = SecurityUtils.getCurrentUserId(securityContext);
            rdqService.deleteRdq(id, userId);
            
            return Response.noContent().build();
            
        } catch (BusinessException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                          .entity(ErrorResponse.of(e.getCode(), e.getMessage()))
                          .build();
        }
    }
    
    /**
     * Recherche textuelle dans les RDQ
     * OWASP A01 - Validation du paramètre de recherche
     */
    @GET
    @Path("/search")
    @RolesAllowed({"USER", "MANAGER"})
    public Response searchRdq(@QueryParam("q") @Pattern(regexp = "^[a-zA-Z0-9\\s\\-_.,!?()]{1,100}$") String searchTerm,
                              @Context SecurityContext securityContext) {
        
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                          .entity(ErrorResponse.of("INVALID_SEARCH", "Terme de recherche requis"))
                          .build();
        }
        
        try {
            // Validation supplémentaire XSS
            validateInputForXss(searchTerm);
            
            // TODO: Implémenter la recherche textuelle dans le service
            // List<RdqDto> results = rdqService.searchByText(searchTerm);
            
            return Response.ok(List.of()).build();
            
        } catch (BusinessException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                          .entity(ErrorResponse.of(e.getCode(), e.getMessage()))
                          .build();
        }
    }
    
    // ========== Méthodes privées de validation OWASP ==========
    
    /**
     * Validation contre les attaques XSS (OWASP A07)
     */
    private void validateInputForXss(String input) {
        if (input == null) return;
        
        // Pattern de validation natif simple
        String safePattern = "^[a-zA-Z0-9\\s\\-_.,!?()àáâãäåçèéêëìíîïñòóôõöùúûüýÿ]+$";
        if (!input.matches(safePattern) || input.length() > 2000) {
            throw new BusinessException("INVALID_INPUT", "Format d'entrée invalide");
        }
    }
    
    // ========== Classes DTO internes ==========
    
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ApprovalDto {
        @jakarta.validation.constraints.Size(max = 1000, message = "Le commentaire ne peut dépasser 1000 caractères")
        private String comment;
    }
    
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class RejectionDto {
        @jakarta.validation.constraints.NotBlank(message = "Le commentaire de rejet est obligatoire")
        @jakarta.validation.constraints.Size(max = 1000, message = "Le commentaire ne peut dépasser 1000 caractères")
        private String comment;
    }
    
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ErrorResponse {
        private String code;
        private String message;
        private long timestamp;
        
        public static ErrorResponse of(String code, String message) {
            return new ErrorResponse(code, message, System.currentTimeMillis());
        }
    }
}