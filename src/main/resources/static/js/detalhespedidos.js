document.addEventListener("DOMContentLoaded", carregarDadosPedido);

//Função para carregar automaticamente os dados do pedido do banco de dados
function carregarDadosPedido() {
    const pedidoId = obterParametro('id');
    if (pedidoId) {
        fetch(`http://localhost:8080/api/pedidos/${pedidoId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar o pedido');
                }
                return response.json();
            })
            .then(pedido => {
                // Exibir os detalhes do pedido na página
                exibirPedido(pedido);
            })
            .catch(error => console.error('Erro:', error));
    } else {
        console.error('ID do pedido não encontrado na URL');
    }
}

//Função para exibir o pedido
function exibirPedido(pedido) {
    const pedidoInfo = document.getElementById("pedidoInfo");
    pedidoInfo.innerHTML = `
        <div><span>Nome do Cliente:</span> ${pedido.nome}</div>
        <div><span>Contato:</span> ${pedido.celular}</div>
        <div><span>E-mail:</span> ${pedido.email}</div>
        <div><span>Data de Retirada:</span> ${formatarData(pedido.dataRetirada)}</div>
        <div><span>Horário de Retirada:</span> ${pedido.horaRetirada.slice(0, 5)}</div>
        <div><span>Método de pagamento:</span> ${pedido.metodoPagamento.toUpperCase()}</div>
    `;

    const tabelaSalgados = document.getElementById("tabelaSalgados");
    let contador = 0;

    pedido.salgadoNomes.forEach(salgadoNome => {
        const tr = document.createElement('tr');
        tr.innerHTML =
            `
                <td>${salgadoNome}</td>
                <td>
                    ${parseFloat(pedido.salgadoPrecos[contador]).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
                <td>${pedido.salgadoQuantidades[contador]}</td>
                <td>${parseFloat(pedido.salgadoSubtotais[contador]).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            `;
        tabelaSalgados.appendChild(tr);
        contador++;
    });

    const td_qtd = document.getElementById('qtd_total');
    const td_valor = document.getElementById('valor_total');
    
    td_qtd.textContent = `${pedido.qtdTotal}`;
    td_valor.textContent = `${parseFloat(pedido.valorTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
}

//Função para alterar o status do pedido
function atualizarStatusPedido(status){
    const formData = new FormData();
    formData.append("id", obterParametro('id'));
    formData.append("status", status);
    fetch("http://localhost:8080/api/atualizar-status", {
        method: "POST",
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                redirecionar('pedidos.html');
            } else {
                alert("Erro: " + data.error);
            }
        })
        .catch(error => console.error("Erro:", error));
}

// Função para obter os parâmetros da URL
function obterParametro(chave) {
    const params = new URLSearchParams(window.location.search);
    return params.get(chave);
}

// Função para formatar a data
const formatarData = (data) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
};