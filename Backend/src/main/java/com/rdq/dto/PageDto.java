package com.rdq.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO générique pour encapsuler les résultats paginés
 * Compatible avec les standards REST pour pagination
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageDto<T> {
    
    /**
     * Contenu de la page actuelle
     */
    private List<T> content;
    
    /**
     * Nombre total d'éléments dans toutes les pages
     */
    private long totalElements;
    
    /**
     * Nombre total de pages
     */
    private int totalPages;
    
    /**
     * Numéro de la page actuelle (commence à 0)
     */
    private int number;
    
    /**
     * Taille de la page (nombre d'éléments par page)
     */
    private int size;
    
    /**
     * Indique si c'est la première page
     */
    private boolean first;
    
    /**
     * Indique si c'est la dernière page
     */
    private boolean last;
    
    /**
     * Nombre d'éléments dans la page actuelle
     */
    private int numberOfElements;
}