package com.buscador.semantico.pdf;

import com.buscador.semantico.exception.ApiException;
import com.buscador.semantico.trabajogrado.TrabajoGrado;
import com.buscador.semantico.trabajogrado.TrabajoGradoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class PdfService {

    private final TrabajoGradoRepository trabajoRepository;
    private final TextoCompletoRepository textoRepository;

    @Transactional
    public TextoCompleto procesarPdf(Long trabajoId, MultipartFile file) {
        trabajoRepository.findById(trabajoId)
                .orElseThrow(() -> ApiException.notFound("Trabajo de grado no encontrado: " + trabajoId));

        String textoPlano = extraerTexto(file);
        TextoCompleto texto = parsearSecciones(textoPlano, trabajoId);

        textoRepository.findByTrabajoId(trabajoId).ifPresent(existing -> texto.setId(existing.getId()));
        TextoCompleto guardado = textoRepository.save(texto);

        actualizarResumenTrabajo(trabajoId, texto.getResumen());
        log.info("Contenido procesado para trabajo id={}", trabajoId);
        return guardado;
    }

    @Transactional
    public TextoCompleto procesarTextoPlano(Long trabajoId, String textoPlano) {
        trabajoRepository.findById(trabajoId)
                .orElseThrow(() -> ApiException.notFound("Trabajo de grado no encontrado: " + trabajoId));

        TextoCompleto texto = parsearSecciones(textoPlano, trabajoId);
        textoRepository.findByTrabajoId(trabajoId).ifPresent(existing -> texto.setId(existing.getId()));
        TextoCompleto guardado = textoRepository.save(texto);

        actualizarResumenTrabajo(trabajoId, texto.getResumen());
        log.info("Texto plano procesado para trabajo id={}", trabajoId);
        return guardado;
    }

    private String extraerTexto(MultipartFile file) {
        String contentType = file.getContentType();
        try (InputStream is = file.getInputStream()) {
            if (contentType != null && contentType.startsWith("text/")) {
                return new String(file.getBytes(), StandardCharsets.UTF_8);
            }
            // Usa PDFBox para extracción real del texto del PDF (API 3.x)
            try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
                PDFTextStripper stripper = new PDFTextStripper();
                stripper.setSortByPosition(true);
                return stripper.getText(doc);
            }
        } catch (IOException e) {
            throw ApiException.badRequest("No se pudo leer el archivo: " + e.getMessage());
        }
    }

    private TextoCompleto parsearSecciones(String texto, Long trabajoId) {
        return TextoCompleto.builder()
                .trabajoId(trabajoId)
                .resumen(extraerSeccion(texto, "resumen|abstract"))
                .introduccion(extraerSeccion(texto, "introducción|introduccion|introduction"))
                .metodologia(extraerSeccion(texto, "metodología|metodologia|methodology|método|metodo"))
                .resultados(extraerSeccion(texto, "resultados|results|hallazgos|findings"))
                .conclusiones(extraerSeccion(texto, "conclusiones|conclusión|conclusion|conclusions"))
                .referencias(extraerSeccion(texto, "referencias|bibliography|bibliografía|bibliogr"))
                .build();
    }

    private String extraerSeccion(String texto, String titulos) {
        Pattern pattern = Pattern.compile(
                "(?i)(?:^|\\n)\\s*(?:" + titulos + ")[^\\n]{0,80}\\n(.*?)(?=(?:^|\\n)\\s*[A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ\\s]{3,}\\n|\\z)",
                Pattern.DOTALL | Pattern.MULTILINE
        );
        Matcher m = pattern.matcher(texto);
        return m.find() ? m.group(1).strip() : null;
    }

    private void actualizarResumenTrabajo(Long trabajoId, String resumen) {
        if (resumen == null) return;
        trabajoRepository.findById(trabajoId).ifPresent((TrabajoGrado t) -> {
            if (t.getResumen() == null) {
                t.setResumen(resumen.length() > 500 ? resumen.substring(0, 500) + "..." : resumen);
                trabajoRepository.save(t);
            }
        });
    }
}
