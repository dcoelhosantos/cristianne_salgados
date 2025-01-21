document.addEventListener("DOMContentLoaded", carregarSalgados);

// Remove apenas os dados relacionados aos salgados e ao total
localStorage.removeItem('salgados_armazenados');
localStorage.removeItem('total');

// Inicializa as variáveis novamente, caso necessário
var salgados_armazenados = JSON.parse(localStorage.getItem('salgados_armazenados')) || [];
var total = JSON.parse(localStorage.getItem('total')) || [];

//Função para carregar automaticamente todos os salgados do banco de dados
function carregarSalgados() {
    fetch('http://localhost:8080/api/salgados')
        .then(response => response.json())
        .then(salgados => {
            const cardapio = document.getElementById("cardapio");
            cardapio.innerHTML = ""; // Limpa o conteúdo existente

            salgados.forEach(salgado => {
                const card = document.createElement("div");
                card.classList.add("col-md-4");
                card.setAttribute("data-tipo", salgado.classe); // Adiciona o atributo data-tipo para o filtro

                card.innerHTML = `
                    <div class="card">
                        <img src="${salgado.urlFoto}" class="card-img-top" alt="${salgado.nome}">
                        <div class="card-body text-center">
                            <h5 class="card-title">${salgado.nome.toUpperCase()}</h5>
                            <h5 class="card-title"><span class="preco">R$${salgado.preco}</span></h5>
                        </div>
                    </div>
                `;

                cardapio.appendChild(card);
            });

            // Ativa o filtro após carregar os salgados
            ativarFiltro();
            salgadoSelecionavel();
        })
        .catch(error => console.error("Erro ao carregar os salgados:", error));
}

window.onload = check;
function check() {
    document.getElementById("todos").checked = true;
}

function ativarFiltro(){
    const filtros = document.querySelector('.btn-group');
    const cardapio = document.getElementById("cardapio");

    filtros.addEventListener('click', function (e) {
        const input = e.target.closest('input[type="radio"]'); // Verifica se o clique foi em um <input>
        if (!input) return; // Sai se o clique não foi em um <input>

        const tipo = input.value; // Obtém o valor do botão de rádio selecionado
        const items = cardapio.querySelectorAll('.col-md-4'); // Seleciona os itens no cardápio

        items.forEach(item => {
            if (tipo === 'todos') {
                item.style.display = ''; // Exibe todos os itens
            } else {
                item.style.display = item.getAttribute('data-tipo') === tipo ? '' : 'none'; // Filtra pelo tipo
            }
        });
    });
}

function salgadoSelecionavel(){
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function (event) {
            const img = event.target.closest('.card').querySelector('img');
            const nome = event.target.closest('.card').querySelector('h5');
            const preco = event.target.closest('.card').querySelector('.preco');
    
            document.querySelector('.products-preview').style.display = 'block';
            document.querySelector('.preview img').src = img.getAttribute('src');
            document.querySelector('.preview h3').textContent = nome.textContent;
            document.querySelector('.preview .preco').textContent = preco.textContent;
    
            const cabecalho = document.getElementById("cabecalho");
            cabecalho.className = "navbar bg-body-tertiary";
    
        });
    })
}

/*Fechar pop-ups*/
document.querySelector('.preview span').onclick =  () =>{
    document.querySelector('.products-preview').style.display = 'none';
    const cabecalho = document.getElementById("cabecalho");
    cabecalho.className = "navbar bg-body-tertiary fixed-top";
}

document.querySelector('.remover span').onclick =  () =>{
    document.querySelector('.remover-background').style.display = 'none';
    const cabecalho = document.getElementById("cabecalho");
    cabecalho.className = "navbar bg-body-tertiary fixed-top";
}
/*Fim fechar pop-ups*/

function exibirPopUpRemover() {
    const salgados_armazenados = JSON.parse(localStorage.getItem('salgados_armazenados')) || [];
    
    if(salgados_armazenados){
        if(salgados_armazenados.length >= 1){
            const cabecalho = document.getElementById("cabecalho");
            cabecalho.className = "navbar bg-body-tertiary";

            document.querySelector('.remover-background').style.display = 'block';
        }else{
            alert("Seu carrinho já está vazio!")
        }
    }else{
        alert("Seu carrinho já está vazio!")
    }
}

function adicionarItem() {
    document.querySelector('.products-preview').style.display = 'none';

    const div1 = document.getElementById("itens_adicionados");
    const div2 = document.createElement("div");

    const qtd_total_el = document.getElementById("total_qtd");
    const qtd_total_txt = document.getElementById("total_qtd").textContent;
    const preco_total_el = document.getElementById("total_preco");
    const preco_total_txt = document.getElementById("total_preco").textContent;
    const preco_total_num = parseFloat(preco_total_txt.replace("R$", "").replace(",", "."));

    const nome = document.getElementById("nome_item").textContent;
    const qtd = document.getElementById("item_qtd").value;
    const preco_txt = document.getElementById("preco_item").textContent;
    const preco_num = parseFloat(preco_txt.replace("R$", "").replace(",", "."));

    const valor = Number(qtd) * preco_num;

    const nova_qtd_total = Number(qtd_total_txt) + Number(qtd);
    const novo_preco_total = valor + preco_total_num;

    div2.className = "order-item d-flex justify-content-between align-items-center mb-2";
    div2.style.padding = "5px";
    div2.innerHTML =
        `
        <span class="nome_add">${nome}</span>
        <span class="qtd_add">${qtd} unidade(s)</span>
        <span class="valor_add">R$${valor.toFixed(2).replace(".", ",")}</span>
        <button onclick="removerSalgado()" style="border: none;"><i class="fas fa-trash"></i></button>
    `;
    div1.appendChild(div2);

    // Atualiza o localStorage
    const salgados_armazenados = JSON.parse(localStorage.getItem('salgados_armazenados')) || [];
    const novoSalgado = { nome, qtd, preco_num, valor };
    salgados_armazenados.push(novoSalgado);
    localStorage.setItem('salgados_armazenados', JSON.stringify(salgados_armazenados));

    qtd_total_el.textContent = `${nova_qtd_total}`;
    preco_total_el.textContent = `R$${novo_preco_total.toFixed(2).replace(".", ",")}`;

    const novo_total = {
        nova_qtd_total,
        novo_preco_total
    }
    
    localStorage.setItem('total', JSON.stringify(novo_total));

    const cabecalho = document.getElementById("cabecalho");
    cabecalho.className = "navbar bg-body-tertiary fixed-top";
}

function removerSalgado() {
    const button = event.target;
    const div = button.closest('div');

    const nome_txt = div.querySelector(".nome_add").textContent;
    const qtd_txt = div.querySelector(".qtd_add").textContent;
    const qtd_num = Number(qtd_txt.replace(" unidade(s)", ""));
    const valor_txt = div.querySelector(".valor_add").textContent;
    const valor_num = parseFloat(valor_txt.replace("R$", "").replace(",", "."));

    // Atualiza o total
    const qtd_total_el = document.getElementById("total_qtd");
    const preco_total_el = document.getElementById("total_preco");
    const qtd_total_txt = Number(qtd_total_el.textContent);
    const preco_total_txt = parseFloat(preco_total_el.textContent.replace("R$", "").replace(",", "."));

    const nova_qtd_total = qtd_total_txt - qtd_num;
    const novo_preco_total = preco_total_txt - valor_num;

    qtd_total_el.textContent = `${nova_qtd_total}`;
    preco_total_el.textContent = `R$${(novo_preco_total).toFixed(2).replace(".", ",")}`;

    // Remove do localStorage
    const salgados_armazenados = JSON.parse(localStorage.getItem('salgados_armazenados')) || [];
    const posicao = salgados_armazenados.findIndex(salgado => salgado.nome === nome_txt);

    if (posicao !== -1) {
        salgados_armazenados.splice(posicao, 1);
        localStorage.setItem('salgados_armazenados', JSON.stringify(salgados_armazenados));
    }

    const novo_total  = {
        nova_qtd_total,
        novo_preco_total
    }
    
    localStorage.setItem('total', JSON.stringify(novo_total));

    // Remove do DOM
    div.remove();
}

function removerTudo() {
    document.querySelector('.remover-background').style.display = 'none';
    const div = document.getElementById('itens_adicionados');
    const preco_total = document.getElementById("total_preco");
    const qtd_total = document.getElementById("total_qtd");

    preco_total.textContent = `R$0,00`;
    qtd_total.textContent = `0`;

    div.replaceChildren();
    localStorage.clear();
}

// Função para redirecionar para a página de pedidos verificando os salgados
function avancarPedido(pagina) {
    const salgados_armazenados = JSON.parse(localStorage.getItem('salgados_armazenados')) || [];
    
    if(salgados_armazenados){
        if(salgados_armazenados.length >= 1){
            window.location.href = pagina;
        }else{
            alert("Seu carrinho está vazio!")
        }
    }else{
        alert("Seu carrinho está vazio!")
    }
}