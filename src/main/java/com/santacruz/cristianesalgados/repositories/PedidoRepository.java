package com.santacruz.cristianesalgados.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import jakarta.transaction.Transactional;

import com.santacruz.cristianesalgados.models.Pedido;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByEmail(String email);

    // Método para atualizar os status de um pedido
    @Modifying
    @Transactional
    @Query("UPDATE Pedido p SET p.status = :status WHERE p.id = :id")
    int updateStatus(Long id, String status);
}