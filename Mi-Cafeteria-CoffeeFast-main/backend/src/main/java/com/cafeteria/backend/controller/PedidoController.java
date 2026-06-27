package com.cafeteria.backend.controller;

import com.cafeteria.backend.model.EstadoPedido;
import com.cafeteria.backend.model.Pedido;
import com.cafeteria.backend.model.Perfil;
import com.cafeteria.backend.model.Rol;
import com.cafeteria.backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public List<Pedido> getPedidos(){return pedidoService.listarPedidos();}

    // URL en React: GET /api/pedidos/buscar?nombre="nombre"
    @GetMapping("/buscar")
    public ResponseEntity<List<Pedido>> buscarPorNombre(@RequestParam String nombre) {
        List<Pedido> historial = pedidoService.buscarHistorialPorNombre(nombre);
        return ResponseEntity.ok(historial);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPorId(@PathVariable UUID id){
        return ResponseEntity.ok(pedidoService.buscarPedidoPorId(id));
    }

    @PostMapping("/crearPedido/{id}")
    public ResponseEntity<Pedido> crearPedido(@PathVariable UUID id){
        return ResponseEntity.ok(pedidoService.crearPedidoCliente(id));
    }

    @PutMapping("/cambiarEstadoPedido/{id}")
    public ResponseEntity<Pedido> cambiarEstadoPedido(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String estadoString = body.get("estado");
        EstadoPedido nuevoEstadoPedido = EstadoPedido.valueOf(estadoString.toUpperCase());
        return ResponseEntity.ok(pedidoService.actualizarEstadoPedido(id, nuevoEstadoPedido));
    }

    @PutMapping("/cancelarPedido/{id}")
    public ResponseEntity<Pedido> cancelarPedido(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.cancelarPedido(id));
    }
}
