package com.buscador.semantico.embedding;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trabajos/{trabajoId}/embedding")
@RequiredArgsConstructor
public class EmbeddingController {

    private final EmbeddingService embeddingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO')")
    public ResponseEntity<Void> generarEmbedding(@PathVariable Long trabajoId) {
        embeddingService.procesarTrabajo(trabajoId);
        return ResponseEntity.noContent().build();
    }
}
