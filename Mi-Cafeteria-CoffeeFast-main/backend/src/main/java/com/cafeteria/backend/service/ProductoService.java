package com.cafeteria.backend.service;

import com.cafeteria.backend.model.Categoria;
import com.cafeteria.backend.model.Producto;
import com.cafeteria.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    //@PreAuthorize("hasAuthority('ADMIN')")
    public Producto guardar(Producto producto){
        Producto productoExistente = productoRepository.findByNombreIgnoreCase(producto.getNombre());
        if(productoExistente == null)return productoRepository.save(producto);
        else {
            productoExistente.setDescripcion(producto.getDescripcion());
            productoExistente.setCategoria(producto.getCategoria());
            productoExistente.setPrecio(producto.getPrecio());
            productoExistente.setDisponible(producto.getDisponible());
            productoExistente.setIsDeleted(false);
            productoExistente.setImagenUrl(producto.getImagenUrl());
            return productoRepository.save(productoExistente);
        }
    }

    public Producto actualizar(Long id, Producto producto){
        Producto productoExistente = buscarPorId(id);
        if(productoExistente == null)return productoRepository.save(producto);
        else {
            productoExistente.setNombre(producto.getNombre());
            productoExistente.setDescripcion(producto.getDescripcion());
            productoExistente.setCategoria(producto.getCategoria());
            productoExistente.setPrecio(producto.getPrecio());
            productoExistente.setDisponible(producto.getDisponible());
            productoExistente.setIsDeleted(false);
            productoExistente.setImagenUrl(producto.getImagenUrl());
            return productoRepository.save(productoExistente);
        }
    }

    public Producto activar(Long id){
        Producto productoExistente = buscarPorId(id);
        productoExistente.setIsDeleted(false);
        return productoRepository.save(productoExistente);
    }

    public Producto buscarPorId(Long id){
        return productoRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
    }

    //@PreAuthorize("hasAuthority('ADMIN')")
    public List<Producto> listarProductos(){
        return productoRepository.findAll();
    }

    //@PreAuthorize("hasAuthority('ADMIN','EMPLEADO','CLIENTE')")
    public List<Producto> listarProductosActivos(){return productoRepository.findByIsDeletedFalse();}

    public List<Producto> buscarPorNombre(String nombre){return productoRepository.findByNombreContainingIgnoreCase(nombre);}

    //@PreAuthorize("hasAuthority('ADMIN')")
    public Producto eliminarProducto(Long id){
        Producto producto = buscarPorId(id);
        producto.setIsDeleted(true);
        return productoRepository.save(producto);
    }
}
