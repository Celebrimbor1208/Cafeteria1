package com.cafeteria.backend.repository;

import com.cafeteria.backend.model.Categoria;
import com.cafeteria.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    Producto findByNombreIgnoreCase(String nombre);
    List<Producto> findByIsDeletedFalse();
}
