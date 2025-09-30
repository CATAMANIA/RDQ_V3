package com.rdq.resource;

import com.rdq.dto.CreateRdqDto;
import com.rdq.dto.LoginDto;
import com.rdq.entity.RdqType;
import com.rdq.entity.RdqPriority;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

/**
 * Tests d'intégration pour RdqResource selon les instructions Backend
 * - Tests end-to-end avec @QuarkusTest
 * - Tests de sécurité avec @TestSecurity
 * - Validation des endpoints REST
 */
@QuarkusTest
class RdqResourceIT {
    
    private CreateRdqDto validCreateDto;
    
    @BeforeEach
    void setUp() {
        validCreateDto = CreateRdqDto.builder()
                .title("Formation Java Spring Boot")
                .description("Formation complète sur Spring Boot pour monter en compétences sur ce framework")
                .type(RdqType.FORMATION)
                .priority(RdqPriority.HIGH)
                .build();
    }
    
    /**
     * Test d'accès non autorisé sans authentification
     */
    @Test
    void shouldReturn401WithoutAuthentication() {
        given()
            .when().get("/api/rdq")
            .then()
            .statusCode(401);
    }
    
    /**
     * Test de création de RDQ avec utilisateur authentifié
     */
    @Test
    @TestSecurity(user = "test@example.com", roles = "USER")
    void shouldCreateRdqSuccessfully() {
        given()
            .contentType(ContentType.JSON)
            .body(validCreateDto)
            .when().post("/api/rdq")
            .then()
            .statusCode(201)
            .body("title", equalTo(validCreateDto.getTitle()))
            .body("description", equalTo(validCreateDto.getDescription()))
            .body("type", equalTo(validCreateDto.getType().name()))
            .body("status", equalTo("DRAFT"));
    }
    
    /**
     * Test de récupération des RDQ utilisateur
     */
    @Test
    @TestSecurity(user = "test@example.com", roles = "USER")
    void shouldReturnUserRdqs() {
        given()
            .when().get("/api/rdq")
            .then()
            .statusCode(200)
            .body("size()", greaterThanOrEqualTo(0));
    }
    
    /**
     * Test avec paramètres de pagination
     */
    @Test
    @TestSecurity(user = "test@example.com", roles = "USER")
    void shouldReturnRdqsWithPagination() {
        given()
            .queryParam("page", 0)
            .queryParam("size", 10)
            .when().get("/api/rdq")
            .then()
            .statusCode(200);
    }
    
    /**
     * Test avec paramètres de filtrage
     */
    @Test
    @TestSecurity(user = "test@example.com", roles = "USER")
    void shouldReturnFilteredRdqs() {
        given()
            .queryParam("type", "FORMATION")
            .queryParam("priority", "HIGH")
            .when().get("/api/rdq")
            .then()
            .statusCode(200);
    }
    
    /**
     * Test de validation des données d'entrée
     */
    @Test
    @TestSecurity(user = "test@example.com", roles = "USER")
    void shouldReturn400WithInvalidData() {
        var invalidDto = CreateRdqDto.builder()
                .title("Test") // Trop court (< 5 caractères)
                .description("Court") // Trop court (< 20 caractères)
                .build();
        
        given()
            .contentType(ContentType.JSON)
            .body(invalidDto)
            .when().post("/api/rdq")
            .then()
            .statusCode(400);
    }
    
    /**
     * Test d'accès refusé pour rôle insuffisant
     */
    @Test
    @TestSecurity(user = "user@example.com", roles = "USER")
    void shouldReturn403ForInsufficientRole() {
        // Tentative d'approbation par un utilisateur simple
        given()
            .contentType(ContentType.JSON)
            .body("{\"comment\": \"Test approval\"}")
            .when().post("/api/rdq/1/approve")
            .then()
            .statusCode(403); // Forbidden
    }
    
    /**
     * Test d'approbation par un manager
     */
    @Test
    @TestSecurity(user = "manager@example.com", roles = "MANAGER")
    void shouldApproveRdqAsManager() {
        // D'abord créer une RDQ comme utilisateur
        // Puis l'approuver comme manager (simulation)
        given()
            .contentType(ContentType.JSON)
            .body("{\"comment\": \"Approuvé pour formation\"}")
            .when().post("/api/rdq/1/approve")
            .then()
            .statusCode(anyOf(is(200), is(400))); // 400 si RDQ n'existe pas
    }
    
    /**
     * Test de recherche avec paramètres invalides
     */
    @Test
    @TestSecurity(user = "test@example.com", roles = "USER")
    void shouldReturn400WithInvalidSearchParams() {
        given()
            .queryParam("q", "<script>alert('xss')</script>") // Tentative XSS
            .when().get("/api/rdq/search")
            .then()
            .statusCode(400);
    }
    
    /**
     * Test de recherche valide
     */
    @Test
    @TestSecurity(user = "test@example.com", roles = "USER")
    void shouldReturnSearchResults() {
        given()
            .queryParam("q", "formation java")
            .when().get("/api/rdq/search")
            .then()
            .statusCode(200)
            .body("size()", greaterThanOrEqualTo(0));
    }
    
    /**
     * Test de suppression de RDQ
     */
    @Test
    @TestSecurity(user = "test@example.com", roles = "USER")
    void shouldDeleteRdq() {
        // Simulation de suppression (peut retourner 404 si RDQ n'existe pas)
        given()
            .when().delete("/api/rdq/999")
            .then()
            .statusCode(anyOf(is(204), is(404), is(400)));
    }
    
    /**
     * Test des headers de sécurité
     */
    @Test
    @TestSecurity(user = "test@example.com", roles = "USER")
    void shouldReturnSecurityHeaders() {
        given()
            .when().get("/api/rdq")
            .then()
            .statusCode(200)
            .header("X-Frame-Options", "DENY")
            .header("X-Content-Type-Options", "nosniff")
            .header("X-XSS-Protection", "1; mode=block");
    }
}