package com.santacruz.cristianesalgados.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.santacruz.cristianesalgados.models.Usuario;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método para buscar um usuário pelo email
    Optional<Usuario> findByEmail(String email);
}