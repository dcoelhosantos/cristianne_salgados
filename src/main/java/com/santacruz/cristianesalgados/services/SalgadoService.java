package com.santacruz.cristianesalgados.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import com.santacruz.cristianesalgados.models.Salgado;
import com.santacruz.cristianesalgados.repositories.SalgadoRepository;

@Service
public class SalgadoService {

    @Autowired
    private SalgadoRepository salgadoRepository;

    // Salvar salgado
    public void salvarSalgado(Salgado salgado) {
        salgadoRepository.save(salgado);
    }

    // Listar todos os salgados
    public List<Salgado> listarSalgados() {
        return salgadoRepository.findAll();
    }

    // Buscar usuário por email
    public Optional<Salgado> buscarPorNome(String nome) {
        return salgadoRepository.findByNome(nome);
    }
}
