-- V9: Tabla de auditoría — registra todas las acciones significativas del sistema
CREATE TYPE accion_auditoria AS ENUM (
    'SEARCH', 'UPLOAD', 'UPDATE', 'DOWNLOAD', 'LOGIN', 'LOGOUT', 'DELETE'
);

CREATE TABLE auditoria (
    id            BIGSERIAL        PRIMARY KEY,
    usuario_id    BIGINT           REFERENCES usuarios(id) ON DELETE SET NULL,
    rol           rol_usuario,
    accion        accion_auditoria NOT NULL,
    detalle       JSONB,
    ip_origen     INET,
    registrado_en TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);
