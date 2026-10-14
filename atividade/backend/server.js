// ROTAS:
// GET /api/esportes/aleatorio
// GET /api/esportes/:nome

// Importar o framework Express para criar o servidor
const express = require("express");
// Importar o CORS para permitir requisições de outros domínios (ex: frontend)
const cors = require("cors");
// Importa utilidades para trabalhar com caminhos de arquivos
const path = require("path");
// Importa o arquivo JSON que contém os esportes e fotos
const sports = require("./data/sports.json");

// Cria a aplicação Express
const app = express();
// Definir a porta onde o servidor irá rodar
const PORT = 3000;

// Habilitar o uso do CORS na aplicação
app.use(cors());

//=================================================
// SERVIR ARQUIVOS ESTÁTICOS
//=================================================

// Disponibiliza as imagens da pasta data/fotos no caminho /fotos
app.use(
  "/fotos",
  express.static(
    path.join(__dirname, "data/fotos"),
  ),
);

//=================================================
// FUNÇÃO AUXILIAR
//=================================================

// Função que recebe um array e retorna um item aleatório dele
function sortear(array) {
  const i = Math.floor(Math.random() * array.length);
  return array[i];
}

//================================
// ROTAS DA API
//================================

// ROTA 1 - Esporte aleatório
app.get("/api/esportes/aleatorio", (req, res) => {
  // Pega todas as fotos de todos os esportes em um único array
  const todasAsFotos = Object.values(sports).flat();

  // Sorteia uma foto aleatória
  const item = sortear(todasAsFotos);

  // Responde para o cliente em formato JSON
  res.json({
    status: "success",
    message: `http://localhost:${PORT}/fotos/${item}`,
  });
});

// ROTA 2 - Esporte por nome
app.get("/api/esportes/:nome", (req, res) => {
  // decodeURIComponent trata caracteres especiais e acentos enviados na URL (ex: v%C3%B4lei -> vôlei)
  const nome = decodeURIComponent(req.params.nome).toLowerCase();

  // Verifica se o esporte existe no arquivo JSON
  if (!sports[nome]) {
    return res.status(404).json({
      status: "error",
      message: `Esporte "${nome}" não encontrado.`,
    });
  }

  // Sorteia uma foto do esporte solicitado
  const item = sortear(sports[nome]);

  // Retorna a resposta em JSON
  res.json({
    status: "success",
    message: `http://localhost:${PORT}/fotos/${item}`,
  });
});

//======================================
// INICIA O SERVIDOR
//=====================================

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📂 Coloque as fotos manualmente em: data/fotos/`);
});