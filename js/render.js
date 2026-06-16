// js/render.js
function renderizarPartidas(partidas) {
    const container = document.getElementById("jogos-container");
    container.innerHTML = ""; 

    if (!partidas || partidas.length === 0) {
        container.innerHTML = "<p>Nenhuma partida encontrada no momento.</p>";
        return;
    }

    partidas.slice(0, 3).forEach(jogo => {
        const card = document.createElement("div");
        card.className = "card card-jogo"; // Usa suas classes originais dos cards
        
        const flagHome = jogo.home_team_id ? jogo.home_team_id.toLowerCase() : "un";
        const flagAway = jogo.away_team_id ? jogo.away_team_id.toLowerCase() : "un";

        card.innerHTML = `
            <span class="grupo-label">GRUPO ${jogo.id}</span>
            <div class="placar-container">
                <div class="time-linha">
                    <img src="https://flagcdn.com{flagHome}.png" class="flag-small" alt="">
                    <span>${jogo.home_team_name_en || 'A definir'}</span>
                    <span class="bold">${jogo.home_score ?? 0}</span>
                </div>
                <div class="placar-separador">-</div>
                <div class="time-linha">
                    <span class="bold">${jogo.away_score ?? 0}</span>
                    <span>${jogo.away_team_name_en || 'A definir'}</span>
                    <img src="https://flagcdn.com{flagAway}.png" class="flag-small" alt="">
                </div>
            </div>
            <span class="tempo-jogo">${jogo.status === 'finished' ? 'ENCERRADO' : 'AGENDADO'}</span>
        `;
        container.appendChild(card);
    });
}