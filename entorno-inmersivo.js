/**
 * Entorno inmersivo — visor de video 360° equirectangular.
 *
 * Estrategia:
 * - Video oculto (<video id="vr360Video">) alimenta una THREE.VideoTexture.
 * - Se mapea sobre una SphereGeometry usando side: BackSide, lo que equivale
 *   a verla "desde adentro": la cámara en el centro mira hacia las paredes.
 * - Drag del puntero (mouse o touch) desplaza longitud/latitud de la cámara.
 *   Rueda/pinch ajusta el FOV (zoom). Flechas del teclado también rotan.
 * - Autoplay siempre muted (política de navegadores). Botón de sonido alterna
 *   el mute y, si hace falta, vuelve a disparar play().
 * - Si WebGL o la carga del video fallan, se muestra un fallback con el
 *   <video> plano a pantalla completa del contenedor.
 *
 * Requiere que `vendor/three.min.js` se haya cargado antes (expone `THREE`).
 */
(function () {
  const VIDEO_SRC = "materia/vr-1.mov";

  const root = document.getElementById("vr360Root");
  const videoEl = document.getElementById("vr360Video");
  const fallbackVideo = document.getElementById("vr360Fallback");
  const overlay = document.getElementById("vr360PlayOverlay");
  const muteBtn = document.getElementById("vr360Mute");
  const resetBtn = document.getElementById("vr360Reset");
  const helpEl = document.getElementById("vr360Help");
  const ui = root ? root.querySelector(".vr360-ui") : null;

  if (!root || !videoEl) return;

  videoEl.src = VIDEO_SRC;
  videoEl.load();

  function showFallback(msg) {
    if (fallbackVideo) {
      fallbackVideo.src = VIDEO_SRC;
      fallbackVideo.hidden = false;
      fallbackVideo.muted = videoEl.muted;
      fallbackVideo.play().catch(() => {});
    }
    if (ui) ui.hidden = false;
    if (overlay) overlay.hidden = true;
    if (msg && !fallbackVideo) {
      root.innerHTML = `<p class="vr360-fallback">${msg}</p>`;
    }
  }

  if (typeof window.THREE === "undefined") {
    showFallback(
      "No se pudo cargar el visor 360° en este navegador. Te mostramos el video plano."
    );
    return;
  }
  const THREE = window.THREE;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch (_) {
    showFallback(
      "Tu navegador no soporta WebGL. Te mostramos el video plano como alternativa."
    );
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x0a0a0a, 1);
  root.prepend(renderer.domElement);
  if (fallbackVideo) fallbackVideo.hidden = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(72, 1, 0.1, 2000);
  camera.position.set(0, 0, 0);

  const geometry = new THREE.SphereGeometry(500, 96, 64);

  const texture = new THREE.VideoTexture(videoEl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  });
  scene.add(new THREE.Mesh(geometry, material));

  /* ---------------- Cámara ---------------- */

  let lon = 0;
  let lat = 0;
  let fov = 72;
  let hasInteracted = false;

  function updateCamera() {
    lat = Math.max(-85, Math.min(85, lat));
    fov = Math.max(35, Math.min(95, fov));
    camera.fov = fov;
    camera.updateProjectionMatrix();
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);
    camera.lookAt(
      500 * Math.sin(phi) * Math.cos(theta),
      500 * Math.cos(phi),
      500 * Math.sin(phi) * Math.sin(theta)
    );
  }

  function resize() {
    const w = root.clientWidth;
    const h = root.clientHeight;
    if (w < 2 || h < 2) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(root);
  resize();
  updateCamera();

  /* ---------------- Drag ---------------- */

  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  const DRAG_FACTOR = 0.22;

  function onPointerDown(e) {
    if (e.target instanceof Element && e.target.closest(".vr360-ui")) return;
    dragging = true;
    hasInteracted = true;
    lastX = e.clientX;
    lastY = e.clientY;
    root.classList.add("is-dragging");
    try {
      root.setPointerCapture(e.pointerId);
    } catch (_) {
      /* noop */
    }
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    lon -= dx * DRAG_FACTOR;
    lat += dy * DRAG_FACTOR;
    updateCamera();
  }

  function endDrag() {
    dragging = false;
    root.classList.remove("is-dragging");
  }

  root.addEventListener("pointerdown", onPointerDown);
  root.addEventListener("pointermove", onPointerMove);
  root.addEventListener("pointerup", endDrag);
  root.addEventListener("pointercancel", endDrag);
  root.addEventListener("pointerleave", endDrag);

  /* ---------------- Zoom (wheel) ---------------- */

  root.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      hasInteracted = true;
      fov += e.deltaY * 0.04;
      updateCamera();
    },
    { passive: false }
  );

  /* ---------------- Teclado ---------------- */

  root.tabIndex = 0;
  root.addEventListener("keydown", (e) => {
    let handled = true;
    if (e.key === "ArrowLeft") lon -= 4;
    else if (e.key === "ArrowRight") lon += 4;
    else if (e.key === "ArrowUp") lat += 3;
    else if (e.key === "ArrowDown") lat -= 3;
    else if (e.key === "+" || e.key === "=") fov -= 3;
    else if (e.key === "-" || e.key === "_") fov += 3;
    else if (e.key === "Home") {
      lon = 0;
      lat = 0;
      fov = 72;
    } else handled = false;
    if (handled) {
      hasInteracted = true;
      updateCamera();
      e.preventDefault();
    }
  });

  /* ---------------- Botones ---------------- */

  function refreshMute() {
    if (!muteBtn) return;
    const active = !videoEl.muted;
    muteBtn.setAttribute("aria-pressed", active ? "true" : "false");
    muteBtn.setAttribute(
      "aria-label",
      active ? "Silenciar video" : "Activar sonido"
    );
    muteBtn.textContent = active ? "Sonido: ON" : "Sonido: OFF";
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      videoEl.muted = !videoEl.muted;
      if (!videoEl.muted && videoEl.paused) {
        videoEl.play().catch(() => {
          /* si el navegador lo bloquea, lo deja muteado igual */
          videoEl.muted = true;
          refreshMute();
        });
      }
      refreshMute();
    });
    refreshMute();
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      lon = 0;
      lat = 0;
      fov = 72;
      updateCamera();
      root.focus();
    });
  }

  /* ---------------- Playback ---------------- */

  function tryPlay() {
    const p = videoEl.play();
    if (p && typeof p.catch === "function") {
      p
        .then(() => {
          if (overlay) overlay.hidden = true;
        })
        .catch(() => {
          if (overlay) overlay.hidden = false;
        });
    }
  }

  if (overlay) {
    overlay.hidden = true;
    overlay.addEventListener("click", () => {
      videoEl.play().then(() => {
        overlay.hidden = true;
        root.focus();
      }).catch(() => {});
    });
  }

  videoEl.addEventListener("loadeddata", () => {
    resize();
    updateCamera();
    if (helpEl) helpEl.hidden = false;
  });

  videoEl.addEventListener("error", () => {
    showFallback(
      "No se pudo cargar el video 360°. Verificá tu conexión o probá recargar."
    );
  });

  tryPlay();

  /* Si el video no llega a arrancar en 6s (ej. red lenta o bloqueo de
     autoplay), mostramos el overlay para que el usuario lo active. */
  window.setTimeout(() => {
    if (videoEl.readyState < videoEl.HAVE_CURRENT_DATA) {
      if (overlay) overlay.hidden = false;
    }
  }, 6000);

  /* ---------------- Loop ---------------- */

  function animate() {
    requestAnimationFrame(animate);
    /* Rotación idle muy leve hasta que el usuario interactúa, para dejar
       claro que es un entorno 360 explorable. */
    if (!hasInteracted) {
      lon += 0.03;
      updateCamera();
    }
    if (videoEl.readyState >= videoEl.HAVE_CURRENT_DATA) {
      texture.needsUpdate = true;
    }
    renderer.render(scene, camera);
  }
  animate();

  /* Ocultar el hint flotante cuando el usuario ya entendió que puede
     arrastrar. */
  root.addEventListener(
    "pointerdown",
    () => {
      if (helpEl) helpEl.classList.add("is-hidden");
    },
    { once: true }
  );
})();
