package com.buscador.semantico.autor;

import com.buscador.semantico.autor.dto.AutorRequest;
import com.buscador.semantico.autor.dto.AutorResponse;
import com.buscador.semantico.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AutorService {

    private final AutorRepository repository;

    @Transactional(readOnly = true)
    public Page<AutorResponse> findAllActive(Pageable pageable) {
        return repository.findByActivoTrue(pageable).map(AutorResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public AutorResponse findById(Long id) {
        return repository.findByIdAndActivoTrue(id)
                .map(AutorResponse::fromEntity)
                .orElseThrow(() -> ApiException.notFound("Autor no encontrado: " + id));
    }

    @Transactional
    public AutorResponse create(AutorRequest req) {
        if (req.getEmail() != null && repository.existsByEmail(req.getEmail())) {
            throw ApiException.conflict("El email ya está registrado: " + req.getEmail());
        }
        Autor autor = Autor.builder()
                .nombre(req.getNombre())
                .apellido(req.getApellido())
                .email(req.getEmail())
                .programaId(req.getProgramaId())
                .activo(true)
                .build();
        return AutorResponse.fromEntity(repository.save(autor));
    }

    @Transactional
    public AutorResponse update(Long id, AutorRequest req) {
        Autor autor = repository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> ApiException.notFound("Autor no encontrado: " + id));
        if (req.getNombre() != null) autor.setNombre(req.getNombre());
        if (req.getApellido() != null) autor.setApellido(req.getApellido());
        if (req.getEmail() != null) {
            if (repository.existsByEmail(req.getEmail())
                    && !req.getEmail().equalsIgnoreCase(autor.getEmail())) {
                throw ApiException.conflict("El email ya está registrado: " + req.getEmail());
            }
            autor.setEmail(req.getEmail());
        }
        if (req.getProgramaId() != null) autor.setProgramaId(req.getProgramaId());
        return AutorResponse.fromEntity(repository.save(autor));
    }

    @Transactional
    public void deactivate(Long id) {
        Autor autor = repository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> ApiException.notFound("Autor no encontrado: " + id));
        autor.setActivo(false);
        repository.save(autor);
    }
}
