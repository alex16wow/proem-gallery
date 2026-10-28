# PROEM — independent gallery (concept)

A concept website for a fictional independent contemporary art gallery: six pages, interactive scenes (spatial hero, scroll assembly, transparent color panels, Canvas light study, interactive room plan, visit route) and a catalog of five concept works plus sixteen CC0 reproductions from the Cleveland Museum of Art.

Stack: React 18, TypeScript, Vite, React Router, GSAP ScrollTrigger, SVG and Canvas 2D.

## Run

```bash
npm install
npm run dev      # http://localhost:5180
npm run build    # output in dist/
```

The site uses client-side routes (`/exhibitions`, `/works`, `/space`, `/visit` …), so the host must serve `index.html` for unknown paths. To deploy under a sub-path, build with `BASE=/sub-path/ npm run build`.

## Credits

- Architecture photos and contemporary works are AI-generated concepts, not real objects.
- Historical reproductions: The Cleveland Museum of Art, Open Access, CC0. They do not imply the originals are held by PROEM or any partnership.
- Typefaces: Jost and Overpass Mono (SIL Open Font License), used as open substitutes for ITC Avant Garde Gothic and Interstate.

PROEM is a concept project; the address and contact (`hello@proem.example`) are placeholders.
