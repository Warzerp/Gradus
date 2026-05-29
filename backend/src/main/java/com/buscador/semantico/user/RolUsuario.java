package com.buscador.semantico.user;

/**
 * Roles del sistema — deben coincidir exactamente con el ENUM `rol_usuario` de PostgreSQL.
 */
public enum RolUsuario {
    ADMIN,
    BIBLIOTECARIO,
    DOCENTE,
    ESTUDIANTE
}
