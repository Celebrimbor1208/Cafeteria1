package com.cafeteria.backend.repository;
import com.cafeteria.backend.model.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PerfilRepository extends JpaRepository<Perfil, UUID> {

    List<Perfil> findByIsDeletedFalse();

    List<Perfil> findByNombreContainingIgnoreCase(String nombre);

    Perfil findByNombreIgnoreCase(String nombre);

    Perfil findByCorreoIgnoreCase(String correo);

    Optional<Perfil> findById(UUID id);
}
