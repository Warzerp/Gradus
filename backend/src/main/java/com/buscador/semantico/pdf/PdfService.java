package com.buscador.semantico.pdf;

import com.buscador.semantico.exception.ApiException;
import com.buscador.semantico.trabajogrado.TrabajoGrado;
import com.buscador.semantico.trabajogrado.TrabajoGradoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
        try {
            byte[] bytes = file.getBytes();
            if (contentType != null && contentType.startsWith("text/")) {
                return new String(bytes, StandardCharsets.UTF_8);
            }
            // Extracción básica de texto visible de PDF (sin librería externa)
            String raw = new String(bytes, StandardCharsets.ISO_8859_1);
            return extraerTextoPdf(raw);
        } catch (IOException e) {
            throw ApiException.badRequest("No se pudo leer el archivo: " + e.getMessage());
        }
    }

    /**
     * Extrae texto legible de un PDF usando expresiones regulares sobre el contenido bruto.
     * Funciona para PDFs sin cifrado con texto sin codificación especial.
     */
    private String extraerTextoPdf(String raw) {
        StringBuilder sb = new StringBuilder();
        // Busca bloques BT...ET (Begin Text / End Text) de PDF
        Pattern btEt = Pattern.compile("BT\\s(.*?)ET", Pattern.DOTALL);
        Matcher m = btEt.matcher(raw);
        while (m.find()) {
            String block = m.group(1);
            // Extrae texto dentro de paréntesis (operador Tj) o corchetes (TJ)
            Pattern tj = Pattern.compile("\\(([^)]+)\\)\\s*Tj");
            Matcher tm = tj.matcher(block);
            while (tm.find()) sb.append(tm.group(1)).append(" ");
        }
        String resultado = sb.toString().trim();
        return resultado.isEmpty() ? raw.replaceAll("[^\\x20-\\x7E\\n]", " ").trim() : resultado;
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
        trabajoRepository.findById(trabajoId).ifPresent(t -> {
            if (t.getResumen() == null) {
                t.setResumen(resumen.length() > 500 ? resumen.substring(0, 500) + "..." : resumen);
                trabajoRepository.save(t);
            }
        });
    }
}
