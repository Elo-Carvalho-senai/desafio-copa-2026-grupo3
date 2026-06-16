// js/app.js

// 1. CARREGAMENTO DOS DADOS REAIS DA API DA FIFA
async function inicializarPainel() {
    try {
        const partidas = await obterDadosDaCopa("/get/games");
        
        // Renderiza os jogos dinâmicos na seção central
        renderizarPartidas(partidas);
        
        // Atualiza o contador de jogos totais/hoje
        document.getElementById("qtd-jogos-hoje").textContent = "104"; 
        
        // Soma inteligente de todos os gols reais do campeonato
        const totalGols = partidas.reduce((acc, jogo) => acc + (jogo.home_score || 0) + (jogo.away_score || 0), 0);
        document.getElementById("total-gols").textContent = totalGols;

    } catch (erro) {
        exibirMensagemErroUI("Não foi possível carregar os dados dinâmicos da API.");
    }
}

// 2. SISTEMA DE NAVEGAÇÃO DE PÁGINA ÚNICA (SPA)
function ativarNavegacaoMenu() {
    const linksMenu = document.querySelectorAll("#main-nav .nav-link");
    
    const secaoCardsSuperiores = document.getElementById("aba-inicio");
    const secaoTabelaNoticias = document.getElementById("aba-classificacao");
    const secaoJogosAoVivo = document.getElementById("jogos-container")?.parentElement;

    linksMenu.forEach(link => {
        link.addEventListener("click", (evento) => {
            evento.preventDefault(); 

            // Altera a classe visual ativa do link clicado
            linksMenu.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const textoBotao = link.textContent.trim().toLowerCase();

            // Gerencia a visibilidade das seções baseada no menu sem quebrar o layout
            if (textoBotao === "início") {
                secaoCardsSuperiores?.classList.remove("secao-oculta");
                secaoTabelaNoticias?.classList.remove("secao-oculta");
                if (secaoJogosAoVivo) secaoJogosAoVivo.style.display = "block";
            } 
            else if (textoBotao === "classificação" || textoBotao === "grupos") {
                secaoCardsSuperiores?.classList.add("secao-oculta");
                secaoTabelaNoticias?.classList.remove("secao-oculta");
                if (secaoJogosAoVivo) secaoJogosAoVivo.style.display = "none";
            } 
            else if (textoBotao === "jogos") {
                secaoCardsSuperiores?.classList.add("secao-oculta");
                secaoTabelaNoticias?.classList.add("secao-oculta");
                if (secaoJogosAoVivo) secaoJogosAoVivo.style.display = "block";
            }
            else if (textoBotao === "notícias") {
                secaoCardsSuperiores?.classList.add("secao-oculta");
                secaoTabelaNoticias?.classList.remove("secao-oculta");
                if (secaoJogosAoVivo) secaoJogosAoVivo.style.display = "none";
            }
        });
    });
}

// DISPARADORES DE CARREGAMENTO DO PROJETO
document.addEventListener("DOMContentLoaded", () => {
    inicializarPainel();   // Carrega as informações dinâmicas da API
    ativarNavegacaoMenu(); // Ativa os cliques e filtros do menu superior
});