// js/app.js

async function inicializarPainel() {
    const jogosContainer = document.getElementById("jogos-container");
    jogosContainer.innerHTML = "<div class='loading-placeholder'>Buscando dados atualizados...</div>";

    try {
        // 1. Busca as partidas reais da API
        const partidas = await obterDadosDaCopa("/get/games");
        
        // 2. Manda desenhar na tela usando a função do render.js
        renderizarPartidas(partidas);
        
        // 3. Atualiza os contadores estáticos superiores com dados reais
        document.getElementById("qtd-jogos-hoje").textContent = "104"; // Total do torneio
        document.getElementById("total-gols").textContent = partidas.reduce((acc, jogo) => acc + (jogo.home_score || 0) + (jogo.away_score || 0), 0);

    } catch (erro) {
        // Se der qualquer erro (rede, token vencido), avisa o usuário sem quebrar a tela
        exibirMensagemErroUI("Não foi possível carregar os dados da Copa. Verifique sua conexão ou o Token JWT.");
    }
}

// Dispara a inicialização assim que a página carrega completamente
document.addEventListener("DOMContentLoaded", inicializarPainel);