# Portfolio (estático)

Sitio en HTML/CSS/JS en la raíz del repo:

- `index.html` — inicio
- `project.html` — caso de estudio
- `random.html` — placeholder
- `styles.css`, `script.js`

## Ver en local

```bash
python3 -m http.server 5173
```

Abrí `http://localhost:5173/index.html`.

## GitHub Pages

En el repo: **Settings → Pages → Build and deployment → Deploy from a branch**, elegí la rama (por ejemplo `main`) y carpeta **`/` (root)**. La URL será algo como `https://<usuario>.github.io/<repo>/`.

## Vercel

En el proyecto de Vercel, framework **Other** (sin build) o dejá el preset que detecte archivos estáticos en la raíz.
