package com.cafeteria.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "productos")
@Data
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nombre;
    private String descripcion;
    @Column(nullable = false)
    private BigDecimal precio;
    @Column(nullable = false)
    private Boolean disponible = true;
    @ManyToOne
    @JoinColumn(name = "categoria_id",nullable = false)
    private Categoria categoria;
    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;
    @Column(name = "imagen_url")
    private String imagenUrl;
}
