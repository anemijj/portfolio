# Assets — SOMA case study

La página `soma.html` consume archivos de esta carpeta y de `materia/`.
Estado actual:

## App (pantallas del producto)

JPGs verticales que ya estás usando (en `materia/soma/`):

- `inicio alta.jpg`
- `actividad alta.jpg`
- `balance baja.jpg`
- `sueño alta.jpg`
- `detalle act.jpg`
- `ciclo.jpg`

## Métricas

- `general.jpg`
- `hr.jpg`
- `detalle2.jpg`

## Web (`soma.pe`)

Videos comprimidos a 1280px H.264 (sin audio):

- `materia/hero-web.mp4` (~1.5 MB) — original `hero web.mov`.
- `materia/soma/websoma-1.mp4` (~4.9 MB) — original `websoma-1.mov`.

> Los `.mov` originales quedan en disco pero ignorados por git
> (ver `.gitignore`). Si querés re-comprimir con otra calidad:
>
> ```bash
> ffmpeg -i input.mov -movflags +faststart -pix_fmt yuv420p \
>   -vf "scale=1280:-2:flags=lanczos" -c:v libx264 -crf 24 \
>   -preset slow -an output.mp4
> ```
>
> Subí `crf` (24 → 28) si querés archivos más chicos.

## Render del anillo

- `materia/rosegold.mp4` (~770 KB) — loop usado en la sección "sobre".

## Social (Instagram @livewithsoma)

Ya **no** se usan imágenes locales. La sección renderiza los embeds
oficiales de Instagram (iframes a `instagram.com/p/{ID}/embed/`).

Para que aparezcan posts: editá `soma.html` y pegá los permalinks en la
constante `SOMA_IG_POSTS` (al final del archivo). Mientras esté vacía,
la sección muestra un placeholder con link al perfil.

```js
const SOMA_IG_POSTS = [
  "https://www.instagram.com/p/ABCdEf123/",
  "https://www.instagram.com/reel/XYZ789/",
  // ...
];
```
