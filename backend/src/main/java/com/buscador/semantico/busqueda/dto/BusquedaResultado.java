package com.buscador.semantico.busqueda.dto;

import com.buscador.semantico.trabajogrado.EstadoTrabajo;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BusquedaResultado {
    private Long id;
    private String titulo;
    private String resumen;
    private Short anioPublicacion;
    private EstadoTrabajo estado;
    private Double similitud;
}
