package com.rdq.service;

import com.rdq.dto.RdqDto;
import com.rdq.dto.CreateRdqDto;
import com.rdq.dto.UpdateRdqDto;
import com.rdq.dto.PageDto;
import com.rdq.entity.RdqEntity;
import com.rdq.entity.RdqStatus;
import com.rdq.entity.RdqType;
import com.rdq.entity.RdqPriority;
import com.rdq.entity.UserEntity;
import com.rdq.repository.RdqRepository;
import com.rdq.repository.UserRepository;
import com.rdq.mapper.RdqMapper;
import com.rdq.exception.RdqNotFoundException;
import com.rdq.exception.BusinessException;
import com.rdq.exception.AccessDeniedException;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

/**
 * Service RDQ selon les instructions Backend
 * - @ApplicationScoped pour CDI
 * - @Transactional pour gestion transactionnelle
 * - @RequiredArgsConstructor (Lombok) pour injection par constructeur
 * - @Slf4j (Lombok) pour logging automatique
 * - MapStruct pour transformations Entity <-> DTO
 */
@ApplicationScoped
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RdqService {
    
    private final RdqRepository rdqRepository;
    private final UserRepository userRepository;
    private final RdqMapper rdqMapper; // Injection automatique MapStruct
    private final NotificationService notificationService;
    
    /**
     * Création d'une RDQ selon les instructions Backend
     */
    public RdqDto createRdq(CreateRdqDto createDto, Long userId) {
        log.debug("Creating RDQ for user {}: {}", userId, createDto.getTitle());
        
        // 1. Validation métier
        validateRdqCreation(createDto, userId);
        
        // 2. Récupération utilisateur
        UserEntity user = userRepository.findById(userId);
        if (user == null) {
            throw new BusinessException("USER_NOT_FOUND", "Utilisateur non trouvé");
        }
        
        // 3. Transformation DTO -> Entity avec MapStruct
        RdqEntity entity = rdqMapper.toEntity(createDto);
        entity.user = user;
        entity.status = RdqStatus.DRAFT;
        
        // 4. Persistance
        rdqRepository.persist(entity);
        
        // 5. Actions post-création
        notificationService.sendRdqCreatedNotification(entity);
        
        log.info("RDQ created successfully: id={}, title={}", entity.id, entity.title);
        
        // 6. Retour DTO avec MapStruct
        return rdqMapper.toDto(entity);
    }
    
    /**
     * Mise à jour d'une RDQ
     */
    public RdqDto updateRdq(Long rdqId, UpdateRdqDto updateDto, Long userId) {
        log.debug("Updating RDQ {}: {}", rdqId, updateDto);
        
        RdqEntity entity = findRdqById(rdqId);
        
        // Validation des droits
        validateUpdatePermissions(entity, userId);
        
        // Mise à jour avec MapStruct (ignore les valeurs null)
        rdqMapper.updateEntityFromDto(updateDto, entity);
        
        log.info("RDQ updated successfully: id={}", rdqId);
        return rdqMapper.toDto(entity);
    }
    
    /**
     * Récupération des RDQ d'un utilisateur avec pagination
     */
    public PageDto<RdqDto> getUserRdqs(Long userId, RdqStatus status, int page, int size) {
        log.debug("Getting RDQs for user {}, status {}, page {}, size {}", userId, status, page, size);
        
        // Utilisation directe de l'API Panache native
        String query;
        Object[] params;
        
        if (status != null) {
            query = "user.id = ?1 and status = ?2 ORDER BY createdAt DESC";
            params = new Object[]{userId, status};
        } else {
            query = "user.id = ?1 ORDER BY createdAt DESC";
            params = new Object[]{userId};
        }
        
        // Récupération paginée avec comptage
        long totalElements = rdqRepository.count(query, params);
        List<RdqEntity> entities = rdqRepository.find(query, params)
                                                .page(page, size)
                                                .list();
        
        // Transformation avec MapStruct
        List<RdqDto> dtoList = rdqMapper.toDtoList(entities);
        
        // Construction du PageDto
        PageDto<RdqDto> result = new PageDto<>();
        result.setContent(dtoList);
        result.setTotalElements(totalElements);
        result.setTotalPages((int) Math.ceil((double) totalElements / size));
        result.setNumber(page);
        result.setSize(size);
        result.setFirst(page == 0);
        result.setLast(page >= (int) Math.ceil((double) totalElements / size) - 1);
        result.setNumberOfElements(dtoList.size());
        
        return result;
    }
    
    /**
     * Récupération d'une RDQ par ID
     */
    public RdqDto getRdqById(Long rdqId, Long userId) {
        log.debug("Getting RDQ {} for user {}", rdqId, userId);
        
        RdqEntity entity = findRdqById(rdqId);
        
        // Validation des droits de lecture
        validateReadPermissions(entity, userId);
        
        return rdqMapper.toDto(entity);
    }
    
    /**
     * Soumission d'une RDQ pour approbation
     */
    public RdqDto submitRdq(Long rdqId, Long userId) {
        log.debug("Submitting RDQ {} by user {}", rdqId, userId);
        
        RdqEntity entity = findRdqById(rdqId);
        validateUpdatePermissions(entity, userId);
        
        if (entity.status != RdqStatus.DRAFT) {
            throw new BusinessException("INVALID_STATUS", "Seules les RDQ en brouillon peuvent être soumises");
        }
        
        entity.status = RdqStatus.SUBMITTED;
        
        // Notification au manager
        if (entity.user.manager != null) {
            notificationService.sendRdqSubmittedNotification(entity);
        }
        
        log.info("RDQ submitted successfully: id={}", rdqId);
        return rdqMapper.toDto(entity);
    }
    
    /**
     * Approbation d'une RDQ par un manager
     */
    public RdqDto approveRdq(Long rdqId, String comment, Long managerId) {
        log.debug("Approving RDQ {} by manager {}", rdqId, managerId);
        
        RdqEntity entity = findRdqById(rdqId);
        validateManagerPermissions(entity, managerId);
        
        if (entity.status != RdqStatus.SUBMITTED) {
            throw new BusinessException("INVALID_STATUS", "Seules les RDQ soumises peuvent être approuvées");
        }
        
        entity.status = RdqStatus.APPROVED;
        entity.managerComment = comment;
        
        notificationService.sendRdqApprovedNotification(entity);
        
        log.info("RDQ approved successfully: id={}, manager={}", rdqId, managerId);
        return rdqMapper.toDto(entity);
    }
    
    /**
     * Rejet d'une RDQ par un manager
     */
    public RdqDto rejectRdq(Long rdqId, String comment, Long managerId) {
        log.debug("Rejecting RDQ {} by manager {}", rdqId, managerId);
        
        RdqEntity entity = findRdqById(rdqId);
        validateManagerPermissions(entity, managerId);
        
        if (entity.status != RdqStatus.SUBMITTED) {
            throw new BusinessException("INVALID_STATUS", "Seules les RDQ soumises peuvent être rejetées");
        }
        
        entity.status = RdqStatus.REJECTED;
        entity.managerComment = comment;
        
        notificationService.sendRdqRejectedNotification(entity);
        
        log.info("RDQ rejected successfully: id={}, manager={}", rdqId, managerId);
        return rdqMapper.toDto(entity);
    }
    
    /**
     * Recherche de RDQ avec critères multiples
     */
    public PageDto<RdqDto> searchRdq(Long userId, RdqStatus status, RdqType type, 
                                     RdqPriority priority, LocalDate dateFrom, 
                                     LocalDate dateTo, int page, int size) {
        log.debug("Searching RDQ with criteria: user={}, status={}, type={}", userId, status, type);
        
        // Construction dynamique de la requête
        StringBuilder query = new StringBuilder("1=1");
        List<Object> paramsList = new ArrayList<>();
        
        if (userId != null) {
            query.append(" AND user.id = ?").append(paramsList.size() + 1);
            paramsList.add(userId);
        }
        if (status != null) {
            query.append(" AND status = ?").append(paramsList.size() + 1);
            paramsList.add(status);
        }
        if (type != null) {
            query.append(" AND type = ?").append(paramsList.size() + 1);
            paramsList.add(type);
        }
        if (priority != null) {
            query.append(" AND priority = ?").append(paramsList.size() + 1);
            paramsList.add(priority);
        }
        if (dateFrom != null) {
            query.append(" AND createdAt >= ?").append(paramsList.size() + 1);
            paramsList.add(dateFrom.atStartOfDay());
        }
        if (dateTo != null) {
            query.append(" AND createdAt <= ?").append(paramsList.size() + 1);
            paramsList.add(dateTo.atTime(23, 59, 59));
        }
        
        query.append(" ORDER BY createdAt DESC");
        Object[] params = paramsList.toArray();
        
        // Récupération paginée avec comptage
        long totalElements = rdqRepository.count(query.toString(), params);
        List<RdqEntity> entities = rdqRepository.find(query.toString(), params)
                                                .page(page, size)
                                                .list();
        
        // Transformation avec MapStruct
        List<RdqDto> dtoList = rdqMapper.toDtoList(entities);
        
        // Construction du PageDto
        PageDto<RdqDto> result = new PageDto<>();
        result.setContent(dtoList);
        result.setTotalElements(totalElements);
        result.setTotalPages((int) Math.ceil((double) totalElements / size));
        result.setNumber(page);
        result.setSize(size);
        result.setFirst(page == 0);
        result.setLast(page >= (int) Math.ceil((double) totalElements / size) - 1);
        result.setNumberOfElements(dtoList.size());
        
        return result;
    }
    
    /**
     * Suppression d'une RDQ (soft delete)
     */
    public void deleteRdq(Long rdqId, Long userId) {
        log.debug("Deleting RDQ {} by user {}", rdqId, userId);
        
        RdqEntity entity = findRdqById(rdqId);
        validateDeletePermissions(entity, userId);
        
        if (entity.status != RdqStatus.DRAFT) {
            throw new BusinessException("INVALID_STATUS", "Seules les RDQ en brouillon peuvent être supprimées");
        }
        
        rdqRepository.delete(entity);
        
        log.info("RDQ deleted successfully: id={}", rdqId);
    }
    
    // ========== Méthodes privées de validation ==========
    
    private RdqEntity findRdqById(Long rdqId) {
        RdqEntity entity = rdqRepository.findById(rdqId);
        if (entity == null) {
            throw new RdqNotFoundException(rdqId);
        }
        return entity;
    }
    
    private void validateRdqCreation(CreateRdqDto dto, Long userId) {
        // Validation métier spécifique
        if (dto.getTitle().toLowerCase().contains("test") && dto.getType() != RdqType.AUTRE) {
            log.warn("Suspicious RDQ creation attempt by user {}: {}", userId, dto.getTitle());
        }
    }
    
    private void validateUpdatePermissions(RdqEntity entity, Long userId) {
        if (!entity.user.id.equals(userId)) {
            throw new AccessDeniedException("Vous ne pouvez modifier que vos propres RDQ");
        }
    }
    
    private void validateReadPermissions(RdqEntity entity, Long userId) {
        // Un utilisateur peut voir ses RDQ ou celles de son équipe s'il est manager
        UserEntity currentUser = userRepository.findById(userId);
        
        // L'utilisateur peut voir sa propre RDQ
        if (entity.user.id.equals(userId)) {
            return;
        }
        
        // Un manager peut voir les RDQ de son équipe
        if (entity.user.manager != null && entity.user.manager.id.equals(userId)) {
            return;
        }
        
        throw new AccessDeniedException("Accès non autorisé à cette RDQ");
    }
    
    private void validateManagerPermissions(RdqEntity entity, Long managerId) {
        if (entity.user.manager == null || !entity.user.manager.id.equals(managerId)) {
            throw new AccessDeniedException("Vous n'êtes pas le manager de cet utilisateur");
        }
    }
    
    private void validateDeletePermissions(RdqEntity entity, Long userId) {
        validateUpdatePermissions(entity, userId);
    }
}