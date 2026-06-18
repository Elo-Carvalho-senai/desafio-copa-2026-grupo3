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
                const flagHome = proximoJogoReal.home_team_id ? proximoJogoReal.home_team_id.toLowerCase() : "un";
                const flagAway = proximoJogoReal.away_team_id ? proximoJogoReal.away_team_id.toLowerCase() : "un";
                
                const dataJogo = proximoJogoReal.date ? new Date(proximoJogoReal.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'SHORT'}).toUpperCase() : "20 JUN";
                const horaJogo = proximoJogoReal.time || "22:00";
                const estadioJogo = proximoJogoReal.stadium_name || "SoFi Stadium - Los Angeles";

                containerProximo.innerHTML = `
                    <span class="badge-title"><img src="assets/calendario-icon.png" class="card-title-icon" alt=""> PRÓXIMO JOGO</span>
                    
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

        // Atualização do contador do Card 2
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

        // Renderização dos cards inferiores do ui.js
        if (typeof renderizarPartidas === "function") {
            renderizarPartidas(partidas);
        }

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
    
    const secaoCardsSuperiores = document.getElementById("aba-inicio");
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
                secaoCardsSuperiores?.classList.remove("secao-oculta");
                secaoTabelaNoticias?.classList.remove("secao-oculta");
                if (secaoJogosAoVivo) secaoJogosAoVivo.style.display = "block";
                telaGrupos?.classList.remove("active");
            } 
            else if (textoBotao === "grupos" || textoBotao === "classificação") {
                secaoCardsSuperiores?.classList.add("secao-oculta");
                secaoTabelaNoticias?.classList.add("secao-oculta");
                if (secaoJogosAoVivo) secaoJogosAoVivo.style.display = "none";
                
                // Ativa a tela de grupos limpa que você pediu
                telaGrupos?.classList.add("active");
                buscarEExibirTodosOsGrupos();
            }
        });
    });
}

// 📦 CARREGA OS 12 GRUPO DA FIFA COM OS PAÍSES DELES
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
                listaTimesHTML += `
                    <li>
                        <img src="assets/bandeiras/${flagTime}.png" class="flag-small" alt="">
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

// INITIALIZER
document.addEventListener("DOMContentLoaded", () => {
    inicializarPainel();   
    ativarNavegacaoMenu(); 
});