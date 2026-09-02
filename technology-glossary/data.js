/* ============================================================
   data.js
   Termos iniciais do glossário, categorias e funções de acesso
   ao localStorage. Compartilhado entre index.html e admin.html.
   ============================================================ */

const STORAGE_KEY = "techGlossaryTerms";
const THEME_KEY = "techGlossaryTheme";

/* ---------- Categorias ----------
   Cada categoria tem um id, um rótulo e um ícone (chave de ICONS). */
const CATEGORIES = [
  { id: "programming", label: "Programming", icon: "code" },
  { id: "web", label: "Web & Internet", icon: "globe" },
  { id: "ai", label: "AI & Data", icon: "brain" },
  { id: "hardware", label: "Hardware", icon: "cpu" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "systems", label: "Software & Systems", icon: "layers" }
];

function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}

const INITIAL_TERMS = [
  { id: 1, term: "Algorithm", category: "programming", explanation: "Uma sequência de instruções organizada para resolver um problema ou realizar determinada tarefa." },
  { id: 2, term: "API", category: "web", explanation: "Um conjunto de regras que permite que diferentes sistemas ou aplicativos se comuniquem entre si." },
  { id: 3, term: "Artificial Intelligence", category: "ai", explanation: "Área da tecnologia que cria sistemas capazes de simular capacidades humanas, como aprender e tomar decisões." },
  { id: 4, term: "Backend", category: "systems", explanation: "Parte de um sistema responsável pelos processos que acontecem no servidor e que normalmente não são vistos diretamente pelo usuário." },
  { id: 5, term: "Browser", category: "web", explanation: "Programa utilizado para acessar e navegar por páginas da internet." },
  { id: 6, term: "Bug", category: "systems", explanation: "Um erro ou falha em um programa que faz com que ele funcione de forma inesperada." },
  { id: 7, term: "Cache", category: "systems", explanation: "Um espaço de armazenamento temporário utilizado para acelerar o acesso a dados usados com frequência." },
  { id: 8, term: "Cloud Computing", category: "web", explanation: "Uso de servidores na internet para armazenar dados e executar programas, em vez de utilizar apenas um computador local." },
  { id: 9, term: "Code", category: "programming", explanation: "Conjunto de instruções escritas em uma linguagem de programação para que um computador execute uma tarefa." },
  { id: 10, term: "Compiler", category: "programming", explanation: "Programa que transforma o código escrito por um desenvolvedor em instruções que o computador consegue executar." },
  { id: 11, term: "Computer", category: "hardware", explanation: "Máquina eletrônica capaz de processar dados e executar tarefas conforme instruções recebidas." },
  { id: 12, term: "Database", category: "ai", explanation: "Um sistema utilizado para armazenar, organizar e consultar informações." },
  { id: 13, term: "Debugging", category: "programming", explanation: "Processo de encontrar e corrigir erros em um programa de computador." },
  { id: 14, term: "Developer", category: "systems", explanation: "Profissional responsável por criar, testar e manter programas e sistemas." },
  { id: 15, term: "Domain", category: "web", explanation: "Nome utilizado para identificar e acessar um site na internet, como exemplo.com." },
  { id: 16, term: "Download", category: "web", explanation: "Ato de transferir um arquivo da internet para o computador ou dispositivo do usuário." },
  { id: 17, term: "Encryption", category: "security", explanation: "Técnica que transforma informações em um código, protegendo dados contra acessos não autorizados." },
  { id: 18, term: "Firewall", category: "security", explanation: "Um mecanismo de segurança utilizado para controlar e filtrar conexões de rede." },
  { id: 19, term: "Framework", category: "programming", explanation: "Um conjunto de ferramentas e padrões que facilita e organiza o desenvolvimento de programas." },
  { id: 20, term: "Frontend", category: "systems", explanation: "Parte de um site ou sistema com a qual o usuário interage diretamente, como botões, menus, textos e imagens." },
  { id: 21, term: "Git", category: "programming", explanation: "Ferramenta utilizada para controlar e organizar diferentes versões do código de um projeto." },
  { id: 22, term: "Hardware", category: "hardware", explanation: "Conjunto das partes físicas de um computador, como processador, memória e teclado." },
  { id: 23, term: "Hosting", category: "web", explanation: "Serviço que armazena os arquivos de um site para que ele fique disponível na internet." },
  { id: 24, term: "HTML", category: "programming", explanation: "Linguagem utilizada para criar a estrutura e o conteúdo das páginas da Web." },
  { id: 25, term: "Internet", category: "web", explanation: "Rede mundial que conecta computadores e dispositivos, permitindo a troca de informações entre eles." },
  { id: 26, term: "JavaScript", category: "programming", explanation: "Linguagem de programação utilizada para adicionar interatividade às páginas da Web." },
  { id: 27, term: "Machine Learning", category: "ai", explanation: "Área da inteligência artificial em que os sistemas aprendem a partir de dados para melhorar suas previsões e decisões." },
  { id: 28, term: "Malware", category: "security", explanation: "Programa criado com a intenção de causar danos, roubar dados ou invadir sistemas." },
  { id: 29, term: "Network", category: "web", explanation: "Conjunto de computadores e dispositivos conectados entre si para compartilhar dados e recursos." },
  { id: 30, term: "Operating System", category: "hardware", explanation: "Programa principal que gerencia o funcionamento do computador e permite executar outros programas." },
  { id: 31, term: "Password", category: "security", explanation: "Uma sequência de caracteres utilizada para proteger o acesso a contas e sistemas." },
  { id: 32, term: "Phishing", category: "security", explanation: "Golpe utilizado para enganar usuários e roubar informações pessoais, geralmente por e-mail ou mensagens falsas." },
  { id: 33, term: "Programming", category: "programming", explanation: "Processo de criar programas de computador escrevendo instruções em uma linguagem específica." },
  { id: 34, term: "RAM", category: "hardware", explanation: "Memória do computador utilizada para armazenar dados temporariamente enquanto os programas estão em uso." },
  { id: 35, term: "Server", category: "systems", explanation: "Um computador ou sistema responsável por fornecer serviços, dados ou recursos para outros computadores e dispositivos." },
  { id: 36, term: "Software", category: "systems", explanation: "Conjunto de programas e instruções que permitem ao computador realizar tarefas." },
  { id: 37, term: "Source Code", category: "programming", explanation: "Conjunto de instruções escritas por um desenvolvedor em uma linguagem de programação, antes de serem executadas pelo computador." },
  { id: 38, term: "URL", category: "web", explanation: "Endereço utilizado para localizar e acessar uma página específica na internet." },
  { id: 39, term: "Virus", category: "security", explanation: "Programa malicioso capaz de se espalhar e causar danos a arquivos e sistemas." },
  { id: 40, term: "Wi-Fi", category: "web", explanation: "Tecnologia que permite a conexão sem fio de dispositivos a uma rede de internet." }
];

/** Retorna a lista de termos salva no localStorage.
 *  Se ainda não houver dados, grava e devolve os termos iniciais.
 *  Termos salvos de versões anteriores (sem "category") recebem "systems". */
function loadTerms() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TERMS));
    return [...INITIAL_TERMS];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...INITIAL_TERMS];
    return parsed.map((t) => ({ category: "systems", ...t }));
  } catch (e) {
    return [...INITIAL_TERMS];
  }
}

/** Grava a lista de termos no localStorage. */
function saveTerms(terms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
}

/** Gera o próximo id disponível. */
function nextId(terms) {
  return terms.reduce((max, t) => Math.max(max, t.id), 0) + 1;
}

/** Aplica o tema salvo (claro/escuro) assim que a página carrega. */
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
