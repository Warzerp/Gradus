package com.buscador.semantico.duplicados;

import com.buscador.semantico.duplicados.dto.SimilitudResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/duplicados")
@PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO')")
@RequiredArgsConstructor
public class DuplicadoController {

    private final DuplicadoService service;

    @GetMapping
    public ResponseEntity<Page<SimilitudResponse>> listarPendientes(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(service.listarPendientes(pageable));
    }

    @PostMapping("/detectar")
    public ResponseEntity<Map<String, Integer>> detectar() {
        int nuevos = service.detectarDuplicados();
        return ResponseEntity.ok(Map.of("nuevosDetectados", nuevos));
    }

    @PatchMapping("/{id}/revisar")
    public ResponseEntity<SimilitudResponse> revisar(
            @PathVariable Long id,
            @RequestParam(defaultValue = "false") boolean requiereAccion) {
        return ResponseEntity.ok(service.marcarRevisado(id, requiereAccion));
    }
}
