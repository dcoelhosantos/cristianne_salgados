//Função pra deixar um método de pagamento já marcado
window.onload = check;

var salgados_armazenados = JSON.parse(localStorage.getItem('salgados_armazenados'));
var total = JSON.parse(localStorage.getItem('total'));

renderizarSalgados(salgados_armazenados);
renderizarTotal(total);

function check() {
    document.getElementById("dinheiro").checked = true;
}

// Função para redirecionar para outra página
function redirecionar(pagina) {
    window.location.href = pagina;
}

// Função para abrir as pop-ups
function openPopup(type) {
    const cabecalho = document.getElementById("cabecalho");
    cabecalho.className = "navbar bg-body-tertiary";
    document.querySelector(`.${type}-background`).style.display = 'block';
}

//Função para exibir a pop-up correta
function exibirPopUpPagamento() {
    if (document.getElementById("dinheiro").checked) {
        openPopup('dinheiro');
    } else if (document.getElementById("cartao").checked) {
        openPopup('cartao');
    } else if (document.getElementById("pix").checked) {
        openPopup('pix');
    }
}

// Função para fechar as pop-ups
function closePopup(type) {
    document.querySelector(`.${type}-background`).style.display = 'none';
    const cabecalho = document.getElementById("cabecalho");
    cabecalho.className = "navbar bg-body-tertiary fixed-top";
}

// Função para finalizar o pedido
function finalizarPedido(type) {

    let metodoPagamento = null;
    const dataRetirada = document.getElementById("data_retirada").value;
    const horaRetirada = document.getElementById("hora_retirada").value;
    const nomeCliente = document.getElementById("nome_cliente").value;
    const celularCliente = document.getElementById("celular_cliente").value;
    const emailCliente = document.getElementById("email_cliente").value;

    if (document.getElementById("dinheiro").checked) {
        const troco = document.getElementById("troco").value;
        if (troco.trim() === "") {
            metodoPagamento = "dinheiro, não precisa de troco";
        } else {
            metodoPagamento = `dinheiro, troco para ${troco}`;
        }
    } else if (document.getElementById("cartao").checked) {
        metodoPagamento = 'cartao';
    } else if (document.getElementById("pix").checked) {
        metodoPagamento = 'pix';
    }

    // Verificar se os campos obrigatórios estão preenchidos
    if (!dataRetirada || !horaRetirada || !nomeCliente || !celularCliente || !emailCliente || !metodoPagamento) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const salgados_armazenados = JSON.parse(localStorage.getItem('salgados_armazenados')) || [];
    const total = JSON.parse(localStorage.getItem('total')) || [];

    const qtdTotal = total.nova_qtd_total;
    const valorTotal = total.novo_preco_total;

    const salgadoNomes = [];
    const salgadoPrecos = [];
    const salgadoSubtotais = [];
    const salgadoQuantidades = [];

    salgados_armazenados.forEach(salgado => {
        salgadoNomes.push(salgado.nome);
        salgadoPrecos.push(salgado.preco_num);
        salgadoSubtotais.push(salgado.valor);
        salgadoQuantidades.push(salgado.qtd);
    });

    const formData = new FormData();
    formData.append("metodoPagamento", metodoPagamento);
    formData.append("dataRetirada", dataRetirada);
    formData.append("horaRetirada", horaRetirada);
    formData.append("nome", nomeCliente);
    formData.append("celular", celularCliente);
    formData.append("email", emailCliente);
    formData.append("qtdTotal", qtdTotal);
    formData.append("valorTotal", valorTotal);
    formData.append("salgadoNomes", salgadoNomes);
    formData.append("salgadoPrecos", salgadoPrecos);
    formData.append("salgadoQuantidades", salgadoQuantidades);
    formData.append("salgadoSubtotais", salgadoSubtotais);

    fetch("http://localhost:8080/api/salvar-pedido", {
        method: "POST",
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Pedido feito com sucesso!");
                document.querySelector(`.agradecimento-background`).style.display = 'block'; document.querySelector(`.agradecimento-background`).style.display = 'block';
                document.querySelector(`.${type}-background`).style.display = 'none';
                const cabecalho = document.getElementById("cabecalho");
                cabecalho.className = "navbar bg-body-tertiary";
            } else {
                alert("Erro: " + data.error);
            }
        })
        .catch(error => console.error("Erro:", error));
}

function renderizarSalgados(salgados_armazenados) {
    const tbody = document.getElementById('produtos_adicionados');
    salgados_armazenados.forEach(salgado => {
        const tr = document.createElement('tr');
        tr.innerHTML =
            `
                <td>${salgado.nome}</td>
                <td>R$${salgado.preco_num.toFixed(2).replace(".", ",")}</td>
                <td>${salgado.qtd}</td>
                <td>R$${salgado.valor.toFixed(2).replace(".", ",")}</td>
            `;
        tbody.appendChild(tr);
    });
}

function renderizarTotal(total) {
    const td_qtd = document.getElementById('qtd_total');
    const td_valor = document.getElementById('valor_total');
    const p_total = document.querySelector('.total-price');

    td_qtd.textContent = `${total.nova_qtd_total}`;
    td_valor.textContent = `R$${total.novo_preco_total.toFixed(2).replace(".", ",")}`;
    p_total.textContent = `R$${total.novo_preco_total.toFixed(2).replace(".", ",")}`;
}

// Função para redirecionar para a página escolhida
function redirecionar(pagina) {
    window.location.href = pagina;
}