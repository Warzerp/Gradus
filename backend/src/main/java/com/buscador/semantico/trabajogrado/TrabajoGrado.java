package com.buscador.semantico.trabajogrado;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

import java.time.OffsetDateTime;

@Entity
@Table(name = "trabajos_grado")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrabajoGrado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String resumen;

    @Column(name = "anio_publicacion")
    private Short anioPublicacion;

    @Column(name = "facultad_id")
    private Long facultadId;

    @Column(name = "programa_id")
    private Long programaId;

    @Column(name = "linea_id")
    private Long lineaId;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(nullable = false, columnDefinition = "estado_trabajo")
    private EstadoTrabajo estado;

    @Column(name = "url_pdf", columnDefinition = "TEXT")
    private String urlPdf;

    @Column(name = "es_privado", nullable = false)
    private boolean esPrivado = false;

    @Column(name = "texto_cifrado", columnDefinition = "TEXT")
    private String textoCifrado;

    // embedding (vector) gestionado por EmbeddingService vía JDBC nativo
    @Transient
    private float[] embedding;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private OffsetDateTime creadoEn;

    @Column(name = "actualizado_en", nullable = false)
    private OffsetDateTime actualizadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = OffsetDateTime.now();
        actualizadoEn = OffsetDateTime.now();
        if (estado == null) estado = EstadoTrabajo.BORRADOR;
    }

    @PreUpdate
    protected void onUpdate() {
        actualizadoEn = OffsetDateTime.now();
    }
}
