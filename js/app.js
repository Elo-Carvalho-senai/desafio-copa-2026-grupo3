// js/app.js

async function inicializarPainel() {
    const jogosContainer = document.getElementById("jogos-container");
    jogosContainer.innerHTML = "<div class='loading-placeholder'>Buscando dados atualizados...</div>";

    try {
        // 1. Faz o fetch na rota de jogos mapeada na API
        const partidas = await obterDadosDaCopa("/get/games");
        
        // 2. Passa a lista para o renderizador desenhar os componentes na tela
        renderizarPartidas(partidas);
        
        // 3. Atualiza os marcadores numéricos superiores
        document.getElementById("qtd-jogos-hoje").textContent = "104"; // Total de jogos do torneio atual
        
        // Faz a soma inteligente de todos os gols da lista de partidas usando reduce
        const somaGols = partidas.reduce((acumulador, jogo) => {
            return acumulador + (jogo.home_score || 0) + (jogo.away_score || 0);
        }, 0);
        
        document.getElementById("total-gols").textContent = somaGols;

    } catch (erro) {
        // Critério técnico obrigatório: Tratamento amigável se a API der erro ou o token expirar
        exibirMensagemErroUI("Não foi possível carregar os dados da Copa. Verifique sua conexão ou se o Token JWT do grupo inserido no api.js está correto.");
    }
}

// Escuta o carregamento total do DOM antes de disparar o JavaScript
document.addEventListener("DOMContentLoaded", inicializarPainel);