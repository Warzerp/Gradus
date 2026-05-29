package com.buscador.semantico.auth;

import com.buscador.semantico.auth.dto.*;
import com.buscador.semantico.exception.ApiException;
import com.buscador.semantico.security.JwtTokenProvider;
import com.buscador.semantico.user.RolUsuario;
import com.buscador.semantico.user.User;
import com.buscador.semantico.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Servicio de autenticación: register, login, refreshToken, logout.
 * Cada método tiene exactamente una responsabilidad.
 * La blacklist de tokens es in-memory (ConcurrentHashMap); en producción usar Redis.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository      userRepository;
    private final PasswordEncoder     passwordEncoder;
    private final JwtTokenProvider    jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    // Blacklist de access tokens invalidados: token → momento de expiración
    private final Map<String, Instant> tokenBlacklist = new ConcurrentHashMap<>();

    // ─── Registro ────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw ApiException.conflict("Ya existe un usuario con el email: " + request.getEmail());
        }

        User user = User.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .rol(request.getRol() != null ? request.getRol() : RolUsuario.ESTUDIANTE)
                .activo(true)
                .build();

        userRepository.save(user);

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        return buildAuthResponse(auth, user.getEmail());
    }

    // ─── Login ───────────────────────────────────────────────────────────────

    public AuthResponse login(LoginRequest request) {
        // AuthenticationManager lanza AuthenticationException si las credenciales son inválidas
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String username = auth.getName();
        return buildAuthResponse(auth, username);
    }

    // ─── Refresh Token ───────────────────────────────────────────────────────

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw ApiException.unauthorized("Refresh token inválido o expirado");
        }

        String username = jwtTokenProvider.extractUsername(refreshToken);

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> ApiException.notFound("Usuario no encontrado"));

        if (!user.isActivo()) {
            throw ApiException.unauthorized("La cuenta está desactivada");
        }

        Authentication auth = new UsernamePasswordAuthenticationToken(
                username, null,
                org.springframework.security.core.authority.AuthorityUtils
                        .createAuthorityList("ROLE_" + user.getRol().name()));

        return buildAuthResponse(auth, username);
    }

    // ─── Logout ──────────────────────────────────────────────────────────────

    public void logout(String accessToken) {
        if (accessToken != null && jwtTokenProvider.validateToken(accessToken)) {
            Instant expiration = jwtTokenProvider.extractExpiration(accessToken).toInstant();
            tokenBlacklist.put(accessToken, expiration);
            purgeExpiredTokens();
        }
    }

    // ─── Verificación de blacklist ────────────────────────────────────────────

    public boolean isTokenBlacklisted(String token) {
        return tokenBlacklist.containsKey(token);
    }

    // ─── Internos ────────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(Authentication auth, String username) {
        String accessToken  = jwtTokenProvider.generateAccessToken(auth);
        String refreshToken = jwtTokenProvider.generateRefreshToken(username);
        long expiraEn       = jwtTokenProvider.extractExpiration(accessToken).getTime();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tipo("Bearer")
                .expiraEn(expiraEn)
                .build();
    }

    /** Limpia tokens expirados de la blacklist para evitar crecimiento ilimitado. */
    private void purgeExpiredTokens() {
        Instant now = Instant.now();
        tokenBlacklist.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
    }
}
