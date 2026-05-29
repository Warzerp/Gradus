package com.buscador.semantico.user.dto;

import com.buscador.semantico.user.RolUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO para actualización parcial de un usuario (solo campos actualizables).
 */
@Getter
@NoArgsConstructor
public class UpdateUserRequest {

    @Size(min = 2, max = 150, message = "El nombre debe tener entre 2 y 150 caracteres")
    private String nombre;

    @Email(message = "El email no tiene un formato válido")
    private String email;

    private RolUsuario rol;

    private Boolean activo;
}
