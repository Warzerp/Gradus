package com.buscador.semantico.autor.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AutorRequest {

    @NotBlank
    @Size(max = 150)
    private String nombre;

    @NotBlank
    @Size(max = 150)
    private String apellido;

    @Email
    @Size(max = 255)
    private String email;

    private Long programaId;
}
