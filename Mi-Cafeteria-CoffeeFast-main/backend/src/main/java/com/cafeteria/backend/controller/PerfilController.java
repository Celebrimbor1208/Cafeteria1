package com.cafeteria.backend.controller;

import com.cafeteria.backend.model.Perfil;
import com.cafeteria.backend.model.Rol;
import com.cafeteria.backend.service.PerfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/perfiles")
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @GetMapping
    public List<Perfil> getPerfiles(){return perfilService.listarPerfiles();}

    @GetMapping("/buscar")//localhost:8080/api/perfiles/buscar?nombre=brian
    public List<Perfil> getPerfilPorNombre(@RequestParam String nombre){return perfilService.buscarPorNombre(nombre);}

    @GetMapping("/{correo}")//localhost:8080/api/perfiles/correo@correo.com
    public Perfil getPerfilPorCorreo(@PathVariable String correo){return perfilService.buscarPorCorreo(correo);}

    @PutMapping("/{id}")
    public ResponseEntity<Perfil> editarPerfil(@PathVariable UUID id, @RequestBody Perfil perfilActualizado) {
        return ResponseEntity.ok(perfilService.actualizarPerfil(id, perfilActualizado));
    }

    @PutMapping("/activarPerfil/{id}")
    public ResponseEntity<Perfil> activarPerfil(@PathVariable UUID id) {
        return ResponseEntity.ok(perfilService.activarPerfil(id));
    }

    @PutMapping("/cambiarRolPerfil/{id}")
    public ResponseEntity<Perfil> cambiarRolPerfil(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        String rolString = body.get("rol");
        Rol nuevoRol = Rol.valueOf(rolString.toUpperCase());
        return ResponseEntity.ok(perfilService.cambiarRole(id, nuevoRol));
    }

    @DeleteMapping("/{id}")
    public void eliminarPerfil(@PathVariable UUID id){perfilService.eliminarPerfil(id);}
}
