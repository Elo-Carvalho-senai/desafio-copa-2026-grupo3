# 🏆 Registro de Engenharia de Prompt e Uso de IA — Grupo Gossip Cup

Este documento cumpre o requisito obrigatório de documentação do uso de Inteligência Artificial como ferramenta de apoio no desenvolvimento do Desafio Copa do Mundo 2026. Abaixo estão listados os prompts utilizados, as soluções sugeridas pela IA e as modificações críticas que nosso grupo aplicou para garantir a qualidade do projeto.

---

## 🛠️ 1. Arquitetura do Projeto e Tratamento de Estados (Clean Code)

* **Contexto/Necessidade:** Precisávamos estruturar os arquivos de forma organizada para evitar o acúmulo de códigos em um arquivo único e garantir que a tela não ficasse travada ou em branco caso a API falhasse ou demorasse para responder.
* **Prompt Utilizado:** 
  > "Atue como um Arquiteto de Software Front-end especialista. Crie uma estrutura de arquivos limpa utilizando apenas HTML, CSS e JavaScript puro para um dashboard de esportes. Além disso, estruture um esqueleto avançado utilizando a Fetch API que trate timeouts de rede e erros como 401 e 429, separando a lógica de requisição da lógica de desenho na tela."
* **O que a IA sugeriu:** Sugeriu a divisão do projeto em pastas (`css/`, `js/`), separando os scripts em `api.js` (com `AbortController` para o timeout), `render.js` (manipulação do DOM) e `app.js` (inicializador), além de um arquivo `feedback.css` focado em gerenciar estados visuais de erro e carregamento (*skeletons*).
* **O que mudamos/rejeitamos e por quê:** Aceitamos a arquitetura 100% por ser extremamente aderente às boas práticas do Clean Code. Customizamos as funções de erro para injetar um botão de "Tentar Novamente" dinâmico na interface, permitindo que o usuário refaça a requisição sem precisar recarregar a página inteira.

---

## 🎨 2. Estilização Baseada no Manual de Marca (Identidade Visual)

* **Contexto/Necessidade:** Recebemos o manual de marca da Gossip Cup com uma paleta de cores específica (#F8F8F5, #6FAF8F, #2D6A4F, #DDB86A) e fontes obrigatórias (Poppins para títulos e Inter para textos). Precisávamos aplicar isso ao layout base sem quebrar o Grid.
* **Prompt Utilizado:** 
  > "Utilizando a estrutura HTML anterior, crie um arquivo CSS moderno usando propriedades flexbox e CSS grid para simular cartões de placar lado a lado. Eu preciso que você crie variáveis CSS (:root) com as cores hexadecimais: #F8F8F5 para fundo, #6FAF8F e #2D6A4F para os tons de verde, e #DDB86A para os detalhes dourados. Importe as fontes Poppins e Inter diretamente do Google Fonts."
* **O que a IA sugeriu:** Um arquivo CSS modular estruturado com `:root`, utilizando flexbox para o alinhamento interno dos placares e `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))` para que os cards fiquem responsivos de forma automática em qualquer tamanho de tela.
* **O que mudamos/rejeitamos e por quê:** Ajustamos o comportamento da logo no cabeçalho. A IA havia sugerido pintar toda a marca de uma cor só, mas nós alteramos o HTML adicionando uma tag `<span>` para fazer com que a palavra "GOSSIP" ficasse em verde escuro e a palavra "CUP" ficasse em dourado, replicando fielmente a variação oficial fornecida no manual de identidade visual.

---

## 🧙‍♂️ 3. Automatização de Bandeiras sem Download (Otimização)

* **Contexto/Necessidade:** O endpoint de jogos da API retorna os identificadores de cada seleção (ex: "br", "co", "pt"). Inicialmente, pensamos em baixar os arquivos de imagem de todas as 48 seleções participantes, o que geraria um trabalho manual massivo e pesaria o repositório.
* **Prompt Utilizado:** 
  > "Estou consumindo uma API de futebol que me devolve o ID do país em minúsculas (ex: 'br' para Brasil). Como posso renderizar as bandeiras redondas na tela de forma automática via JavaScript sem precisar baixar os arquivos de imagem de todos os países para dentro do meu projeto?"
* **O que a IA sugeriu:** Apresentou a existência do serviço gratuito de CDN pública **Flagcdn**. Mostrou como mapear a URL `https://flagcdn.com{codigoPais}.png` direto no método construtor do DOM e sugeriu usar a propriedade CSS `border-radius: 50%` com `object-fit: cover` para garantir que qualquer proporção de imagem ficasse em formato de círculo perfeito.
* **O que mudamos/rejeitamos e por quê:** Adotamos a integração com a API Flagcdn pois reduziu o peso do projeto para quase zero. No entanto, adicionamos uma validação extra (operador ternário) no JavaScript: caso a API da Copa retorne um campo vazio ou nulo (jogos onde as seleções ainda não foram definidas na tabela), o código injeta a sigla `"un"` automaticamente, renderizando a bandeira das Nações Unidas como um substituto amigável (*fallback*) para evitar quebras visuais.

---

### 🛡️ 4. Tratamento de Timeouts e Mock de Contingência (Resiliência)
* **Contexto/Necessidade:** Durante os testes, o servidor gratuito da API (`worldcup26.ir`) apresentou instabilidades e erros de `net::ERR_CONNECTION_TIMED_OUT`, travando as requisições assíncronas do nosso site.
* **Prompt Utilizado:** "Como implementar um AbortController na Fetch API com JavaScript puro para capturar timeouts de conexão e ativar uma lista de dados substituta (mock local de contingência) para o site não ficar em branco caso o servidor caia?"
* **Solução e Adaptação Humana:** Criamos uma barreira de proteção com limite de 4 segundos. Caso a API não responda a tempo, nosso script intercepta o erro e injeta um array com a estrutura exata das chaves do banco de dados oficial (como `home_team_name_en` e `pts`), garantindo que a interface mude de aba e renderize os grupos locais perfeitamente mesmo que o servidor esteja offline no momento da apresentação.


### 📈 Conclusão do Grupo
A Inteligência Artificial funcionou como um copiloto técnico de alta performance. Ela acelerou a criação da casca visual repetitiva (CSS) e nos apresentou caminhos otimizados de arquitetura que economizaram horas de trabalho braçal (como o uso da API de bandeiras). O papel do grupo foi o de arquitetar a experiência, validar as respostas para garantir que nenhuma biblioteca externa proibida fosse usada e garantir a fidelidade estética ao manual de marca.