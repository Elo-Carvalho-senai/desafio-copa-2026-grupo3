// js/api.js
const API_URL = "https://worldcup26.ir";
const TOKEN = "SEU_TOKEN_AQUI"; // Certifique-se de manter o token do grupo aqui

async function obterDadosDaCopa(endpoint) {
    try {
        // Define um limite de tempo (timeout) de 4 segundos para a API responder
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const resposta = await fetch(`${API_URL}${endpoint}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!resposta.ok) {
            throw new Error(`Erro na API: Status ${resposta.status}`);
        }

        return await resposta.json();
    } catch (erro) {
        console.warn(`[Aviso] Falha na API no endpoint ${endpoint}. Ativando plano de contingência acadêmico.`);
        
        // 🛡️ BANCO DE DADOS DE EMERGÊNCIA (MOCK LOCAL CASO A API CAIA)
        if (endpoint === "/get/games") {
            return [
                { id: 1, home_team_id: "mx", home_team_name_en: "Mexico", home_score: 2, away_team_id: "za", away_team_name_en: "South Africa", away_score: 1, status: "finished", date: "2026-06-20", time: "22:00", stadium_name: "SoFi Stadium - Los Angeles" },
                { id: 2, home_team_id: "us", home_team_name_en: "USA", home_score: 3, away_team_id: "ca", away_team_name_en: "Canada", away_score: 2, status: "finished" },
                { id: 3, home_team_id: "br", home_team_name_en: "Brazil", home_score: 4, away_team_id: "ht", away_team_name_en: "Haiti", away_score: 0, status: "scheduled" }
            ];
        }
        
        if (endpoint === "/get/groups") {
            return [
                { name: "A", teams: [{ id: "mx", name_en: "Mexico", mp: 1, gd: 1, pts: 3 }, { id: "za", name_en: "South Africa", mp: 1, gd: -1, pts: 0 }] },
                { name: "B", teams: [{ id: "us", name_en: "USA", mp: 1, gd: 1, pts: 3 }, { id: "ca", name_en: "Canada", mp: 1, gd: -1, pts: 0 }] },
                { name: "G", teams: [{ id: "br", name_en: "Brazil", mp: 0, gd: 0, pts: 0 }, { id: "ht", name_en: "Haiti", mp: 0, gd: 0, pts: 0 }] }
            ];
        }

        throw erro;
    }
}