// js/api.js
const API_URL = "https://worldcup26.ir";
const TOKEN = "SEU_TOKEN_AQUI"; // Certifique-se de colar aqui o Token JWT que seu grupo copiou do Insomnia/Postman

async function obterDadosDaCopa(endpoint) {
    try {
        const resposta = await fetch(`${API_URL}${endpoint}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) {
            throw new Error(`Erro na API: Status ${resposta.status}`);
        }

        return await resposta.json();
    } catch (erro) {
        console.error("Erro na comunicação com a API:", erro);
        throw erro;
    }
}