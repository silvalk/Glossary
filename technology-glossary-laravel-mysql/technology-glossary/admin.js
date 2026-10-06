/* ============================================================
   admin.js — área administrativa
   ============================================================ */

(function () {
  // Credenciais de demonstração (autenticação simples, sem servidor)
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "admin123";
  const SESSION_KEY = "techGlossaryAdminSession";

  const loginScreen = document.getElementById("loginScreen");
  const adminDashboard = document.getElementById("adminDashboard");
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const logoutBtn = document.getElementById("logoutBtn");

  const totalTerms = document.getElementById("totalTerms");
  const adminList = document.getElementById("adminList");
  const addTermBtn = document.getElementById("addTermBtn");

  const formOverlay = document.getElementById("formOverlay");
  const formTitle = document.getElementById("formTitle");
  const termForm = document.getElementById("termForm");
  const termIdInput = document.getElementById("termId");
  const termInput = document.getElementById("termInput");
  const translationInput = document.getElementById("translationInput");
  const categoryInput = document.getElementById("categoryInput");
  const explanationInput = document.getElementById("explanationInput");
  const submitFormBtn = document.getElementById("submitFormBtn");
  const formClose = document.getElementById("formClose");
  const cancelFormBtn = document.getElementById("cancelFormBtn");
  const formError = document.getElementById("formError");

  const confirmOverlay = document.getElementById("confirmOverlay");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  const themeToggle = document.getElementById("themeToggle");

  let terms = [];
  let pendingDeleteId = null;

  /* ---------- Select de categorias ---------- */

  function populateCategorySelect() {
    categoryInput.innerHTML = CATEGORIES.map(
      (c) => `<option value="${c.id}">${c.label}</option>`
    ).join("");
  }

  /* Mostra um erro de conexão/validação da API na tela de dashboard
     (reaproveita o mesmo estilo do erro de login, ".login-error"). */
  function showAdminError(erro) {
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    adminList.innerHTML = `<div class="admin-empty">${escapeHTML(mensagem)}</div>`;
  }

  /* ---------- Autenticação ---------- */

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  }

  async function showDashboard() {
    loginScreen.style.display = "none";
    adminDashboard.classList.add("active");
    logoutBtn.style.display = "inline-flex";
    await renderList();
  }

  function showLogin() {
    adminDashboard.classList.remove("active");
    loginScreen.style.display = "flex";
    logoutBtn.style.display = "none";
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, "true");
      loginError.textContent = "";
      loginForm.reset();
      await showDashboard();
    } else {
      loginError.textContent = "Usuário ou senha inválidos.";
    }
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    showLogin();
  });

  /* ---------- Renderização da lista ---------- */

  async function renderList() {
    adminList.innerHTML = `<div class="admin-empty">Carregando termos…</div>`;
    try {
      terms = await fetchTerms();
    } catch (erro) {
      showAdminError(erro);
      return;
    }

    totalTerms.textContent = terms.length;
    adminList.innerHTML = "";

    if (terms.length === 0) {
      adminList.innerHTML = `<div class="admin-empty">Nenhum termo cadastrado ainda.</div>`;
      return;
    }

    terms
      .slice()
      .sort((a, b) => a.term.localeCompare(b.term))
      .forEach((item) => {
        const cat = getCategory(item.category);
        const row = document.createElement("div");
        row.className = "admin-row";
        row.innerHTML = `
          <div class="row-info">
            <div class="row-head">
              <span class="cat-icon-badge cat-${cat.id}">${iconSVG(cat.icon)}</span>
              <span class="term">${escapeHTML(item.term)}</span>
              <button type="button" class="speak-btn admin-speak-btn" aria-label="Ouvir pronúncia de ${escapeHTML(item.term)}">${iconSVG("speaker")}</button>
              <span class="category-badge cat-${cat.id}">${escapeHTML(cat.label)}</span>
            </div>
            <p class="term-translation">${escapeHTML(item.translation)}</p>
            <div class="explanation">${escapeHTML(item.explanation)}</div>
          </div>
          <div class="row-actions">
            <button type="button" class="btn btn-secondary edit-btn">Edit</button>
            <button type="button" class="btn btn-danger delete-btn">Delete</button>
          </div>`;
        row.querySelector(".edit-btn").addEventListener("click", () => openEditForm(item.id));
        row.querySelector(".delete-btn").addEventListener("click", () => openConfirmDelete(item.id));
        row.querySelector(".admin-speak-btn").addEventListener("click", (e) => {
          e.stopPropagation();
          speakTerm(item.term);
        });
        adminList.appendChild(row);
      });
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- Formulário: adicionar / editar ---------- */

  function openAddForm() {
    formTitle.textContent = "+ Add New Term";
    submitFormBtn.textContent = "Add Term";
    formError.textContent = "";
    termIdInput.value = "";
    termInput.value = "";
    translationInput.value = "";
    categoryInput.value = CATEGORIES[0].id;
    explanationInput.value = "";
    formOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    termInput.focus();
  }

  function openEditForm(id) {
    const item = terms.find((t) => t.id === id);
    if (!item) return;
    formTitle.textContent = "Edit Term";
    submitFormBtn.textContent = "Save Changes";
    formError.textContent = "";
    termIdInput.value = item.id;
    termInput.value = item.term;
    translationInput.value = item.translation;
    categoryInput.value = item.category;
    explanationInput.value = item.explanation;
    formOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    termInput.focus();
  }

  function closeForm() {
    formOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  addTermBtn.addEventListener("click", openAddForm);
  formClose.addEventListener("click", closeForm);
  cancelFormBtn.addEventListener("click", closeForm);
  formOverlay.addEventListener("click", (e) => { if (e.target === formOverlay) closeForm(); });

  termForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const termValue = termInput.value.trim();
    const translationValue = translationInput.value.trim();
    const categoryValue = categoryInput.value;
    const explanationValue = explanationInput.value.trim();
    if (!termValue || !translationValue || !explanationValue) return;

    const id = termIdInput.value;
    formError.textContent = "";
    submitFormBtn.disabled = true;
    const textoOriginalBtn = submitFormBtn.textContent;
    submitFormBtn.textContent = "Saving...";

    try {
      if (id) {
        await updateTermApi(Number(id), { term: termValue, translation: translationValue, category: categoryValue, explanation: explanationValue });
      } else {
        await createTerm({ term: termValue, translation: translationValue, category: categoryValue, explanation: explanationValue });
      }
      closeForm();
      await renderList();
    } catch (erro) {
      formError.textContent = erro instanceof Error ? erro.message : String(erro);
    } finally {
      submitFormBtn.disabled = false;
      submitFormBtn.textContent = textoOriginalBtn;
    }
  });

  /* ---------- Exclusão ---------- */

  function openConfirmDelete(id) {
    pendingDeleteId = id;
    confirmOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeConfirmDelete() {
    pendingDeleteId = null;
    confirmOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  cancelDeleteBtn.addEventListener("click", closeConfirmDelete);
  confirmOverlay.addEventListener("click", (e) => { if (e.target === confirmOverlay) closeConfirmDelete(); });

  confirmDeleteBtn.addEventListener("click", async () => {
    if (pendingDeleteId === null) return;
    confirmDeleteBtn.disabled = true;
    try {
      await deleteTermApi(pendingDeleteId);
      closeConfirmDelete();
      await renderList();
    } catch (erro) {
      closeConfirmDelete();
      showAdminError(erro);
    } finally {
      confirmDeleteBtn.disabled = false;
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (formOverlay.classList.contains("open")) closeForm();
    if (confirmOverlay.classList.contains("open")) closeConfirmDelete();
  });

  /* ---------- Dark mode ---------- */

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem(THEME_KEY, "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem(THEME_KEY, "dark");
    }
  });

  /* ---------- Inicialização ---------- */

  async function init() {
    try {
      CATEGORIES = await fetchCategories();
      populateCategorySelect();
    } catch (erro) {
      loginError.textContent = erro instanceof Error ? erro.message : String(erro);
    }

    if (isLoggedIn()) {
      await showDashboard();
    } else {
      showLogin();
    }
  }

  init();
})();
