package com.buscador.semantico.busqueda;

import com.buscador.semantico.busqueda.dto.BusquedaRequest;
import com.buscador.semantico.busqueda.dto.BusquedaResultado;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/busqueda")
@RequiredArgsConstructor
public class BusquedaSemanticaController {

    private final BusquedaSemanticaService service;

    @PostMapping("/semantica")
    public ResponseEntity<List<BusquedaResultado>> buscar(@Valid @RequestBody BusquedaRequest req) {
        return ResponseEntity.ok(service.buscar(req));
    }
}
