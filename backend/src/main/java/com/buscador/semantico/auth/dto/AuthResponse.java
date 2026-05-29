package com.buscador.semantico.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

/**
 * DTO de respuesta de autenticación exitosa.
 * Incluye access token, refresh token, tipo y tiempo de expiración.
 */
@Getter
@Builder
public class AuthResponse {

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("tipo")
    private String tipo;

    @JsonProperty("expira_en")
    private long expiraEn;   // Timestamp Unix (epoch ms) de expiración del access token
}
