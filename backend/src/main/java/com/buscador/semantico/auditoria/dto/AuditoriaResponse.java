package com.buscador.semantico.auditoria.dto;

import com.buscador.semantico.auditoria.Auditoria;
import com.buscador.semantico.auditoria.AccionAuditoria;
import com.buscador.semantico.user.RolUsuario;

import java.time.OffsetDateTime;
import java.util.Map;

public record AuditoriaResponse(
        Long id,
        Long usuarioId,
        RolUsuario rol,
        AccionAuditoria accion,
        Map<String, Object> detalle,
        String ipOrigen,
        OffsetDateTime registradoEn
) {
    public static AuditoriaResponse from(Auditoria a) {
        return new AuditoriaResponse(
                a.getId(),
                a.getUsuarioId(),
                a.getRol(),
                a.getAccion(),
                a.getDetalle(),
                a.getIpOrigen(),
                a.getRegistradoEn()
        );
    }
}
