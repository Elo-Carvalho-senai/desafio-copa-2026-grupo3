// js/ui.js

/**
 * Renderiza as partidas em formato de mini-cards verticais integrados à CazéTV
 * @param {Array} partidas - Lista de objetos de jogos tratados vindos do api.js
 */
function renderizarPartidas(partidas) {
    const container = document.getElementById("jogos-container");
    if (!container) return;
    
    // Limpa placeholders de carregamento
    container.innerHTML = ""; 

    if (!partidas || partidas.length === 0) {
        container.innerHTML = `
            <div class="card-jogo" style="grid-column: 1 / -1; padding: 30px; text-align: center; width:100%;">
                <span class="grupo-label">Aviso</span>
                <p style="color: #64748b; font-weight: 500; margin: 10px 0;">Nenhum evento esportivo ao vivo detectado agora.</p>
                <span class="status-badge status-encerrado" style="margin-top: 10px;">Aguardando Próxima Transmissão</span>
            </div>
        `;
        return;
    }

    // Renderiza os cards estruturados na seção "Ao Vivo Agora"
    partidas.slice(0, 3).forEach(jogo => {
        const card = document.createElement("div");
        card.className = "card card-jogo";
        card.style.cursor = "pointer";
        
        // Evento de clique para redirecionar para o canal ou transmissão específica
        card.onclick = () => {
            if (jogo.video_id === "cazetv") {
                window.open(`https://www.youtube.com/@CazeTV`, '_blank');
            } else if (jogo.video_id) {
                window.open(`https://www.youtube.com/watch?v=${jogo.video_id}`, '_blank');
            }
        };
        
        const flagHome = jogo.home_team_id ? jogo.home_team_id.toLowerCase() : "un";
        const flagAway = jogo.away_team_id ? jogo.away_team_id.toLowerCase() : "un";

        const statusTexto = jogo.status === 'aovivo' ? 'AO VIVO NA CAZÉTV' : 'REPRISE / ENCERRADO';
        const statusClasse = jogo.status === 'aovivo' ? 'status-aovivo' : 'status-encerrado';

        // Puxa as bandeiras mundiais em alta definição via FlagCDN para os cards
        const urlBandeiraHome = flagHome === "un" ? "https://flagcdn.com/w80/un.png" : `https://flagcdn.com/w80/${flagHome}.png`;
        const urlBandeiraAway = flagAway === "un" ? "https://flagcdn.com/w80/un.png" : `https://flagcdn.com/w80/${flagAway}.png`;

        card.innerHTML = `
            <span class="grupo-label">${jogo.group_id}</span>
            
            <div class="mini-grid-confronto">
                <div class="mini-time-bloco">
                    <img src="${urlBandeiraHome}" class="flag-mini-card" alt="${jogo.home_team_name_en}">
                    <span class="mini-time-nome">${jogo.home_team_name_en}</span>
                </div>

                <div class="mini-placar-bloco">
                    <span class="mini-gols">${jogo.home_score}</span>
                    <span class="mini-separador">-</span>
                    <span class="mini-gols">${jogo.away_score}</span>
                </div>

                <div class="mini-time-bloco">
                    <img src="${urlBandeiraAway}" class="flag-mini-card" alt="${jogo.away_team_name_en}">
                    <span class="mini-time-nome">${jogo.away_team_name_en}</span>
                </div>
            </div>

            <div class="status-container-wrapper">
                <span class="status-badge ${statusClasse}">${statusTexto}</span>
            </div>
        `;
        container.appendChild(card);
    });
}