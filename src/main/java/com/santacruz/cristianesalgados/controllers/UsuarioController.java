package com.santacruz.cristianesalgados.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import com.santacruz.cristianesalgados.services.UsuarioService;
import com.santacruz.cristianesalgados.models.Usuario;
import com.santacruz.cristianesalgados.utils.JwtUtil;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080") // Ajuste para o domínio do frontend
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    // Método para cadastrar um novo usuário
    @PostMapping("/cadastro")
    public ResponseEntity<?> cadastrar(@RequestBody Usuario usuario) {
        try {
            // Criptografar a senha antes de salvar
            String senhaCriptografada = usuarioService.criptografarSenha(usuario.getSenha());
            usuario.setSenha(senhaCriptografada);

            // Salvar o usuário
            usuarioService.salvarUsuario(usuario);

            // Responder sucesso
            return ResponseEntity.ok().body("{\"success\": true}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Erro ao cadastrar usuário\"}");
        }
    }

    // Método para login do usuário
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        try {

            // Buscar o usuário pelo email
            Optional<Usuario> usuarioEncontrado = usuarioService.buscarPorEmail(usuario.getEmail());

            if (usuarioEncontrado.isPresent()) {
                Usuario usuarioDB = usuarioEncontrado.get();

                // Verificar a senha
                boolean senhaValida = usuarioService.verificarSenha(usuario.getSenha(), usuarioDB.getSenha());
                if (senhaValida) {
                    // Gera o token JWT
                    String token = jwtUtil.generateToken(usuarioDB.getEmail());

                    return ResponseEntity.ok()
                            .body("{\"success\": true, \"token\": \"" + token + "\", \"nome\": \"" + usuarioDB.getNome() + "\"}");
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Senha incorreta\"}");
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        String.format("{\"error\": \"Usuário com email '%s' não encontrado\"}", usuario.getEmail()));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Erro ao realizar login\"}");
        }
    }

    @GetMapping("/recurso-protegido")
    public ResponseEntity<?> recursoProtegido(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        try {
            if (authorizationHeader == null || authorizationHeader.isEmpty()) {
                // Caso o header Authorization não exista, usuário não está logado
                return ResponseEntity.ok("{\"loggedIn\": false, \"message\": \"Usuário não está logado\"}");
            }
    
            String token = authorizationHeader.replace("Bearer ", "");
            if (!jwtUtil.validateToken(token)) {
                // Token inválido
                return ResponseEntity.ok("{\"loggedIn\": false, \"message\": \"Token inválido ou expirado\"}");
            }
    
            // Token válido, usuário está logado
            return ResponseEntity.ok("{\"loggedIn\": true, \"message\": \"Recurso protegido acessado\"}");
        } catch (Exception e) {
            // Caso ocorra algum erro inesperado
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Erro ao processar requisição\"}");
        }
    }

    //Método para retornar usuário logado
    @GetMapping("/carregar-dados")
    public ResponseEntity<Optional<Usuario>> getUsuarioCadastrado (@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            String email = jwtUtil.getEmailFromToken(token);

             // Buscar o usuário pelo email
            Optional<Usuario> usuarioEncontrado = usuarioService.buscarPorEmail(email);
            
            return ResponseEntity.ok(usuarioEncontrado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
}