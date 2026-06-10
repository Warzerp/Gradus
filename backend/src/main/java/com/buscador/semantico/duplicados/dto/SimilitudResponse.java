package com.buscador.semantico.duplicados.dto;

import com.buscador.semantico.duplicados.SimilitudConceptual;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Builder
public class SimilitudResponse {

    private Long id;
    private Long trabajoAId;
    private Long trabajoBId;
    private BigDecimal score;
    private boolean revisado;
    private boolean requiereAccion;
    private OffsetDateTime detectadoEn;

    public static SimilitudResponse fromEntity(SimilitudConceptual s) {
        return SimilitudResponse.builder()
                .id(s.getId())
                .trabajoAId(s.getTrabajoAId())
                .trabajoBId(s.getTrabajoBId())
                .score(s.getScore())
                .revisado(s.isRevisado())
                .requiereAccion(s.isRequiereAccion())
                .detectadoEn(s.getDetectadoEn())
                .build();
    }
}
