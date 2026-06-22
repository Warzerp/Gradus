package com.buscador.semantico.auditoria;

import com.buscador.semantico.user.RolUsuario;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.Map;

@Entity
@Table(name = "auditoria")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_id")
    private Long usuarioId;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(columnDefinition = "rol_usuario")
    private RolUsuario rol;

    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    @Column(nullable = false, columnDefinition = "accion_auditoria")
    private AccionAuditoria accion;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> detalle;

    @Column(name = "ip_origen", columnDefinition = "inet")
    private String ipOrigen;

    @Column(name = "registrado_en", nullable = false, updatable = false)
    private OffsetDateTime registradoEn;

    @PrePersist
    protected void onCreate() {
        registradoEn = OffsetDateTime.now();
    }
}
