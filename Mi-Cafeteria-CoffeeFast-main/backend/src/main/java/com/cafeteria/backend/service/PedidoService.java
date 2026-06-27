package com.cafeteria.backend.service;

import com.cafeteria.backend.dto.ItemPresencialDTO;
import com.cafeteria.backend.dto.PedidoPresencialDTO;
import com.cafeteria.backend.model.*;
import com.cafeteria.backend.repository.CarritoRepository;
import com.cafeteria.backend.repository.PedidoRepository;
import com.cafeteria.backend.repository.PerfilRepository;
import com.cafeteria.backend.repository.ProductoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private CarritoRepository carritoRepository;
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private PerfilRepository perfilRepository;

    public Pedido buscarPorId(Long id){
        return pedidoRepository.findById(id).orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + id));
    }

    /*METODOS PARA EL CLIENTE*/

    //La anotación @Transactional asegura que si algo falla (ej. se cae la BD al borrar el carrito),
    // no se guarde el pedido a medias. O se hace todo, o no se hace nada (Propiedad ACID).
    @Transactional//@PreAuthorize("hasAuthority('CLIENTE') and #perfilId.toString() == authentication.principal.name")
    public Pedido crearPedidoCliente(UUID perfilId) {
        //Buscamos el carrito del usuario
        Carrito carrito = carritoRepository.findByPerfilId(perfilId);

        if (carrito.getItems().isEmpty()) {
            throw new RuntimeException("El carrito está vacío, no se puede crear un pedido.");
        }

        //Instanciamos el nuevo Pedido
        Pedido nuevoPedido = new Pedido();
        nuevoPedido.setPerfil(perfilRepository.findById(perfilId).orElseThrow(() -> new RuntimeException("perfil no encontrao con id: "+perfilId)));
        nuevoPedido.setEstado(EstadoPedido.PENDIENTE);

        BigDecimal totalCompra = BigDecimal.ZERO;

        //Transformamos los Items del Carrito a Detalles del Pedido
        for (ItemCarrito item : carrito.getItems()) {
            DetallePedido detalle = new DetallePedido();
            detalle.setProducto(item.getProducto());
            detalle.setCantidad(item.getCantidad());

            // Congelamos el precio en este instante de tiempo
            BigDecimal precioActual = item.getProducto().getPrecio();
            detalle.setPrecioUnitario(precioActual);

            // Calculamos subtotal y lo sumamos al total
            BigDecimal subtotal = precioActual.multiply(new BigDecimal(item.getCantidad()));
            totalCompra = totalCompra.add(subtotal);

            // Relacionamos de forma bidireccional
            nuevoPedido.addDetalle(detalle);
        }

        nuevoPedido.setMontoTotal(totalCompra);

        //Guardamos el pedido (Hibernate guardará los detalles automáticamente por el CascadeType.ALL)
        Pedido pedidoGuardado = pedidoRepository.save(nuevoPedido);

        //Vaciamos el carrito y lo guardamos (orphanRemoval eliminará los items de la BD)
        carrito.getItems().clear();
        carritoRepository.save(carrito);

        return pedidoGuardado;
    }

    // El usuario solo puede ver el historial si el perfilId coincide con su propio ID de autenticación
    //@PreAuthorize("hasAuthority('CLIENTE') and #perfilId.toString() == authentication.principal.name")
    public List<Pedido> obtenerHistorialCliente(UUID perfilId) {return pedidoRepository.findByPerfilIdOrderByFechaCreacionDesc(perfilId);}

    //@PreAuthorize("hasAuthority('CLIENTE') and #perfilId.toString() ==  authentication.principal.name")
    public Pedido obtenerDetallePedidoCliente(Long id, UUID perfilId){
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + id));
    }

    //@PreAuthorize("hasAuthority('Cliente') and #perfilId.toString() ==  authentication.principal.name)")
    public Pedido cancelarPedidoCliente(Long id, UUID perfilId){
        Pedido pedidoExistente = buscarPorId(id);
        if(pedidoExistente.getEstado() != EstadoPedido.PENDIENTE){
            pedidoExistente.setEstado(EstadoPedido.CANCELADO);
            return pedidoRepository.save(pedidoExistente);
        }else throw new RuntimeException("El pedido no se puede cancelar porque ya esta en preparación o listo");
    }

    /*METODOS PARA EMPLEADO/ADMIN*/

    //@PreAuthorize("hasAnyAuthority('ADMIN','EMPLEADO')")
    public List<Pedido> listarPedidos(){return pedidoRepository.findAll();}

    //@PreAuthorize("hasAnyAuthority('ADMIN','EMPLEADO')")
    public List<Pedido> listarPedidosIncompletos(){return pedidoRepository.findByEstadoIn(List.of(EstadoPedido.PENDIENTE,EstadoPedido.EN_PREPARACION));}

    //@PreAuthorize("hasAnyAuthority('ADMIN','EMPLEADO')")
    public List<Pedido> listarPedidosCompletados(){return pedidoRepository.findByEstadoIn(List.of(EstadoPedido.LISTO,EstadoPedido.ENTREGADO));}

    //@PreAuthorize("hasAuthority('ADMIN', 'EMPLEADO')")
    public List<Pedido> buscarHistorialPorNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new RuntimeException("El nombre de búsqueda no puede estar vacío");
        }
        return pedidoRepository.buscarHistorialPorNombreCliente(nombre.trim());
    }

    public Pedido buscarPedidoPorId(UUID perfilId){
        return pedidoRepository.findByPerfilId(perfilId);
    }

    //@PreAuthorize("hasAnyAuthority('ADMIN', 'EMPLEADO')")
    public Pedido actualizarEstadoPedido(Long id, EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setEstado(nuevoEstado);
        return pedidoRepository.save(pedido);
    }

    public Pedido cancelarPedido(Long id){
        Pedido pedidoExistente = buscarPorId(id);
        if(pedidoExistente.getEstado() == EstadoPedido.PENDIENTE){
            pedidoExistente.setEstado(EstadoPedido.CANCELADO);
            return pedidoRepository.save(pedidoExistente);
        }else throw new RuntimeException("El pedido no se puede cancelar porque ya esta en preparación o listo");
    }

    @Transactional//@PreAuthorize("hasAuthority('ADMIN', 'EMPLEADO')")
    public Pedido crearPedidoPresencial(PedidoPresencialDTO dto) {

        if (dto.items() == null || dto.items().isEmpty()) {
            throw new RuntimeException("No se pueden procesar pedidos sin productos.");
        }

        //Instanciamos el Pedido como ENTREGADO o LISTO (ya que se paga en caja)
        Pedido pedidoPresencial = new Pedido();
        pedidoPresencial.setPerfil(dto.cliente());
        pedidoPresencial.setEstado(EstadoPedido.ENTREGADO); // O EN_PREPARACION según el flujo del local

        BigDecimal totalCompra = BigDecimal.ZERO;

        //Procesamos la lista de ítems enviados desde el frente de caja
        for (ItemPresencialDTO itemDto : dto.items()) {
            // Buscamos el producto en el catálogo
            Producto producto = productoRepository.findById(itemDto.productoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + itemDto.productoId()));

            // Validación de negocio: Verificar si el producto está disponible
            if (!producto.getDisponible()) {
                throw new RuntimeException("El producto " + producto.getNombre() + " no está disponible.");
            }

            // Construimos el detalle
            DetallePedido detalle = new DetallePedido();
            detalle.setProducto(producto);
            detalle.setCantidad(itemDto.cantidad());
            detalle.setPrecioUnitario(producto.getPrecio());

            // Acumulamos el total
            BigDecimal subtotal = producto.getPrecio().multiply(new BigDecimal(itemDto.cantidad()));
            totalCompra = totalCompra.add(subtotal);

            // Vinculamos bidireccionalmente
            pedidoPresencial.addDetalle(detalle);
        }

        pedidoPresencial.setMontoTotal(totalCompra);

        return pedidoRepository.save(pedidoPresencial);
    }
}
