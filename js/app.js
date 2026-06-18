// js/app.js

// =========================================================
// 1. CARREGAMENTO E ATUALIZAÇÃO DOS DADOS REAIS DA API
// =========================================================
async function inicializarPainel() {
    try {
        // Busca o retorno bruto cadastrado no servidor
        const retornoAPI = await obterDadosDaCopa("/get/games");

        // 🧙‍♂️ MÁGICA DA CORREÇÃO: Verifica se a lista veio direto ou dentro de uma propriedade (ex: retornoAPI.games ou retornoAPI.data)
        // Caso a API mude, essa linha garante que 'partidas' seja SEMPRE uma lista/array puro
        const partidas = Array.isArray(retornoAPI) ? retornoAPI : (retornoAPI.games || retornoAPI.data || Object.values(retornoAPI));

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
                const dataJogo = proximoJogoReal.date ? new Date(proximoJogoReal.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'SHORT' }).toUpperCase() : "20 JUN";
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
        
        // Contador de partidas totais
        const totalJogosContador = document.getElementById("qtd-jogos-hoje");
        if (totalJogosContador) {
            totalJogosContador.textContent = partidas.length || "104";
        }

        // 🧙‍♂️ MÁGICA DA CORREÇÃO DOS GOLS: Converte os valores para Número antes de somar
        const totalGolsContador = document.getElementById("total-gols");
        if (totalGolsContador) {
            const somatorioGols = partidas.reduce((acumulador, jogo) => {
                // O Number() impede que os números fiquem grudados como texto
                const golsHome = Number(jogo.home_score) || 0;
                const golsAway = Number(jogo.away_score) || 0;
                return acumulador + golsHome + golsAway;
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

// Substitua a função carregarAbaGrupos dentro de js/app.js por esta completa:
async function carregarAbaGrupos() {
    const container = document.getElementById("todos-grupos-container");
    if (!container) return;

    // Injeta o estado visual de carregamento dinâmico amigável
    container.innerHTML = "<div class='loading-placeholder'>Buscando classificação oficial dos 12 grupos na API...</div>";

    try {
        // 1. Consome o endpoint real de grupos restrito por JWT
        const dadosGrupos = await obterDadosDaCopa("/get/groups");
        container.innerHTML = ""; // Limpa o carregando

        if (!dadosGrupos || dadosGrupos.length === 0) {
            container.innerHTML = "<p>Nenhum dado de classificação disponível no momento.</p>";
            return;
        }

        // 2. Passa limpando e organizando cada um dos grupos (De A até L)
        dadosGrupos.forEach(grupo => {
            const cardGrupo = document.createElement("div");
            cardGrupo.className = "card-grupo-tabela"; // Aplica o novo estilo em grid

            // Monta o cabeçalho estrutural da mini tabela do respectivo grupo
            let tabelaHTML = `
                <h3 class="titulo-grupo-api">GRUPO ${grupo.name}</h3>
                <table class="tabela-mini-grupo">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>SELEÇÃO</th>
                            <th class="text-center">J</th>
                            <th class="text-center">SG</th>
                            <th class="text-center">PTS</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            // 3. Organiza os times de dentro deste grupo baseado na classificação retornada
            // Caso a API traga os times desordenados, o sort garante que o de mais pontos fique no topo
            const timesOrdenados = grupo.teams.sort((a, b) => b.pts - a.pts);

            timesOrdenados.forEach((time, indice) => {
                // Força o ID em minúsculas para ler o arquivo da sua pasta local de bandeiras
                const codigoBandeiraLocal = time.id ? time.id.toLowerCase() : "un";

                tabelaHTML += `
                    <tr>
                        <td class="bold text-center">${indice + 1}</td>
                        <td>
                            <div class="celula-time-flex">
                                <img src="assets/bandeiras/${codigoBandeiraLocal}.png" class="flag-small" alt="">
                                <span>${time.name_en || 'A definir'}</span>
                            </div>
                        </td>
                        <td class="text-center">${time.mp || 0}</td>
                        <td class="text-center">${time.gd || 0}</td>
                        <td class="text-center pontos-destaque">${time.pts || 0}</td>
                    </tr>
                `;
            });

            // Fecha as tags da tabela e injeta o bloco completo dentro do grid geral
            tabelaHTML += `
                    </tbody>
                </table>
            `;

            cardGrupo.innerHTML = TableHTML = tabelaHTML;
            container.appendChild(cardGrupo);
        });

    } catch (erro) {
        console.error("Falha ao carregar tabelas dos grupos:", erro);
        container.innerHTML = `
            <p style='color:#991b1b; text-align:center; padding: 20px; background-color: #fef2f2; border-radius: 12px; width: 100%; font-weight: 500;'>
                ⚠️ Não foi possível sincronizar as tabelas de classificação com o servidor.
            </p>
        `;
    }
}


// =========================================================
// 3. DISPARADORES DE CARREGAMENTO INICIAL
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    inicializarPainel();   // Executa o consumo bruto e preenchimento da API
    ativarNavegacaoMenu(); // Ativa os ouvintes de clique das abas
});