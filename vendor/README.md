# Vendored dependencies

Everything the page loads is served from this directory. The installation must not
depend on venue wifi or an upstream CDN staying available — a network hiccup at the
exhibition would otherwise leave a black screen with no diagnosis available on site.

| File | Version | Source | License |
| :--- | :--- | :--- | :--- |
| `tailwind.js` | 3.4.16 | `cdn.tailwindcss.com/3.4.16` | MIT |
| `three.min.js` | r128 | cdnjs | MIT |
| `OrbitControls.js` | 0.128.0 | jsDelivr (`three/examples/js/controls`) | MIT |
| `gsap.min.js` | 3.12.5 | cdnjs | GreenSock standard "no charge" license |
| `lucide.js` | 0.468.0 | unpkg (`lucide/dist/umd`) | ISC |
| `fonts/` | — | Google Fonts | SIL Open Font License 1.1 |

`fonts/fonts.css` has had its `fonts.gstatic.com` URLs rewritten to the local
`f*.woff2` files alongside it, so no request leaves the machine.

## Notes

- **Versions are pinned deliberately.** The previous `lucide@latest` reference meant an
  upstream release could break the kiosk overnight with no change on our side.
- **three is r128 (2021).** `OrbitControls` must stay on the matching 0.128.0 build.
  Note `THREE.CapsuleGeometry` does not exist in r128 — the scene DSL's primitive list
  is constrained accordingly.
- To update anything here, replace the file and update the version in this table.
  Re-test before an exhibition; there is no build step to catch breakage.
