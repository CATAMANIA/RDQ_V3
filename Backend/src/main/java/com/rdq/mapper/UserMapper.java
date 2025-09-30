package com.rdq.mapper;

import com.rdq.dto.UserDto;
import com.rdq.dto.CreateUserDto;
import com.rdq.dto.UpdateUserDto;
import com.rdq.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.InjectionStrategy;

import java.util.List;

/**
 * Mapper MapStruct pour UserEntity selon les instructions Backend
 * - componentModel = "cdi" pour intégration Quarkus CDI (OBLIGATOIRE)
 * - injectionStrategy = CONSTRUCTOR pour compatibilité Lombok (OBLIGATOIRE)
 */
@Mapper(
    componentModel = "cdi",
    injectionStrategy = InjectionStrategy.CONSTRUCTOR
)
public interface UserMapper {
    
    // Création - ignorer les champs auto-générés
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "manager", ignore = true)
    @Mapping(target = "active", constant = "true")
    UserEntity toEntity(CreateUserDto dto);
    
    // Lecture - mapping des relations
    @Mapping(source = "manager", target = "managerDto", qualifiedByName = "toSimpleDto")
    UserDto toDto(UserEntity entity);
    
    // Liste
    List<UserDto> toDtoList(List<UserEntity> entities);
    
    // Mise à jour partielle - ignorer les null et champs sensibles
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "manager", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateUserDto dto, @MappingTarget UserEntity entity);
    
    // DTO simple sans relations pour éviter les cycles
    @Named("toSimpleDto")
    @Mapping(target = "managerDto", ignore = true)
    UserDto toSimpleDto(UserEntity entity);
}