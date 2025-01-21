package com.santacruz.cristianesalgados.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import com.santacruz.cristianesalgados.services.PedidoService;
import com.santacruz.cristianesalgados.models.Pedido;
import com.santacruz.cristianesalgados.utils.JwtUtil;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8080") // Ajuste para o domínio do frontend
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private JwtUtil jwtUtil;

    // Método para cadastrar um novo pedido
    @PostMapping("/salvar-pedido")
    public ResponseEntity<?> cadastrar(
            @RequestParam("metodoPagamento") String metodoPagamento,
            @RequestParam("dataRetirada") String dataRetirada, // em formato "yyyy-MM-dd"
            @RequestParam("horaRetirada") String horaRetirada, // em formato "HH:mm"
            @RequestParam("nome") String nome,
            @RequestParam("celular") String celular,
            @RequestParam("email") String email,
            @RequestParam("qtdTotal") String qtdTotal,
            @RequestParam("valorTotal") String valorTotal,
            @RequestParam("salgadoNomes") List<String> salgadoNomes, // Lista de nomes de salgados para associar a
                                                                     // pedido
            @RequestParam("salgadoPrecos") List<String> salgadoPrecos, // Lista de precos de salgados para associar ao
                                                                       // pedido
            @RequestParam("salgadoQuantidades") List<Integer> salgadoQuantidades,
            @RequestParam("salgadoSubtotais") List<String> salgadoSubtotais) { // Quantidades associadas aos salgados

        try {
            // Exemplo de como converter uma string para LocalDate
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate dataRetiradaParsed = LocalDate.parse(dataRetirada, dateFormatter);

            // Exemplo de como converter uma string para LocalTime
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
            LocalTime horaRetiradaParsed = LocalTime.parse(horaRetirada, timeFormatter);

            // Criar o objeto pedido
            Pedido pedido = new Pedido();
            pedido.setMetodoPagamento(metodoPagamento);
            pedido.setDataRetirada(dataRetiradaParsed);
            pedido.setHoraRetirada(horaRetiradaParsed);
            pedido.setDataHoraPedido(LocalDateTime.now());
            pedido.setNome(nome);
            pedido.setCelular(celular);
            pedido.setEmail(email);
            pedido.setSalgadoNomes(salgadoNomes);
            pedido.setSalgadoPrecos(salgadoPrecos);
            pedido.setSalgadoQuantidades(salgadoQuantidades);
            pedido.setSalgadoSubtotais(salgadoSubtotais);
            pedido.setQtdTotal(Integer.parseInt(qtdTotal));
            pedido.setValorTotal(valorTotal);
            pedido.setStatus("Em análise");

            // Salvar o pedido
            pedidoService.salvarPedido(pedido);
            return ResponseEntity.ok().body("{\"success\": true}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"Não foi possível adicionar o pedido!\"}");
        }
    }

    //Método para listar os pedidos do cliente
    @GetMapping("/meus-pedidos")
    public ResponseEntity<List<Pedido>> getMeusPedidos(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");
            String email = jwtUtil.getEmailFromToken(token);
            List<Pedido> pedidos = pedidoService.listarPedidosPorEmail(email);
            return ResponseEntity.ok(pedidos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //Método para buscar pedido pelo seu id
    @GetMapping("/pedidos/{id}")
    public ResponseEntity<Pedido> buscarPedidoPorId(@PathVariable Long id) {
        System.out.println("chegou");
        try {
            return pedidoService.buscarPedidoPorId(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //Método para atualizar os status de um pedido
    @PostMapping("/atualizar-status")
    public ResponseEntity<?> atualizarStatus(
            @RequestParam("id") long id,
            @RequestParam("status") String status) {

        try {
            // Buscar o produto pelo nome
            Optional<Pedido> pedido = pedidoService.buscarPedidoPorId(id);

            if (pedido.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Pedido não encontrado!\"}");
            }

            // Atualizando o status do pedido
            pedidoService.atualizarStatus(pedido.get(), status);

            return ResponseEntity.ok().body("{\"success\": true}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"Não foi possível adicionar o salgado!\"}");
        }
    }
}