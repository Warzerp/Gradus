package com.buscador.semantico.auditoria;

import com.buscador.semantico.auditoria.dto.AuditoriaResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auditoria")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AuditoriaController {

    private final AuditoriaService service;

    @GetMapping
    public ResponseEntity<Page<AuditoriaResponse>> listar(
            @PageableDefault(size = 30) Pageable pageable) {
        return ResponseEntity.ok(service.listar(pageable));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Page<AuditoriaResponse>> listarPorUsuario(
            @PathVariable Long usuarioId,
            @PageableDefault(size = 30) Pageable pageable) {
        return ResponseEntity.ok(service.listarPorUsuario(usuarioId, pageable));
    }

    @GetMapping("/accion/{accion}")
    public ResponseEntity<Page<AuditoriaResponse>> listarPorAccion(
            @PathVariable AccionAuditoria accion,
            @PageableDefault(size = 30) Pageable pageable) {
        return ResponseEntity.ok(service.listarPorAccion(accion, pageable));
    }
}
