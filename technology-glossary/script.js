/* ============================================================
   script.js — glossário público
   ============================================================ */

(function () {
  const termGrid = document.getElementById("termGrid");
  const searchInput = document.getElementById("searchInput");
  const resultCount = document.getElementById("resultCount");
  const themeToggle = document.getElementById("themeToggle");
  const categoryFilter = document.getElementById("categoryFilter");

  const modalOverlay = document.getElementById("modalOverlay");
  const modalTerm = document.getElementById("modalTerm");
  const modalExplanation = document.getElementById("modalExplanation");
  const modalCategoryBadge = document.getElementById("modalCategoryBadge");
  const modalSpeakBtn = document.getElementById("modalSpeakBtn");
  const modalClose = document.getElementById("modalClose");

  let terms = loadTerms();
  let activeCategory = "all";

  /* ---------- Filtro de categorias ---------- */

  function renderCategoryFilter() {
    const allPill = pillHTML("all", "All", null);
    const pills = CATEGORIES.map((c) => pillHTML(c.id, c.label, c.icon));
    categoryFilter.innerHTML = allPill + pills.join("");

    categoryFilter.querySelectorAll(".cat-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.dataset.cat;
        categoryFilter.querySelectorAll(".cat-pill").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        render(applyFilters());
      });
    });
  }

  function pillHTML(id, label, icon) {
    const active = id === activeCategory ? " active" : "";
    const style = id !== "all" ? ` style="--pill-color:var(--cat-color)"` : "";
    const cls = id !== "all" ? ` cat-${id}` : "";
    const iconHTML = icon ? iconSVG(icon) : "";
    return `<button type="button" class="cat-pill${active}${cls}" data-cat="${id}"${style}>${iconHTML}${escapeHTML(label)}</button>`;
  }

  /* ---------- Render de cards ---------- */

  function render(list) {
    termGrid.innerHTML = "";

    if (list.length === 0) {
      termGrid.innerHTML = `
        <div class="empty-state">
          <div class="petal-mark" aria-hidden="true"><img src="assets/logo.svg" alt=""></div>
          <p><strong>Nenhum termo encontrado.</strong></p>
          <p>Tente pesquisar por outra palavra ou escolher outra categoria.</p>
        </div>`;
      resultCount.textContent = "";
      return;
    }

    const hasFilter = searchInput.value.trim() || activeCategory !== "all";
    resultCount.textContent = hasFilter
      ? `${list.length} termo${list.length > 1 ? "s" : ""} encontrado${list.length > 1 ? "s" : ""}`
      : "";

    list
      .slice()
      .sort((a, b) => a.term.localeCompare(b.term))
      .forEach((item) => {
        const cat = getCategory(item.category);
        const card = document.createElement("div");
        card.className = "term-card";
        card.tabIndex = 0;
        card.innerHTML = `
          <div class="card-top">
            <div class="term-heading">
              <span class="cat-icon-badge cat-${cat.id}">${iconSVG(cat.icon)}</span>
              <span class="term">${escapeHTML(item.term)}</span>
            </div>
            <button type="button" class="speak-btn" aria-label="Ouvir pronúncia de ${escapeHTML(item.term)}">${iconSVG("speaker")}</button>
          </div>
          <span class="category-badge cat-${cat.id}">${escapeHTML(cat.label)}</span>
          <span class="snippet">${escapeHTML(item.explanation)}</span>
          <span class="ler-mais">Ler Mais
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>`;

        card.addEventListener("click", () => openModal(item));
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(item); }
        });

        const speakBtn = card.querySelector(".speak-btn");
        speakBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          pronounce(item.term, speakBtn);
        });

        termGrid.appendChild(card);
      });
  }

  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    return terms.filter((t) => {
      const matchesQuery = !q || t.term.toLowerCase().includes(q);
      const matchesCategory = activeCategory === "all" || t.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }

  /* ---------- Pronúncia ---------- */

  function pronounce(text, btnEl) {
    speakTerm(text);
    if (!btnEl) return;
    document.querySelectorAll(".speak-btn.speaking").forEach((b) => b.classList.remove("speaking"));
    btnEl.classList.add("speaking");
    setTimeout(() => btnEl.classList.remove("speaking"), 900);
  }

  /* ---------- Modal ---------- */

  function openModal(item) {
    const cat = getCategory(item.category);
    modalTerm.textContent = item.term;
    modalExplanation.textContent = item.explanation;
    modalCategoryBadge.className = `category-badge cat-${cat.id}`;
    modalCategoryBadge.innerHTML = `${iconSVG(cat.icon)}${escapeHTML(cat.label)}`;
    modalSpeakBtn.innerHTML = iconSVG("speaker");
    modalSpeakBtn.onclick = () => pronounce(item.term, modalSpeakBtn);

    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- Eventos ---------- */

  searchInput.addEventListener("input", () => render(applyFilters()));

  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

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

  // Mantém o glossário atualizado caso o admin altere dados em outra aba
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      terms = loadTerms();
      render(applyFilters());
    }
  });

  renderCategoryFilter();
  render(terms);
})();
