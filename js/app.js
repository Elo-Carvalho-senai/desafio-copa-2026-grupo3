// js/app.js

// =========================================================
// 1. CARREGAMENTO E ATUALIZAÇÃO DOS DADOS REAIS DA API
// =========================================================
async function inicializarPainel() {
    try {
        // Busca a lista completa de partidas reais cadastradas no servidor
        const partidas = await obterDadosDaCopa("/get/games");
        
        // -------------------------------------------------
        // LOGICA DO GOLFINHO: FILTRO DO PRÓXIMO JOGO REAL
        // -------------------------------------------------
        // Encontra o primeiro jogo da lista da FIFA cujo status NÃO seja 'finished'
        const proximoJogoReal = partidas.find(jogo => jogo.status !== 'finished') || partidas[0];

        if (proximoJogoReal) {
            const containerProximo = document.getElementById("proximo-jogo-container");
            
            if (containerProximo) {
                // Força letras minúsculas para ler o arquivo local correto da pasta do grupo
                const flagHome = proximoJogoReal.home_team_id ? proximoJogoReal.home_team_id.toLowerCase() : "un";
                const flagAway = proximoJogoReal.away_team_id ? proximoJogoReal.away_team_id.toLowerCase() : "un";
                
                // Formata a data vinda do banco de dados da API
                const dataJogo = proximoJogoReal.date ? new Date(proximoJogoReal.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'SHORT'}).toUpperCase() : "20 JUN";
                const horaJogo = proximoJogoReal.time || "22:00";
                const estadioJogo = proximoJogoReal.stadium_name || "SoFi Stadium - Los Angeles";

                // Injeta a estrutura exata do novo modelo de card sincronizado
                containerProximo.innerHTML = `
                    <span class="badge-title">🗓️ PRÓXIMO JOGO</span>
                    
                    <div class="confronto-layout-novo">
                        <img src="assets/bandeiras/${flagHome}.png" class="flag-medium" alt="">
                        <span class="texto-confronto-novo">
                            ${proximoJogoReal.home_team_name_en} x ${proximoJogoReal.away_team_name_en}
                        </span>
                        <img src="assets/bandeiras/${flagAway}.png" class="flag-medium" alt="">
                    </div>
                    
                    <div class="info-rodape-card-novo">
                        <div class="info-partida-nova">
                            <p class="data-hora-nova">${dataJogo} • ${horaJogo}</p>
                            <p class="estadio-novo">${estadioJogo}</p>
                        </div>
                        <button class="btn-seta-nova">➔</button>
                    </div>
                `;
            }
        }

        // -------------------------------------------------
        // ATUALIZAÇÃO DOS CONTADORES REAIS (WIDGETS 2 E 3)
        // -------------------------------------------------
        // Contador de partidas totais do cronograma oficial da FIFA
        const totalJogosContador = document.getElementById("qtd-jogos-hoje");
        if (totalJogosContador) {
            totalJogosContador.textContent = partidas.length || "104";
        }

        // Soma matemática inteligente de todos os gols reais marcados até o momento
        const totalGolsContador = document.getElementById("total-gols");
        if (totalGolsContador) {
            const somatorioGols = partidas.reduce((acumulador, jogo) => {
                return acumulador + (jogo.home_score || 0) + (jogo.away_score || 0);
            }, 0);
            totalGolsContador.textContent = somatorioGols;
        }

        // -------------------------------------------------
        // RENDERIZAÇÃO DO GRID INFERIOR (AO VIVO AGORA)
        // -------------------------------------------------
        if (typeof renderizarPartidas === "function") {
            renderizarPartidas(partidas);
        }

    } catch (erro) {
        console.error("Falha ao inicializar o painel com a API:", erro);
        if (typeof exibirMensagemErroUI === "function") {
            exibirMensagemErroUI("Não foi possível carregar ou sincronizar os dados em tempo real.");
        }
    }
}

// =========================================================
// 2. MOTOR DE NAVEGAÇÃO DE PÁGINA ÚNICA (SISTEMA DE ABAS SPA)
// =========================================================
function ativarNavegacaoMenu() {
    const linksMenu = document.querySelectorAll("#main-nav .nav-link");
    
    // Captura as seções do seu HTML pelas classes e IDs criados
    const secaoCardsSuperiores = document.getElementById("aba-inicio");
    const secaoTabelaNoticias = document.getElementById("aba-classificacao");
    const secaoJogosAoVivo = document.getElementById("jogos-container")?.parentElement;

    linksMenu.forEach(link => {
        link.addEventListener("click", (evento) => {
            evento.preventDefault(); // Impede o navegador de dar saltos ou recarregar a tela

            // Alterna a classe visual de link ativo para a barrinha verde acompanhar o clique
            linksMenu.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const textoBotao = link.textContent.trim().toLowerCase();

            // Gerencia a visibilidade das seções ocultando blocos específicos sem quebrar o layout
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

// =========================================================
// 3. DISPARADORES DE CARREGAMENTO INICIAL
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    inicializarPainel();   // Executa o consumo bruto e preenchimento da API
    ativarNavegacaoMenu(); // Ativa os ouvintes de clique das abas
});