# Backend Development Instructions - RDQ_V3

## Vue d'ensemble
Le backend RDQ_V3 est développé en Java 21 avec le framework Quarkus et PostgreSQL 16 comme base de données. Il expose une API REST pour la gestion des Demandes de Ressources Qualifiées (RDQ) et gère l'authentification, l'autorisation, et l'intégration avec les systèmes externes.

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

#### Structure type d'un service avec MapStruct
```java
@ApplicationScoped
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RdqService {
    
    private final RdqRepository rdqRepository;
    private final UserRepository userRepository;
    private final RdqMapper rdqMapper; // Injection automatique MapStruct
    private final NotificationService notificationService;
    
    public RdqDto createRdq(CreateRdqDto createDto, Long userId) {
        log.debug("Creating RDQ for user {}: {}", userId, createDto.getTitle());
        
        // 1. Validation métier
        validateRdqCreation(createDto, userId);
        
        // 2. Transformation DTO -> Entity avec MapStruct
        RdqEntity entity = rdqMapper.toEntity(createDto);
        entity.user = userRepository.findById(userId);
        entity.status = RdqStatus.DRAFT;
        
        // 3. Persistance
        rdqRepository.persist(entity);
        
        // 4. Actions post-création
        notificationService.sendRdqCreatedNotification(entity);
        
        // 5. Retour DTO avec MapStruct
        return rdqMapper.toDto(entity);
    }
    
    public RdqDto updateRdq(Long rdqId, UpdateRdqDto updateDto, Long userId) {
        RdqEntity entity = rdqRepository.findById(rdqId);
        if (entity == null) {
            throw new RdqNotFoundException(rdqId);
        }
        
        // Validation des droits
        validateUpdatePermissions(entity, userId);
        
        // Mise à jour avec MapStruct (ignore les valeurs null)
        rdqMapper.updateEntityFromDto(updateDto, entity);
        
        log.debug("Updated RDQ {}: {}", rdqId, updateDto);
        return rdqMapper.toDto(entity);
    }
    
    public Page<RdqDto> getUserRdqs(Long userId, RdqStatus status, int page, int size) {
        Page<RdqEntity> entities = rdqRepository.findByUserAndStatus(userId, status, page, size);
        
        // Transformation Page<Entity> -> Page<DTO>
        return new Page<>(
            rdqMapper.toDtoList(entities.content),
            entities.totalElements,
            entities.totalPages,
            entities.number,
            entities.size
        );
    }
    
    private void validateRdqCreation(CreateRdqDto dto, Long userId) {
        // Validation métier spécifique
    }
    
    private void validateUpdatePermissions(RdqEntity entity, Long userId) {
        // Validation des permissions
    }
}
```

#### Règles pour les services
- Annotation `@Transactional` au niveau classe
- **Lombok** : `@RequiredArgsConstructor` pour injection par constructeur
- **Lombok** : `@Slf4j` pour logging automatique
- **MapStruct** : Injection automatique des mappers via CDI
- Validation métier dans des méthodes privées
- Utilisation des mappers MapStruct pour Entity <-> DTO
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

## Sécurité OWASP - Règles obligatoires

### Conformité OWASP Top 10
Le projet RDQ_V3 doit **OBLIGATOIREMENT** respecter les règles de sécurité OWASP pour Java/Quarkus. Toutes les implémentations suivantes sont **OBLIGATOIRES**.

### 1. A01:2021 - Injection

#### Protection contre l'injection SQL
```java
@ApplicationScoped
public class RdqRepository implements PanacheRepositoryBase<RdqEntity, Long> {
    
    // ✅ CORRECT - Requêtes paramétrées
    public List<RdqEntity> findByUserAndStatus(Long userId, RdqStatus status) {
        return find("user.id = ?1 and status = ?2", userId, status).list();
    }
    
    // ✅ CORRECT - Named parameters
    public List<RdqEntity> searchByTitle(String title) {
        return find("title LIKE :title", Parameters.with("title", "%" + title + "%")).list();
    }
    
    // ❌ INTERDIT - Concaténation directe
    // public List<RdqEntity> searchUnsafe(String title) {
    //     return find("title LIKE '" + title + "'").list();
    // }
}
```

#### Validation d'entrée obligatoire
```java
@Path("/api/rdq")
public class RdqResource {
    
    @POST
    public Response createRdq(@Valid CreateRdqDto createDto) {
        // Validation automatique avec Bean Validation
        // @Valid est OBLIGATOIRE sur tous les paramètres d'entrée
    }
    
    @GET
    public Response searchRdq(@QueryParam("search") @Pattern(regexp = "^[a-zA-Z0-9\\s]{1,100}$") String search) {
        // Validation des paramètres de requête OBLIGATOIRE
        if (search != null && !search.matches("^[a-zA-Z0-9\\s]{1,100}$")) {
            throw new ValidationException("Invalid search parameter");
        }
    }
}
```

### 2. A02:2021 - Échec de l'authentification et de la gestion de session

#### Authentification robuste
```java
@ApplicationScoped
public class AuthService {
    
    private static final int MAX_LOGIN_ATTEMPTS = 3;
    private static final int LOCKOUT_DURATION_MINUTES = 15;
    
    @Inject
    JwtService jwtService;
    
    @Inject
    UserRepository userRepository;
    
    // Utilisation de Quarkus Security natif pour le hachage
    @Inject
    @Named("default")
    PasswordProvider passwordProvider;
    
    public AuthResponse authenticate(String email, String password) {
        UserEntity user = userRepository.findByEmail(email);
        
        // Vérification des tentatives de connexion
        if (isAccountLocked(user)) {
            throw new AccountLockedException("Account temporarily locked");
        }
        
        // Vérification du mot de passe avec Quarkus Security
        if (!passwordProvider.verify(password, user.passwordHash)) {
            recordFailedAttempt(user);
            throw new InvalidCredentialsException("Invalid credentials");
        }
        
        // Reset des tentatives en cas de succès
        resetFailedAttempts(user);
        
        // Génération token sécurisé
        String token = jwtService.generateToken(user);
        return new AuthResponse(user, token);
    }
    
    public String hashPassword(String password) {
        // Hash sécurisé avec Quarkus Security natif
        return passwordProvider.password(password);
    }
    
    private boolean isAccountLocked(UserEntity user) {
        // Logique de vérification du verrouillage de compte
        return false; // À implémenter
    }
    
    private void recordFailedAttempt(UserEntity user) {
        // Logique d'enregistrement des tentatives échouées
    }
    
    private void resetFailedAttempts(UserEntity user) {
        // Logique de reset des tentatives
    }
}
```

#### Configuration sécurisée des sessions
```properties
# application.properties
# Configuration JWT sécurisée
mp.jwt.verify.issuer=rdq-app
mp.jwt.verify.publickey.location=META-INF/publickey.pem
quarkus.smallrye-jwt.enabled=true

# Expiration courte des tokens
mp.jwt.token.expiration=3600

# Configuration HTTPS obligatoire en production
quarkus.http.ssl-port=8443
quarkus.http.ssl.certificate.key-store-file=keystore.p12
quarkus.http.ssl.certificate.key-store-password=${SSL_KEYSTORE_PASSWORD}

# Sécurisation des cookies
quarkus.http.same-site-cookie=strict
quarkus.http.secure-cookies=true
```

### 3. A03:2021 - Injection et exposition de données sensibles

#### Protection des données sensibles
```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity extends PanacheEntityBase {
    
    @Column(nullable = false, unique = true)
    public String email;
    
    // ❌ INTERDIT - Mot de passe en clair
    // public String password;
    
    // ✅ OBLIGATOIRE - Hash du mot de passe
    @Column(name = "password_hash", nullable = false)
    @JsonIgnore // Exclure des sérialisations JSON
    public String passwordHash;
    
    // ❌ INTERDIT - Données sensibles loggées
    @Override
    public String toString() {
        return "UserEntity{id=" + id + ", email='" + email + "'}";
        // Ne jamais inclure passwordHash dans toString()
    }
}
```

#### Configuration de chiffrement
```properties
# Variables d'environnement pour données sensibles
quarkus.datasource.password=${DB_PASSWORD}
mp.jwt.decrypt.key.location=${JWT_PRIVATE_KEY}

# Chiffrement en base
quarkus.hibernate-orm.database.charset=UTF-8
quarkus.hibernate-orm.sql-load-script=no-script.sql
```

### 4. A04:2021 - Entités externes XML (XXE)

#### Configuration sécurisée XML
```java
@ApplicationScoped
public class XmlProcessor {
    
    public Document parseXmlSecurely(InputStream xmlInput) throws ParserConfigurationException {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        
        // Protection XXE OBLIGATOIRE
        factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
        factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
        factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
        factory.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
        factory.setXIncludeAware(false);
        factory.setExpandEntityReferences(false);
        
        DocumentBuilder builder = factory.newDocumentBuilder();
        return builder.parse(xmlInput);
    }
}
```

### 5. A05:2021 - Contrôle d'accès défaillant

#### Contrôle d'accès basé sur les rôles
```java
@Path("/api/admin")
@RolesAllowed("ADMIN") // Protection au niveau classe
public class AdminResource {
    
    @GET
    @Path("/users")
    @RolesAllowed({"ADMIN", "MANAGER"}) // Protection granulaire
    public Response getUsers(@Context SecurityContext securityContext) {
        // Vérification supplémentaire si nécessaire
        String currentUserRole = securityContext.getUserPrincipal().getName();
        
        // Double vérification métier
        if (!hasAdminPrivileges(securityContext)) {
            throw new ForbiddenException("Insufficient privileges");
        }
        
        return Response.ok(userService.getAllUsers()).build();
    }
    
    @PUT
    @Path("/users/{id}")
    public Response updateUser(@PathParam("id") Long userId, 
                              @Valid UpdateUserDto updateDto,
                              @Context SecurityContext securityContext) {
        
        // Vérification que l'utilisateur ne peut modifier que ses propres données
        // sauf s'il est admin
        Long currentUserId = getCurrentUserId(securityContext);
        String currentUserRole = getCurrentUserRole(securityContext);
        
        if (!currentUserRole.equals("ADMIN") && !currentUserId.equals(userId)) {
            throw new ForbiddenException("Cannot modify other user's data");
        }
        
        return Response.ok(userService.updateUser(userId, updateDto)).build();
    }
}
```

### 6. A06:2021 - Configuration de sécurité défaillante

#### Configuration sécurisée Quarkus
```properties
# application-prod.properties - Configuration production sécurisée

# Désactivation du mode dev
%prod.quarkus.dev-ui.enabled=false
%prod.quarkus.swagger-ui.enable=false

# Logs sécurisés
%prod.quarkus.log.level=WARN
%prod.quarkus.log.category."com.rdq".level=INFO
%prod.quarkus.log.category."org.hibernate.SQL".level=WARN

# Headers de sécurité
quarkus.http.header."X-Frame-Options".value=DENY
quarkus.http.header."X-Content-Type-Options".value=nosniff
quarkus.http.header."X-XSS-Protection".value=1; mode=block
quarkus.http.header."Strict-Transport-Security".value=max-age=31536000; includeSubDomains

# CORS restrictif
quarkus.http.cors.origins=${ALLOWED_ORIGINS}
quarkus.http.cors.methods=GET,POST,PUT,DELETE
quarkus.http.cors.headers=accept,authorization,content-type,x-requested-with

# Désactivation d'endpoints sensibles
quarkus.management.enabled=false
%prod.quarkus.health.enabled=true
%prod.quarkus.health.openapi.included=false
```

### 7. A07:2021 - Cross-Site Scripting (XSS)

#### Protection XSS
```java
@ApplicationScoped
public class XssProtectionFilter {
    
    public String sanitizeInput(String input) {
        if (input == null) return null;
        
        // Échappement des caractères dangereux avec Quarkus natif
        return input.replaceAll("<", "&lt;")
                   .replaceAll(">", "&gt;")
                   .replaceAll("\"", "&quot;")
                   .replaceAll("'", "&#x27;")
                   .replaceAll("/", "&#x2F;");
    }
    
    // Alternative native avec Bean Validation
    public boolean isValidInput(String input) {
        if (input == null) return true;
        
        // Pattern de validation natif
        String safePattern = "^[a-zA-Z0-9\\s\\-_.,!?()]+$";
        return input.matches(safePattern) && input.length() <= 1000;
    }
}

@Path("/api/rdq")
public class RdqResource {
    
    @Inject
    XssProtectionFilter xssFilter;
    
    @POST
    public Response createRdq(@Valid CreateRdqDto createDto) {
        // Validation native avec Bean Validation
        // Assainissement des entrées utilisateur
        if (!xssFilter.isValidInput(createDto.title)) {
            throw new ValidationException("Invalid title format");
        }
        if (!xssFilter.isValidInput(createDto.description)) {
            throw new ValidationException("Invalid description format");
        }
        
        return Response.ok(rdqService.createRdq(createDto)).build();
    }
}
```

### 8. A08:2021 - Désérialisation non sécurisée

#### Sérialisation sécurisée
```java
@ApplicationScoped
public class SecureJsonProcessor {
    
    @Inject
    ObjectMapper objectMapper;
    
    @PostConstruct
    public void configureObjectMapper() {
        // Configuration sécurisée de Jackson avec Quarkus
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, true);
        objectMapper.configure(JsonParser.Feature.STRICT_DUPLICATE_DETECTION, true);
        
        // Désactivation des types polymorphes par défaut
        objectMapper.configure(MapperFeature.DEFAULT_TYPING, false);
        
        // Limitation des types autorisés avec Quarkus
        objectMapper.setConfig(objectMapper.getDeserializationConfig()
            .withoutFeatures(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY));
    }
    
    // Alternative: Validation native avec Bean Validation
    public <T> T deserializeSafely(String json, Class<T> clazz) {
        try {
            // Validation native de la taille
            if (json.length() > 10000) { // 10KB max
                throw new SecurityException("JSON payload too large");
            }
            
            // Validation du format avec Quarkus natif
            if (!isValidJsonStructure(json)) {
                throw new SecurityException("Invalid JSON structure");
            }
            
            return objectMapper.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            throw new SecurityException("Invalid JSON format", e);
        }
    }
    
    private boolean isValidJsonStructure(String json) {
        // Validation simple native sans dépendance externe
        return json.trim().startsWith("{") && json.trim().endsWith("}") ||
               json.trim().startsWith("[") && json.trim().endsWith("]");
    }
}
```

### 9. A09:2021 - Composants avec vulnérabilités connues

#### Gestion des dépendances sécurisées
```xml
<!-- pom.xml -->
<plugins>
    <!-- Plugin de vérification des vulnérabilités OBLIGATOIRE -->
    <plugin>
        <groupId>org.owasp</groupId>
        <artifactId>dependency-check-maven</artifactId>
        <version>8.4.0</version>
        <configuration>
            <failBuildOnCVSS>7</failBuildOnCVSS>
            <suppressionFile>owasp-suppressions.xml</suppressionFile>
        </configuration>
        <executions>
            <execution>
                <goals>
                    <goal>check</goal>
                </goals>
            </execution>
        </executions>
    </plugin>
    
    <!-- Versions plugin pour maintenir les dépendances à jour -->
    <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>versions-maven-plugin</artifactId>
        <version>2.16.0</version>
    </plugin>
</plugins>
```

#### Versions sécurisées obligatoires
```xml
<properties>
    <!-- Versions minimales sécurisées -->
    <quarkus.version>3.4.3</quarkus.version>
    <jackson.version>2.15.2</jackson.version>
    <hibernate.version>6.2.7.Final</hibernate.version>
    <postgresql.version>42.6.0</postgresql.version>
</properties>
```

### 10. A10:2021 - Logs et monitoring insuffisants

#### Logging et monitoring sécurisé
```java
@ApplicationScoped
@Slf4j
public class SecurityAuditService {
    
    @Inject
    Event<SecurityEvent> securityEventPublisher;
    
    public void logSecurityEvent(SecurityEventType type, String userId, String details) {
        // Log structuré pour analyse automatisée
        MDC.put("eventType", type.name());
        MDC.put("userId", userId);
        MDC.put("timestamp", Instant.now().toString());
        
        log.warn("Security Event: type={}, user={}, details={}", type, userId, details);
        
        // Publication pour monitoring temps réel
        securityEventPublisher.fire(new SecurityEvent(type, userId, details));
        
        MDC.clear();
    }
    
    public void logAuthenticationAttempt(String email, boolean success, String clientIP) {
        if (success) {
            log.info("Authentication success: email={}, ip={}", email, clientIP);
        } else {
            log.warn("Authentication failure: email={}, ip={}", email, clientIP);
            // Alerte si trop de tentatives échouées
            checkBruteForceAttempts(email, clientIP);
        }
    }
    
    public void logDataAccess(String userId, String resource, String action) {
        log.info("Data access: user={}, resource={}, action={}", userId, resource, action);
    }
}

@ApplicationScoped
public class SecurityMetrics {
    
    @Inject
    @Metric(name = "security_events_total")
    Counter securityEventsCounter;
    
    @Inject
    @Metric(name = "failed_auth_attempts")
    Counter failedAuthCounter;
    
    public void recordSecurityEvent(SecurityEventType type) {
        securityEventsCounter.increment(Tags.of("type", type.name()));
    }
    
    public void recordFailedAuth(String reason) {
        failedAuthCounter.increment(Tags.of("reason", reason));
    }
}
```

#### Configuration de monitoring sécurisé
```properties
# application.properties
# Logs de sécurité détaillés
quarkus.log.category."com.rdq.security".level=INFO
quarkus.log.category."org.jboss.resteasy.resteasy_jaxrs.i18n".level=WARN

# Métriques de sécurité
quarkus.micrometer.enabled=true
quarkus.micrometer.export.prometheus.enabled=true

# Health checks sécurisés (sans exposition de détails sensibles)
quarkus.health.enabled=true
quarkus.health.openapi.included=false
```

### Règles OWASP obligatoires - Résumé

#### Checklist sécurité OWASP (OBLIGATOIRE)
- [ ] **A01** - Requêtes paramétrées pour toutes les requêtes SQL
- [ ] **A01** - Validation stricte de toutes les entrées utilisateur
- [ ] **A02** - Authentification multi-facteurs implémentée
- [ ] **A02** - Gestion des sessions avec JWT sécurisé
- [ ] **A03** - Chiffrement des données sensibles en base
- [ ] **A03** - Pas de données sensibles dans les logs
- [ ] **A04** - Configuration XML sécurisée contre XXE
- [ ] **A05** - Contrôle d'accès basé sur les rôles vérifié
- [ ] **A06** - Configuration production sécurisée
- [ ] **A06** - Headers de sécurité HTTP configurés
- [ ] **A07** - Protection XSS sur toutes les entrées
- [ ] **A08** - Désérialisation sécurisée configurée
- [ ] **A09** - Scan de vulnérabilités des dépendances
- [ ] **A10** - Logs de sécurité et monitoring activés

#### Outils de sécurité obligatoires
```xml
<!-- Ajout au pom.xml -->
<dependencies>
    <!-- Quarkus Security (NATIF - inclut validation et sécurisation) -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-security</artifactId>
    </dependency>
    
    <!-- Quarkus Hibernate Validator (NATIF - validation Bean Validation) -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-hibernate-validator</artifactId>
    </dependency>
    
    <!-- Quarkus Elytron Security (NATIF - hachage et authentification) -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-elytron-security-properties-file</artifactId>
    </dependency>
    
    <!-- Alternative légère si HTML sanitization nécessaire -->
    <dependency>
        <groupId>com.googlecode.owasp-java-html-sanitizer</groupId>
        <artifactId>owasp-java-html-sanitizer</artifactId>
        <version>20220608.1</version>
    </dependency>
</dependencies>
```

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

### MapStruct - Mapping automatique Entity ↔ DTO

#### Configuration obligatoire
MapStruct est **OBLIGATOIRE** pour tous les mappings Entity ↔ DTO afin d'éviter le code boilerplate manuel et garantir des performances optimales.

#### Configuration Maven
```xml
<properties>
    <mapstruct.version>1.5.5.Final</mapstruct.version>
    <lombok.version>1.18.30</lombok.version>
</properties>

<dependencies>
    <!-- MapStruct -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>${mapstruct.version}</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.11.0</version>
            <configuration>
                <annotationProcessorPaths>
                    <!-- IMPORTANT: Lombok AVANT MapStruct -->
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                        <version>${lombok.version}</version>
                    </path>
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>${mapstruct.version}</version>
                    </path>
                </annotationProcessorPaths>
                <compilerArgs>
                    <compilerArg>-Amapstruct.defaultComponentModel=cdi</compilerArg>
                    <compilerArg>-Amapstruct.defaultInjectionStrategy=constructor</compilerArg>
                </compilerArgs>
            </configuration>
        </plugin>
    </plugins>
</build>
```

#### Exemple de mapper complet
```java
@Mapper(
    componentModel = "cdi",
    injectionStrategy = InjectionStrategy.CONSTRUCTOR,
    uses = {UserMapper.class, ClientMapper.class}
)
public interface RdqMapper {
    
    // Création - ignorer les champs auto-générés
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", constant = "DRAFT")
    RdqEntity toEntity(CreateRdqDto dto);
    
    // Lecture - mapping des relations
    @Mapping(source = "user", target = "userDto")
    @Mapping(source = "client", target = "clientDto")
    @Mapping(source = "projet", target = "projetDto")
    RdqDto toDto(RdqEntity entity);
    
    // Liste
    List<RdqDto> toDtoList(List<RdqEntity> entities);
    
    // Mise à jour partielle - ignorer les null
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateRdqDto dto, @MappingTarget RdqEntity entity);
    
    // Mappings conditionnels
    @Mapping(target = "managerComment", 
             expression = "java(entity.getUser().getRole() == UserRole.MANAGER ? entity.getManagerComment() : null)")
    RdqSummaryDto toSummaryDto(RdqEntity entity);
}
```

#### Règles MapStruct obligatoires
- **componentModel = "cdi"** : Intégration Quarkus CDI
- **injectionStrategy = CONSTRUCTOR** : Injection par constructeur (compatible Lombok)
- **Mapping explicite** des champs critiques (id, timestamps)
- **@BeanMapping** pour les mises à jour partielles
- **uses = {}** pour référencer d'autres mappers

### Configuration par environnement

#### application.properties (base)
```properties
# Database PostgreSQL 16
quarkus.datasource.db-kind=postgresql
quarkus.datasource.jdbc.driver=org.postgresql.Driver
quarkus.hibernate-orm.database.generation=none
quarkus.hibernate-orm.dialect=org.hibernate.dialect.PostgreSQLDialect

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
# Base de données H2 pour dev (ou PostgreSQL local)
quarkus.datasource.db-kind=h2
quarkus.datasource.jdbc.url=jdbc:h2:mem:rdq-dev
quarkus.hibernate-orm.database.generation=drop-and-create

# Alternative: PostgreSQL local pour dev
# quarkus.datasource.db-kind=postgresql
# quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/rdq_dev
# quarkus.datasource.username=rdq_user
# quarkus.datasource.password=rdq_password

# Logs plus verbeux
quarkus.log.level=DEBUG
```

#### application-prod.properties
```properties
# Production database PostgreSQL 16
quarkus.datasource.db-kind=postgresql
quarkus.datasource.jdbc.url=${DATABASE_URL}
quarkus.datasource.username=${DB_USERNAME}
quarkus.datasource.password=${DB_PASSWORD}
quarkus.datasource.max-size=20
quarkus.datasource.min-size=5

# Security
quarkus.http.cors.origins=${FRONTEND_URL}

# Logs
quarkus.log.level=WARN
quarkus.log.category."com.rdq".level=INFO
```

## Configuration PostgreSQL 16

### Dépendances Maven
```xml
<dependencies>
    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-jdbc-postgresql</artifactId>
    </dependency>
    
    <!-- Hibernate ORM avec Panache -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-hibernate-orm-panache</artifactId>
    </dependency>
    
    <!-- Liquibase pour migrations -->
    <dependency>
        <groupId>io.quarkus</groupId>
        <artifactId>quarkus-liquibase</artifactId>
    </dependency>
</dependencies>
```

### Configuration de la base de données
```properties
# Configuration PostgreSQL 16 recommandée
quarkus.datasource.db-kind=postgresql
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/rdq_v3
quarkus.datasource.username=rdq_user
quarkus.datasource.password=rdq_password

# Pool de connexions optimisé
quarkus.datasource.max-size=20
quarkus.datasource.min-size=5
quarkus.datasource.acquisition-timeout=30
quarkus.datasource.leak-detection-interval=30S

# Hibernate avec PostgreSQL
quarkus.hibernate-orm.dialect=org.hibernate.dialect.PostgreSQLDialect
quarkus.hibernate-orm.database.generation=none
quarkus.hibernate-orm.log.sql=false
quarkus.hibernate-orm.log.bind-parameters=false
```

### Optimisations PostgreSQL spécifiques

#### Utilisation des types PostgreSQL
```java
@Entity
@Table(name = "rdq")
public class RdqEntity extends PanacheEntityBase {
    
    // UUID natif PostgreSQL
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    // JSON/JSONB pour données complexes
    @Column(columnDefinition = "jsonb")
    @Convert(converter = JsonConverter.class)
    public Map<String, Object> metadata;
    
    // Array PostgreSQL pour tags
    @Column(columnDefinition = "text[]")
    @Convert(converter = StringArrayConverter.class)
    public List<String> tags;
    
    // Recherche full-text
    @Column(columnDefinition = "tsvector")
    public String searchVector;
}
```

#### Index pour performance
```sql
-- Dans les changesets Liquibase
CREATE INDEX idx_rdq_search ON rdq USING gin(search_vector);
CREATE INDEX idx_rdq_metadata ON rdq USING gin(metadata);
CREATE INDEX idx_rdq_user_status ON rdq(user_id, status);
CREATE INDEX idx_rdq_created_at ON rdq(created_at DESC);
```

### Variables d'environnement recommandées
```bash
# Développement local
export DATABASE_URL="jdbc:postgresql://localhost:5432/rdq_v3"
export DB_USERNAME="rdq_user"
export DB_PASSWORD="rdq_password"

# Production
export DATABASE_URL="jdbc:postgresql://prod-server:5432/rdq_v3_prod"
export DB_USERNAME="${SECRET_DB_USER}"
export DB_PASSWORD="${SECRET_DB_PASSWORD}"
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
- [ ] **Annotations Lombok utilisées correctement**
- [ ] **Mappers MapStruct créés pour nouveaux DTOs**
- [ ] **Checklist sécurité OWASP respectée**
- [ ] **Scan de vulnérabilités des dépendances OK**
- [ ] **Validation des entrées implémentée**
- [ ] **Logs de sécurité ajoutés si nécessaire**
- [ ] Logs appropriés ajoutés
- [ ] Gestion d'erreurs implémentée
- [ ] Validation des entrées en place

---
*Dernière mise à jour : Octobre 2025*