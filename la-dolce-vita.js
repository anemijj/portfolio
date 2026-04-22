/**
 * la dolce vita — collage 3D a pantalla completa; clic → modal con detalle.
 * Fanzine: materia/la dolce vita/fanzine la dolce vita jpgs/
 */
(function () {
  const stage = document.getElementById("dolceStage");
  const modal = document.getElementById("dolceModal");
  const modalTitle = document.getElementById("dolceModalTitle");
  const modalBody = document.getElementById("dolceModalBody");
  const modalMedia = document.getElementById("dolceModalMedia");
  if (!stage || !modal || !modalTitle || !modalBody || !modalMedia) return;

  const BASE = `materia/${encodeURIComponent("la dolce vita")}/`;
  const FANZINE_BASE =
    BASE +
    `${encodeURIComponent("fanzine la dolce vita jpgs")}/`;

  const FANZINE_PAGES = [];
  for (let n = 1; n <= 12; n += 1) {
    const num = String(n).padStart(4, "0");
    FANZINE_PAGES.push(`Haddad-S2-Editorial_page-${num}.jpg`);
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /** Posiciones más separadas (menos choque); brochures en columna izquierda */
  const pieces = [
    {
      type: "img",
      file: "Haddad-S2-brochure1.jpg",
      group: "brochure",
      title: "Brochure — lámina 1",
      detail:
        "Primera cara del brochure: tipografía y ritmo de la pieza editorial.",
      left: "5%",
      top: "4%",
      w: "19%",
      rotZ: -5,
      rotX: 4,
      rotY: -8,
      z: 3,
      depth: 0.3,
    },
    {
      type: "img",
      file: "Haddad-S2-brochure2.jpg",
      group: "brochure",
      title: "Brochure — lámina 2",
      detail: "Segunda lámina del brochure, continuidad del relato visual.",
      left: "5%",
      top: "22%",
      w: "19%",
      rotZ: 3,
      rotX: -3,
      rotY: 10,
      z: 4,
      depth: 0.36,
    },
    {
      type: "img",
      file: "Haddad-S2-brochure3.jpg",
      group: "brochure",
      title: "Brochure — lámina 3",
      detail: "Tercera lámina: cierre de bloque y contraste con las anteriores.",
      left: "5%",
      top: "40%",
      w: "19%",
      rotZ: -2,
      rotX: 5,
      rotY: -6,
      z: 2,
      depth: 0.32,
    },
    {
      type: "img",
      file: "Haddad-S2-brochure4.jpg",
      group: "brochure",
      title: "Brochure — lámina 4",
      detail: "Cuarta lámina del brochure, desenlace del folleto.",
      left: "5%",
      top: "58%",
      w: "19%",
      rotZ: 6,
      rotX: -4,
      rotY: 11,
      z: 5,
      depth: 0.4,
    },
    {
      type: "img",
      file: "Haddad-S2-postal1.jpg",
      group: "postal",
      title: "Postal 1",
      detail: "Frente de postal — pieza suelta del set de correspondencia.",
      left: "62%",
      top: "5%",
      w: "14%",
      rotZ: -12,
      rotX: 6,
      rotY: 14,
      z: 6,
      depth: 0.48,
    },
    {
      type: "img",
      file: "Haddad-S2-postal2.jpg",
      group: "postal",
      title: "Postal 2",
      detail: "Postal con variación de color y composición respecto a la 1.",
      left: "80%",
      top: "8%",
      w: "13%",
      rotZ: 12,
      rotX: -5,
      rotY: -12,
      z: 4,
      depth: 0.38,
    },
    {
      type: "img",
      file: "Haddad-S2-postal3.jpg",
      group: "postal",
      title: "Postal 3",
      detail: "Tercera postal del set, encuadre más abierto.",
      left: "60%",
      top: "24%",
      w: "14%",
      rotZ: -7,
      rotX: 4,
      rotY: 9,
      z: 7,
      depth: 0.45,
    },
    {
      type: "img",
      file: "Haddad-S2-postal4.jpg",
      group: "postal",
      title: "Postal 4",
      detail: "Detalle gráfico y textura propia de esta variante.",
      left: "78%",
      top: "30%",
      w: "13%",
      rotZ: 9,
      rotX: -6,
      rotY: -9,
      z: 3,
      depth: 0.34,
    },
    {
      type: "img",
      file: "Haddad-S2-postal5.jpg",
      group: "postal",
      title: "Postal 5",
      detail: "Quinta postal — juego tipográfico y fotografía.",
      left: "58%",
      top: "46%",
      w: "14%",
      rotZ: -10,
      rotX: 5,
      rotY: 12,
      z: 5,
      depth: 0.42,
    },
    {
      type: "img",
      file: "Haddad-S2-postal6.jpg",
      group: "postal",
      title: "Postal 6",
      detail: "Última postal numerada del frente.",
      left: "76%",
      top: "52%",
      w: "13%",
      rotZ: 7,
      rotX: -4,
      rotY: -10,
      z: 4,
      depth: 0.36,
    },
    {
      type: "img",
      file: "Haddad-S2-postalEXTRA.jpg",
      group: "postal",
      title: "Postal extra",
      detail: "Variante adicional fuera de la numeración principal.",
      left: "66%",
      top: "68%",
      w: "12%",
      rotZ: -14,
      rotX: 8,
      rotY: 16,
      z: 8,
      depth: 0.5,
    },
    {
      type: "img",
      file: "Haddad-S2-PARTE DE ATRAS DE LAS POSTALES.jpg",
      group: "postal-reverso",
      title: "Reverso de las postales",
      detail:
        "Lámina con el dorso / mensajes del set: complementa los frentes de las postales.",
      left: "28%",
      top: "70%",
      w: "30%",
      rotZ: 2,
      rotX: -2,
      rotY: -6,
      z: 1,
      depth: 0.2,
    },
    {
      type: "img",
      file: "Haddad-S2-AFICHE.jpg",
      group: "afiche",
      title: "Afiche",
      detail: "Pieza principal de afiche, escala y lectura a distancia.",
      left: "32%",
      top: "1%",
      w: "26%",
      rotZ: -4,
      rotX: 3,
      rotY: 5,
      z: 9,
      depth: 0.55,
    },
    {
      type: "img",
      file: "Haddad-S2-aficheta1.jpg",
      group: "afiche",
      title: "Aficheta 1",
      detail: "Primera aficheta del sistema de piezas chicas.",
      left: "22%",
      top: "82%",
      w: "14%",
      rotZ: 11,
      rotX: -6,
      rotY: -12,
      z: 6,
      depth: 0.42,
    },
    {
      type: "img",
      file: "Haddad-S2-aficheta2.jpg",
      group: "afiche",
      title: "Aficheta 2",
      detail: "Segunda aficheta, variación cromática.",
      left: "8%",
      top: "78%",
      w: "13%",
      rotZ: -8,
      rotX: 4,
      rotY: 10,
      z: 4,
      depth: 0.38,
    },
    {
      type: "img",
      file: "Haddad-S2-aficheta3.jpg",
      group: "afiche",
      title: "Aficheta 3",
      detail: "Tercera aficheta del trío.",
      left: "84%",
      top: "72%",
      w: "13%",
      rotZ: 8,
      rotX: -5,
      rotY: -11,
      z: 5,
      depth: 0.4,
    },
    {
      type: "img",
      file: "Haddad-S2-pieza extra 1.jpg",
      group: "extra",
      title: "Pieza extra 1",
      detail: "Material gráfico complementario del proyecto.",
      left: "4%",
      top: "8%",
      w: "12%",
      rotZ: -14,
      rotX: 8,
      rotY: 18,
      z: 10,
      depth: 0.52,
    },
    {
      type: "img",
      file: "Haddad-S2-pieza extra2.jpg",
      group: "extra",
      title: "Pieza extra 2",
      detail: "Segunda pieza extra, cierre de volumen menor.",
      left: "4%",
      top: "88%",
      w: "12%",
      rotZ: 11,
      rotX: -6,
      rotY: -14,
      z: 3,
      depth: 0.32,
    },
    {
      type: "fanzine",
      group: "fanzine",
      title: "Fanzine — La dolce vita",
      detail:
        "Pasá con el scroll para ver todas las páginas. Al final podés abrir el PDF original.",
      left: "37%",
      top: "94%",
      w: "26%",
      rotZ: -2,
      rotX: 2,
      rotY: 3,
      z: 12,
      depth: 0.65,
    },
  ];

  const els = [];
  const hovered = new Set();

  function buildTransform(p, scrollY, tiltX, tiltY) {
    const parallax = prefersReducedMotion ? 0 : scrollY * p.depth * 0.04;
    const rx = p.rotX + tiltX * 0.32;
    const ry = p.rotY + tiltY * 0.32;
    const rz = p.rotZ + tiltY * 0.07;
    return (
      `translate3d(0, ${parallax}px, 0) ` +
      `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`
    );
  }

  function openModal(p) {
    modalTitle.textContent = p.title;
    modalBody.textContent = p.detail;
    modalMedia.innerHTML = "";
    modalMedia.hidden = true;

    if (p.type === "img") {
      const img = document.createElement("img");
      img.src = BASE + encodeURIComponent(p.file);
      img.alt = p.title;
      img.loading = "eager";
      modalMedia.appendChild(img);
      modalMedia.hidden = false;
    } else if (p.type === "fanzine") {
      const scroll = document.createElement("div");
      scroll.className = "dolce-modal-fanzine-scroll";
      FANZINE_PAGES.forEach((fn) => {
        const im = document.createElement("img");
        im.src = FANZINE_BASE + encodeURIComponent(fn);
        im.alt = fn;
        im.loading = "lazy";
        scroll.appendChild(im);
      });
      const a = document.createElement("a");
      a.className = "dolce-modal-pdf-link";
      a.href = `${BASE}${encodeURIComponent("Haddad-S2-Editorial.pdf")}`;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Abrir PDF original";
      scroll.appendChild(a);
      modalMedia.appendChild(scroll);
      modalMedia.hidden = false;
    }

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const closeBtn = modal.querySelector(".dolce-modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalMedia.innerHTML = "";
    modalMedia.hidden = true;
  }

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-dolce-close]")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  pieces.forEach((p, idx) => {
    const el = document.createElement("div");
    el.className = "dolce-piece";
    el.dataset.group = p.group;
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", p.title);
    el.style.left = p.left;
    el.style.top = p.top;
    el.style.width = p.w;
    el.style.zIndex = String(p.z);
    el.dataset.pieceIndex = String(idx);

    if (p.type === "fanzine") {
      el.classList.add("dolce-piece--fanzine");
      const book = document.createElement("div");
      book.className = "dolce-book";
      const inner = document.createElement("div");
      inner.className = "dolce-book-inner";

      const left = document.createElement("div");
      left.className = "dolce-book-spread dolce-book-spread--left";
      const imgL = document.createElement("img");
      imgL.src = FANZINE_BASE + encodeURIComponent(FANZINE_PAGES[0]);
      imgL.alt = "";
      imgL.loading = "eager";
      imgL.decoding = "async";
      left.appendChild(imgL);

      const spine = document.createElement("div");
      spine.className = "dolce-book-spine";
      spine.setAttribute("aria-hidden", "true");

      const right = document.createElement("div");
      right.className = "dolce-book-spread dolce-book-spread--right";
      const imgR = document.createElement("img");
      imgR.src = FANZINE_BASE + encodeURIComponent(FANZINE_PAGES[1]);
      imgR.alt = "";
      imgR.loading = "eager";
      imgR.decoding = "async";
      right.appendChild(imgR);

      inner.appendChild(left);
      inner.appendChild(spine);
      inner.appendChild(right);
      book.appendChild(inner);
      el.appendChild(book);
    } else {
      const img = document.createElement("img");
      img.src = BASE + encodeURIComponent(p.file);
      img.alt = p.title;
      img.loading = "lazy";
      img.decoding = "async";
      el.appendChild(img);
    }

    function activate() {
      openModal(p);
    }

    if (p.type === "fanzine") {
      let press = null;
      el.addEventListener("pointerdown", (e) => {
        press = { x: e.clientX, y: e.clientY };
      });
      el.addEventListener("pointerup", (e) => {
        if (!press) return;
        const d = Math.hypot(e.clientX - press.x, e.clientY - press.y);
        press = null;
        if (d > 18) return;
        activate();
      });
    } else {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        activate();
      });
    }

    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });

    stage.appendChild(el);
    els.push({ el, p });
  });

  let scrollY = window.scrollY || 0;
  let tiltX = 0;
  let tiltY = 0;
  let targetTiltX = 0;
  let targetTiltY = 0;

  function applyPieceTransforms() {
    els.forEach(({ el, p }) => {
      let t = buildTransform(p, scrollY, tiltX, tiltY);
      if (hovered.has(el)) t += " scale(1.03)";
      el.style.transform = t;
    });
  }

  function applyStageTilt() {
    if (prefersReducedMotion) return;
    stage.style.transform =
      `rotateX(${tiltX * 0.05}deg) rotateY(${tiltY * 0.045}deg)`;
  }

  function onScroll() {
    scrollY = window.scrollY || 0;
    applyPieceTransforms();
  }

  function onPointerMove(e) {
    if (prefersReducedMotion) return;
    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.5;
    targetTiltX = ((e.clientY - cy) / cy) * -16;
    targetTiltY = ((e.clientX - cx) / cx) * 16;
  }

  function tick() {
    tiltX += (targetTiltX - tiltX) * 0.08;
    tiltY += (targetTiltY - tiltY) * 0.08;
    applyPieceTransforms();
    applyStageTilt();
    requestAnimationFrame(tick);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  applyPieceTransforms();
  applyStageTilt();
  if (!prefersReducedMotion) {
    requestAnimationFrame(tick);
  }

  els.forEach(({ el }) => {
    el.addEventListener("pointerenter", () => {
      hovered.add(el);
    });
    el.addEventListener("pointerleave", () => {
      hovered.delete(el);
    });
  });
})();
