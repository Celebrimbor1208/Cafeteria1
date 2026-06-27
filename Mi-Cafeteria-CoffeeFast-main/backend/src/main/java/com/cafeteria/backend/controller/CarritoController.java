package com.cafeteria.backend.controller;

import com.cafeteria.backend.model.Carrito;
import com.cafeteria.backend.model.ItemCarrito;
import com.cafeteria.backend.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "*")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    // 1. Obtener o crear el carrito usando el perfilId
    // Ejemplo: GET http://localhost:8080/api/carrito/obtener?perfilId=4f3b2a1...
    @GetMapping("/{id}")
    public ResponseEntity<Carrito> obtenerOCrearCarrito(@PathVariable UUID id) {
        // El servicio ahora solo necesita el perfilId para buscar en la BD
        Carrito carrito = carritoService.obtenerOCrearCarrito(id);
        return ResponseEntity.ok(carrito);
    }

    // 2. Agregar un producto al carrito
    // Ejemplo: POST http://localhost:8080/api/carrito/agregar?perfilId=...&idProducto=5&cantidad=2
    @PostMapping("/agregarProducto/{id}")
    public ResponseEntity<?> agregarProducto(@PathVariable UUID id,@RequestBody ItemCarrito itemCarrito) {
        try {
            Carrito carritoActualizado = carritoService.agregarProductoCarrito(
                    id,
                    itemCarrito.getProducto().getId()
            );
            return ResponseEntity.ok(carritoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/quitarProducto/{id}/{productoId}")
    public ResponseEntity<?> quitarProducto(@PathVariable UUID id,@PathVariable Long productoId) {
        try {
            Carrito carritoActualizado = carritoService.quitarProductoCarrito(
                    id,
                    productoId
            );
            return ResponseEntity.ok(carritoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. Limpiar o vaciar el carrito
    // Ejemplo: DELETE http://localhost:8080/api/carrito/limpiar?perfilId=...
    @DeleteMapping("/limpiarCarrito/{id}")
    public ResponseEntity<String> limpiarCarrito(@PathVariable UUID id) {
        carritoService.limpiarCarrito(id);
        return ResponseEntity.ok("Carrito vaciado correctamente");
    }
}