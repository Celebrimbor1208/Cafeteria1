package com.cafeteria.backend.repository;

import com.cafeteria.backend.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByIsDeletedFalse();//select * from Categoria, where IsDeleted = False;
    List<Categoria> findByNombreContainingIgnoreCase(String nombre);
    Categoria findByNombreIgnoreCase(String nombre);
}
