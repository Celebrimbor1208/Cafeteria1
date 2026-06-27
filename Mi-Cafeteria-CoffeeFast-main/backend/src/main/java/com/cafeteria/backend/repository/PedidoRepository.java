package com.cafeteria.backend.repository;

import com.cafeteria.backend.model.Carrito;
import com.cafeteria.backend.model.EstadoPedido;
import com.cafeteria.backend.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Pedido findByPerfilId(UUID perfilId);
    List<Pedido> findByPerfilIdOrderByFechaCreacionDesc(UUID perfilId);
    List<Pedido> findByEstadoIn(Collection<EstadoPedido> estados);
    // Realiza un JOIN implícito entre Pedido y Perfil, buscando por coincidencia parcial e ignorando mayúsculas/minúsculas
    @Query("SELECT p FROM Pedido p JOIN FETCH p.perfil perf " +
            "WHERE LOWER(perf.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) ORDER BY p.fechaCreacion DESC")
    List<Pedido> buscarHistorialPorNombreCliente(@Param("nombre") String nombre);
}
