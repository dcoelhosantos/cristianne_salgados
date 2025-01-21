package com.santacruz.cristianesalgados.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.santacruz.cristianesalgados.models.Usuario;
import com.santacruz.cristianesalgados.repositories.UsuarioRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Salvar usuário
    public void salvarUsuario(Usuario usuario) {
        usuarioRepository.save(usuario);
    }

    // Listar todos os usuários
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // Criptografar senha
    public String criptografarSenha(String senha) {
        return passwordEncoder.encode(senha);
    }

    // Buscar usuário por email
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    // Verificar senha
    public boolean verificarSenha(String senhaFornecida, String senhaCriptografada) {
        return passwordEncoder.matches(senhaFornecida, senhaCriptografada);
    }
}
