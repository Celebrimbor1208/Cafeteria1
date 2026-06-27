package com.cafeteria.backend.service;

import com.cafeteria.backend.model.EstadoPedido;
import com.cafeteria.backend.model.Perfil;
import com.cafeteria.backend.model.Producto;
import com.cafeteria.backend.model.Rol;
import com.cafeteria.backend.repository.PerfilRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service

public class PerfilService{

    @Autowired
    private PerfilRepository perfilRepository;

    public List<Perfil> listarPerfiles(){
        return perfilRepository.findAll();
    }

    public List<Perfil> listarPerfilesActivos(){
            return perfilRepository.findByIsDeletedFalse();
    }

    public Perfil buscarPorId(UUID id){
        return perfilRepository.findById(id).filter(perfil->!perfil.getIsDeleted()).orElseThrow(()-> new RuntimeException("´Perfil no encontrado o inactivo con ID : "+id));
    }

    public Perfil guardar(Perfil perfil) {
        Perfil perfilExistente = perfilRepository.findByNombreIgnoreCase(perfil.getNombre()); //esto esta bien siempre y cuando no puedan repetirse nombres.
        
        if (perfilExistente == null) {
            return perfilRepository.save(perfil);
        } else {
            perfilExistente.setTelefono(perfil.getTelefono());
            perfilExistente.setRol(perfil.getRol());// recordar crear un metodo aparte para cambiar roles y que sea exclusivo para administrador
            perfilExistente.setIsDeleted(false); // Reactivación, esta reactivacion solo deberia hacerlo un administrador
            return perfilRepository.save(perfilExistente);
        }
    }

    //@PreAuthorize("hasAuthority('ADMIN','EMPLEADO')")
    public List<Perfil> buscarPorNombre(String nombre) {
        return perfilRepository.findByNombreContainingIgnoreCase(nombre);
    }

    //@PreAuthorize("hasAuthority('ADMIN','EMPLEADO')")
    public Perfil buscarPorCorreo(String correo) {
        return perfilRepository.findByCorreoIgnoreCase(correo);
    }


    //@PreAuthorize("hasAuthority('ADMIN')")
    public Perfil cambiarRole(UUID perfilId, Rol rolNuevo){
        Perfil perfilExistente = buscarPorId(perfilId);
        perfilExistente.setRol(rolNuevo);
        return perfilRepository.save(perfilExistente);
    }

    //@PreAuthorize("hasAuthority('CLIENTE') and #perfilId.toString() == authentication.principal.name")
    public Perfil actualizar(String correo) {
        Perfil perfilExistente = perfilRepository.findByCorreoIgnoreCase(correo);
        
        perfilExistente.setNombre(correo);
        perfilExistente.setCorreo(correo);;

        return perfilRepository.save(perfilExistente);
    }

    @Transactional
    public Perfil actualizarPerfil(UUID id, Perfil perfilActualizado) {
        Perfil existente = perfilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
        existente.setNombre(perfilActualizado.getNombre());
        existente.setTelefono(perfilActualizado.getTelefono());

        return perfilRepository.save(existente);
    }

    public Perfil activarPerfil(UUID id) {
        Perfil existente = perfilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
        existente.setIsDeleted(false);
        return perfilRepository.save(existente);
    }

    //@PreAuthorize("hasAuthority('CLIENTE') and #perfilId.toString() == authentication.principal.name")
    public void eliminarPerfilCliente(String correo){
        Perfil perfilExistente =perfilRepository.findByCorreoIgnoreCase(correo);
        perfilExistente.setIsDeleted(true);
        perfilRepository.save(perfilExistente);
    }

    //@PreAuthorize("hasAuthority('ADMIN')")
    public void eliminarPerfil(UUID id){
        Perfil perfilExistente = perfilRepository.findById(id).orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
        perfilExistente.setIsDeleted(true);
        perfilRepository.save(perfilExistente);
    }
}