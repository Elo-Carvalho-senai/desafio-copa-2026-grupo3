// js/app.js

// =========================================================
// 1. CARREGAMENTO E ATUALIZAÇÃO DOS DADOS REAIS DA API
// =========================================================
async function inicializarPainel() {
    try {
        const retornoAPI = await obterDadosDaCopa("/get/games");
        const partidas = Array.isArray(retornoAPI) ? retornoAPI : (retornoAPI.games || retornoAPI.data || Object.values(retornoAPI));

        // Filtro inteligente para encontrar a próxima partida agendada
        const proximoJogoReal = partidas.find(jogo => jogo.status !== 'finished') || partidas[0];

        if (proximoJogoReal) {
            const containerProximo = document.getElementById("proximo-jogo-container");
            
            if (containerProximo) {
                // CORREÇÃO DOS CAMINHOS: Ajustado de "assets/bandeiras/" para "assets/flags/"
                const flagHome = proximoJogoReal.home_team_id ? proximoJogoReal.home_team_id.toLowerCase() : "un";
                const flagAway = proximoJogoReal.away_team_id ? proximoJogoReal.away_team_id.toLowerCase() : "un";
                
                // Mapeia siglas específicas para arquivos criados localmente pelo grupo
                const nomeFlagHome = flagHome === "br" ? "brasil" : (flagHome === "ht" ? "haiti" : flagHome);
                const nomeFlagAway = flagAway === "br" ? "brasil" : (flagAway === "ht" ? "haiti" : flagAway);

                const dataJogo = proximoJogoReal.date ? new Date(proximoJogoReal.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'}).toUpperCase() : "20 JUN";
                const horaJogo = proximoJogoReal.time || "22:00";
                const estadioJogo = proximoJogoReal.stadium_name || "SoFi Stadium - Los Angeles";

                // CORREÇÃO DO ÍCONE: Ajustado de "assets/calendario-icon.png" para "assets/img-cards/calendario.png"
                containerProximo.innerHTML = `
                    <span class="badge-title"><img src="assets/img-cards/calendario.png" class="card-title-icon" alt=""> PRÓXIMO JOGO</span>
                    
                    <div class="confronto-layout-novo">
                        <img src="assets/flags/${nomeFlagHome}.png" class="flag-medium" alt="">
                        <span class="texto-confronto-novo">
                            ${proximoJogoReal.home_team_name_en} x ${proximoJogoReal.away_team_name_en}
                        </span>
                        <img src="assets/flags/${nomeFlagAway}.png" class="flag-medium" alt="">
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

        // Atualização do contador do Card 2 (Jogos Hoje / Total)
        const totalJogosContador = document.getElementById("qtd-jogos-hoje");
        if (totalJogosContador) {
            totalJogosContador.textContent = partidas.length || "104";
        }

        // CORREÇÃO DOS GOLS: Soma de inteiros matemáticos pura
        const totalGolsContador = document.getElementById("total-gols");
        if (totalGolsContador) {
            const somatorioGols = partidas.reduce((acumulador, jogo) => {
                const golsHome = Number(jogo.home_score) || 0;
                const golsAway = Number(jogo.away_score) || 0;
                return acumulador + golsHome + golsAway;
            }, 0);
            totalGolsContador.textContent = somatorioGols;
        }

        // Chamar a CazéTV para gerenciar de forma limpa o container de transmissões
        await carregarCazeTVNoPainel();

    } catch (erro) {
        console.error("Falha ao inicializar o painel com a API:", erro);
        if (typeof exibirMensagemErroUI === "function") {
            exibirMensagemErroUI("Não foi possível carregar os dados em tempo real.");
        }
    }
}

// =========================================================
// 2. MOTOR DE NAVEGAÇÃO DE PÁGINA ÚNICA (SPA) — TELA GRUPOS
// =========================================================
function ativarNavegacaoMenu() {
    const linksMenu = document.querySelectorAll("#main-nav .nav-link, .navbar nav a");
    
    const secaoCardsSuperiores = document.querySelector(".hero")?.parentElement; 
    const secaoTabelaNoticias = document.getElementById("aba-classificacao");
    const secaoJogosAoVivo = document.getElementById("jogos-container")?.parentElement;
    const telaGrupos = document.getElementById("secao-grupos");

    linksMenu.forEach(link => {
        link.addEventListener("click", (evento) => {
            evento.preventDefault(); 

            linksMenu.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const textoBotao = link.textContent.trim().toLowerCase();

            if (textoBotao === "início") {
                document.querySelector(".hero")?.style.removeProperty("display");
                document.querySelector(".widgets-grid")?.style.removeProperty("display");
                if (secaoTabelaNoticias) secaoTabelaNoticias.style.display = "flex";
                if (secaoJogosAoVivo) secaoJogosAoVivo.style.display = "block";
                if (telaGrupos) telaGrupos.style.display = "none";
            } 
            else if (textoBotao === "grupos" || textoBotao === "classificação") {
                document.querySelector(".hero")?.style.setProperties ? null : document.querySelector(".hero").style.display = "none";
                const widgets = document.querySelector(".widgets-grid");
                if (widgets) widgets.style.display = "none";
                
                if (secaoTabelaNoticias) secaoTabelaNoticias.style.display = "none";
                if (secaoJogosAoVivo) secaoJogosAoVivo.style.display = "none";
                
                if (telaGrupos) {
                    telaGrupos.style.display = "block";
                    telaGrupos.classList.add("active");
                }
                buscarEExibirTodosOsGrupos();
            }
        });
    });
}

// 📦 CARREGA OS 12 GRUPOS DA FIFA COM OS PAÍSES DELES
async function buscarEExibirTodosOsGrupos() {
    const gridGrupos = document.getElementById("grid-todos-grupos");
    if (!gridGrupos) return;

    gridGrupos.innerHTML = "<div class='loading-placeholder'>Buscando grupos oficiais da FIFA...</div>";

    try {
        const dadosGrupos = await obterDadosDaCopa("/get/groups");
        gridGrupos.innerHTML = ""; 

        dadosGrupos.forEach(grupo => {
            const card = document.createElement("div");
            card.className = "mini-card-grupo";

            let listaTimesHTML = `<ul class="lista-times-grupo">`;

            grupo.teams.forEach(time => {
                const flagTime = time.id ? time.id.toLowerCase() : "un";
                // CORREÇÃO DO CAMINHO: Ajustado para usar pasta real local "assets/flags/"
                const nomeFlagLocal = flagTime === "br" ? "brasil" : (flagTime === "mx" ? "mexico" : flagTime);

                listaTimesHTML += `
                    <li>
                        <img src="assets/flags/${nomeFlagLocal}.png" class="flag-small" onerror="this.src='https://flagcdn.com/w40/${flagTime}.png'" alt="">
                        <span>${time.name_en || 'A definir'}</span>
                    </li>
                `;
            });

            listaTimesHTML += `</ul>`;

            card.innerHTML = `
                <h3>GRUPO ${grupo.name}</h3>
                ${listaTimesHTML}
            `;
            gridGrupos.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao listar os 12 grupos:", erro);
        gridGrupos.innerHTML = "<p style='text-align:center; color:red;'>Erro ao carregar as chaves.</p>";
    }
}

// 🟢 CENTRALIZADOR DE CHAMADA DA CAZÉTV
async function carregarCazeTVNoPainel() {
    const containerJogos = document.getElementById("jogos-container"); 
    if (!containerJogos) return;

    try {
        // 1. Busca transmissões tratadas da CazéTV via api.js
        const partidasCazeTV = await buscarPartidasAPI();
        
        // 2. Executa a montagem limpa dos cards na tela
        renderizarPartidas(partidasCazeTV);
    } catch (erro) {
        console.error("Erro ao integrar com o YouTube:", erro);
    }
}

// INITIALIZER ÚNICO E ORGANIZADO
document.addEventListener("DOMContentLoaded", () => {
    inicializarPainel();   
    ativarNavegacaoMenu(); 
});