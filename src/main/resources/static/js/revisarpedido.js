document.addEventListener("DOMContentLoaded", carregarDadosCliente);

// Função para carregar automaticamente os dados do cliente
function carregarDadosCliente() {
    const token = localStorage.getItem('token');

    if (!token) {
        return;
    }

    fetch('http://localhost:8080/api/carregar-dados', {
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
        .then(usuario => {
            const nomeCliente = document.getElementById("nome_cliente");
            const celularCliente = document.getElementById("celular_cliente");
            const emailCliente = document.getElementById("email_cliente");

            nomeCliente.value = usuario.nome;
            celularCliente.value = usuario.celular;
            emailCliente.value = usuario.email

            nomeCliente.readOnly = true;
            celularCliente.readOnly = true;
            emailCliente.readOnly = true;
        })
        .catch(error => {
            console.error("Erro ao carregar os dados do usuário:", error);
        });
}