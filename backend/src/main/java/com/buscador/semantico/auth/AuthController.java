package com.buscador.semantico.auth;

import com.buscador.semantico.auditoria.AccionAuditoria;
import com.buscador.semantico.auditoria.AuditoriaService;
import com.buscador.semantico.auth.dto.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuditoriaService auditoriaService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request,
                                                 HttpServletRequest httpRequest) {
        AuthResponse response = authService.register(request);
        auditoriaService.registrar(null, null, AccionAuditoria.LOGIN,
                Map.of("evento", "register", "email", request.getEmail()),
                httpRequest.getRemoteAddr());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
                                              HttpServletRequest httpRequest) {
        AuthResponse response = authService.login(request);
        auditoriaService.registrar(null, null, AccionAuditoria.LOGIN,
                Map.of("email", request.getEmail()),
                httpRequest.getRemoteAddr());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest httpRequest) {
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
        authService.logout(token);
        auditoriaService.registrar(null, null, AccionAuditoria.LOGOUT,
                Map.of("evento", "logout"),
                httpRequest.getRemoteAddr());
        return ResponseEntity.noContent().build();
    }
}
