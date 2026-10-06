/* ============================================================
   data.js
   Cliente da API Laravel (categorias e termos) + funções
   compartilhadas (ícones, tema, pronúncia). Compartilhado entre
   index.html e admin.html.

   IMPORTANTE: os termos e categorias NÃO ficam mais salvos no
   localStorage deste navegador. O MySQL, através da API Laravel,
   é a única fonte de dados. O localStorage continua sendo usado
   só para o tema (claro/escuro) e para a sessão de login do admin
   — nada disso guarda termos/categorias.
   ============================================================ */

const THEME_KEY = "techGlossaryTheme";

/* Ajuste esta URL para onde o backend Laravel estiver rodando.
   Configuração local: `php artisan serve --host=127.0.0.1 --port=8001` */
const API_BASE_URL = "http://127.0.0.1:8001/api";

class ApiError extends Error {}

async function apiFetch(path, options = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      ...options
    });
  } catch (e) {
    throw new ApiError(
      "Não foi possível conectar à API do glossário. Verifique se o backend Laravel está rodando (php artisan serve)."
    );
  }

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status} ao comunicar com a API.`;
    try {
      const corpo = await resposta.json();
      if (corpo.errors) mensagem = Object.values(corpo.errors).flat().join(" ");
      else if (corpo.message) mensagem = corpo.message;
    } catch (_) { /* resposta sem corpo JSON */ }
    throw new ApiError(mensagem);
  }

  if (resposta.status === 204) return null;
  return resposta.json();
}

/* ---------- Categorias ----------
   CATEGORIES é preenchido a partir da API (GET /api/categories) em vez
   de ser um array fixo. O formato de cada item continua o mesmo de antes:
   { id: "programming", label: "Programming", icon: "code" } — "id" aqui
   é o slug, exatamente como script.js/admin.js já esperavam. */
let CATEGORIES = [];

function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}

async function fetchCategories() {
  const dados = await apiFetch("/categories");
  return dados.data ?? dados;
}

/* ---------- Termos ----------
   Substituem loadTerms()/saveTerms()/nextId() (baseados em localStorage).
   O formato de cada termo continua { id, term, category, explanation }. */

async function fetchTerms(filtros = {}) {
  const params = new URLSearchParams();
  if (filtros.search) params.set("search", filtros.search);
  if (filtros.category && filtros.category !== "all") params.set("category", filtros.category);
  const query = params.toString() ? `?${params.toString()}` : "";
  const dados = await apiFetch(`/terms${query}`);
  return dados.data ?? dados;
}

async function createTerm({ term, translation, category, explanation }) {
  const dados = await apiFetch("/terms", {
    method: "POST",
    body: JSON.stringify({ term, translation, category, explanation })
  });
  return dados.data ?? dados;
}

async function updateTermApi(id, { term, translation, category, explanation }) {
  const dados = await apiFetch(`/terms/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({ term, translation, category, explanation })
  });
  return dados.data ?? dados;
}

async function deleteTermApi(id) {
  await apiFetch(`/terms/${encodeURIComponent(id)}`, { method: "DELETE" });
  return true;
}

/* ---------- Tema (claro/escuro) ----------
   Continua em localStorage de propósito: é só uma preferência de
   interface do navegador, sem relação com os dados do glossário. */

function applySavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}
applySavedTheme();

/** Fala um termo em inglês em voz alta usando a Web Speech API. */
function speakTerm(text) {
  if (!("speechSynthesis" in window)) {
    alert("Seu navegador não tem suporte à pronúncia por voz.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

/** Conjunto de ícones (estilo Feather, stroke, 24x24) usado nas categorias. */
const ICONS = {
  code: '<path d="m8 6-6 6 6 6M16 6l6 6-6 6M13 4l-2 16"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 6 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-6-3.8-9s1.3-6.3 3.8-9Z"/>',
  brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5h1a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5h-1a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="10" y="10" width="4" height="4"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>',
  shield: '<path d="M12 3 4.5 6v6c0 4.5 3.2 7.7 7.5 9 4.3-1.3 7.5-4.5 7.5-9V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  speaker: '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M17 9a4 4 0 0 1 0 6"/><path d="M19.5 6.5a8 8 0 0 1 0 11"/>'
};

function iconSVG(name, extraClass) {
  return `<svg class="cat-icon${extraClass ? " " + extraClass : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}
