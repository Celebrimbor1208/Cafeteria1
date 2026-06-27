package com.cafeteria.backend.service;

import com.cafeteria.backend.model.Categoria;
import com.cafeteria.backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import java.util.List;
@Service

public class CategoriaService {
    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> listarCategoriasActivas(){
        return categoriaRepository.findByIsDeletedFalse();
    }

    public Categoria buscarPorId(Long id){
        return categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));
    }
    //@PreAuthorize("hasAnyRole('ADMIN')")
    public Categoria guardar(Categoria categoria){
        Categoria categoriaExistente = categoriaRepository.findByNombreIgnoreCase(categoria.getNombre());
        if(categoriaExistente == null)return categoriaRepository.save(categoria);
        else {
            categoriaExistente.setDescripcion(categoria.getDescripcion());
            categoriaExistente.setIsDeleted(false);
            return categoriaRepository.save(categoriaExistente);
        }
    }
    public List<Categoria> buscarPorNombre(String nombre){return categoriaRepository.findByNombreContainingIgnoreCase(nombre);}

    //@PreAuthorize("hasAnyRole('ADMIN')")
    public Categoria actualizar(Long id, Categoria categoriaActualizada){
        Categoria categoriaExistente = buscarPorId(id);
        categoriaExistente.setNombre(categoriaActualizada.getNombre());
        categoriaExistente.setDescripcion(categoriaActualizada.getDescripcion());
        return categoriaRepository.save(categoriaExistente);
    }

    //@PreAuthorize("hasAnyRole('ADMIN')")
    public Categoria eliminar(Long id){
        Categoria categoria = buscarPorId(id);
        categoria.setIsDeleted(true);
        return categoriaRepository.save(categoria);
    }


    public Categoria activar(Long id){
        Categoria categoria = buscarPorId(id);
        categoria.setIsDeleted(false);
        return categoriaRepository.save(categoria);
    }
}