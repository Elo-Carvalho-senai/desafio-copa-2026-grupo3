// js/app.js

// =========================================================
// 1. CARREGAMENTO E ATUALIZAÇÃO DOS DADOS REAIS DA API
// =========================================================
async function inicializarPainel() {
    try {
        const retornoAPI = await obterDadosDaCopa("/get/games");
        const partidas = Array.isArray(retornoAPI) ? retornoAPI : (retornoAPI.games || retornoAPI.data || Object.values(retornoAPI));

        // 🔥 MOTOR DINÂMICO: Procura o primeiro jogo que NÃO terminou ('finished') e que NÃO está ao vivo ('aovivo')
        // Se todos já tiverem acabado, ele pega o último jogo da lista por segurança.
        const proximoJogoReal = partidas.find(jogo => jogo.status !== 'finished' && jogo.status !== 'live' && jogo.status !== 'aovivo') || partidas[partidas.length - 1];

        if (proximoJogoReal) {
            const containerProximo = document.getElementById("proximo-jogo-container");
            
            if (containerProximo) {
                // Obtém as siglas dos países vindas da API (ex: "br", "mx", "us")
                const flagHome = proximoJogoReal.home_team_id ? proximoJogoReal.home_team_id.toLowerCase() : "un";
                const flagAway = proximoJogoReal.away_team_id ? proximoJogoReal.away_team_id.toLowerCase() : "un";
                
                // 🌐 SOLUÇÃO 100% ONLINE: Puxa as bandeiras direto da internet (FlagCDN) em média resolução (w160)
                const urlBandeiraHome = flagHome === "un" ? "https://flagcdn.com/w160/un.png" : `https://flagcdn.com/w160/${flagHome}.png`;
                const urlBandeiraAway = flagAway === "un" ? "https://flagcdn.com/w160/un.png" : `https://flagcdn.com/w160/${flagAway}.png`;

                // Formata a data de forma bonita (Ex: "20 JUN" ou baseado no que vier da API)
                let dataTexto = "A DEFINIR";
                if (proximoJogoReal.date) {
                    const partesData = proximoJogoReal.date.split('-'); // Trata o formato YYYY-MM-DD
                    if (partesData.length === 3) {
                        const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
                        const mesIndice = parseInt(partesData[1], 10) - 1;
                        dataTexto = `${partesData[2]} ${meses[mesIndice]}`;
                    }
                }
                
                const horaJogo = proximoJogoReal.time || "--:--";
                const estadioJogo = proximoJogoReal.stadium_name || "Estádio Oficial FIFA";

                // Injeta os dados REAIS e dinâmicos no card do topo
                containerProximo.innerHTML = `
                    <span class="badge-title">
                        <img src="assets/img-cards/calendario.png" class="card-title-icon" alt=""> 
                        PRÓXIMO JOGO DO TORNEIO
                    </span>
                    
                    <div class="confronto-layout-novo">
                        <img src="${urlBandeiraHome}" class="flag-medium" alt="${proximoJogoReal.home_team_name_en}" style="border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <span class="texto-confronto-novo">
                            ${proximoJogoReal.home_team_name_en} x ${proximoJogoReal.away_team_name_en}
                        </span>
                        <img src="${urlBandeiraAway}" class="flag-medium" alt="${proximoJogoReal.away_team_name_en}" style="border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    </div>
                    
                    <div class="info-rodape-card-novo">
                        <div class="info-partida-nova">
                            <p class="data-hora-nova">${dataTexto} • ${horaJogo}</p>
                            <p class="estadio-novo">${estadioJogo}</p>
                        </div>
                        <button class="btn-seta-nova">➔</button>
                    </div>
                `;
            }
        }

        // Atualização do contador do Card 2 (Total de Jogos)
        const totalJogosContador = document.getElementById("qtd-jogos-hoje");
        if (totalJogosContador) {
            totalJogosContador.textContent = partidas.length || "104";
        }

        // Soma de gols matemáticos pura
        const totalGolsContador = document.getElementById("total-gols");
        if (totalGolsContador) {
            const somatorioGols = partidas.reduce((acumulador, jogo) => {
                const golsHome = Number(jogo.home_score) || 0;
                const golsAway = Number(jogo.away_score) || 0;
                return acumulador + golsHome + golsAway;
            }, 0);
            totalGolsContador.textContent = somatorioGols;
        }

        // Alimenta os cards da CazéTV na seção de lives
        await carregarCazeTVNoPainel();

    } catch (erro) {
        console.error("Falha ao inicializar o painel com a API:", erro);
    }
}

// =========================================================
// 2. MOTOR DE NAVEGAÇÃO DE PÁGINA ÚNICA (SPA) — TELA GRUPOS
// =========================================================
function ativarNavegacaoMenu() {
    const linksMenu = document.querySelectorAll("#main-nav .nav-link, .navbar nav a");
    
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
                const hero = document.querySelector(".hero");
                if (hero) hero.style.display = "none";
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
                // Usa 100% FlagCDN da internet para a lista de grupos também!
                const urlFlagGrupo = flagTime === "un" ? "https://flagcdn.com/w40/un.png" : `https://flagcdn.com/w40/${flagTime}.png`;

                listaTimesHTML += `
                    <li>
                        <img src="${urlFlagGrupo}" class="flag-small" alt="" style="border-radius:2px;">
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
        const partidasCazeTV = await buscarPartidasAPI();
        renderizarPartidas(partidasCazeTV);
    } catch (erro) {
        console.error("Erro ao integrar com o YouTube:", erro);
    }
}

// INITIALIZER
document.addEventListener("DOMContentLoaded", () => {
    inicializarPainel();   
    ativarNavegacaoMenu(); 
});