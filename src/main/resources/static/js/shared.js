function cadastrarUsuario(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const email = document.getElementById("emailCadastro").value;
    const nome = document.getElementById("nome").value;
    const celular = document.getElementById("celular").value;
    const senha = document.getElementById("password").value;

    const usuario = { email, nome, celular, senha };

    fetch('http://localhost:8080/api/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
    .then(response => {
        if (response.ok) {
            alert("Usuário cadastrado com sucesso!");
            window.location.href = "index.html"; // Redireciona para index.html
        } else {
            response.json().then(data => alert("Erro: " + data.error));
        }
    })
    .catch(error => console.error("Erro:", error));
}

function logarUsuario(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("passwordLogin").value;

    const usuario = { email, senha };

    fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Retorna o JSON para ser usado no próximo bloco
        } else {
            return response.json().then(data => {
                throw new Error(data.error || "Erro ao fazer login");
            });
        }
    })
    .then(data => {
        alert("Login realizado com sucesso! Bem vindo, " + data.nome);
        localStorage.setItem("token", data.token); // Salva o token no localStorage
        window.location.href = "index.html"; // Redireciona para a página inicial
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao fazer login: " + error.message);
    });
}

// Função para verificar se o usuário está logado
function verificarAutenticacao() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.log("Token não encontrado. Usuário não está logado.");
        atualizarBotaoAutenticacao(false);
        return;
    }

    console.log("Token encontrado:", token);

    // Valida o token com a API
    fetch('http://localhost:8080/api/recurso-protegido', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
        .then(response => {
            console.log("Resposta da API:", response);

            if (response.status === 401) {
                // Token inválido ou expirado
                throw new Error("Sessão expirada");
            }

            if (!response.ok) {
                throw new Error("Erro ao verificar autenticação");
            }

            return response.json();
        })
        .then(data => {
            console.log("Dados recebidos:", data);

            if (data.loggedIn) {
                // Usuário autenticado
                console.log("Usuário autenticado:", data);
                atualizarBotaoAutenticacao(true); // Atualiza o botão para "Sair"
            } else {
                // Token é inválido ou usuário não autenticado
                console.log("Usuário não está logado ou token inválido:", data.message);
                throw new Error("Sessão expirada"); // Força a entrada no fluxo do catch
            }
        })
        .catch(error => {
            console.error("Erro capturado:", error);

            if (error.message === "Sessão expirada") {
                // Token expirado ou inválido
                alert("Sua sessão expirou. Você será redirecionado para o início.");
                localStorage.removeItem('token'); // Remove o token expirado
                window.location.href = "index.html"; // Redireciona para o menu
            } else {
                console.error("Erro ao verificar autenticação:", error);
                atualizarBotaoAutenticacao(false); // Volta para "Entrar/Login"
            }
        });
}

// Função para atualizar o botão de autenticação
function atualizarBotaoAutenticacao(estaLogado) {
    const botao = document.getElementById('botaoAutenticacao');

    if (estaLogado) {
        botao.textContent = 'Sair';
        botao.onclick = sair; // Define a função para sair
    } else {
        botao.textContent = 'Entrar / Log In';
        botao.onclick = exibirPopUpLogin;
    }
}

// Função para sair
function sair() {
    localStorage.removeItem('token'); // Remove o token do Local Storage
    atualizarBotaoAutenticacao(false); // Atualiza o botão para "Entrar/Login"
    redirecionar('index.html'); // Redireciona para a página inicial, se necessário
}

// Chama a verificação de autenticação ao carregar a página
verificarAutenticacao();

// Função para redirecionar para a página escolhida
function redirecionar(pagina) {
    window.location.href = pagina;
}

// Função para carregar popups dinâmicas
function carregarPopups() {
    fetch('../html/popups.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar as popups.');
            }
            return response.text();
        })
        .then(html => {
            const container = document.createElement('div');
            container.innerHTML = html;
            document.body.appendChild(container); // Adiciona as popups no final do <body>
        })
        .catch(error => console.error('Erro ao carregar popups:', error));
}

// Chamar a função ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarPopups();
});

function exibirPopUpLogin() {
    document.body.style.overflow = 'hidden';
    const cabecalho = document.querySelector(".navbar");
    cabecalho.className = "navbar bg-body-tertiary";
    document.querySelector('.login-background').style.display = 'block';
}

function exibirPopUpCadastro() {
    document.body.style.overflow = 'hidden';
    document.querySelector('.login-background').style.display = 'none';
    document.querySelector('.cadastro-background').style.display = 'block';
}

function fecharLogin(){
    document.body.style.overflow = '';
    document.querySelector('.login-background').style.display = 'none';
    const cabecalho = document.querySelector(".navbar");
    cabecalho.className = "navbar bg-body-tertiary fixed-top";
}

function fecharCadastro(){
    document.body.style.overflow = '';
    document.querySelector('.cadastro-background').style.display = 'none';
    const cabecalho = document.querySelector(".navbar");
    cabecalho.className = "navbar bg-body-tertiary fixed-top";
}
        

