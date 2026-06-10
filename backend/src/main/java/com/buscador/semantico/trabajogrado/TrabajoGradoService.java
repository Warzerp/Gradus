package com.buscador.semantico.trabajogrado;

import com.buscador.semantico.exception.ApiException;
import com.buscador.semantico.trabajogrado.dto.TrabajoGradoRequest;
import com.buscador.semantico.trabajogrado.dto.TrabajoGradoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TrabajoGradoService {

    private final TrabajoGradoRepository repository;

    @Transactional(readOnly = true)
    public Page<TrabajoGradoResponse> findAll(Pageable pageable) {
        return repository.findAll(pageable).map(TrabajoGradoResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public TrabajoGradoResponse findById(Long id) {
        return repository.findById(id)
                .map(TrabajoGradoResponse::fromEntity)
                .orElseThrow(() -> ApiException.notFound("Trabajo de grado no encontrado: " + id));
    }

    @Transactional
    public TrabajoGradoResponse create(TrabajoGradoRequest req) {
        TrabajoGrado t = TrabajoGrado.builder()
                .titulo(req.getTitulo())
                .resumen(req.getResumen())
                .anioPublicacion(req.getAnioPublicacion())
                .facultadId(req.getFacultadId())
                .programaId(req.getProgramaId())
                .lineaId(req.getLineaId())
                .estado(req.getEstado() != null ? req.getEstado() : EstadoTrabajo.BORRADOR)
                .urlPdf(req.getUrlPdf())
                .build();
        return TrabajoGradoResponse.fromEntity(repository.save(t));
    }

    @Transactional
    public TrabajoGradoResponse update(Long id, TrabajoGradoRequest req) {
        TrabajoGrado t = repository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Trabajo de grado no encontrado: " + id));
        if (req.getTitulo() != null) t.setTitulo(req.getTitulo());
        if (req.getResumen() != null) t.setResumen(req.getResumen());
        if (req.getAnioPublicacion() != null) t.setAnioPublicacion(req.getAnioPublicacion());
        if (req.getFacultadId() != null) t.setFacultadId(req.getFacultadId());
        if (req.getProgramaId() != null) t.setProgramaId(req.getProgramaId());
        if (req.getLineaId() != null) t.setLineaId(req.getLineaId());
        if (req.getEstado() != null) t.setEstado(req.getEstado());
        if (req.getUrlPdf() != null) t.setUrlPdf(req.getUrlPdf());
        return TrabajoGradoResponse.fromEntity(repository.save(t));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw ApiException.notFound("Trabajo de grado no encontrado: " + id);
        }
        repository.deleteById(id);
    }
}
