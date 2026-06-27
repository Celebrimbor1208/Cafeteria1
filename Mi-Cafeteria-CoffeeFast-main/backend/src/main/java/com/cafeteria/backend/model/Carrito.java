package com.cafeteria.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.time.ZonedDateTime;

@Entity
@Table(name = "carrito") // En minúscula como tu diagrama
@Data
public class Carrito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // int8 en el diagrama es un Long autoincrementable
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "perfil_id", nullable = false)
    private Perfil perfil;

    @Column(name = "fecha_modificacion")
    private ZonedDateTime fechaModificacion;

    @OneToMany(mappedBy = "carrito", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<ItemCarrito> items = new ArrayList<>();
}