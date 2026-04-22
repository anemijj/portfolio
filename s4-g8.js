/**
 * S4 G8 — sincroniza los 4 <video> y permite girar la sala con drag.
 */
(function () {
  const scene = document.getElementById("s4Scene");
  const room = document.getElementById("s4Room");
  const videos = Array.from(document.querySelectorAll(".s4-wall video"));
  if (!scene || !room || videos.length === 0) return;

  const master = videos[0];
  let dragging = false;
  let lx = 0;
  let ly = 0;
  let rx = 6;
  let ry = -22;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function applyRoomTilt() {
    room.style.setProperty("--s4-rx", `${rx}deg`);
    room.style.setProperty("--s4-ry", `${ry}deg`);
  }

  function syncSlaves() {
    const t = master.currentTime;
    for (let i = 1; i < videos.length; i += 1) {
      if (Math.abs(videos[i].currentTime - t) > 0.12) {
        try {
          videos[i].currentTime = t;
        } catch (_) {
          /* noop */
        }
      }
    }
  }

  master.addEventListener("timeupdate", syncSlaves);

  function tryPlayAll() {
    videos.forEach((v) => {
      v.muted = true;
      v.playsInline = true;
    });
    Promise.all(videos.map((v) => v.play())).catch(() => {});
  }

  tryPlayAll();

  if (!prefersReducedMotion) {
    scene.addEventListener("pointerdown", (e) => {
      dragging = true;
      lx = e.clientX;
      ly = e.clientY;
      scene.classList.add("is-dragging");
      try {
        scene.setPointerCapture(e.pointerId);
      } catch (_) {
        /* noop */
      }
    });

    scene.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      ry += dx * 0.18;
      rx -= dy * 0.12;
      rx = Math.max(-28, Math.min(32, rx));
      ry = Math.max(-70, Math.min(70, ry));
      applyRoomTilt();
    });

    function endDrag() {
      dragging = false;
      scene.classList.remove("is-dragging");
    }

    scene.addEventListener("pointerup", endDrag);
    scene.addEventListener("pointercancel", endDrag);
  }

  applyRoomTilt();
})();
