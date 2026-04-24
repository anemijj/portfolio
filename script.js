/**
 * Minimal portfolio behavior:
 * - Renders projects from a data array
 * - Filter selection blurs/fades non-matching items (does not hide them)
 * - Clicking a project logs its name (easy to swap for navigation later)
 */

const page = document.body?.dataset?.page || "home";

/** Iconos reales en `materia/iconos/` (nombres de archivo tal cual en disco) */
const ICON_DIR = "materia/iconos/";

function iconPath(fileName) {
  return encodeURI(`${ICON_DIR}${fileName}`);
}

/**
 * Un ítem por cada PNG en `materia/iconos/`.
 * El primero (índice 0) abre `project.html` al hacer click.
 */
const projects = [
  {
    name: "El Público — Tesis",
    category: "editorial",
    recent: true,
    image: iconPath("butaca 1.png"),
  },
  {
    name: "Recurso 50",
    category: "web",
    recent: true,
    image: iconPath("Recurso 50 1.png"),
  },
  {
    name: "S4 G8",
    category: "3d",
    recent: true,
    image: iconPath("6c8f988eb13b2eae0e430839e03248b4 1.png"),
  },
  {
    name: "la dolce vita",
    category: "web",
    recent: true,
    image: iconPath("trabajo 2-07 1.png"),
  },
  {
    name: "Logo SOMA",
    category: "editorial",
    recent: true,
    image: iconPath("Logo SOMA png sin texto-07 1.png"),
  },
  {
    name: "Café aesthetic",
    category: "editorial",
    recent: false,
    image: iconPath("cafe aesthetic 1.png"),
  },
  {
    name: "PC",
    category: "web",
    recent: false,
    image: iconPath("pc 1.png"),
  },
  {
    name: "lookbook digital",
    category: "web",
    recent: false,
    image: iconPath("cartita.png"),
  },
  {
    name: "vuelta griega",
    category: "editorial",
    recent: false,
    image: iconPath("tapa voladora.19 1.png"),
  },
  {
    name: "entorno inmersivo",
    category: "3d",
    recent: false,
    image: iconPath("Rectangle.png"),
  },
];

let activeFilter = null; // "reciente" | "editorial" | "3d" | "web" | null

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
    if (index === 1) {
      window.location.href = "criollismo.html";
      return;
    }
    if (index === 2) {
      window.location.href = "s4-g8.html";
      return;
    }
    if (index === 3) {
      window.location.href = "la-dolce-vita.html";
      return;
    }
    if (index === 5) {
      window.location.href = "cafe.html";
      return;
    }
    if (index === 6) {
      window.location.href = "bb-asul-tp2.html";
      return;
    }
    if (index === 7) {
      window.location.href = "lookbook-digital.html";
      return;
    }
    if (index === 8) {
      window.location.href = "vuelta-griega.html";
      return;
    }
    if (index === 9) {
      window.location.href = "entorno-inmersivo.html";
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

/**
 * JPG exportados en orden (por número revista_page-NNNN).
 * Si agregás o renombrás archivos, actualizá esta lista y mantené el orden.
 */
const REVISTA_JPG_FILES = [
  "revista_page-0001.jpg",
  "revista_page-0004.jpg",
  "revista_page-0005.jpg",
  "revista_page-0006.jpg",
  "revista_page-0007.jpg",
  "revista_page-0008.jpg",
  "revista_page-0009.jpg",
  "revista_page-0010.jpg",
  "revista_page-0011.jpg",
  "revista_page-0012.jpg",
  "revista_page-0013.jpg",
  "revista_page-0014.jpg",
  "revista_page-0015.jpg",
  "revista_page-0016.jpg",
  "revista_page-0017.jpg",
  "revista_page-0018.jpg",
  "revista_page-0019.jpg",
  "revista_page-0020.jpg",
  "revista_page-0021.jpg",
  "revista_page-0022.jpg",
  "revista_page-0023.jpg",
  "revista_page-0024.jpg",
  "revista_page-0025.jpg",
  "revista_page-0026.jpg",
  "revista_page-0027.jpg",
  "revista_page-0028.jpg",
  "revista_page-0029.jpg",
  "revista_page-0030.jpg",
  "revista_page-0031.jpg",
  "revista_page-0032.jpg",
  "revista_page-0033.jpg",
  "revista_page-0034.jpg",
  "revista_page-0035.jpg",
  "revista_page-0036.jpg",
  "revista_page-0037.jpg",
  "revista_page-0038.jpg",
  "revista_page-0039.jpg",
  "revista_page-0040.jpg",
  "revista_page-0041.jpg",
  "revista_page-0042.jpg",
  "revista_page-0043.jpg",
  "revista_page-0044.jpg",
  "revista_page-0045.jpg",
  "revista_page-0046.jpg",
  "revista_page-0047.jpg",
  "revista_page-0048.jpg",
  "revista_page-0049.jpg",
  "revista_page-0050.jpg",
  "revista_page-0051.jpg",
  "revista_page-0052.jpg",
  "revista_page-0053.jpg",
  "revista_page-0054.jpg",
  "revista_page-0055.jpg",
  "revista_page-0056.jpg",
  "revista_page-0057.jpg",
  "revista_page-0058.jpg",
  "revista_page-0059.jpg",
  "revista_page-0060.jpg",
  "revista_page-0061.jpg",
  "revista_page-0062.jpg",
  "revista_page-0063.jpg",
  "revista_page-0064.jpg",
  "revista_page-0065.jpg",
  "revista_page-0066.jpg",
  "revista_page-0067.jpg",
  "revista_page-0068.jpg",
  "revista_page-0069.jpg",
  "revista_page-0070.jpg",
  "revista_page-0071.jpg",
  "revista_page-0072.jpg",
  "revista_page-0073.jpg",
  "revista_page-0074.jpg",
  "revista_page-0075.jpg",
  "revista_page-0076.jpg",
  "revista_page-0077.jpg",
  "revista_page-0078.jpg",
  "revista_page-0079.jpg",
  "revista_page-0080.jpg",
  "revista_page-0081.jpg",
  "revista_page-0084.jpg",
];

function revistaJpgUrl(fileName) {
  return ["materia", "revistajpg", fileName]
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

/** Mismo nombre que en git (NFC “presentación”); NFD rompe URLs en GitHub Pages (Linux). */
const PRES_CRIOLLISMO_PREFIX =
  "presentación identidad CRIOLLISMO_compressed_page-";
const PRES_CRIOLLISMO_FILES = Array.from({ length: 38 }, (_, i) =>
  `${PRES_CRIOLLISMO_PREFIX}${String(i + 1).padStart(4, "0")}.jpg`
);

function presCriollismoJpgUrl(fileName) {
  const normalized = fileName.normalize("NFC");
  return ["materia", "pres criollismo", normalized]
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function initPresCriollismoStack() {
  const stack = document.getElementById("presCriollismoStack");
  if (!stack) return;

  stack.innerHTML = "";
  const files = PRES_CRIOLLISMO_FILES;
  let eagerLeft = 5;

  files.forEach((file, i) => {
    const img = document.createElement("img");
    img.className = "pres-criollismo-img";
    img.src = presCriollismoJpgUrl(file);
    img.alt = `Presentación Criollismo — lámina ${i + 1} de ${files.length}`;
    img.decoding = "async";
    img.loading = eagerLeft-- > 0 ? "eager" : "lazy";
    stack.appendChild(img);
  });
}

/** Plan de vistas: pág.1 sola; pares 2–3, 4–5, … en el interior; última sola (contratapa). */
function buildRevistaSpreadPlan(numPages) {
  const n = numPages;
  if (n < 1) return [];
  if (n === 1) return [[1]];
  const views = [[1]];
  let i = 2;
  while (i <= n - 1) {
    if (i + 1 <= n - 1) {
      views.push([i, i + 1]);
      i += 2;
    } else {
      views.push([i]);
      i += 1;
    }
  }
  views.push([n]);
  return views;
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
  button.setAttribute("data-recent", project.recent ? "true" : "false");
  button.setAttribute("data-index", String(index));
  const recentLabel = project.recent ? ", reciente" : "";
  button.setAttribute(
    "aria-label",
    `${project.name} (${project.category}${recentLabel})`
  );

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
    const matches = !activeFilter
      ? true
      : activeFilter === "reciente"
        ? card.getAttribute("data-recent") === "true"
        : card.getAttribute("data-category") === activeFilter;

    card.classList.toggle("is-dimmed", Boolean(activeFilter) && !matches);
    card.classList.toggle("is-active", Boolean(activeFilter) && matches);
  });

  if (!hint) return;
  hint.textContent = activeFilter
    ? `Filtro activo: ${activeFilter}. Los demás proyectos se des-enfatizan con blur.`
    : "Elegí un filtro para resaltar una categoría.";
}


function initRevistaJpgStrip() {
  const strip = document.getElementById("magStrip");
  if (!strip) return;

  strip.innerHTML = "";
  const files = REVISTA_JPG_FILES;
  const n = files.length;
  if (n === 0) {
    strip.innerHTML =
      '<p class="pdf-error">No hay JPG en <code>materia/revistajpg/</code>.</p>';
    return;
  }

  const plan = buildRevistaSpreadPlan(n);
  let eagerLeft = 8;

  for (const pageNums of plan) {
    const spread = document.createElement("div");
    const isSingle = pageNums.length === 1;
    spread.className = isSingle
      ? "pdf-spread pdf-spread--single revista-spread"
      : "pdf-spread pdf-spread--double revista-spread";
    spread.setAttribute("role", "group");
    spread.setAttribute(
      "aria-label",
      isSingle
        ? `Página ${pageNums[0]}`
        : `Páginas ${pageNums[0]} y ${pageNums[1]}`
    );

    for (const pageNum of pageNums) {
      const file = files[pageNum - 1];
      if (!file) continue;
      const img = document.createElement("img");
      img.className = "revista-page-img";
      img.src = revistaJpgUrl(file);
      img.alt = `Revista — página ${pageNum}`;
      img.decoding = "async";
      img.loading = eagerLeft-- > 0 ? "eager" : "lazy";
      spread.appendChild(img);
    }
    strip.appendChild(spread);
  }
}

function mapaJpgUrl(fileName) {
  return ["materia", "mapa", fileName]
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

/**
 * Galería del Este — botones sobre el SVG (coordenadas en % del contenedor).
 * Ajustá x/y hasta que coincidan con tu referencia; `jpg` apunta al archivo en materia/mapa/.
 */
const MAP_GALLERY_POINTS = [
  { id: "difusion", x: 20, y: 92, title: "Difusión", jpg: "Frame 75.jpg" },
  { id: "cine", x: 30, y: 68, title: "Sala / cine", jpg: "Frame 74.jpg" },
  { id: "circulacion", x: 55, y: 60, title: "Circulación", jpg: "Frame 77.jpg" },
  { id: "comunidad", x: 56, y: 36, title: "Comunidad", jpg: "Frame 76.jpg" },
  { id: "torre", x: 69, y: 30, title: "Espacio vertical", jpg: "Frame 78.jpg" },
  { id: "preservacion", x: 68, y: 46, title: "Preservación", jpg: "Frame 79.jpg" },
];

function initInteractiveMap() {
  const stage = document.getElementById("mapStage");
  if (!stage) return;

  MAP_GALLERY_POINTS.forEach((p) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "marker marker--map";
    btn.style.left = `${p.x}%`;
    btn.style.top = `${p.y}%`;
    btn.dataset.markerId = p.id;
    btn.setAttribute("aria-label", `Ampliar vista: ${p.title}`);

    btn.addEventListener("click", () => {
      openModal({
        title: "",
        body: "",
        imageSrc: mapaJpgUrl(p.jpg),
      });
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
  const imageWrap = document.getElementById("modalImageWrap");
  const panel = modal.querySelector(".modal-panel");
  const closeEls = Array.from(modal.querySelectorAll("[data-modal-close]"));

  modalEls = { modal, titleEl, bodyEl, imageWrap, panel };

  closeEls.forEach((el) =>
    el.addEventListener("click", () => {
      closeModal();
    })
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function openModal({ title, body, imageSrc }) {
  if (!modalEls) return;
  const { modal, titleEl, bodyEl, imageWrap, panel } = modalEls;

  modal.classList.toggle("modal--media-backdrop", Boolean(imageSrc));

  if (titleEl) titleEl.textContent = title || "";
  if (bodyEl) {
    bodyEl.textContent = body || "";
    bodyEl.hidden = Boolean(imageSrc) && !body;
  }

  if (imageWrap) {
    if (imageSrc) {
      imageWrap.hidden = false;
      imageWrap.innerHTML = "";
      const img = document.createElement("img");
      img.src = imageSrc;
      img.alt = "";
      img.loading = "eager";
      img.decoding = "async";
      img.style.cursor = "pointer";
      img.addEventListener("click", () => closeModal());
      imageWrap.appendChild(img);
    } else {
      imageWrap.hidden = true;
      imageWrap.innerHTML = "";
    }
  }

  if (panel) {
    panel.classList.toggle("modal-panel--with-image", Boolean(imageSrc));
    if (imageSrc) {
      panel.setAttribute(
        "aria-label",
        "Vista ampliada del mapa. Clic en la imagen o fuera para cerrar, o Escape."
      );
      panel.removeAttribute("aria-labelledby");
      panel.removeAttribute("aria-describedby");
    } else {
      panel.removeAttribute("aria-label");
      panel.setAttribute("aria-labelledby", "modalTitle");
      panel.setAttribute("aria-describedby", "modalBody");
    }
  }

  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!modalEls) return;
  const { modal, imageWrap, panel } = modalEls;
  modal.classList.remove("modal--media-backdrop");
  modal.setAttribute("aria-hidden", "true");
  if (imageWrap) {
    imageWrap.hidden = true;
    imageWrap.innerHTML = "";
  }
  if (panel) {
    panel.classList.remove("modal-panel--with-image");
    panel.removeAttribute("aria-label");
    panel.setAttribute("aria-labelledby", "modalTitle");
    panel.setAttribute("aria-describedby", "modalBody");
  }
  const bodyEl = modalEls.bodyEl;
  if (bodyEl) bodyEl.hidden = false;
}

if (page === "project" || page === "criollismo") {
  initModal();
}

if (page === "project") {
  initInteractiveMap();
  initRevistaJpgStrip();
}

if (page === "criollismo") {
  initPresCriollismoStack();
}
