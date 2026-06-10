package com.buscador.semantico.duplicados;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "similitud_conceptual")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimilitudConceptual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trabajo_a_id", nullable = false)
    private Long trabajoAId;

    @Column(name = "trabajo_b_id", nullable = false)
    private Long trabajoBId;

    @Column(nullable = false, precision = 5, scale = 4)
    private java.math.BigDecimal score;

    @Builder.Default
    @Column(nullable = false)
    private boolean revisado = false;

    @Builder.Default
    @Column(name = "requiere_accion", nullable = false)
    private boolean requiereAccion = false;

    @Column(name = "detectado_en", nullable = false)
    private OffsetDateTime detectadoEn;

    @PrePersist
    protected void onCreate() {
        detectadoEn = OffsetDateTime.now();
    }
}
