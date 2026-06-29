package com.cafeteria.backend.controller;

import com.cafeteria.backend.model.Categoria;
import com.cafeteria.backend.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public List<Categoria> getCategoriasActivas(){
        return categoriaService.listarCategoriasActivas();
    }

    @GetMapping("/buscar")
    public List<Categoria> getCategoriaPorNombre(@RequestParam String nombre){return categoriaService.buscarPorNombre(nombre);}

    @GetMapping("/{id}")
    public Categoria getCategoriaPorId(@PathVariable Long id) {
        return categoriaService.buscarPorId(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Categoria crearCategoria(@RequestBody Categoria categoria){
        return categoriaService.guardar(categoria);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Categoria actualizarCategoria(@PathVariable long id, @RequestBody Categoria categoria){return categoriaService.actualizar(id,categoria);}

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/activarCategoria/{id}")
    public Categoria activarCategoria(@PathVariable long id){return categoriaService.activar(id);}

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public Categoria eliminarCategoria(@PathVariable Long id){return categoriaService.eliminar(id);}
}