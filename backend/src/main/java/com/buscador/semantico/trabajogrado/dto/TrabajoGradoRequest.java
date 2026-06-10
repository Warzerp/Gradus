package com.buscador.semantico.trabajogrado.dto;

import com.buscador.semantico.trabajogrado.EstadoTrabajo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TrabajoGradoRequest {

    @NotBlank
    @Size(max = 500)
    private String titulo;

    private String resumen;

    private Short anioPublicacion;

    private Long facultadId;

    private Long programaId;

    private Long lineaId;

    private EstadoTrabajo estado;

    private String urlPdf;
}
