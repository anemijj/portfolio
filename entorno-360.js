/**
 * Visor 360: video equirectangular en esfera Three.js.
 * Si Three/WebGL falla, queda visible el fallback en video normal.
 */
const VIDEO_SRC = "materia/archivos%20faltantes%20pc/entorno.mp4";
const PROJECTION_MODE_DEFAULT = "right";

function main() {
  const host = document.getElementById("vr360-root");
  const videoEl = document.getElementById("vr360-video");
  const fallbackVideo = document.getElementById("vr360-fallback-video");
  if (!host || !videoEl) return;
  videoEl.src = VIDEO_SRC;
  videoEl.load();

  const overlay = document.getElementById("vr360-play-overlay");
  const playToggle = document.getElementById("vr360-play-toggle");
  const eyeToggle = document.getElementById("vr360-eye-toggle");
  const resetView = document.getElementById("vr360-reset-view");
  const ui = host.querySelector(".vr360-ui");

  // Fallback visible por defecto: solo ocultar si el 360 inicia.
  if (overlay) overlay.hidden = true;
  if (ui) ui.hidden = true;
  if (fallbackVideo) {
    fallbackVideo.hidden = false;
    fallbackVideo.play().catch(() => {});
  }

  function showFallback(reasonText) {
    if (fallbackVideo) {
      fallbackVideo.hidden = false;
      fallbackVideo.currentTime = videoEl.currentTime || 0;
      fallbackVideo.play().catch(() => {});
    }
    if (overlay) {
      overlay.hidden = true;
    }
    if (ui) {
      ui.hidden = true;
    }
    if (reasonText && !fallbackVideo) {
      host.innerHTML = `<p class="vr360-fallback">${reasonText}</p>`;
    }
  }

  if (typeof window.THREE === "undefined") {
    showFallback("No se pudo cargar el visor 360 en este navegador/conexión. Te mostramos el video normal.");
    return;
  }
  const THREE = window.THREE;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
  camera.position.set(0, 0, 0);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch (_) {
    showFallback("Tu navegador no pudo iniciar WebGL para el visor 360. Te mostramos el video en modo normal.");
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x111111, 1);
  host.prepend(renderer.domElement);
  if (fallbackVideo) fallbackVideo.hidden = true;
  if (overlay) overlay.hidden = false;
  if (ui) ui.hidden = false;

  const geometry = new THREE.SphereGeometry(500, 96, 64);

  const texture = new THREE.VideoTexture(videoEl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  const projectionModes = ["full", "right", "left", "top", "bottom"];
  let projectionMode = PROJECTION_MODE_DEFAULT;
  function applyProjectionMode() {
    if (projectionMode === "full") {
      texture.repeat.set(1, 1);
      texture.offset.set(0, 0);
    } else if (projectionMode === "right") {
      texture.repeat.set(0.5, 1);
      texture.offset.set(0.5, 0);
    } else if (projectionMode === "left") {
      texture.repeat.set(0.5, 1);
      texture.offset.set(0, 0);
    } else if (projectionMode === "top") {
      texture.repeat.set(1, 0.5);
      texture.offset.set(0, 0.5);
    } else if (projectionMode === "bottom") {
      texture.repeat.set(1, 0.5);
      texture.offset.set(0, 0);
    }
    texture.needsUpdate = true;
    if (eyeToggle) {
      const labels = {
        full: "Formato: completo",
        right: "Formato: derecha",
        left: "Formato: izquierda",
        top: "Formato: arriba",
        bottom: "Formato: abajo",
      };
      eyeToggle.textContent = labels[projectionMode];
    }
  }
  applyProjectionMode();

  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let lon = 0;
  let lat = 0;
  let fov = 60;
  let dragging = false;
  let interacted = false;
  let lastX = 0;
  let lastY = 0;
  const factor = 0.2;

  function updateCamera() {
    lat = Math.max(-85, Math.min(85, lat));
    fov = Math.max(35, Math.min(90, fov));
    camera.fov = fov;
    camera.updateProjectionMatrix();
    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);
    const x = 500 * Math.sin(phi) * Math.cos(theta);
    const y = 500 * Math.cos(phi);
    const z = 500 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(x, y, z);
  }

  function resize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (w < 2 || h < 2) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(host);

  function onPointerDown(e) {
    if (e.target instanceof Element && e.target.closest(".vr360-ui")) return;
    interacted = true;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    try {
      host.setPointerCapture(e.pointerId);
    } catch (_) {
      /* noop */
    }
  }

  function onPointerUp() {
    dragging = false;
  }

  function onPointerMove(e) {
    if (!dragging) return;
    let dx = e.movementX;
    let dy = e.movementY;
    if (dx === 0 && dy === 0 && e.pointerType === "touch") {
      dx = e.clientX - lastX;
      dy = e.clientY - lastY;
    }
    lastX = e.clientX;
    lastY = e.clientY;
    lon -= dx * factor;
    lat += dy * factor;
    updateCamera();
  }

  host.addEventListener("pointerdown", onPointerDown);
  host.addEventListener("pointerup", onPointerUp);
  host.addEventListener("pointercancel", onPointerUp);
  host.addEventListener("pointerleave", onPointerUp);
  host.addEventListener("pointermove", onPointerMove);
  host.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      fov += e.deltaY * 0.03;
      updateCamera();
    },
    { passive: false }
  );
  host.addEventListener("keydown", (e) => {
    interacted = true;
    if (e.key === "ArrowLeft") lon -= 2.2;
    if (e.key === "ArrowRight") lon += 2.2;
    if (e.key === "ArrowUp") lat -= 2;
    if (e.key === "ArrowDown") lat += 2;
    if (e.key === "+" || e.key === "=") fov -= 2;
    if (e.key === "-") fov += 2;
    updateCamera();
  });

  videoEl.addEventListener("loadeddata", () => {
    resize();
    updateCamera();
  });

  videoEl.addEventListener("error", () => {
    showFallback(
      'No se pudo cargar el video 360. Revisá que exista <code>materia/archivos faltantes pc/entorno.mp4</code>.'
    );
  });

  function syncPlayUi() {
    if (!playToggle) return;
    playToggle.textContent = videoEl.paused ? "Reproducir" : "Pausar";
  }

  videoEl.addEventListener("play", syncPlayUi);
  videoEl.addEventListener("pause", syncPlayUi);

  if (overlay) {
    overlay.addEventListener("click", () => {
      videoEl
        .play()
        .then(() => {
          overlay.hidden = true;
          syncPlayUi();
          host.focus();
        })
        .catch(() => {});
    });
  }

  if (playToggle) {
    playToggle.addEventListener("click", () => {
      if (videoEl.paused) {
        videoEl.play().catch(() => {});
        if (overlay) overlay.hidden = true;
      } else {
        videoEl.pause();
        if (overlay) overlay.hidden = false;
      }
    });
  }

  if (eyeToggle) {
    eyeToggle.addEventListener("click", () => {
      const currentIdx = projectionModes.indexOf(projectionMode);
      projectionMode = projectionModes[(currentIdx + 1) % projectionModes.length];
      applyProjectionMode();
      host.focus();
    });
  }

  if (resetView) {
    resetView.addEventListener("click", () => {
      lon = 0;
      lat = 0;
      fov = 60;
      updateCamera();
      host.focus();
    });
  }

  function tryPlay() {
    const p = videoEl.play();
    if (p && typeof p.then === "function") {
      p
        .then(() => {
          if (overlay) overlay.hidden = true;
          syncPlayUi();
        })
        .catch(() => {
          if (overlay) overlay.hidden = false;
          syncPlayUi();
        });
    }
  }
  tryPlay();
  window.setTimeout(() => {
    if (videoEl.readyState < videoEl.HAVE_CURRENT_DATA) {
      showFallback("El video 360 no llegó a cargar a tiempo. Te mostramos el video en modo normal.");
    }
  }, 4000);

  function animate() {
    requestAnimationFrame(animate);
    if (!interacted) {
      lon += 0.03;
      updateCamera();
    }
    if (videoEl.readyState >= videoEl.HAVE_CURRENT_DATA) {
      texture.needsUpdate = true;
    }
    renderer.render(scene, camera);
  }
  animate();

  renderer.domElement.style.cursor = "grab";
  renderer.domElement.style.touchAction = "none";
  renderer.domElement.addEventListener("pointerdown", () => {
    renderer.domElement.style.cursor = "grabbing";
  });
  renderer.domElement.addEventListener("pointerup", () => {
    renderer.domElement.style.cursor = "grab";
  });
  renderer.domElement.addEventListener("pointerleave", () => {
    renderer.domElement.style.cursor = "grab";
  });

  resize();
  updateCamera();
}

main();
