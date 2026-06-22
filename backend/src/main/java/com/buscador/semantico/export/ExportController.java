package com.buscador.semantico.export;

import com.buscador.semantico.security.JwtTokenProvider;
import com.buscador.semantico.user.RolUsuario;
import com.buscador.semantico.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/export")
@PreAuthorize("hasAnyRole('ADMIN','BIBLIOTECARIO')")
@RequiredArgsConstructor
public class ExportController {

    private final ExportService exportService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @GetMapping("/csv")
    public ResponseEntity<byte[]> exportarCsv(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest request) {

        ExportContext ctx = resolverContexto(authHeader);
        String csv = exportService.exportarCsv(ctx.usuarioId(), ctx.rol(), request.getRemoteAddr());

        String filename = "trabajos_grado_" + LocalDate.now() + ".csv";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv;charset=UTF-8"))
                .body(csv.getBytes(StandardCharsets.UTF_8));
    }

    @GetMapping("/json")
    public ResponseEntity<byte[]> exportarJson(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest request) {

        ExportContext ctx = resolverContexto(authHeader);
        String json = exportService.exportarJson(ctx.usuarioId(), ctx.rol(), request.getRemoteAddr());

        String filename = "trabajos_grado_" + LocalDate.now() + ".json";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_JSON)
                .body(json.getBytes(StandardCharsets.UTF_8));
    }

    private ExportContext resolverContexto(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtTokenProvider.extractUsername(token);
            return userRepository.findByEmail(email)
                    .map(u -> new ExportContext(u.getId(), u.getRol()))
                    .orElse(new ExportContext(null, null));
        }
        return new ExportContext(null, null);
    }

    private record ExportContext(Long usuarioId, RolUsuario rol) {}
}
