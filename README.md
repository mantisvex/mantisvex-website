# MANTISVEX — Website

Official site for **MantisVex**, a cyberpunk / darksynth artist. Built as a fast,
dependency-free static site optimized for **GitHub Pages**.

## Sections

| Page | File | What's there |
|------|------|--------------|
| **Landing** | `index.html` | Hero, latest transmissions (track previews), feature strip, about, contact |
| **VST Plugins** | `vst.html` | Filterable plugin grid (synths / FX / utility), install guide |
| **SigilGrid** | `sigilgrid.html` | Interactive Web Audio "sigil" sequencer — draw glyphs, hear them play |

## Stack

- Plain **HTML / CSS / vanilla JS** — no build step, no frameworks, no dependencies.
- Fonts via Google Fonts (Orbitron, Rajdhani, Share Tech Mono).
- All sound is generated client-side with the **Web Audio API** (no audio files to host).
- SVG favicon + Open Graph image.

## Run locally

It's a static site — just open `index.html`, or serve it:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Push these files to the repository root (default branch, e.g. `main`).
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment**, set **Source = Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`. Save.
5. The site goes live at `https://<username>.github.io/mantisvex-website/`.

Notes:
- `.nojekyll` is included so GitHub serves files as-is (no Jekyll processing).
- `404.html` provides a themed not-found page.
- For a custom domain, add a `CNAME` file with your domain and configure DNS.

## Customize

- **Colors / fonts:** CSS custom properties at the top of `css/styles.css` (`:root`).
- **Tracks:** edit the `.track-card` blocks in `index.html`.
- **Plugins:** edit the `.plugin` articles in `vst.html` (set `data-cat` to `synth`/`fx`/`util`).
- **SigilGrid scale / grid size:** `COLS`, `ROWS`, and `scale[]` in `js/sigilgrid.js`.
- **Real download / social links:** replace the `href="#"` placeholders.

---

© MANTISVEX. Built in the static.
