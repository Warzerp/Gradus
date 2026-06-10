package com.buscador.semantico.pdf;

import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/trabajos/{trabajoId}/pdf")
@RequiredArgsConstructor
public class PdfController {

    private final PdfService pdfService;

    /** Sube un archivo PDF o TXT y extrae el texto por secciones. */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO')")
    public ResponseEntity<TextoCompleto> subirArchivo(
            @PathVariable Long trabajoId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(pdfService.procesarPdf(trabajoId, file));
    }

    /** Envía texto plano directamente, sin necesidad de archivo. */
    @PostMapping("/texto")
    @PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO')")
    public ResponseEntity<TextoCompleto> subirTexto(
            @PathVariable Long trabajoId,
            @RequestBody @NotBlank String textoPlano) {
        return ResponseEntity.ok(pdfService.procesarTextoPlano(trabajoId, textoPlano));
    }
}
