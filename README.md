# MANTIS VEX — Website

Official site for **Mantis Vex**, a French **darksynth / horrorsynth / cyberpunk**
artist. Built as a fast, dependency-free static site optimized for **GitHub Pages**.

## Sections

| Page | File | What's there |
|------|------|--------------|
| **Landing** | `index.html` | Hero, embedded Bandcamp players, full discography, bio, platform links |
| **VST Plugins** | `vst.html` | "Coming soon" placeholder |
| **SigilGrid** | `sigilgrid.html` | "Coming soon" placeholder |

## Real data wired in

- **Bandcamp:** https://mantisvex.bandcamp.com — used for the embedded players & every discography link.
- **Spotify:** https://open.spotify.com/artist/5HMkJnRrb6XsjmSzKlRkTO
- **YouTube:** https://www.youtube.com/channel/UCW8NPJouuJmq6MUjzPr_BlQ
- **Email:** mantisvex@gmail.com

Featured Bandcamp embeds (by album id): `Glitchpunk` 1254143414 · `Observed Into Being`
1086371301 · `It, That Craves` 2266996122.

## Stack

- Plain **HTML / CSS / vanilla JS** — no build step, no frameworks, no dependencies.
- Music is streamed via Bandcamp's official `EmbedPlayer` iframes (no audio hosted here).
- SVG favicon + Open Graph image.
- Horrorsynth palette: toxic-green / blood-rust on near-black (no neon-outrun cliché).

## Run locally

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

Already live at **https://mantisvex.github.io/mantisvex-website/** (branch `main`, root).
`.nojekyll` is included so files are served as-is; `404.html` is a themed fallback.

## Customize

- **Colors / fonts:** CSS custom properties at the top of `css/styles.css` (`:root`).
- **Discography:** edit the `.discog__row` links in `index.html`. Some albums currently
  point at the main Bandcamp page — swap in their direct `/album/<slug>` URLs once confirmed.
- **Featured players:** change the `album=<id>` values in the `.embed` iframes.
- **VST / SigilGrid:** drop real content into `vst.html` / `sigilgrid.html` when ready.

---

© MANTIS VEX. France.
