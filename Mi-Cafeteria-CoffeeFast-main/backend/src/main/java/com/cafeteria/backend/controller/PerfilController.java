package com.cafeteria.backend.controller;

import com.cafeteria.backend.model.Perfil;
import com.cafeteria.backend.model.Rol;
import com.cafeteria.backend.service.PerfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/perfiles")
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Perfil> getPerfiles(){return perfilService.listarPerfiles();}

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/buscar")
    public List<Perfil> getPerfilPorNombre(@RequestParam String nombre){return perfilService.buscarPorNombre(nombre);}

    // Esta la deja sin @PreAuthorize porque tu propio login (authService.login)
    // la llama para saber el rol del usuario que acaba de entrar
    @GetMapping("/{correo}")
    public Perfil getPerfilPorCorreo(@PathVariable String correo){return perfilService.buscarPorCorreo(correo);}

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Perfil> editarPerfil(@PathVariable UUID id, @RequestBody Perfil perfilActualizado) {
        return ResponseEntity.ok(perfilService.actualizarPerfil(id, perfilActualizado));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/activarPerfil/{id}")
    public ResponseEntity<Perfil> activarPerfil(@PathVariable UUID id) {
        return ResponseEntity.ok(perfilService.activarPerfil(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/cambiarRolPerfil/{id}")
    public ResponseEntity<Perfil> cambiarRolPerfil(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        String rolString = body.get("rol");
        Rol nuevoRol = Rol.valueOf(rolString.toUpperCase());
        return ResponseEntity.ok(perfilService.cambiarRole(id, nuevoRol));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void eliminarPerfil(@PathVariable UUID id){perfilService.eliminarPerfil(id);}
}