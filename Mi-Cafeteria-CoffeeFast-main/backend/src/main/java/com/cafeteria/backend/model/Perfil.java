package com.cafeteria.backend.model;
import jakarta.persistence.*;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.UUID;
@Entity
@Table(name = "perfiles")
@Data 
public class Perfil {
    @Id
    private UUID id;//SE GENERA ALEATORIAMENTE MEDIANTE AUTH_USERS EN SUPABASE
    private String nombre;
    @Column(nullable = false)
    private String correo;
    private Integer telefono;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol = Rol.CLIENTE;
    private OffsetDateTime fecha_creacion;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;
}
