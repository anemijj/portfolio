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
 *
 * `categories` puede tener varias tags. Filtros disponibles:
 *   "branding" · "3d" · "web" · "proceso" (este último = en proceso)
 * `inProcess` se modela aparte porque es un estado, no una categoría;
 * el filtro "proceso" matchea proyectos con inProcess === true.
 */
const projects = [
  {
    name: "El Público — Tesis",
    categories: ["branding", "3d", "web"],
    inProcess: false,
    image: iconPath("butaca 1.png"),
  },
  {
    name: "Recurso 50",
    categories: ["branding", "3d", "web"],
    inProcess: false,
    image: iconPath("Recurso 50 1.png"),
  },
  {
    name: "S4 G8",
    categories: ["3d"],
    inProcess: false,
    image: iconPath("6c8f988eb13b2eae0e430839e03248b4 1.png"),
  },
  {
    name: "la dolce vita",
    categories: ["branding"],
    inProcess: false,
    image: iconPath("trabajo 2-07 1.png"),
  },
  {
    name: "SOMA",
    categories: ["branding", "web"],
    inProcess: true,
    image: iconPath("Logo SOMA png sin texto-07 1.png"),
  },
  {
    name: "Café aesthetic",
    categories: ["branding"],
    inProcess: false,
    image: iconPath("cafe aesthetic 1.png"),
  },
  {
    name: "PC",
    categories: ["web"],
    inProcess: false,
    image: iconPath("pc 1.png"),
  },
  {
    name: "lookbook digital",
    categories: ["web"],
    inProcess: false,
    image: iconPath("cartita.png"),
  },
  {
    name: "vuelta griega",
    categories: ["3d"],
    inProcess: false,
    image: iconPath("tapa voladora.19 1.png"),
  },
  {
    name: "entorno inmersivo",
    categories: ["3d"],
    inProcess: false,
    image: iconPath("Rectangle.png"),
  },
];

/** Etiqueta legible de cada filtro (solo para el hint accesible). */
const FILTER_LABELS = {
  proceso: "en proceso",
  branding: "branding / identidad",
  "3d": "3d / espacial",
  web: "web",
};

let activeFilter = null; // "proceso" | "branding" | "3d" | "web" | null

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
    if (index === 4) {
      window.location.href = "soma.html";
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
  /* `data-categories` guarda las tags separadas por espacio para que
     el filtro pueda matchear con un attribute selector si hace falta;
     la lógica JS usa el array de `projects` directamente. */
  button.setAttribute("data-categories", project.categories.join(" "));
  button.setAttribute("data-process", project.inProcess ? "true" : "false");
  button.setAttribute("data-index", String(index));
  const stateLabel = project.inProcess ? ", en proceso" : "";
  const catLabel = project.categories
    .map((c) => FILTER_LABELS[c] || c)
    .join(", ");
  button.setAttribute(
    "aria-label",
    `${project.name} (${catLabel}${stateLabel})`
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
    let matches = true;
    if (activeFilter === "proceso") {
      matches = card.getAttribute("data-process") === "true";
    } else if (activeFilter) {
      const tags = (card.getAttribute("data-categories") || "").split(/\s+/);
      matches = tags.includes(activeFilter);
    }

    card.classList.toggle("is-dimmed", Boolean(activeFilter) && !matches);
    card.classList.toggle("is-active", Boolean(activeFilter) && matches);
  });

  if (!hint) return;
  const label = activeFilter ? FILTER_LABELS[activeFilter] || activeFilter : null;
  hint.textContent = label
    ? `Filtro activo: ${label}. Los demás proyectos se des-enfatizan con blur.`
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

/* =============================================================
   MANIFOLD — random.html
   Constelación 3D de imágenes y videos. Estructura intencional
   tipo "cuartos recorribles" (estilo manifold.art): los tiles se
   ubican en posiciones fijas y rotan SOLO en múltiplos de 45° en Y
   (0°, ±45°, ±90°), formando nichos / paredes que componen un
   espacio tridimensional. La escena entera responde al mouse con
   un parallax suave (rota la stage, no las posiciones).
   ============================================================= */

/* Layout orgánico estilo manifold.art.
   Ejes CSS: +X derecha, +Y abajo, +Z hacia cámara.
   - Mix de cuartos de 3 tiles (paredes + piso), pares de 2 paredes y
     tiles sueltos en ángulos arbitrarios.
   - Variación deliberada de z (-100 a +50) para que los cuartos
     se inter-penetren en pantalla y la escena tenga peso 3D.
   - Variación de tamaños: W ∈ [140, 210], H ∈ [180, 280].
   - Para una pareja de paredes en un corner (cx, cy, cz) con ancho W:
       k = W·cos(45°)/2 ≈ W·0.3536
       WallL: (cx − k, cy, cz + k), ry = +45
       WallR: (cx + k, cy, cz + k), ry = −45
     Comparten arista vertical exacta en (cx, _, cz).
   - Para el piso con altura H_floor:
       cy_floor = cy_wall + H_wall/2
       cz_floor = cz_wall − k_wall + H_floor/2  (alinea borde trasero
                  del piso con la base de la arista del corner)
       rx = +90  (cara visible apuntando hacia arriba)
   - Tiles sueltos: ry y rx libres, sin emparejamiento. */
const MANIFOLD_LAYOUT = [
  /* === CLUSTER A — mid-left, grande, adelante (album covers) === */
  /* corner (-200, -80, +30), W=210 H=270, k≈74.2 */
  { x: -274.2, y:  -80, z: 104.2, ry:  45,             w: 210, h: 210 },
  { x: -125.8, y:  -80, z: 104.2, ry: -45,             w: 210, h: 210 },
  { x: -200,   y:   35, z: 115,   ry: -45,         rx: 90,     w: 210, h: 210 },

  /* === CLUSTER B — top-center derecha, mediano, atrás === */
  /* corner (+80, -150, -40), W=170 H=220, k≈60.1 */
  { x:   19.9, y: -150, z:  20.1, ry:  45,             w: 170, h: 220 },
  { x:  140.1, y: -150, z:  20.1, ry: -45,             w: 170, h: 220 },
  { x:   80,   y:  -40, z:  35,             rx: 90,    w: 170, h: 150 },

  /* === CLUSTER C — mid-right, grande, frente === */
  /* corner (+220, +40, 0), W=200 H=260, k≈70.7 */
  { x:  320.3, y:   40, z:  70.7, ry:  45,             w: 200, h: 260 },
  { x:  440.7, y:   40, z:  70.7, ry: -45,             w: 200, h: 260 },
  { x:  390,   y:  170, z:  120,   ry: -45,  rx: 90,    w: 200, h: 160 },

  /* === CLUSTER D — bottom-left, mediano, atrás === */
  /* corner (-260, +110, -60), W=180 H=240, k≈63.6 */
  { x: -323.6, y:  110, z:   3.6, ry:  45,             w: 180, h: 240 },
  { x: -196.4, y:  110, z:   3.6, ry: -45,             w: 180, h: 240 },
  { x: -260,   y:  230, z:  15,             rx: 90,    w: 180, h: 150 },

  /* === CLUSTER E — bottom-center, par chico, frente === */
  /* corner (+30, +210, +50), W=160 H=210, k≈56.6 */
  { x:  -26.6, y:  210, z: 106.6, ry:  45,             w: 160, h: 210 },
  { x:   86.6, y:  210, z: 106.6, ry: -45,             w: 160, h: 210 },

  /* === CLUSTER F — top-left, par mediano, frente === */
  /* corner (-100, -240, +40), W=160 H=210, k≈56.6 */
  { x: -156.6, y: -240, z:  96.6, ry:  45,             w: 160, h: 210 },
  { x:  -43.4, y: -240, z:  96.6, ry: -45,             w: 160, h: 210 },

  /* === CLUSTER G — fondo profundo, par chico === */
  /* corner (+170, -10, -110), W=140 H=190, k≈49.5 */
  { x:  120.5, y:  -10, z: -60.5, ry:  45,             w: 140, h: 190 },
  { x:  219.5, y:  -10, z: -60.5, ry: -45,             w: 140, h: 190 },

  /* === SUELTOS — tiles aislados con ángulos varios === */
  /* Pared lateral izquierda, mira hacia adentro (right) */
  { x: -340, y: -160, z: -10, ry:  60,                 w: 160, h: 230 },
  /* Pared lateral derecha alta, mira hacia adentro (left) */
  { x:  340, y: -200, z:  10, ry: -55,                 w: 150, h: 220 },
  /* Tile bajo en ángulo suave (cuasi frontal) */
  { x:  -80, y:  240, z: -40, ry: -25,                 w: 150, h: 200 },
  /* Tile diagonal abajo-derecha */
  { x:  280, y:  250, z: -20, ry:  35,                 w: 150, h: 190 },
];

/* Helper: encodea cada segmento de path de manera independiente, así
   funcionan caracteres como "?", " ", "&" en nombres de archivo/carpeta. */
function manifoldUrl(p) {
  return p.split("/").map(encodeURIComponent).join("/");
}

/* MANIFOLD_MEDIA: cada item representa un tile.
   - src: ruta a la imagen/video que se ve en el tile.
   - type: "video" si corresponde (autodetectado por extensión también).
   - alt: texto descriptivo.
   - album: si está presente, el tile se vuelve clickeable y abre el
     lightbox con todas las imágenes/videos del array `images`.
   - href: link a otra página (NO se usa junto con album). */
const MANIFOLD_MEDIA = [
  /* Carruseles (covers) — siempre primero para ubicarlos en cuartos
     prominentes del layout. */
  {
    src: "materia/?web/ccp/A4 - 1.jpg",
    alt: "ccp — proyecto editorial",
    album: {
      title: "ccp",
      images: [
        "materia/?web/ccp/A4 - 1.jpg",
        "materia/?web/ccp/A4 - 2.jpg",
        "materia/?web/ccp/A4 - 3.jpg",
        "materia/?web/ccp/A4 - 4.jpg",
      ],
    },
  },
  {
    src: "materia/?web/reviews/Instagram post - 1.jpg",
    alt: "reviews — serie para Instagram",
    album: {
      title: "reviews",
      images: [
        "materia/?web/reviews/Instagram post - 1.jpg",
        "materia/?web/reviews/Instagram post - 2.jpg",
        "materia/?web/reviews/Instagram post - 3.jpg",
        "materia/?web/reviews/Instagram post - 4.jpg",
        "materia/?web/reviews/Instagram post - 5.jpg",
        "materia/?web/reviews/Instagram post - 6.jpg",
      ],
    },
  },

  /* Resto de archivos sueltos en ?web/ */
  { src: "materia/?web/IMG_2866.JPG", alt: "" },
  { src: "materia/?web/IMG_2874.JPG", alt: "" },
  { src: "materia/?web/IMG_2877.JPG", alt: "" },
  { src: "materia/?web/IMG_2878.JPG", alt: "" },
  { src: "materia/?web/IMG_2884.jpg", alt: "" },
  { src: "materia/?web/IMG_2888.JPG", alt: "" },
  { src: "materia/?web/IMG_2889.JPG", alt: "" },
  { src: "materia/?web/IMG_2896.JPG", alt: "" },
  { src: "materia/?web/IMG_2897.JPG", alt: "" },
  { src: "materia/?web/IMG_2898.JPG", alt: "" },
  { src: "materia/?web/IMG_2899.JPG", alt: "" },
  { src: "materia/?web/IMG_2900.JPG", alt: "" },
  { src: "materia/?web/IMG_9693.JPG", alt: "" },
  { src: "materia/?web/IMG_9712.jpg", alt: "" },
  { src: "materia/?web/IMG_9728.JPG", alt: "" },
  { src: "materia/?web/IMG_9778.JPG", alt: "" },
  { src: "materia/?web/778f6c1c-cdea-434a-9cfa-420b04336855.jpg", alt: "" },
  { src: "materia/?web/778f6c1c-cdea-434a-9cfa-420b04336855 2.JPG", alt: "" },
  { src: "materia/?web/3-1.mp4", type: "video", alt: "" },
  { src: "materia/?web/gorrito.mp4", type: "video", alt: "" },
];

/* Lightbox modal para los álbumes del manifold (carruseles tipo
   ccp / reviews). Se cuelga de #manifoldLightbox que está en
   random.html. Maneja teclado (← → Esc), prev/next y close. */
function initManifoldLightbox(stage) {
  const overlay = document.getElementById("manifoldLightbox");
  if (!overlay) return;
  const stageEl = overlay.querySelector(".ml-stage");
  const counter = overlay.querySelector("#mlCounter");
  const titleEl = overlay.querySelector("#mlTitle");
  const closeBtn = overlay.querySelector(".ml-close");
  const prevBtn = overlay.querySelector(".ml-prev");
  const nextBtn = overlay.querySelector(".ml-next");

  let images = [];
  let index = 0;
  let albumTitle = "";
  let lastFocused = null;

  function render() {
    if (!stageEl) return;
    stageEl.innerHTML = "";
    const src = images[index];
    if (!src) return;
    const isVideo = /\.(mp4|webm|mov)$/i.test(src);
    const el = document.createElement(isVideo ? "video" : "img");
    el.src = manifoldUrl(src);
    if (isVideo) {
      el.controls = true;
      el.autoplay = true;
      el.muted = false;
      el.playsInline = true;
      el.setAttribute("playsinline", "");
    } else {
      el.alt = albumTitle ? `${albumTitle} ${index + 1}` : "";
      el.decoding = "async";
    }
    stageEl.appendChild(el);

    if (counter) {
      counter.textContent = `${index + 1} / ${images.length}`;
    }
    if (titleEl) {
      titleEl.textContent = albumTitle;
    }
    const single = images.length <= 1;
    if (prevBtn) prevBtn.hidden = single;
    if (nextBtn) nextBtn.hidden = single;
  }

  function open(album, startIndex = 0) {
    images = album.images.slice();
    albumTitle = album.title || "";
    index = Math.max(0, Math.min(startIndex, images.length - 1));
    lastFocused = document.activeElement;
    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("manifold-lock");
    render();
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("manifold-lock");
    if (stageEl) stageEl.innerHTML = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  function step(delta) {
    if (!images.length) return;
    index = (index + delta + images.length) % images.length;
    render();
  }

  if (closeBtn) closeBtn.addEventListener("click", close);
  if (prevBtn) prevBtn.addEventListener("click", () => step(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => step(1));

  /* Click en backdrop (no en stage ni controles) cierra. */
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener("keydown", (e) => {
    if (overlay.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  });

  /* Delegación: cualquier tile con álbum dispara el lightbox. */
  if (stage) {
    stage.addEventListener("click", (e) => {
      const tile = e.target.closest(".manifold-tile--album");
      if (!tile) return;
      const idx = Number(tile.dataset.albumIndex);
      const item = MANIFOLD_MEDIA[idx];
      if (!item || !item.album) return;
      e.preventDefault();
      open(item.album, 0);
    });
  }
}

function initManifold() {
  const stage = document.getElementById("manifoldStage");
  const scene = document.getElementById("manifoldScene");
  if (!stage || !scene) return;

  /* Cantidad de tiles a renderizar = mínimo entre slots y medios,
     así nunca quedan slots vacíos ni medios sin posición. */
  const count = Math.min(MANIFOLD_LAYOUT.length, MANIFOLD_MEDIA.length);

  for (let i = 0; i < count; i++) {
    const item = MANIFOLD_MEDIA[i];
    const slot = MANIFOLD_LAYOUT[i];
    const hasAlbum = Boolean(item.album && Array.isArray(item.album.images));
    const isLink = Boolean(item.href) && !hasAlbum;

    /* Tag elegido: <a> si navega a otra página, <button> si abre el
       lightbox del álbum, <figure> si es solo decorativo. */
    let tagName = "figure";
    if (isLink) tagName = "a";
    else if (hasAlbum) tagName = "button";

    const tile = document.createElement(tagName);
    tile.className = "manifold-tile";
    if (isLink) {
      tile.href = item.href;
      tile.setAttribute("aria-label", item.alt || "Abrir proyecto");
    } else if (hasAlbum) {
      tile.type = "button";
      tile.classList.add("manifold-tile--album");
      tile.setAttribute(
        "aria-label",
        `Abrir galería: ${item.album.title || item.alt || "ver más"}`
      );
      tile.dataset.albumIndex = String(i);
    }

    tile.style.setProperty("--tile-x", `${slot.x}px`);
    tile.style.setProperty("--tile-y", `${slot.y}px`);
    tile.style.setProperty("--tile-z", `${slot.z}px`);
    tile.style.setProperty("--tile-ry", `${slot.ry || 0}deg`);
    tile.style.setProperty("--tile-rx", `${slot.rx || 0}deg`);
    tile.style.setProperty("--tile-w", `${slot.w}px`);
    tile.style.setProperty("--tile-h", `${slot.h}px`);

    const isVideo =
      item.type === "video" || /\.(mp4|webm|mov)$/i.test(item.src);

    let media;
    if (isVideo) {
      media = document.createElement("video");
      media.src = manifoldUrl(item.src);
      media.autoplay = true;
      media.muted = true;
      media.loop = true;
      media.playsInline = true;
      media.setAttribute("playsinline", "");
      media.preload = "metadata";
    } else {
      media = document.createElement("img");
      media.src = manifoldUrl(item.src);
      media.alt = item.alt || "";
      media.loading = "lazy";
      media.decoding = "async";
    }

    tile.appendChild(media);
    stage.appendChild(tile);
  }

  initManifoldLightbox(stage);

  /* ----- Parallax: la stage rota con el cursor sobre un tilt base ----- */

  /* Tilt base más fuerte: -15° en X (cámara mirando claramente "desde
     arriba" la escena). Sin esto, los pisos quedan edge-on y la
     escena se lee como un plano dividido en vez de cuartos 3D. */
  const BASE_RX = -15;
  const BASE_RY = 0;

  let targetRx = 0;
  let targetRy = 0;
  let currentRx = 0;
  let currentRy = 0;

  function setPointer(clientX, clientY) {
    const rect = scene.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width - 0.5; // -0.5..+0.5
    const py = (clientY - rect.top) / rect.height - 0.5;
    /* Range moderado: la galería respira pero no se abre tanto como
       para perder la lectura de cuartos. */
    targetRy = px * 18;
    targetRx = -py * 10;
  }

  scene.addEventListener("mousemove", (e) => setPointer(e.clientX, e.clientY));
  scene.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (t) setPointer(t.clientX, t.clientY);
    },
    { passive: true }
  );
  scene.addEventListener("mouseleave", () => {
    targetRx = 0;
    targetRy = 0;
  });

  function tick() {
    currentRx += (targetRx - currentRx) * 0.08;
    currentRy += (targetRy - currentRy) * 0.08;
    stage.style.setProperty(
      "--scene-rx",
      `${(currentRx + BASE_RX).toFixed(2)}deg`
    );
    stage.style.setProperty(
      "--scene-ry",
      `${(currentRy + BASE_RY).toFixed(2)}deg`
    );
    requestAnimationFrame(tick);
  }
  /* Sin transición CSS — la suavidad la da el rAF. */
  stage.style.transition = "none";
  requestAnimationFrame(tick);
}

if (document.getElementById("manifoldStage")) {
  initManifold();
}
