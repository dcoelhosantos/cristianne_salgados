package com.santacruz.cristianesalgados.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.santacruz.cristianesalgados.models.Pedido;
import com.santacruz.cristianesalgados.repositories.PedidoRepository;


@Service
public class PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;
    
    // Salvar pedido
    public void salvarPedido(Pedido pedido) {
        pedidoRepository.save(pedido);
    }

    // Listar os pedidos por email
    public List<Pedido> listarPedidosPorEmail(String email) {
        return pedidoRepository.findByEmail(email);
    }

    // Buscar pedido por id
    public Optional<Pedido> buscarPedidoPorId(long id) {
        return pedidoRepository.findById(id);
    }

    // Atualizar status do pedido
    public void atualizarStatus(Pedido pedido, String status){
        pedidoRepository.updateStatus(pedido.getId(), status);
    }
}
