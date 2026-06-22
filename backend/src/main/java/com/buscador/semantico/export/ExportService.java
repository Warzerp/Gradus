package com.buscador.semantico.export;

import com.buscador.semantico.auditoria.AccionAuditoria;
import com.buscador.semantico.auditoria.AuditoriaService;
import com.buscador.semantico.trabajogrado.TrabajoGrado;
import com.buscador.semantico.trabajogrado.TrabajoGradoRepository;
import com.buscador.semantico.user.RolUsuario;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExportService {

    private final TrabajoGradoRepository trabajoRepository;
    private final AuditoriaService auditoriaService;
    private final ObjectMapper objectMapper;

    public String exportarCsv(Long usuarioId, RolUsuario rol, String ip) {
        List<TrabajoGrado> trabajos = trabajoRepository.findAllPublicados();

        StringWriter sw = new StringWriter();
        try (CSVWriter writer = new CSVWriter(sw)) {
            writer.writeNext(new String[]{"id", "titulo", "resumen", "anio_publicacion",
                    "estado", "url_pdf", "creado_en"});
            for (TrabajoGrado t : trabajos) {
                writer.writeNext(new String[]{
                        String.valueOf(t.getId()),
                        nvl(t.getTitulo()),
                        nvl(t.getResumen()),
                        t.getAnioPublicacion() != null ? String.valueOf(t.getAnioPublicacion()) : "",
                        t.getEstado() != null ? t.getEstado().name() : "",
                        nvl(t.getUrlPdf()),
                        t.getCreadoEn() != null ? t.getCreadoEn().toString() : ""
                });
            }
        } catch (IOException e) {
            throw new RuntimeException("Error generando CSV: " + e.getMessage(), e);
        }

        auditoriaService.registrar(usuarioId, rol, AccionAuditoria.DOWNLOAD,
                Map.of("formato", "csv", "registros", trabajos.size()), ip);
        log.info("Exportación CSV: {} registros por usuario={}", trabajos.size(), usuarioId);
        return sw.toString();
    }

    public String exportarJson(Long usuarioId, RolUsuario rol, String ip) {
        List<TrabajoGrado> trabajos = trabajoRepository.findAllPublicados();

        List<Map<String, Object>> datos = trabajos.stream().map(t -> Map.<String, Object>of(
                "id", t.getId(),
                "titulo", nvl(t.getTitulo()),
                "resumen", nvl(t.getResumen()),
                "anioPublicacion", t.getAnioPublicacion() != null ? t.getAnioPublicacion() : 0,
                "estado", t.getEstado() != null ? t.getEstado().name() : "",
                "urlPdf", nvl(t.getUrlPdf()),
                "creadoEn", t.getCreadoEn() != null ? t.getCreadoEn().toString() : ""
        )).toList();

        try {
            String json = objectMapper.writeValueAsString(datos);
            auditoriaService.registrar(usuarioId, rol, AccionAuditoria.DOWNLOAD,
                    Map.of("formato", "json", "registros", trabajos.size()), ip);
            log.info("Exportación JSON: {} registros por usuario={}", trabajos.size(), usuarioId);
            return json;
        } catch (Exception e) {
            throw new RuntimeException("Error serializando JSON: " + e.getMessage(), e);
        }
    }

    private String nvl(String s) {
        return s != null ? s : "";
    }
}
