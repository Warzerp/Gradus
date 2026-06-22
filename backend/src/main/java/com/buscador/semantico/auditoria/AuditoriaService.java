package com.buscador.semantico.auditoria;

import com.buscador.semantico.auditoria.dto.AuditoriaResponse;
import com.buscador.semantico.user.RolUsuario;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditoriaService {

    private final AuditoriaRepository repository;

    /** Registra una acción de forma asíncrona para no bloquear el hilo principal. */
    @Async
    public void registrar(Long usuarioId, RolUsuario rol, AccionAuditoria accion,
                          Map<String, Object> detalle, String ip) {
        try {
            Auditoria entrada = Auditoria.builder()
                    .usuarioId(usuarioId)
                    .rol(rol)
                    .accion(accion)
                    .detalle(detalle)
                    .ipOrigen(ip)
                    .build();
            repository.save(entrada);
        } catch (Exception e) {
            log.error("Error al registrar auditoría accion={} usuario={}: {}", accion, usuarioId, e.getMessage());
        }
    }

    public Page<AuditoriaResponse> listar(Pageable pageable) {
        return repository.findAllByOrderByRegistradoEnDesc(pageable)
                .map(AuditoriaResponse::from);
    }

    public Page<AuditoriaResponse> listarPorUsuario(Long usuarioId, Pageable pageable) {
        return repository.findByUsuarioIdOrderByRegistradoEnDesc(usuarioId, pageable)
                .map(AuditoriaResponse::from);
    }

    public Page<AuditoriaResponse> listarPorAccion(AccionAuditoria accion, Pageable pageable) {
        return repository.findByAccionOrderByRegistradoEnDesc(accion, pageable)
                .map(AuditoriaResponse::from);
    }
}
