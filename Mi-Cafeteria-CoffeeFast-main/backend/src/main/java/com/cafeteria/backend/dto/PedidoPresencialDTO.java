package com.cafeteria.backend.dto;

import com.cafeteria.backend.model.Perfil;

import java.util.List;

public record PedidoPresencialDTO(
        Perfil cliente,
        List<ItemPresencialDTO> items
) {}
