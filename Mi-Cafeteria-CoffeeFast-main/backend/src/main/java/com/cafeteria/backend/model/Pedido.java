package com.cafeteria.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pedidos")
@Data
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "perfil_id", nullable = false)
    private Perfil perfil;
    @Column(name="monto_total",nullable = false)
    private BigDecimal montoTotal;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado = EstadoPedido.PENDIENTE;
    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles = new ArrayList<>();
    private String indicaciones;

    @PrePersist
    protected void onCreate(){
        this.fechaCreacion = LocalDateTime.now();
    }

    public void addDetalle(DetallePedido detalle) {
        detalle.setPedido(this);// Le dice al detalle quién es su pedido padre
        this.detalles.add(detalle);
    }
}
