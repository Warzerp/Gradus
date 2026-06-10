package com.buscador.semantico.embedding;

import com.buscador.semantico.exception.ApiException;
import com.buscador.semantico.trabajogrado.TrabajoGradoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class EmbeddingService {

    private final JdbcTemplate jdbc;
    private final TrabajoGradoRepository trabajoRepository;
    private final RestClient restClient;
    private final String apiKey;
    private final String model;
    private final String url;

    public EmbeddingService(
            JdbcTemplate jdbc,
            TrabajoGradoRepository trabajoRepository,
            @Value("${openai.api-key:}") String apiKey,
            @Value("${openai.embedding-model:text-embedding-ada-002}") String model,
            @Value("${openai.embedding-url:https://api.openai.com/v1/embeddings}") String url) {
        this.jdbc = jdbc;
        this.trabajoRepository = trabajoRepository;
        this.apiKey = apiKey;
        this.model = model;
        this.url = url;
        this.restClient = RestClient.create();
    }

    @SuppressWarnings("unchecked")
    public float[] generarEmbedding(String texto) {
        if (apiKey == null || apiKey.isBlank()) {
            throw ApiException.badRequest("OpenAI API key no configurada (OPENAI_API_KEY)");
        }
        Map<String, Object> response = restClient.post()
                .uri(url)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .body(Map.of("input", texto, "model", model))
                .retrieve()
                .body(Map.class);

        List<Map<String, Object>> data = (List<Map<String, Object>>) response.get("data");
        if (data == null || data.isEmpty()) {
            throw ApiException.badRequest("Respuesta inesperada de OpenAI: sin campo 'data'");
        }
        List<Number> embedding = (List<Number>) data.get(0).get("embedding");
        float[] vector = new float[embedding.size()];
        for (int i = 0; i < embedding.size(); i++) {
            vector[i] = embedding.get(i).floatValue();
        }
        return vector;
    }

    public void guardarEmbedding(Long trabajoId, float[] vector) {
        String vectorStr = vectorToString(vector);
        jdbc.update(
                "UPDATE trabajos_grado SET embedding = ?::vector WHERE id = ?",
                vectorStr, trabajoId
        );
        log.info("Embedding guardado para trabajo id={}", trabajoId);
    }

    public void procesarTrabajo(Long trabajoId) {
        var trabajo = trabajoRepository.findById(trabajoId)
                .orElseThrow(() -> ApiException.notFound("Trabajo no encontrado: " + trabajoId));
        String texto = (trabajo.getTitulo() != null ? trabajo.getTitulo() : "")
                + " " + (trabajo.getResumen() != null ? trabajo.getResumen() : "");
        float[] embedding = generarEmbedding(texto.strip());
        guardarEmbedding(trabajoId, embedding);
    }

    public float[] obtenerEmbeddingTexto(String texto) {
        return generarEmbedding(texto);
    }

    public static String vectorToString(float[] vector) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < vector.length; i++) {
            if (i > 0) sb.append(",");
            sb.append(vector[i]);
        }
        sb.append("]");
        return sb.toString();
    }
}
