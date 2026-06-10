package com.buscador.semantico.trabajogrado.dto;

import com.buscador.semantico.trabajogrado.EstadoTrabajo;
import com.buscador.semantico.trabajogrado.TrabajoGrado;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class TrabajoGradoResponse {

    private Long id;
    private String titulo;
    private String resumen;
    private Short anioPublicacion;
    private Long facultadId;
    private Long programaId;
    private Long lineaId;
    private EstadoTrabajo estado;
    private String urlPdf;
    private OffsetDateTime creadoEn;
    private OffsetDateTime actualizadoEn;

    public static TrabajoGradoResponse fromEntity(TrabajoGrado t) {
        return TrabajoGradoResponse.builder()
                .id(t.getId())
                .titulo(t.getTitulo())
                .resumen(t.getResumen())
                .anioPublicacion(t.getAnioPublicacion())
                .facultadId(t.getFacultadId())
                .programaId(t.getProgramaId())
                .lineaId(t.getLineaId())
                .estado(t.getEstado())
                .urlPdf(t.getUrlPdf())
                .creadoEn(t.getCreadoEn())
                .actualizadoEn(t.getActualizadoEn())
                .build();
    }
}
