package com.cafeteria.backend.repository;

import com.cafeteria.backend.model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    // Buscaremos el carrito usando el ID del perfil
    Carrito findByPerfilId(UUID perfilId);
}

