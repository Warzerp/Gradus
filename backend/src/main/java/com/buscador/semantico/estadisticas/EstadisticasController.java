package com.buscador.semantico.estadisticas;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estadisticas")
@RequiredArgsConstructor
public class EstadisticasController {

    private final EstadisticasService service;

    @GetMapping("/resumen")
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO')")
    public ResponseEntity<Map<String, Object>> resumen() {
        return ResponseEntity.ok(service.resumenGlobal());
    }

    @GetMapping("/por-facultad")
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO')")
    public ResponseEntity<List<Map<String, Object>>> porFacultad() {
        return ResponseEntity.ok(service.statsPorFacultad());
    }

    @GetMapping("/tendencia-anual")
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO')")
    public ResponseEntity<List<Map<String, Object>>> tendenciaAnual() {
        return ResponseEntity.ok(service.tendenciaPorAnio());
    }

    @GetMapping("/distribucion-estado")
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO')")
    public ResponseEntity<List<Map<String, Object>>> distribucionEstado() {
        return ResponseEntity.ok(service.distribucionPorEstado());
    }

    @PostMapping("/refrescar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> refrescar() {
        service.refrescarVistaMaterializada();
        return ResponseEntity.ok(Map.of("mensaje", "Vista materializada refrescada correctamente"));
    }
}
