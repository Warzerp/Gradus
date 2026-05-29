package com.buscador.semantico.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Manejador centralizado de excepciones.
 * Transforma excepciones en respuestas JSON estructuradas y consistentes.
 * No expone detalles de implementación internos al cliente.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ─── 400 Bad Request — errores de validación de campos ───────────────────

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .toList();

        return buildResponse(HttpStatus.BAD_REQUEST, "Error de validación", errors);
    }

    // ─── 401 Unauthorized ────────────────────────────────────────────────────

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(
            AuthenticationException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "No autenticado", null);
    }

    // ─── 403 Forbidden ───────────────────────────────────────────────────────

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(
            AccessDeniedException ex) {
        return buildResponse(HttpStatus.FORBIDDEN, "Acceso denegado", null);
    }

    // ─── ApiException (custom) ───────────────────────────────────────────────

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, Object>> handleApiException(ApiException ex) {
        return buildResponse(ex.getStatus(), ex.getMessage(), null);
    }

    // ─── 500 Internal Server Error ───────────────────────────────────────────

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        log.error("Error inesperado del servidor", ex);
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Error interno del servidor. Por favor intente más tarde.",
                null);
    }

    // ─── Builder de respuesta ─────────────────────────────────────────────────

    private ResponseEntity<Map<String, Object>> buildResponse(
            HttpStatus status, String message, List<String> errors) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        if (errors != null && !errors.isEmpty()) {
            body.put("errors", errors);
        }
        return ResponseEntity.status(status).body(body);
    }
}
