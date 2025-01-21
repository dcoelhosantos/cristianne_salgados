package com.santacruz.cristianesalgados.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.*;

@Entity
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String metodoPagamento;

    @Column(nullable = false)
    private LocalDate dataRetirada;

    @Column(nullable = false)
    private LocalTime horaRetirada;

    @Column(nullable = false)
    private LocalDateTime dataHoraPedido;

    @Column(nullable = false)
    private String nome;
    
    @Column(nullable = false)
    private String celular;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private List<String> salgadoNomes;

    @Column(nullable = false)
    private List<Integer> salgadoQuantidades;

    @Column(nullable = false)
    private List<String> salgadoPrecos;

    @Column(nullable = false)
    private List<String> salgadoSubtotais;

    @Column(nullable = false)
    private Integer qtdTotal;

    @Column(nullable = false)
    private String valorTotal;

    @Column(nullable = false)
    private String status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(String metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public LocalDate getDataRetirada() {
        return dataRetirada;
    }

    public void setDataRetirada(LocalDate dataRetirada) {
        this.dataRetirada = dataRetirada;
    }

    public LocalTime getHoraRetirada() {
        return horaRetirada;
    }

    public void setHoraRetirada(LocalTime horaRetirada) {
        this.horaRetirada = horaRetirada;
    }

    public LocalDateTime getDataHoraPedido() {
        return dataHoraPedido;
    }

    public void setDataHoraPedido(LocalDateTime dataHoraPedido) {
        this.dataHoraPedido = dataHoraPedido;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCelular() {
        return celular;
    }

    public void setCelular(String celular) {
        this.celular = celular;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getSalgadoNomes() {
        return salgadoNomes;
    }

    public void setSalgadoNomes(List<String> salgadoNomes) {
        this.salgadoNomes = salgadoNomes;
    }

    public List<Integer> getSalgadoQuantidades() {
        return salgadoQuantidades;
    }

    public void setSalgadoQuantidades(List<Integer> salgadoQuantidades) {
        this.salgadoQuantidades = salgadoQuantidades;
    }

    public List<String> getSalgadoPrecos() {
        return salgadoPrecos;
    }

    public void setSalgadoPrecos(List<String> salgadoPrecos) {
        this.salgadoPrecos = salgadoPrecos;
    }

    public Integer getQtdTotal() {
        return qtdTotal;
    }

    public void setQtdTotal(Integer qtdTotal) {
        this.qtdTotal = qtdTotal;
    }

    public String getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(String valorTotal) {
        this.valorTotal = valorTotal;
    }

    public List<String> getSalgadoSubtotais() {
        return salgadoSubtotais;
    }

    public void setSalgadoSubtotais(List<String> salgadoSubtotais) {
        this.salgadoSubtotais = salgadoSubtotais;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}