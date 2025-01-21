package com.santacruz.cristianesalgados.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

import com.santacruz.cristianesalgados.services.SalgadoService;


import com.santacruz.cristianesalgados.models.Salgado;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080") // Ajuste para o domínio do frontend
public class SalgadoController {

    @Autowired
    private SalgadoService salgadoService;

    // Método para listar todos os salgados
    @GetMapping("/salgados")
    public ResponseEntity<List<Salgado>> listarSalgados() {
        try {
            List<Salgado> salgados = salgadoService.listarSalgados();
            return ResponseEntity.ok(salgados);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}