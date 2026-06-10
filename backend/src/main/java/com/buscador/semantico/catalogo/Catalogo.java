package com.buscador.semantico.catalogo;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "catalogos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Catalogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String tipo;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;
}
