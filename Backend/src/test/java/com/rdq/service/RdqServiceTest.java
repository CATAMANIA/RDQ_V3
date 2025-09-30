package com.rdq.service;

import com.rdq.dto.RdqDto;
import com.rdq.dto.CreateRdqDto;
import com.rdq.entity.RdqType;
import com.rdq.entity.RdqPriority;
import com.rdq.entity.RdqStatus;
import com.rdq.repository.UserRepository;
import com.rdq.repository.RdqRepository;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.mockito.InjectMock;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Tests unitaires pour RdqService selon les instructions Backend
 * - Tests couvrant les cas limites
 * - Tests paramétrés avec @ParameterizedTest
 * - Documentation avec JavaDoc
 */
@QuarkusTest
class RdqServiceTest {
    
    @Inject
    RdqService rdqService;
    
    @InjectMock
    RdqRepository rdqRepository;
    
    @InjectMock
    UserRepository userRepository;
    
    @InjectMock
    NotificationService notificationService;
    
    private CreateRdqDto validCreateDto;
    private Long userId;
    
    @BeforeEach
    void setUp() {
        userId = 1L;
        validCreateDto = CreateRdqDto.builder()
                .title("Test RDQ Formation Java")
                .description("Formation Java avancée pour améliorer les compétences de l'équipe")
                .type(RdqType.FORMATION)
                .priority(RdqPriority.MEDIUM)
                .build();
    }
    
    /**
     * Test de création RDQ avec données valides
     */
    @Test
    void shouldCreateRdqSuccessfully() {
        // Given
        var mockUser = TestDataBuilder.createUser(userId, "test@example.com");
        when(userRepository.findById(userId)).thenReturn(mockUser);
        
        var mockRdq = TestDataBuilder.createRdq(1L, validCreateDto.getTitle(), mockUser);
        when(rdqRepository.persist(any())).thenAnswer(invocation -> {
            var rdq = invocation.getArgument(0);
            // Simulation de l'assignation d'ID par la base
            return rdq;
        });
        
        // When
        RdqDto result = rdqService.createRdq(validCreateDto, userId);
        
        // Then
        assertNotNull(result);
        assertEquals(validCreateDto.getTitle(), result.getTitle());
        assertEquals(validCreateDto.getDescription(), result.getDescription());
        assertEquals(RdqStatus.DRAFT, result.getStatus());
        
        // Vérification des interactions
        Mockito.verify(userRepository).findById(userId);
        Mockito.verify(rdqRepository).persist(any());
        Mockito.verify(notificationService).sendRdqCreatedNotification(any());
    }
    
    /**
     * Test paramétré pour différents types de RDQ
     */
    @ParameterizedTest
    @EnumSource(RdqType.class)
    void shouldCreateRdqWithAllTypes(RdqType type) {
        // Given
        validCreateDto.setType(type);
        var mockUser = TestDataBuilder.createUser(userId, "test@example.com");
        when(userRepository.findById(userId)).thenReturn(mockUser);
        
        // When
        RdqDto result = rdqService.createRdq(validCreateDto, userId);
        
        // Then
        assertEquals(type, result.getType());
    }
    
    /**
     * Test paramétré pour différentes priorités
     */
    @ParameterizedTest
    @EnumSource(RdqPriority.class)
    void shouldCreateRdqWithAllPriorities(RdqPriority priority) {
        // Given
        validCreateDto.setPriority(priority);
        var mockUser = TestDataBuilder.createUser(userId, "test@example.com");
        when(userRepository.findById(userId)).thenReturn(mockUser);
        
        // When
        RdqDto result = rdqService.createRdq(validCreateDto, userId);
        
        // Then
        assertEquals(priority, result.getPriority());
    }
    
    /**
     * Test avec valeurs limites - titre minimum
     */
    @Test
    void shouldFailWithTitleTooShort() {
        // Given
        validCreateDto.setTitle("Test"); // 4 caractères (< 5 minimum)
        
        // When & Then
        assertThrows(Exception.class, () -> {
            rdqService.createRdq(validCreateDto, userId);
        });
    }
    
    /**
     * Test avec valeurs limites - description minimum
     */
    @Test
    void shouldFailWithDescriptionTooShort() {
        // Given
        validCreateDto.setDescription("Trop court"); // < 20 caractères
        
        // When & Then
        assertThrows(Exception.class, () -> {
            rdqService.createRdq(validCreateDto, userId);
        });
    }
    
    /**
     * Test avec utilisateur inexistant
     */
    @Test
    void shouldFailWithNonExistentUser() {
        // Given
        when(userRepository.findById(userId)).thenReturn(null);
        
        // When & Then
        assertThrows(Exception.class, () -> {
            rdqService.createRdq(validCreateDto, userId);
        });
    }
    
    /**
     * Test avec valeurs nulles
     */
    @Test
    void shouldFailWithNullValues() {
        // When & Then
        assertThrows(Exception.class, () -> {
            rdqService.createRdq(null, userId);
        });
        
        assertThrows(Exception.class, () -> {
            rdqService.createRdq(validCreateDto, null);
        });
    }
    
    /**
     * Test de soumission RDQ
     */
    @Test
    void shouldSubmitRdqSuccessfully() {
        // Given
        Long rdqId = 1L;
        var mockUser = TestDataBuilder.createUser(userId, "test@example.com");
        var mockRdq = TestDataBuilder.createRdq(rdqId, "Test RDQ", mockUser);
        mockRdq.status = RdqStatus.DRAFT;
        
        when(rdqRepository.findById(rdqId)).thenReturn(mockRdq);
        
        // When
        RdqDto result = rdqService.submitRdq(rdqId, userId);
        
        // Then
        assertEquals(RdqStatus.SUBMITTED, result.getStatus());
        Mockito.verify(notificationService).sendRdqSubmittedNotification(any());
    }
    
    /**
     * Test de soumission avec statut invalide
     */
    @Test
    void shouldFailSubmitWithInvalidStatus() {
        // Given
        Long rdqId = 1L;
        var mockUser = TestDataBuilder.createUser(userId, "test@example.com");
        var mockRdq = TestDataBuilder.createRdq(rdqId, "Test RDQ", mockUser);
        mockRdq.status = RdqStatus.APPROVED; // Déjà approuvée
        
        when(rdqRepository.findById(rdqId)).thenReturn(mockRdq);
        
        // When & Then
        assertThrows(Exception.class, () -> {
            rdqService.submitRdq(rdqId, userId);
        });
    }
}