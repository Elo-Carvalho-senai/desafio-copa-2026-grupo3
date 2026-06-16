// js/render.js

function renderizarPartidas(partidas) {
    const container = document.getElementById("jogos-container");
    container.innerHTML = ""; // Limpa a mensagem padrão de loading

    if (!partidas || partidas.length === 0) {
        container.innerHTML = "<div class='loading-placeholder'>Nenhum jogo encontrado na API para exibição.</div>";
        return;
    }

    // Filtra e pega os primeiros 3 jogos retornados para preencher o grid visual do layout
    partidas.slice(0, 3).forEach(jogo => {
        const card = document.createElement("div");
        card.className = "card card-jogo";
        
        // Se a API não trouxer um ID de time válido, define "un" (bandeira das Nações Unidas) como segurança
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

function exibirMensagemErroUI(mensagem) {
    const container = document.getElementById("jogos-container");
    container.innerHTML = `
        <div class="erro-box" style="padding: 20px; border: 1px solid #fca5a5; background-color: #fef2f2; border-radius: 12px; text-align: center; color: #991b1b; width: 100%;">
            <p style="margin-bottom: 12px; font-weight: 500;">⚠️ ${mensagem}</p>
            <button onclick="inicializarPainel()" style="background-color: #991b1b; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: bold;">Tentar Novamente</button>
        </div>
    `;
}