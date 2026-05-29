package com.buscador.semantico.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO de request para renovar el access token usando el refresh token.
 */
@Getter
@NoArgsConstructor
public class RefreshRequest {

    @NotBlank(message = "El refresh token es obligatorio")
    @JsonProperty("refresh_token")
    private String refreshToken;
}
