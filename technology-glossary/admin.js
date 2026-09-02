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
  const categoryInput = document.getElementById("categoryInput");
  const explanationInput = document.getElementById("explanationInput");
  const submitFormBtn = document.getElementById("submitFormBtn");
  const formClose = document.getElementById("formClose");
  const cancelFormBtn = document.getElementById("cancelFormBtn");

  const confirmOverlay = document.getElementById("confirmOverlay");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  const themeToggle = document.getElementById("themeToggle");

  let terms = loadTerms();
  let pendingDeleteId = null;

  /* ---------- Select de categorias ---------- */

  function populateCategorySelect() {
    categoryInput.innerHTML = CATEGORIES.map(
      (c) => `<option value="${c.id}">${c.label}</option>`
    ).join("");
  }

  /* ---------- Autenticação ---------- */

  function isLoggedIn() {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  }

  function showDashboard() {
    loginScreen.style.display = "none";
    adminDashboard.classList.add("active");
    logoutBtn.style.display = "inline-flex";
    renderList();
  }

  function showLogin() {
    adminDashboard.classList.remove("active");
    loginScreen.style.display = "flex";
    logoutBtn.style.display = "none";
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, "true");
      loginError.textContent = "";
      loginForm.reset();
      showDashboard();
    } else {
      loginError.textContent = "Usuário ou senha inválidos.";
    }
  });

  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    showLogin();
  });

  /* ---------- Renderização da lista ---------- */

  function renderList() {
    terms = loadTerms();
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
    termIdInput.value = "";
    termInput.value = "";
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
    termIdInput.value = item.id;
    termInput.value = item.term;
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

  termForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const termValue = termInput.value.trim();
    const categoryValue = categoryInput.value;
    const explanationValue = explanationInput.value.trim();
    if (!termValue || !explanationValue) return;

    const id = termIdInput.value;

    if (id) {
      // editar
      terms = terms.map((t) =>
        t.id === Number(id)
          ? { ...t, term: termValue, category: categoryValue, explanation: explanationValue }
          : t
      );
    } else {
      // adicionar
      terms.push({ id: nextId(terms), term: termValue, category: categoryValue, explanation: explanationValue });
    }

    saveTerms(terms);
    closeForm();
    renderList();
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

  confirmDeleteBtn.addEventListener("click", () => {
    if (pendingDeleteId === null) return;
    terms = terms.filter((t) => t.id !== pendingDeleteId);
    saveTerms(terms);
    closeConfirmDelete();
    renderList();
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

  populateCategorySelect();

  if (isLoggedIn()) {
    showDashboard();
  } else {
    showLogin();
  }
})();
