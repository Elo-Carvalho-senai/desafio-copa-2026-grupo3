// js/render.js

function renderizarPartidas(partidas) {
    const container = document.getElementById("jogos-container");
    if (!container) return;
    
    container.innerHTML = ""; // Limpa a mensagem de carregamento

    if (!partidas || partidas.length === 0) {
        container.innerHTML = "<p>Nenhuma partida encontrada no momento.</p>";
        return;
    }

    // Renderiza as 3 primeiras partidas para a home
    partidas.slice(0, 3).forEach(jogo => {
        const card = document.createElement("div");
        card.className = "card card-jogo";
        
        // Garante letras minúsculas para bater com o nome do arquivo salvo por vocês
        const flagHome = jogo.home_team_id ? jogo.home_team_id.toLowerCase() : "un";
        const flagAway = jogo.away_team_id ? jogo.away_team_id.toLowerCase() : "un";

        // CORREÇÃO: Removido totalmente o flagcdn e apontado para a pasta local assets/bandeiras/
        card.innerHTML = `
            <span class="grupo-label">PARTIDA ${jogo.id}</span>
            <div class="placar-container">
                <div class="time-linha">
                    <img src="assets/bandeiras/${flagHome}.png" class="flag-small" alt="">
                    <span>${jogo.home_team_name_en || 'A definir'}</span>
                    <span class="bold">${jogo.home_score ?? 0}</span>
                </div>
                <div class="placar-separador">-</div>
                <div class="time-linha">
                    <span class="bold">${jogo.away_score ?? 0}</span>
                    <span>${jogo.away_team_name_en || 'A definir'}</span>
                    <img src="assets/bandeiras/${flagAway}.png" class="flag-small" alt="">
                </div>
            </div>
            <span class="tempo-jogo">${jogo.status === 'finished' ? 'ENCERRADO' : 'AGENDADO'}</span>
        `;
        container.appendChild(card);
    });
}

function exibirMensagemErroUI(mensagem) {
    const container = document.getElementById("jogos-container");
    if (!container) return;
    
    container.innerHTML = `
        <div class="erro-box" style="padding: 20px; border: 1px solid #fca5a5; background-color: #fef2f2; border-radius: 12px; text-align: center; color: #991b1b; width: 100%;">
            <p style="margin-bottom: 12px; font-weight: 500;">⚠️ ${mensagem}</p>
            <button onclick="inicializarPainel()" style="background-color: #991b1b; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold;">Tentar Novamente</button>
        </div>
    `;
}