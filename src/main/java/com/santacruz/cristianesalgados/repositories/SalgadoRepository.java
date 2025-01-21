package com.santacruz.cristianesalgados.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.santacruz.cristianesalgados.models.Salgado;

import java.util.Optional;

public interface SalgadoRepository extends JpaRepository<Salgado, Long> {

    // Método para buscar um salgado pelo nome
    Optional<Salgado> findByNome(String nome);
}