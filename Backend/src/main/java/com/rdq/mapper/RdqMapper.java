package com.rdq.mapper;

import com.rdq.dto.RdqDto;
import com.rdq.dto.CreateRdqDto;
import com.rdq.dto.UpdateRdqDto;
import com.rdq.entity.RdqEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.InjectionStrategy;

import java.util.List;

/**
 * Mapper MapStruct pour RdqEntity selon les instructions Backend
 * - componentModel = "cdi" pour intégration Quarkus CDI (OBLIGATOIRE)
 * - injectionStrategy = CONSTRUCTOR pour compatibilité Lombok (OBLIGATOIRE)
 * - uses = {UserMapper.class} pour référencer d'autres mappers (OBLIGATOIRE)
 */
@Mapper(
    componentModel = "cdi",
    injectionStrategy = InjectionStrategy.CONSTRUCTOR,
    uses = {UserMapper.class}
)
public interface RdqMapper {
    
    // Création - ignorer les champs auto-générés
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", constant = "DRAFT")
    @Mapping(target = "managerComment", ignore = true)
    RdqEntity toEntity(CreateRdqDto dto);
    
    // Lecture - mapping des relations avec UserMapper
    @Mapping(source = "user", target = "userDto", qualifiedByName = "toSimpleDto")
    @Mapping(source = "user.manager", target = "managerDto", qualifiedByName = "toSimpleDto")
    RdqDto toDto(RdqEntity entity);
    
    // Liste
    List<RdqDto> toDtoList(List<RdqEntity> entities);
    
    // Mise à jour partielle - ignorer les null et champs critiques
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateRdqDto dto, @MappingTarget RdqEntity entity);
    
    // DTO simplifié pour listes
    @Named("toSummaryDto")
    @Mapping(source = "user", target = "userDto", qualifiedByName = "toSimpleDto")
    @Mapping(target = "managerDto", ignore = true)
    RdqDto toSummaryDto(RdqEntity entity);
}