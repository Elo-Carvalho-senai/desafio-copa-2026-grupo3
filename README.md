# Copa do Mundo 2026

## Descrição

Projeto desenvolvido para o desafio "Copa do Mundo 2026 — Front-end com IA".

A aplicação consome dados reais da API World Cup 2026 e exibe informações sobre seleções, grupos, partidas e estádios da Copa do Mundo de 2026.

O objetivo do projeto é praticar o consumo de APIs utilizando HTML, CSS e JavaScript puro, além de documentar o uso da Inteligência Artificial durante o desenvolvimento.

---

## Funcionalidades

* Listagem das seleções participantes da Copa do Mundo 2026.
* Visualização dos grupos e classificação.
* Consulta das partidas da competição.
* Exibição dos estádios utilizados no torneio.
* Tratamento de erros para falhas de conexão e respostas inválidas da API.
* Interface responsiva e intuitiva.

---

## Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Fetch API
* API World Cup 2026

---

## Estrutura do Projeto

```text
copa-2026/
│
├── index.html
├── css/
│   └── style.css
│
├── js/
│   ├── api.js
│   ├── ui.js
│   └── app.js
│
├── README.md
└── PROMPTS.md
```

---

## Como Executar

1. Clone o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

2. Abra a pasta do projeto.

3. Insira o token JWT gerado pela API no arquivo JavaScript responsável pelas requisições.

4. Abra o arquivo `index.html` em seu navegador.

---

## Consumo da API

API utilizada:

https://worldcup26.ir

Documentação:

https://worldcup26.ir/api-docs/

Endpoints utilizados:

* GET /get/teams
* GET /get/groups
* GET /get/games
* GET /get/stadiums

---

## Tratamento de Erros

A aplicação realiza tratamento para:

* Falhas de conexão.
* Token inválido ou expirado.
* Respostas de erro da API.
* Problemas temporários de indisponibilidade do serviço.

Sempre que ocorre um erro, uma mensagem amigável é exibida ao usuário.

---

## Integrantes

* Isadora Aquino Moraes
* Maria Fernanda Bighi Siqueira
* Maria Eloisa de Carvalho Silva
* Raissa dos Santos Fernandes

---

## Uso de Inteligência Artificial

A Inteligência Artificial foi utilizada como ferramenta de apoio para:

* Estruturação do projeto.
* Sugestões de código.
* Organização dos arquivos.
* Criação da documentação.
* Correção e melhoria do tratamento de erros.

Todos os prompts utilizados estão documentados no arquivo `PROMPTS.md`.
