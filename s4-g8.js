/**
 * S4 G8 — sala 3D con video proyectado + audio opcional.
 * - Un único <video id="s4Src"> como fuente; 4 <canvas> dibujan su cuadrante.
 * - Todas las paredes tienen la misma altura (42.6% del nominal) pegadas al
 *   piso, mostrando la franja del video que calza visualmente.
 * - <audio id="s4Audio"> arranca muted para respetar políticas de autoplay.
 *   El botón SOUND lo activa y lo sincroniza con el video; hay slider de
 *   volumen al costado.
 * - Drag sobre la escena para girar la sala 360°.
 */
(function () {
  const scene = document.getElementById("s4Scene");
  const room = document.getElementById("s4Room");
  const video = document.getElementById("s4Src");
  const audio = document.getElementById("s4Audio");
  const canvases = Array.from(document.querySelectorAll(".s4-canvas"));
  if (!scene || !room || !video || canvases.length === 0) return;

  /* Geometría nominal del layout 2x2:
     ancho total 6396 = 3404 + 2992
     alto total  2056 = 1028 + 1028 */
  const TOTAL_W = 6396;
  const TOTAL_H = 2056;
  const SPLIT_X = 3404;
  const SPLIT_Y = 1028;

  /* Porción visible (calibración empírica). Debe coincidir con --H34
     del CSS (var(--H) * VISIBLE_FRAC). */
  const VISIBLE_FRAC = 0.426;
  const SLICE_H = SPLIT_Y * VISIBLE_FRAC; // ~438 u

  /* Fuente de cada pared. Todas muestran una franja de SLICE_H de alto.
     - Fila superior (q1, q2): BOTTOM de la fila → sy = SPLIT_Y - SLICE_H
     - Fila inferior (q3, q4): TOP de la fila    → sy = SPLIT_Y */
  const QUADS = {
    1: [0, SPLIT_Y - SLICE_H, SPLIT_X, SLICE_H], // pared izquierda
    2: [SPLIT_X, SPLIT_Y - SLICE_H, TOTAL_W - SPLIT_X, SLICE_H], // pared fondo
    3: [0, SPLIT_Y, SPLIT_X, SLICE_H], // pared derecha
    4: [SPLIT_X, SPLIT_Y, TOTAL_W - SPLIT_X, SLICE_H], // pared frente
  };

  const ctxs = canvases.map((c) => c.getContext("2d"));

  function resizeCanvases() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvases.forEach((c) => {
      const rect = c.getBoundingClientRect();
      const w = Math.max(2, Math.round(rect.width * dpr));
      const h = Math.max(2, Math.round(rect.height * dpr));
      if (c.width !== w) c.width = w;
      if (c.height !== h) c.height = h;
    });
  }

  function drawFrame() {
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (vw && vh && video.readyState >= 2) {
      const kx = vw / TOTAL_W;
      const ky = vh / TOTAL_H;
      for (let i = 0; i < canvases.length; i += 1) {
        const c = canvases[i];
        const ctx = ctxs[i];
        const q = QUADS[c.dataset.q];
        if (!q) continue;
        try {
          ctx.drawImage(
            video,
            q[0] * kx,
            q[1] * ky,
            q[2] * kx,
            q[3] * ky,
            0,
            0,
            c.width,
            c.height
          );
        } catch (_) {
          /* noop */
        }
      }
    }
    requestAnimationFrame(drawFrame);
  }

  function tryPlayVideo() {
    video.muted = true;
    video.playsInline = true;
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }

  video.addEventListener("loadedmetadata", resizeCanvases);
  video.addEventListener("canplay", tryPlayVideo);
  window.addEventListener("resize", resizeCanvases);

  resizeCanvases();
  tryPlayVideo();
  requestAnimationFrame(drawFrame);

  /* ---------------- Audio ---------------- */

  const player = document.getElementById("s4Player");
  const audioBtn = document.getElementById("s4AudioToggle");
  const volInput = document.getElementById("s4AudioVol");
  const pctSpan = document.getElementById("s4AudioPct");
  const timeEl = document.getElementById("s4AudioTime");
  const durEl = document.getElementById("s4AudioDur");

  if (audio && player && audioBtn && volInput && pctSpan) {
    audio.loop = true;
    audio.muted = true;
    audio.volume = 0.7;

    function fmt(s) {
      if (!isFinite(s) || s < 0) s = 0;
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    }

    function syncAudioToVideo() {
      const t = video.currentTime || 0;
      try {
        if (Math.abs(audio.currentTime - t) > 0.2) audio.currentTime = t;
      } catch (_) {
        /* noop */
      }
    }

    function setPctLabel() {
      pctSpan.textContent = String(Math.round(audio.volume * 100));
    }

    function refreshButton() {
      const active = !audio.muted && !audio.paused;
      audioBtn.setAttribute("aria-pressed", active ? "true" : "false");
      audioBtn.setAttribute(
        "aria-label",
        active ? "Pausar audio" : "Activar audio"
      );
      const icon = audioBtn.querySelector("[data-icon]");
      if (icon) icon.textContent = active ? "❚❚" : "▶";
      player.classList.toggle("is-muted", !active);
      player.classList.toggle("is-playing", active);
    }

    function refreshTime() {
      if (timeEl) timeEl.textContent = fmt(audio.currentTime);
      if (durEl) {
        durEl.textContent = isFinite(audio.duration)
          ? fmt(audio.duration)
          : "--:--";
      }
    }

    audioBtn.addEventListener("click", () => {
      if (audio.muted || audio.paused) {
        audio.muted = false;
        syncAudioToVideo();
        const p = audio.play();
        if (p && typeof p.catch === "function") {
          p.catch(() => {
            audio.muted = true;
            refreshButton();
          });
        }
      } else {
        audio.muted = true;
      }
      refreshButton();
    });

    volInput.addEventListener("input", () => {
      const v = Math.max(0, Math.min(1, Number(volInput.value) / 100));
      audio.volume = v;
      if (v > 0 && audio.muted) {
        audio.muted = false;
        const p = audio.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
      setPctLabel();
      refreshButton();
    });

    audio.addEventListener("volumechange", () => {
      volInput.value = String(Math.round(audio.volume * 100));
      setPctLabel();
    });

    audio.addEventListener("play", refreshButton);
    audio.addEventListener("pause", refreshButton);
    audio.addEventListener("timeupdate", refreshTime);
    audio.addEventListener("loadedmetadata", refreshTime);
    audio.addEventListener("durationchange", refreshTime);

    /* Autoplay silencioso apenas esté listo */
    audio.addEventListener("canplay", () => {
      const p = audio.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    });

    setPctLabel();
    refreshTime();
    refreshButton();
  }

  /* ---------------- Drag (rotación 360°) ---------------- */

  let rx = 6;
  let ry = -22;
  let dragging = false;
  let lx = 0;
  let ly = 0;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function applyRoomTilt() {
    room.style.setProperty("--s4-rx", `${rx}deg`);
    room.style.setProperty("--s4-ry", `${ry}deg`);
  }
  applyRoomTilt();

  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - lx;
    const dy = e.clientY - ly;
    lx = e.clientX;
    ly = e.clientY;
    ry += dx * 0.25;
    rx -= dy * 0.15;
    rx = Math.max(-40, Math.min(40, rx));
    if (ry > 360) ry -= 360;
    if (ry < -360) ry += 360;
    applyRoomTilt();
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    scene.classList.remove("is-dragging");
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", endDrag);
    document.removeEventListener("pointercancel", endDrag);
  }

  if (!prefersReducedMotion) {
    scene.addEventListener("pointerdown", (e) => {
      dragging = true;
      lx = e.clientX;
      ly = e.clientY;
      scene.classList.add("is-dragging");
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", endDrag);
      document.addEventListener("pointercancel", endDrag);
    });
  }

  /* Teclado: flechas para rotar, Home para resetear. */
  scene.tabIndex = 0;
  scene.addEventListener("keydown", (e) => {
    let handled = true;
    if (e.key === "ArrowLeft") ry -= 10;
    else if (e.key === "ArrowRight") ry += 10;
    else if (e.key === "ArrowUp") rx = Math.min(40, rx + 4);
    else if (e.key === "ArrowDown") rx = Math.max(-40, rx - 4);
    else if (e.key === "Home") {
      rx = 6;
      ry = -22;
    } else handled = false;
    if (handled) {
      applyRoomTilt();
      e.preventDefault();
    }
  });
})();
