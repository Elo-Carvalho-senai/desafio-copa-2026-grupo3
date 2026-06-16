// js/render.js

// Desenha a lista de partidas na tela
function renderizarPartidas(partidas) {
    const container = document.getElementById("jogos-container");
    container.innerHTML = ""; // Limpa a mensagem de carregando

    if (!partidas || partidas.length === 0) {
        container.innerHTML = "<p>Nenhuma partida encontrada no momento.</p>";
        return;
    }

    // Pega as primeiras 3 partidas para moldar o layout da imagem
    partidas.slice(0, 3).forEach(jogo => {
        const card = document.createElement("div");
        card.className = "card card-jogo";
        
        // Pega os IDs dos times para gerar o link da bandeira (ex: "br", "fr")
        const flagHome = jogo.home_team_id ? jogo.home_team_id.toLowerCase() : "un";
        const flagAway = jogo.away_team_id ? jogo.away_team_id.toLowerCase() : "un";

        card.innerHTML = `
            <span class="grupo-label">PARTIDA ${jogo.id}</span>
            <div class="placar-container">
                <div class="time-linha">
                    <img src="https://flagcdn.com{flagHome}.png" class="flag-small" alt="">
                    <span>${jogo.home_team_name_en || 'A definir'}</span>
                    <span class="gols-marcador">${jogo.home_score ?? 0}</span>
                </div>
                <div class="placar-separador">-</div>
                <div class="time-linha">
                    <span class="gols-marcador">${jogo.away_score ?? 0}</span>
                    <span>${jogo.away_team_name_en || 'A definir'}</span>
                    <img src="https://flagcdn.com{flagAway}.png" class="flag-small" alt="">
                </div>
            </div>
            <span class="tempo-jogo">${jogo.status === 'finished' ? 'ENCERRADO' : 'AGENDADO'}</span>
        `;
        container.appendChild(card);
    });
}

// Mostra uma mensagem amigável na tela se a API cair
function exibirMensagemErroUI(mensagem) {
    const container = document.getElementById("jogos-container");
    container.innerHTML = `
        <div class="erro-box">
            <p>⚠️ ${mensagem}</p>
            <button onclick="inicializarPainel()">Tentar Novamente</button>
        </div>
    `;
}