/**
 * Minimal portfolio behavior:
 * - Renders projects from a data array
 * - Filter selection blurs/fades non-matching items (does not hide them)
 * - Clicking a project logs its name (easy to swap for navigation later)
 */

const page = document.body?.dataset?.page || "home";

const projects = [
  {
    name: "Revista — Sistema Editorial",
    category: "editorial",
    image: iconDataUri("E", "#111", "#fefefe"),
  },
  {
    name: "Book Cover Studies",
    category: "editorial",
    image: iconDataUri("B", "#111", "#fefefe"),
  },
  {
    name: "3D — Still Life",
    category: "3d",
    image: iconDataUri("3D", "#111", "#fefefe"),
  },
  {
    name: "3D — Character Blockout",
    category: "3d",
    image: iconDataUri("C", "#111", "#fefefe"),
  },
  {
    name: "Web — Landing Page",
    category: "web",
    image: iconDataUri("W", "#111", "#fefefe"),
  },
  {
    name: "Web — UI Kit",
    category: "web",
    image: iconDataUri("UI", "#111", "#fefefe"),
  },
  {
    name: "Editorial — Posters",
    category: "editorial",
    image: iconDataUri("P", "#111", "#fefefe"),
  },
  {
    name: "3D — Product Render",
    category: "3d",
    image: iconDataUri("R", "#111", "#fefefe"),
  },
  {
    name: "Web — Portfolio v1",
    category: "web",
    image: iconDataUri("J", "#111", "#fefefe"),
  },
  {
    name: "Editorial — Catalog",
    category: "editorial",
    image: iconDataUri("C", "#111", "#fefefe"),
  },
  {
    name: "3D — Scene Study",
    category: "3d",
    image: iconDataUri("S", "#111", "#fefefe"),
  },
  {
    name: "Web — Microsite",
    category: "web",
    image: iconDataUri("M", "#111", "#fefefe"),
  },
];

let activeFilter = null; // "editorial" | "3d" | "web" | null

const grid = document.getElementById("galleryGrid");
const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
const clearBtn = document.querySelector("[data-clear]");
const hint = document.querySelector(".hint");

if (page === "home" && grid) {
  renderGallery(projects);
  syncFilterUi();

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.filter;
      // Toggle behavior: clicking the active filter clears it.
      activeFilter = activeFilter === next ? null : next;
      syncFilterUi();
    });
  });

  clearBtn?.addEventListener("click", () => {
    activeFilter = null;
    syncFilterUi();
  });

  grid.addEventListener("click", (event) => {
    const item = event.target.closest("[data-project]");
    if (!item) return;

    const name = item.getAttribute("data-project");
    const index = Number(item.getAttribute("data-index") || "-1");
    if (index === 0) {
      window.location.href = "project.html";
      return;
    }
    console.log("Project clicked:", name);
    // Future: location.href = `/projects/${slugify(name)}.html`
  });

  grid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const item = event.target.closest("[data-project]");
    if (!item) return;
    event.preventDefault();
    item.click();
  });
}

if (page === "project") {
  initInteractiveMap();
  initModal();
}

function renderGallery(items) {
  grid.innerHTML = "";

  const frag = document.createDocumentFragment();
  items.forEach((p, idx) => frag.appendChild(projectCard(p, idx)));
  grid.appendChild(frag);
}

function projectCard(project, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "project";
  button.setAttribute("role", "listitem");
  button.setAttribute("data-project", project.name);
  button.setAttribute("data-category", project.category);
  button.setAttribute("data-index", String(index));
  button.setAttribute("aria-label", `${project.name} (${project.category})`);

  const img = document.createElement("img");
  img.className = "project-img";
  img.alt = ""; // decorative icon; accessible name is on the button
  img.src = project.image;
  img.loading = "lazy";
  img.decoding = "async";

  button.appendChild(img);
  return button;
}

function syncFilterUi() {
  filterButtons.forEach((btn) => {
    const isActive = btn.dataset.filter === activeFilter;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });

  const cards = Array.from(grid.querySelectorAll(".project"));
  cards.forEach((card) => {
    const matches = activeFilter
      ? card.getAttribute("data-category") === activeFilter
      : true;

    card.classList.toggle("is-dimmed", Boolean(activeFilter) && !matches);
    card.classList.toggle("is-active", Boolean(activeFilter) && matches);
  });

  if (!hint) return;
  hint.textContent = activeFilter
    ? `Filtro activo: ${activeFilter}. Los demás proyectos se des-enfatizan con blur.`
    : "Elegí un filtro para resaltar una categoría.";
}

function iconDataUri(label, fg, bg) {
  // Simple, lightweight icon SVG (inline as a data URI) so the project stays 3-file minimal.
  const safe = String(label).slice(0, 3);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <rect x="10" y="10" width="108" height="108" rx="22" fill="${bg}"/>
      <path d="M28 44c8-10 18-16 36-16s28 6 36 16" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="6" stroke-linecap="round"/>
      <text x="64" y="78" text-anchor="middle" font-size="38" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace" font-weight="700" fill="${fg}">
        ${escapeXml(safe)}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeXml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function initInteractiveMap() {
  const stage = document.getElementById("mapStage");
  if (!stage) return;

  // Circle data: positions are percentages relative to the image container.
  const points = [
    {
      id: "entrada",
      x: 18,
      y: 32,
      color: "#f6b6d8", // pastel pink
      title: "Entrada",
      description:
        "Punto de llegada: compresión → apertura. Marca el ritmo inicial y el primer cambio de escala.",
    },
    {
      id: "nucleo",
      x: 56,
      y: 28,
      color: "#a7d8ff", // pastel blue
      title: "Núcleo",
      description:
        "Centro operativo: organiza recorridos y vistas cruzadas. Acá se concentran decisiones de orientación.",
    },
    {
      id: "umbral",
      x: 74,
      y: 58,
      color: "#fde68a", // pastel yellow
      title: "Umbral",
      description:
        "Transición: cambia la atmósfera. Luz, material y sonido acompañan el pasaje entre zonas.",
    },
  ];

  points.forEach((p) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "marker";
    btn.style.left = `${p.x}%`;
    btn.style.top = `${p.y}%`;
    btn.dataset.markerId = p.id;
    btn.dataset.markerColor = p.color;
    btn.dataset.modalTitle = p.title;
    btn.dataset.modalBody = p.description;
    btn.setAttribute("aria-label", `Abrir detalle: ${p.title}`);

    btn.addEventListener("mouseenter", () => {
      btn.style.backgroundColor = p.color;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.backgroundColor = "#000";
    });
    btn.addEventListener("click", () => {
      openModal({ title: p.title, body: p.description });
    });

    stage.appendChild(btn);
  });
}

let modalEls = null;

function initModal() {
  const modal = document.getElementById("modal");
  if (!modal) return;

  const titleEl = document.getElementById("modalTitle");
  const bodyEl = document.getElementById("modalBody");
  const closeEls = Array.from(modal.querySelectorAll("[data-modal-close]"));

  modalEls = { modal, titleEl, bodyEl };

  closeEls.forEach((el) =>
    el.addEventListener("click", () => {
      closeModal();
    })
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function openModal({ title, body }) {
  if (!modalEls) return;
  const { modal, titleEl, bodyEl } = modalEls;

  if (titleEl) titleEl.textContent = title;
  if (bodyEl) bodyEl.textContent = body;

  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!modalEls) return;
  const { modal } = modalEls;
  modal.setAttribute("aria-hidden", "true");
}
