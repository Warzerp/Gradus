package com.buscador.semantico.autor.dto;

import com.buscador.semantico.autor.Autor;
import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class AutorResponse {

    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private Long programaId;
    private boolean activo;
    private OffsetDateTime creadoEn;

    public static AutorResponse fromEntity(Autor a) {
        return AutorResponse.builder()
                .id(a.getId())
                .nombre(a.getNombre())
                .apellido(a.getApellido())
                .email(a.getEmail())
                .programaId(a.getProgramaId())
                .activo(a.isActivo())
                .creadoEn(a.getCreadoEn())
                .build();
    }
}
