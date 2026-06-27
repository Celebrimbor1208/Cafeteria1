package com.cafeteria.backend.service;
import com.cafeteria.backend.repository.PerfilRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cafeteria.backend.model.Carrito;
import com.cafeteria.backend.model.ItemCarrito;
import com.cafeteria.backend.model.Producto;
import com.cafeteria.backend.repository.CarritoRepository;
import com.cafeteria.backend.repository.ProductoRepository;

import java.time.ZonedDateTime;
import java.util.UUID;

@Service
public class CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private PerfilRepository perfilRepository;

    @Transactional
    public Carrito obtenerOCrearCarrito(UUID perfilId) {
        // 1. Intentamos buscar el carrito directamente por el perfilId que nos mandan
        Carrito carrito = carritoRepository.findByPerfilId(perfilId);

        // 2. Si no existe, lo creamos asignándole el perfilId
        if (carrito == null) {
            carrito = new Carrito();
            carrito.setPerfil(perfilRepository.findById(perfilId).orElseThrow(() -> new RuntimeException("perfil no encontrao con id: "+perfilId)));
            carrito.setFechaModificacion(ZonedDateTime.now());
            carrito = carritoRepository.save(carrito);
        }

        return carrito;
    }

    @Transactional
    public void limpiarCarrito(UUID perfilId) { // <- Cambiamos String correo por UUID perfilId
        // Buscamos el carrito usando el perfilId según el nuevo Repositorio
        Carrito carrito = carritoRepository.findByPerfilId(perfilId);

        if (carrito != null) {
            carrito.getItems().clear();
            carrito.setFechaModificacion(ZonedDateTime.now()); // Opcional: Actualizar la fecha de modificación
            carritoRepository.save(carrito); // Guardamos el cambio
        }
    }

    @Transactional
    public Carrito agregarProductoCarrito(UUID perfilId, Long idProducto) { // <- Removemos el parámetro correo que ya no se usa aquí

        //UUID perfilId = UUID.fromString(principal.getName()); Extraes el id del usuario autenticado
        // 1. Obtenemos o creamos el carrito usando solo el perfilId
        Carrito carrito = obtenerOCrearCarrito(perfilId);

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (!producto.getDisponible() || producto.getIsDeleted()) {
            throw new RuntimeException("El producto " + producto.getNombre() + " no está disponible para la venta");
        }

        var itemExistente = carrito.getItems().stream()
                .filter(item -> item.getProducto().getId().equals(idProducto))
                .findFirst();
        if (itemExistente.isPresent()) {
            // Si ya existe, aumentamos la cantidad
            var item = itemExistente.get();
            item.setCantidad(item.getCantidad() + 1);
        } else {
            ItemCarrito nuevoItem = new ItemCarrito();
            nuevoItem.setCarrito(carrito);
            nuevoItem.setProducto(producto);
            nuevoItem.setCantidad(1);
            nuevoItem.setPrecioUnitario(producto.getPrecio());

            carrito.getItems().add(nuevoItem);
        }
        carrito.setFechaModificacion(ZonedDateTime.now());

        return carritoRepository.save(carrito);
    }

    @Transactional
    public Carrito quitarProductoCarrito(UUID perfilId, Long idProducto) {
        Carrito carrito = obtenerOCrearCarrito(perfilId);

        var itemExistente = carrito.getItems().stream()
                .filter(item -> item.getProducto().getId().equals(idProducto))
                .findFirst();

        if (itemExistente.isPresent()) {
            var item = itemExistente.get();

            int nuevaCantidad = item.getCantidad() - 1;

            if (nuevaCantidad > 0) {
                item.setCantidad(nuevaCantidad);
            } else {
                carrito.getItems().remove(item);
            }
        } else {
            throw new RuntimeException("El producto no se encuentra en el carrito");
        }
        carrito.setFechaModificacion(ZonedDateTime.now());
        return carritoRepository.save(carrito);
    }
}