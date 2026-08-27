# 2127 World Shaper // 3D Interactive Societal Simulation

A real-time, browser-based interactive 3D simulation prototype for an exhibition installation set in **2127**.

Guests input text decrees or voice statements describing their vision or law for the future. The **Gemini 2.5 Flash API** (with structured JSON output mode) parses this decree into numeric societal parameters, triggering immediate procedural visual transformations in an isometric 3D metropolis via **Three.js** and **GSAP**.

---

## Features

- **Procedural 3D Metropolis ($10 \times 10$ Isometric Grid)**:
  - **High Tech**: Glowing wireframe conduits, pulsing emissive window textures, and rotating holographic energy coils.
  - **High Nature / Solarpunk**: Earthy bio-composite towers, dense vertical rooftop gardens, and animated procedural trees.
  - **Low Order / Chaos**: Chaotic structural building tilts, damaged masonry, dark atmospheric smog, and fire/ash particle emitters.
- **Dynamic Agents & Zero-Shot Citizen Wardrobe**:
  - **Modular Headwear & Accessories**: 50 citizens with attachable slots for procedural top hats, green hats, glowing angel halos, cyber horns, and helmets.
  - **Dynamic Behaviors**: Citizens can synchronously march in military parades, dance and celebrate at raves, float in anti-gravity, or rush in panic.
  - **Zero-Shot Procedural Entity Synthesis**: Unprepared guest prompts dynamically spawn animated 3D geometry:
    - 🐙 *Bioluminescent Serpentine Tentacles* with sine-wave undulating joint physics.
    - 💎 *Floating Crystal Monoliths* with pulsating neon lattices.
    - 🪐 *Massive Planetary Energy Rings* orbiting above the skyline.
  - **Sky-Drones**: Autonomous flying vehicles with speed and swarm density scaling according to tech and order levels.
  - **Procedural Flora**: Trees with organic wind sway that sprout, bloom, or wither in real time.
  - **Atmospheric Particles**: Floating bio-spores, cyber motes, and smoke/ash particle systems.
- **High-Luminescence Lighting Rig & Visual FX**:
  - **Dynamic Multi-Point Lighting**: Super-bright 4.8 intensity central plaza beacon, hemisphere sky fill, directional crisp sunlight, and 4 corner district neon glow beacons (Cyan, Magenta, Emerald, Amber).
  - **24+ Cyber Streetlights**: Metallic curved streetlamp posts with glowing neon bulbs and ground illumination discs along all city avenues.
  - **Volumetric Sweeping Searchlights**: 5 rotating skyscraper light cones with additive blending cutting dramatically through the sky and clouds.
  - **Procedural Glowing Windows**: Dense arrays of illuminated golden, cyan, and magenta interior window matrices on building facades.
  - **Atmospheric Lighting Controller**: Real-time HUD button to toggle between *Ultra-Neon Night*, *Solarpunk Daylight*, and *Cyber Dusk*.
- **Real-Time Holographic Sky-Billboard**:
  - Live 2D dynamic canvas texture hovering over the city center.
  - **Live Progress Bar (0%–100%)**: When processing a decree, the board displays the incoming prompt in real time, animated scanning hazard chevrons, stage diagnostics, and percentage progress.
  - **Breaking News Broadcast**: Once computed, the board transitions to broadcasting the 2127 breaking headline with dynamic audio equalizer waveforms.
- **Persistent World Accretion**:
  - Decrees layer onto the city instead of erasing it — the world carries the marks of every guest who came before.
  - A `STANDING DECREES` ledger shows what the city is still holding, and from whom.
- **Generative Scene DSL**:
  - When no preset spawn fits a decree, the model composes the form itself from a primitive node tree, with bilateral `mirror` symmetry and five animators.
  - Strictly data — model output is never evaluated. A hardened validator clamps, drops or rejects anything malformed and falls back to the hand-built spawners.
- **Layered AI Engine with Graceful Degradation**:
  - `gemini-2.5-flash` first, using strict structured-output response schemas.
  - Falls back to `gemini-2.5-flash-lite` when Flash is rate-limited (429) or erroring (5xx).
  - Falls back again to a built-in offline semantic parser if neither model responds, so the installation never goes dead.
  - A bad key or malformed request (400/401/403) stops the chain immediately rather than burning quota on a retry that would fail identically.
- **Exhibition HUD & Soundscape**:
  - 3 live metric gauge bars tracking Nature, Technology, and Order.
  - Web Speech API integration for direct speech-to-text voice input.
  - 4 one-click preset test environments (*Solarpunk Haven*, *Cyberpunk Surveillance State*, *Wasteland Anarchy*, *Neon Bio-Synth Oasis*).
  - Pure Web Audio API synthesized cyber soundscape (ambient drones, chime feedback, and parameter morph whooshes).

---

## Quick Start

### 1. Add your API key

```bash
cp .env.example .env
# then edit .env and paste your key from https://aistudio.google.com/apikey
```

`.env` is read by the browser at runtime — there is no build step — so the app **must be
served over HTTP** for the key to load (see below). Opening `index.html` via `file://`
skips `.env` silently and falls back to the in-app **API KEY** modal, or to the offline
parser if no key is set anywhere.

> **Security note:** because `.env` is fetched by the page, your static server serves it to
> anyone who can reach the host. That is fine for local testing. For a kiosk on a shared or
> public network, leave `.env` empty and enter the key through the in-app **API KEY** modal
> instead, which stores it in `localStorage` and never puts it on the wire.

`.env` is gitignored. `.env.example` is the committed template — never commit a real key.

### 2. Direct Browser Launch
Open `index.html` directly in any modern web browser (Chrome, Edge, Safari, Firefox). No build step or package installation required. (`.env` will not load this way — use the API KEY modal.)

### 3. Local HTTP Server (Recommended)
Using Python:
```bash
python3 -m http.server 8080
```
Then visit [http://localhost:8080](http://localhost:8080).

Using Node.js:
```bash
npx serve .
```

---

## Preset Configurations

| Preset | Nature | Tech | Order | Mood Hex | Theme |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **🌿 Solarpunk Haven** | `1.0` | `0.8` | `0.9` | `#10b981` | Clean energy independence, vertical forests |
| **⚡ Cyberpunk State** | `0.0` | `1.0` | `1.0` | `#00f0ff` | 24/7 AI surveillance grid, maximal efficiency |
| **☣️ Wasteland Anarchy** | `0.1` | `0.2` | `0.0` | `#ef4444` | Grid collapse, rebel factions, industrial smog |
| **🔮 Bio-Synth Oasis** | `0.9` | `0.9` | `0.5` | `#ec4899` | Bioluminescent flora fused with cybernetics |

---

## Gemini 2.5 Flash Structured Schema Contract

---

## Memory Bank (AI & Developer Handover System)

The [`memory-bank/`](file:///Users/fatboy/2127/memory-bank/) directory contains the complete architectural knowledge and workflow instructions for any AI agent (Claude Code, Cursor, Windsurf, Copilot, Gemini) or human developer:

- [`projectbrief.md`](file:///Users/fatboy/2127/memory-bank/projectbrief.md): Vision, exhibition context, target year 2127, constraints.
- [`productContext.md`](file:///Users/fatboy/2127/memory-bank/productContext.md): Visitor interaction loop, autonomous exhibition mode.
- [`systemPatterns.md`](file:///Users/fatboy/2127/memory-bank/systemPatterns.md): System architecture, Three.js engines, lighting rig.
- [`techContext.md`](file:///Users/fatboy/2127/memory-bank/techContext.md): Tech stack, browser APIs, storage keys, performance.
- [`activeContext.md`](file:///Users/fatboy/2127/memory-bank/activeContext.md): Current state of codebase, recent updates, active decisions.
- [`progress.md`](file:///Users/fatboy/2127/memory-bank/progress.md): Milestone checklist and feature progress.
- [`process.md`](file:///Users/fatboy/2127/memory-bank/process.md): Step-by-step developer & AI handover process guide.
