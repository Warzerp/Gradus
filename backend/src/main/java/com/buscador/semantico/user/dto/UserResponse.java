package com.buscador.semantico.user.dto;

import com.buscador.semantico.user.RolUsuario;
import com.buscador.semantico.user.User;
import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;

/**
 * DTO de respuesta pública de usuario.
 * NUNCA incluye password_hash.
 */
@Getter
@Builder
public class UserResponse {

    private Long id;
    private String nombre;
    private String email;
    private RolUsuario rol;
    private boolean activo;
    private OffsetDateTime creadoEn;

    /**
     * Convierte una entidad User a DTO de respuesta sin exponer campos sensibles.
     */
    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .nombre(user.getNombre())
                .email(user.getEmail())
                .rol(user.getRol())
                .activo(user.isActivo())
                .creadoEn(user.getCreadoEn())
                .build();
    }
}
