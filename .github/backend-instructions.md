# Backend Development Instructions - RDQ_V3

## Vue d'ensemble
Le backend RDQ_V3 est développé en Java 21 avec le framework Quarkus. Il expose une API REST pour la gestion des Demandes de Ressources Qualifiées (RDQ) et gère l'authentification, l'autorisation, et l'intégration avec les systèmes externes.

## Architecture Backend

### Structure des packages
```
Backend/
├── src/main/java/com/rdq/
│   ├── config/          # Configuration (CORS, JWT, etc.)
│   ├── entity/          # Entités JPA/Hibernate
│   ├── repository/      # Repositories Panache
│   ├── service/         # Services métier
│   ├── resource/        # Endpoints REST
│   ├── dto/             # Data Transfer Objects
│   ├── mapper/          # Mappers Entity <-> DTO
│   ├── security/        # Sécurité, JWT, rôles
│   ├── exception/       # Gestion des exceptions
│   └── util/            # Utilitaires
├── src/main/resources/
│   ├── application.properties
│   ├── application-dev.properties
│   ├── application-prod.properties
│   └── db/changelog/    # Scripts Liquibase (OBLIGATOIRE)
└── src/test/            # Tests unitaires et d'intégration
```

## Standards de développement

### Conventions de nommage
- **Entités** : PascalCase (ex: `RdqEntity`, `UserEntity`)
- **DTOs** : PascalCase + suffixe DTO (ex: `RdqDto`, `UserProfileDto`)
- **Services** : PascalCase + suffixe Service (ex: `RdqService`, `NotificationService`)
- **Resources** : PascalCase + suffixe Resource (ex: `RdqResource`, `AuthResource`)
- **Repositories** : PascalCase + suffixe Repository (ex: `RdqRepository`)
- **Endpoints** : kebab-case dans l'URL (ex: `/api/rdq`, `/api/user-profile`)

### Gestion des entités JPA

#### Modèle de base
```java
@Entity
@Table(name = "rdq")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RdqEntity extends PanacheEntityBase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    @Column(nullable = false)
    @NotBlank(message = "Le titre est obligatoire")
    public String title;
    
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le statut est obligatoire")
    public RdqStatus status;
    
    @CreationTimestamp
    public LocalDateTime createdAt;
    
    @UpdateTimestamp
    public LocalDateTime updatedAt;
    
    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @NotNull(message = "L'utilisateur est obligatoire")
    public UserEntity user;
}
```

#### Règles pour les entités
- Utiliser `PanacheEntityBase` comme classe de base
- **Lombok OBLIGATOIRE** : `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`
- Champs publics pour Panache (pas de getters/setters manuels)
- Annotations de validation Bean Validation
- `@CreationTimestamp` et `@UpdateTimestamp` pour l'audit
- Relations LAZY par défaut
- Indexes sur les colonnes de recherche

### Repositories Panache

```java
@ApplicationScoped
public class RdqRepository implements PanacheRepositoryBase<RdqEntity, Long> {
    
    public List<RdqEntity> findByUserAndStatus(Long userId, RdqStatus status) {
        return find("user.id = ?1 and status = ?2", userId, status).list();
    }
    
    public Page<RdqEntity> findByManagerWithPagination(Long managerId, int page, int size) {
        return find("user.manager.id = ?1", managerId)
               .page(Page.of(page, size));
    }
}
```

### Services métier

#### Structure type d'un service
```java
@ApplicationScoped
@Transactional
public class RdqService {
    
    @Inject
    RdqRepository rdqRepository;
    
    @Inject
    NotificationService notificationService;
    
    public RdqDto createRdq(CreateRdqDto createDto, Long userId) {
        // 1. Validation métier
        validateRdqCreation(createDto, userId);
        
        // 2. Transformation DTO -> Entity
        RdqEntity entity = RdqMapper.toEntity(createDto);
        entity.user = userRepository.findById(userId);
        entity.status = RdqStatus.DRAFT;
        
        // 3. Persistance
        rdqRepository.persist(entity);
        
        // 4. Actions post-création
        notificationService.sendRdqCreatedNotification(entity);
        
        // 5. Retour DTO
        return RdqMapper.toDto(entity);
    }
    
    private void validateRdqCreation(CreateRdqDto dto, Long userId) {
        // Validation métier spécifique
    }
}
```

#### Règles pour les services
- Annotation `@Transactional` au niveau classe
- Injection des dépendances avec `@Inject`
- Validation métier dans des méthodes privées
- Utilisation des mappers pour Entity <-> DTO
- Gestion des exceptions métier explicite
- Logs avec SLF4J pour traçabilité

### API REST Resources

#### Structure type d'un endpoint
```java
@Path("/api/rdq")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({"USER", "MANAGER", "ADMIN"})
public class RdqResource {
    
    @Inject
    RdqService rdqService;
    
    @GET
    @RolesAllowed({"USER", "MANAGER"})
    public Response getRdqList(@QueryParam("status") RdqStatus status,
                               @QueryParam("page") @DefaultValue("0") int page,
                               @QueryParam("size") @DefaultValue("20") int size,
                               @Context SecurityContext securityContext) {
        
        Long userId = getCurrentUserId(securityContext);
        Page<RdqDto> result = rdqService.getUserRdqs(userId, status, page, size);
        
        return Response.ok(result).build();
    }
    
    @POST
    @RolesAllowed("USER")
    public Response createRdq(@Valid CreateRdqDto createDto,
                              @Context SecurityContext securityContext) {
        try {
            Long userId = getCurrentUserId(securityContext);
            RdqDto created = rdqService.createRdq(createDto, userId);
            
            return Response.status(Status.CREATED)
                          .entity(created)
                          .build();
                          
        } catch (BusinessException e) {
            return Response.status(Status.BAD_REQUEST)
                          .entity(ErrorResponse.of(e.getMessage()))
                          .build();
        }
    }
}
```

#### Standards API REST
- Utiliser les codes HTTP appropriés (200, 201, 400, 401, 403, 404, 500)
- Validation avec Bean Validation (`@Valid`)
- Gestion des erreurs avec des DTOs d'erreur standardisés
- Pagination avec `Page<T>` pour les listes
- Filtres via `@QueryParam`
- Sécurité avec `@RolesAllowed`

### Sécurité et authentification

#### Configuration JWT
```java
@ApplicationScoped
public class JwtService {
    
    public String generateToken(UserEntity user) {
        return Jwt.issuer("rdq-app")
                  .subject(user.email)
                  .claim("userId", user.id)
                  .claim("role", user.role.name())
                  .expiresAt(Instant.now().plusSeconds(3600))
                  .sign();
    }
    
    public Optional<JwtClaims> validateToken(String token) {
        try {
            return Optional.of(Jwt.parse(token));
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
```

#### Gestion des rôles
- **USER** : Collaborateur (création/consultation de ses RDQ)
- **MANAGER** : Manager (gestion d'équipe, approbation RDQ)
- **ADMIN** : Administrateur (configuration système)

## Outils obligatoires

### Liquibase - Gestion des migrations de base de données

#### Configuration obligatoire
Liquibase est **OBLIGATOIRE** pour toutes les modifications de schéma de base de données.

Structure des changesets :
```
src/main/resources/db/changelog/
├── db.changelog-master.xml          # Fichier principal
├── changes/
│   ├── 001-create-users-table.xml
│   ├── 002-create-rdq-table.xml
│   ├── 003-add-rdq-status-column.xml
│   └── ...
└── data/
    ├── 001-insert-default-users.xml
    └── 002-insert-rdq-types.xml
```

#### Exemple de changeset
```xml
<?xml version="1.0" encoding="UTF-8"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
                   http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-4.0.xsd">

    <changeSet id="001-create-rdq-table" author="developer">
        <comment>Création de la table RDQ</comment>
        <createTable tableName="rdq">
            <column name="id" type="BIGINT" autoIncrement="true">
                <constraints primaryKey="true" nullable="false"/>
            </column>
            <column name="title" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="status" type="VARCHAR(50)">
                <constraints nullable="false"/>
            </column>
            <column name="created_at" type="TIMESTAMP" defaultValueComputed="CURRENT_TIMESTAMP"/>
            <column name="updated_at" type="TIMESTAMP" defaultValueComputed="CURRENT_TIMESTAMP"/>
            <column name="user_id" type="BIGINT">
                <constraints nullable="false"/>
            </column>
        </createTable>
        
        <addForeignKeyConstraint baseTableName="rdq" baseColumnNames="user_id"
                                 constraintName="fk_rdq_user"
                                 referencedTableName="users" referencedColumnNames="id"/>
    </changeSet>
</databaseChangeLog>
```

### Lombok - Réduction du code boilerplate

#### Utilisation obligatoire
Lombok est **OBLIGATOIRE** pour réduire le code boilerplate dans les entités, DTOs et services.

#### Annotations principales à utiliser

**Pour les entités :**
```java
@Entity
@Table(name = "rdq")
@Data                    // Génère getters, setters, toString, equals, hashCode
@NoArgsConstructor      // Constructeur sans arguments (requis par JPA)
@AllArgsConstructor     // Constructeur avec tous les arguments
public class RdqEntity extends PanacheEntityBase {
    // Champs de l'entité
}
```

**Pour les DTOs :**
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RdqDto {
    private Long id;
    private String title;
    private RdqStatus status;
    // autres champs...
}
```

**Pour les DTOs de requête :**
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Valid
public class CreateRdqDto {
    @NotBlank(message = "Le titre est obligatoire")
    @Size(min = 5, max = 255, message = "Le titre doit contenir entre 5 et 255 caractères")
    private String title;
    
    @NotNull(message = "Le type est obligatoire")
    private RdqType type;
    // autres champs...
}
```

**Pour les services avec injection :**
```java
@ApplicationScoped
@Transactional
@RequiredArgsConstructor  // Constructeur avec final fields pour injection
public class RdqService {
    
    private final RdqRepository rdqRepository;
    private final NotificationService notificationService;
    
    // Pas besoin de constructeur ni d'annotations @Inject
}
```

#### Annotations Lombok recommandées
- `@Data` : Génère getters, setters, toString, equals, hashCode
- `@Builder` : Pattern Builder pour construction d'objets
- `@NoArgsConstructor` : Constructeur sans arguments
- `@AllArgsConstructor` : Constructeur avec tous les arguments
- `@RequiredArgsConstructor` : Constructeur avec champs final/non-null
- `@Slf4j` : Logger automatique
- `@Value` : Classe immutable (final, getters seulement)

### Configuration par environnement

#### application.properties (base)
```properties
# Database
quarkus.datasource.db-kind=postgresql
quarkus.hibernate-orm.database.generation=none

# Liquibase (OBLIGATOIRE)
quarkus.liquibase.migrate-at-start=true
quarkus.liquibase.change-log=db/changelog/db.changelog-master.xml
quarkus.liquibase.validate-on-migrate=true

# JWT
mp.jwt.verify.issuer=rdq-app
mp.jwt.verify.publickey.location=META-INF/publickey.pem

# CORS
quarkus.http.cors=true
quarkus.http.cors.origins=http://localhost:3000

# Logs
quarkus.log.level=INFO
quarkus.log.category."com.rdq".level=DEBUG
```

#### application-dev.properties
```properties
# Base de données H2 pour dev
quarkus.datasource.db-kind=h2
quarkus.datasource.jdbc.url=jdbc:h2:mem:rdq-dev
quarkus.hibernate-orm.database.generation=drop-and-create

# Logs plus verbeux
quarkus.log.level=DEBUG
```

#### application-prod.properties
```properties
# Production database
quarkus.datasource.jdbc.url=${DATABASE_URL}
quarkus.datasource.username=${DB_USERNAME}
quarkus.datasource.password=${DB_PASSWORD}

# Security
quarkus.http.cors.origins=${FRONTEND_URL}

# Logs
quarkus.log.level=WARN
quarkus.log.category."com.rdq".level=INFO
```

## Tests

### Tests unitaires
```java
@QuarkusTest
class RdqServiceTest {
    
    @Inject
    RdqService rdqService;
    
    @Mock
    RdqRepository rdqRepository;
    
    @Test
    void shouldCreateRdqSuccessfully() {
        // Given
        CreateRdqDto createDto = new CreateRdqDto();
        createDto.title = "Test RDQ";
        
        // When
        RdqDto result = rdqService.createRdq(createDto, 1L);
        
        // Then
        assertThat(result.title).isEqualTo("Test RDQ");
        verify(rdqRepository).persist(any(RdqEntity.class));
    }
}
```

### Tests d'intégration
```java
@QuarkusTest
@TestHTTPEndpoint(RdqResource.class)
class RdqResourceTest {
    
    @Test
    @TestSecurity(user = "test@example.com", roles = "USER")
    void shouldReturnUserRdqs() {
        given()
            .when().get()
            .then()
            .statusCode(200)
            .body("content.size()", greaterThan(0));
    }
}
```

## Gestion des erreurs

### Exceptions métier
```java
public class BusinessException extends RuntimeException {
    private final String code;
    
    public BusinessException(String code, String message) {
        super(message);
        this.code = code;
    }
}

public class RdqNotFoundException extends BusinessException {
    public RdqNotFoundException(Long rdqId) {
        super("RDQ_NOT_FOUND", "RDQ with id " + rdqId + " not found");
    }
}
```

### ExceptionMapper global
```java
@Provider
public class GlobalExceptionMapper implements ExceptionMapper<Exception> {
    
    @Override
    public Response toResponse(Exception exception) {
        if (exception instanceof BusinessException) {
            return Response.status(Status.BAD_REQUEST)
                          .entity(ErrorResponse.of(exception.getMessage()))
                          .build();
        }
        
        // Log erreur inattendue
        Log.error("Unexpected error", exception);
        
        return Response.status(Status.INTERNAL_SERVER_ERROR)
                      .entity(ErrorResponse.of("Internal server error"))
                      .build();
    }
}
```

## Performance et monitoring

### Métriques applicatives
```java
@ApplicationScoped
public class RdqMetrics {
    
    @Counted(name = "rdq_created_total", description = "Total RDQ created")
    @Timed(name = "rdq_creation_duration", description = "RDQ creation duration")
    public void recordRdqCreation() {
        // Métrique automatique via annotations
    }
}
```

### Health checks
```java
@ApplicationScoped
@Readiness
public class DatabaseHealthCheck implements HealthCheck {
    
    @Inject
    AgroalDataSource dataSource;
    
    @Override
    public HealthCheckResponse call() {
        try {
            dataSource.getConnection().close();
            return HealthCheckResponse.up("Database connection OK");
        } catch (Exception e) {
            return HealthCheckResponse.down("Database connection failed");
        }
    }
}
```

## Bonnes pratiques

### Code quality
- Couverture de tests > 80%
- Utilisation de SonarQube pour l'analyse statique
- Respect des conventions Google Java Style
- Documentation JavaDoc pour les APIs publiques

### Performance
- Requêtes optimisées avec projections DTO
- Pagination obligatoire pour les listes
- Cache avec Quarkus Cache pour données statiques
- Connection pooling configuré

### Sécurité
- Validation systématique des entrées
- Logs d'audit pour actions sensibles
- Protection CSRF pour les mutations
- Rate limiting sur les endpoints publics

### Maintenance
- **Migration base de données avec Liquibase (OBLIGATOIRE)**
- Gestion des changements de schéma versionnés
- Configuration externalisée
- Logs structurés (JSON en prod)
- Monitoring avec Micrometer/Prometheus

---

## Checklist développement

Avant chaque commit, vérifier :
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Pas de warnings SonarQube critiques
- [ ] Documentation JavaDoc à jour
- [ ] **Changeset Liquibase créé si modification de schéma**
- [ ] Annotations Lombok utilisées correctement
- [ ] Logs appropriés ajoutés
- [ ] Gestion d'erreurs implémentée
- [ ] Validation des entrées en place

---
*Dernière mise à jour : Octobre 2025*