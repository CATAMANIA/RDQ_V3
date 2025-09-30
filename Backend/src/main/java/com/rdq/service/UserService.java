package com.rdq.service;

import com.rdq.dto.UserDto;
import com.rdq.dto.CreateUserDto;
import com.rdq.dto.UpdateUserDto;
import com.rdq.entity.UserEntity;
import com.rdq.entity.UserRole;
import com.rdq.repository.UserRepository;
import com.rdq.mapper.UserMapper;
import com.rdq.exception.UserNotFoundException;
import com.rdq.exception.BusinessException;
import com.rdq.security.PasswordService;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Optional;

/**
 * Service User selon les instructions Backend
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
public class UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper; // Injection automatique MapStruct
    private final PasswordService passwordService;
    
    /**
     * Création d'un utilisateur
     */
    public UserDto createUser(CreateUserDto createDto) {
        log.debug("Creating user: {}", createDto.getEmail());
        
        // Validation métier
        validateUserCreation(createDto);
        
        // Transformation DTO -> Entity avec MapStruct
        UserEntity entity = userMapper.toEntity(createDto);
        
        // Hash du mot de passe (sécurité OWASP A02)
        entity.passwordHash = passwordService.hashPassword(createDto.getPassword());
        
        // Gestion du manager si spécifié
        if (createDto.getManagerId() != null) {
            UserEntity manager = userRepository.findById(createDto.getManagerId());
            if (manager == null) {
                throw new BusinessException("MANAGER_NOT_FOUND", "Manager non trouvé");
            }
            entity.manager = manager;
        }
        
        // Persistance
        userRepository.persist(entity);
        
        log.info("User created successfully: id={}, email={}", entity.id, entity.email);
        
        // Retour DTO avec MapStruct
        return userMapper.toDto(entity);
    }
    
    /**
     * Mise à jour d'un utilisateur
     */
    public UserDto updateUser(Long userId, UpdateUserDto updateDto) {
        log.debug("Updating user {}: {}", userId, updateDto);
        
        UserEntity entity = findUserById(userId);
        
        // Mise à jour avec MapStruct (ignore les valeurs null)
        userMapper.updateEntityFromDto(updateDto, entity);
        
        // Gestion du manager si modifié
        if (updateDto.getManagerId() != null) {
            UserEntity manager = userRepository.findById(updateDto.getManagerId());
            if (manager == null) {
                throw new BusinessException("MANAGER_NOT_FOUND", "Manager non trouvé");
            }
            entity.manager = manager;
        }
        
        log.info("User updated successfully: id={}", userId);
        return userMapper.toDto(entity);
    }
    
    /**
     * Récupération d'un utilisateur par ID
     */
    public UserDto getUserById(Long userId) {
        log.debug("Getting user by id: {}", userId);
        
        UserEntity entity = findUserById(userId);
        return userMapper.toDto(entity);
    }
    
    /**
     * Récupération d'un utilisateur par email
     */
    public UserDto getUserByEmail(String email) {
        log.debug("Getting user by email: {}", email);
        
        Optional<UserEntity> entityOpt = userRepository.findByEmail(email);
        if (entityOpt.isEmpty()) {
            throw new UserNotFoundException("Utilisateur non trouvé: " + email);
        }
        
        return userMapper.toDto(entityOpt.get());
    }
    
    /**
     * Liste tous les utilisateurs actifs
     */
    public List<UserDto> getAllActiveUsers() {
        log.debug("Getting all active users");
        
        List<UserEntity> entities = userRepository.findActiveUsers();
        return userMapper.toDtoList(entities);
    }
    
    /**
     * Liste des utilisateurs par rôle
     */
    public List<UserDto> getUsersByRole(UserRole role) {
        log.debug("Getting users by role: {}", role);
        
        List<UserEntity> entities = userRepository.findByRole(role);
        return userMapper.toDtoList(entities);
    }
    
    /**
     * Recherche d'utilisateurs par nom/prénom
     */
    public List<UserDto> searchUsers(String searchTerm) {
        log.debug("Searching users: {}", searchTerm);
        
        List<UserEntity> entities = userRepository.searchByName(searchTerm);
        return userMapper.toDtoList(entities);
    }
    
    /**
     * Désactivation d'un utilisateur
     */
    public UserDto deactivateUser(Long userId) {
        log.debug("Deactivating user: {}", userId);
        
        UserEntity entity = findUserById(userId);
        entity.active = false;
        
        log.info("User deactivated successfully: id={}", userId);
        return userMapper.toDto(entity);
    }
    
    /**
     * Réactivation d'un utilisateur
     */
    public UserDto activateUser(Long userId) {
        log.debug("Activating user: {}", userId);
        
        UserEntity entity = findUserById(userId);
        entity.active = true;
        
        log.info("User activated successfully: id={}", userId);
        return userMapper.toDto(entity);
    }
    
    /**
     * Changement de mot de passe
     */
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        log.debug("Changing password for user: {}", userId);
        
        UserEntity entity = findUserById(userId);
        
        // Vérification ancien mot de passe
        if (!passwordService.verifyPassword(oldPassword, entity.passwordHash)) {
            throw new BusinessException("INVALID_PASSWORD", "Mot de passe actuel incorrect");
        }
        
        // Hash nouveau mot de passe
        entity.passwordHash = passwordService.hashPassword(newPassword);
        
        log.info("Password changed successfully for user: {}", userId);
    }
    
    /**
     * Liste des collaborateurs d'un manager
     */
    public List<UserDto> getTeamMembers(Long managerId) {
        log.debug("Getting team members for manager: {}", managerId);
        
        List<UserEntity> entities = userRepository.findByManagerId(managerId);
        return userMapper.toDtoList(entities);
    }
    
    // ========== Méthodes privées ==========
    
    private UserEntity findUserById(Long userId) {
        UserEntity entity = userRepository.findById(userId);
        if (entity == null) {
            throw new UserNotFoundException("Utilisateur non trouvé: " + userId);
        }
        return entity;
    }
    
    private void validateUserCreation(CreateUserDto dto) {
        // Vérification unicité email
        if (userRepository.findByEmail(dto.getEmail()) != null) {
            throw new BusinessException("EMAIL_ALREADY_EXISTS", "Cet email est déjà utilisé");
        }
        
        // Validation mot de passe
        if (!passwordService.isValidPassword(dto.getPassword())) {
            throw new BusinessException("WEAK_PASSWORD", 
                "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre");
        }
    }
}