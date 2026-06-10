package com.buscador.semantico.pdf;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "texto_completo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TextoCompleto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trabajo_id", nullable = false, unique = true)
    private Long trabajoId;

    @Column(columnDefinition = "TEXT")
    private String resumen;

    @Column(columnDefinition = "TEXT")
    private String introduccion;

    @Column(columnDefinition = "TEXT")
    private String metodologia;

    @Column(columnDefinition = "TEXT")
    private String resultados;

    @Column(columnDefinition = "TEXT")
    private String conclusiones;

    @Column(columnDefinition = "TEXT")
    private String referencias;
}
