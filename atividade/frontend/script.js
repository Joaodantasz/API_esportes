// =====================================
// FRONT - END = consome nossa API local
// =====================================

// =====================================
// ELEMENTOS DO HTML
// =====================================

const sportsImage = document.getElementById("sportsImage");
const sportsName = document.getElementById("sportsName");
const randomBtn = document.getElementById("randomBtn");
const searchBtn = document.getElementById("searchBtn");
const sportsInput = document.getElementById("sportsInput");
const sportsArea = document.querySelector(".sports-area");

// =====================================
// URL DA API
// =====================================

const API = "http://localhost:3000/api/esportes";

// =====================================
// FUNÇÃO PRINCIPAL
// =====================================

async function buscarEsporte(url) {
  // Mostra a animação de carregamento
  sportsArea.classList.add("loading");

  try {
    // Faz requisição HTTP para a API
    const response = await fetch(url);
    const data = await response.json();

    console.log("Resposta da API:", data);

    // Se a API retornar erro (ex: esporte 404)
    if (data.status === "error") {
      sportsName.textContent = data.message;
      sportsImage.src = "";
      return;
    }

    // Coloca a imagem sorteada na tela
    sportsImage.src = data.message;

    // Extrai e decodifica o nome do esporte a partir da URL da imagem
    // Exemplo: "http://localhost:3000/fotos/v%C3%B4lei/1.jpg" -> "vôlei"
    const parts = data.message.split("/");
    const esporteRaw = parts[4];

    if (esporteRaw) {
      // decodeURIComponent transforma "v%C3%B4lei" em "vôlei"
      const esporte = decodeURIComponent(esporteRaw);
      sportsName.textContent = esporte.charAt(0).toUpperCase() + esporte.slice(1);
    } else {
      sportsName.textContent = "Esporte";
    }

  } catch (error) {
    console.error(error);
    sportsName.textContent = "📴 Falha na conexão com o servidor. Verifique se o `node server.js` está rodando.";
    sportsImage.src = "";
  } finally {
    // Remove o indicador de carregamento
    sportsArea.classList.remove("loading");
  }
}

// =====================================
// AÇÕES
// =====================================

// Busca esporte aleatório
function esporteAleatorio() {
  buscarEsporte(`${API}/aleatorio`);
}

// Busca esporte por nome digitado
function buscarPorEsporte() {
  const esporte = sportsInput.value.trim().toLowerCase();

  if (!esporte) {
    alert("Digite um esporte para buscar!");
    return;
  }

  // encodeURIComponent garante que acentos fiquem seguros na URL da requisição
  buscarEsporte(`${API}/${encodeURIComponent(esporte)}`);
}

// =====================================
// EVENTOS
// =====================================

// Clique no botão aleatório
randomBtn.addEventListener("click", esporteAleatorio);

// Clique no botão de busca
searchBtn.addEventListener("click", buscarPorEsporte);

// Clique na própria imagem do esporte
sportsImage.addEventListener("click", esporteAleatorio);

// Enter no campo de busca
sportsInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    buscarPorEsporte();
  }
});

// Carrega um esporte assim que a página abre
window.addEventListener("load", esporteAleatorio);