package com.cafeteria.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.util.Map;

@RestController
@RequestMapping("/api/ping")
public class testController {

    @Autowired
    private DataSource dataSource;

    @GetMapping
    public Map<String, String> ping() {
        // Un Map en Java se convierte automáticamente en un JSON como: {"mensaje": "..."}
        return Map.of("mensaje", "✅ ¡Conexión exitosa! El backend está vivo y respirando.");
    }
}