document.addEventListener("DOMContentLoaded", carregarMeusPedidos);

// Função para carregar automaticamente todos os pedidos do cliente
function carregarMeusPedidos() {
    const token = localStorage.getItem('token');

    if (!token) {
        const div = document.getElementById("meusPedidos");
        div.innerHTML = "Faça Login para poder ver seus pedidos!";
        return;
    }

    fetch('http://localhost:8080/api/meus-pedidos', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(pedidos => {
            const div = document.getElementById("meusPedidos");
            div.innerHTML = ""; // Limpa o conteúdo existente

            pedidos.forEach(pedido => {
                const divFilha = document.createElement("div");
                divFilha.classList.add("pedido");

                urlRedirecionamento = 'pedidosconcluidos.html';

                if((verificarPrazoParaRetirada(pedido.dataRetirada) && pedido.status == 'Aceito') || pedido.status == 'Em análise'){
                    urlRedirecionamento = 'pedidosmodificaveis.html';
                }

                divFilha.innerHTML = `
                    <div class="info">
                        <span>Pedido: </span>
                        <span class="status ${pedido.status.toLowerCase().replace(" ", "-")}">${pedido.status}</span>
                    </div>
                    <div class="detalhes">
                        <span class="dh">Data: ${formatarData(pedido.dataHoraPedido)}<br>
                        Horário: ${formatarHora(pedido.dataHoraPedido)} </span>
                        <button onclick="avancar('${urlRedirecionamento}', ${pedido.id})">Ver Detalhes</button>
                    </div>
                `;

                div.appendChild(divFilha);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os pedidos:", error);
            const div = document.getElementById("meusPedidos");
            div.innerHTML = "Faça Login para poder ver seus pedidos!";
        });
}

// Função para formatar apenas a data
function formatarData(dataHora) {
    const data = new Date(dataHora);
    return data.toLocaleDateString('pt-BR'); // Formato: dd/mm/aaaa
}

// Função para formatar apenas o horário
function formatarHora(dataHora) {
    const data = new Date(dataHora);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // Formato: hh:mm
}

// Função para redirecionar com o ID do pedido na URL
function avancar(pagina, id) {
    window.location.href = `${pagina}?id=${id}`;
}

// Função para verificar se o prazo para alterar um pedido ainda é válido
function verificarPrazoParaRetirada(dataRetirada) {
    // Converter a data de retirada para um objeto Date
    const retirada = new Date(dataRetirada);

    // Obter a data de hoje
    const hoje = new Date();
    
    // Zerar as horas, minutos, segundos e milissegundos de ambas as datas
    hoje.setHours(0, 0, 0, 0);
    retirada.setHours(0, 0, 0, 0);

    // Calcular a diferença em milissegundos
    const diferencaMilissegundos = retirada - hoje;

    // Converter a diferença para dias
    const diferencaDias = diferencaMilissegundos / (1000 * 60 * 60 * 24);

    // Retornar true se a data de hoje for pelo menos dois dias antes da retirada
    return diferencaDias >= 2;
}