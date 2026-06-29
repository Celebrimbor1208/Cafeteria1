package com.cafeteria.backend.controller;

import com.cafeteria.backend.model.Categoria;
import com.cafeteria.backend.model.Producto;
import com.cafeteria.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 👇 AGREGA ESTA LÍNEA AQUÍ (Permite que tu frontend local se conecte al backend de internet)
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public List<Producto> getProductos(){return productoService.listarProductos();}

    @GetMapping("/buscar")
    public List<Producto> getProductoPorNombre(@RequestParam String nombre){return productoService.buscarPorNombre(nombre);}

    @GetMapping("/{id}")
    public Producto getProductoPorId(@PathVariable Long id){return productoService.buscarPorId(id);}

    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto){return productoService.guardar(producto);}

    @PutMapping("/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody Producto producto){return productoService.actualizar(id, producto);}

    @PutMapping("/activarProducto/{id}")
    public Producto activarProducto(@PathVariable Long id){return productoService.activar(id);}

    @DeleteMapping("/{id}")
    public Producto eliminarProducto(@PathVariable Long id){return productoService.eliminarProducto(id);}
}