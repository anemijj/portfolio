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

Elegí **solo una** de estas opciones (si mezclás mal la fuente, suele “fallar” o no publicar):

### Opción A — Deploy from a branch (simple)

**Settings → Pages → Build and deployment → Deploy from a branch** → rama `main` → carpeta **`/` (root)**.

En la raíz hay un archivo **`.nojekyll`** para que GitHub no intente procesar el sitio con Jekyll (evita errores raros con HTML estático).

### Opción B — GitHub Actions

**Settings → Pages → Source: GitHub Actions**. El repo incluye `.github/workflows/pages.yml`, que sube la raíz del repo como sitio estático.

Si antes tenías la fuente en Actions **sin** workflow, el deploy fallaba: con este archivo debería pasar el build.

La URL suele ser `https://<usuario>.github.io/<repo>/` (proyecto) o `https://<usuario>.github.io/` (repo llamado `<usuario>.github.io`).

## Vercel

En el proyecto de Vercel, framework **Other** (sin build) o dejá el preset que detecte archivos estáticos en la raíz.
