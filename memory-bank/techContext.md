# Tech Context: "2127 World Shaper"

## 1. Technologies & Dependencies
All libraries are loaded via reliable CDNs in `index.html` to maintain zero-build, single-file simplicity:

| Library / API | Version / CDN | Purpose |
| :--- | :--- | :--- |
| **Three.js** | `0.128.0` (cdnjs) | Core 3D scene, procedural geometries, materials, lighting, particle systems |
| **OrbitControls** | `0.128.0` (cdn.jsdelivr.net) | Camera navigation, auto-orbit, damping, tilt constraints |
| **GSAP** | `3.12.5` (cdnjs) | High-performance parametric tweening of heights, colors, scales, and opacity |
| **Tailwind CSS** | CDN script | Glassmorphic futuristic HUD, responsive layouts, neon borders |
| **Lucide Icons** | `0.344.0` (unpkg) | Cyberpunk UI iconography |
| **Web Audio API** | Native Browser API | Pure synthesized cyber soundscape (tones, chimes, whooshes, ambient drone) |
| **Web Speech API** | Native Browser API | Browser-native speech-to-text voice recognition for exhibition mic |
| **Google Gemini API** | `gemini-3.5-flash-lite` (chain: 3.1-flash-lite → 2.5-flash-lite → 2.5-flash) | Structured JSON generative LLM parsing of citizen decrees |

---

## 2. File Organization
```
/Users/fatboy/2127/
├── index.html              # Main self-contained application (Three.js, HUD, AI, Audio)
├── README.md               # Overview documentation and quick start guide
├── package.json            # Optional dev server scripts (Vite/Node)
└── memory-bank/            # Complete Project Knowledge & AI Handoff System
    ├── projectbrief.md     # Vision, exhibition context, target year 2127, constraints
    ├── productContext.md   # Visitor interaction loop, autonomous exhibition mode
    ├── systemPatterns.md   # System architecture, Three.js engines, lighting rig
    ├── techContext.md      # Tech stack, browser APIs, storage keys, performance
    ├── activeContext.md    # Current state of codebase, recent updates, active decisions
    ├── progress.md         # Milestone checklist and feature progress
    └── process.md          # Step-by-step developer & AI handover process guide
```

---

## 3. Local Storage Keys
- `2127_GEMINI_API_KEY`: Stores the visitor/curator's Gemini 2.5 Flash API key locally in the browser. If empty, the app runs automatically on the built-in offline NLP engine.

---

## 4. Performance & Memory Management Guidelines
1. **Object Pooling & Pre-Allocation**:
   - All 50 citizens, buildings, ground tiles, and streetlights are allocated at startup.
   - Transforming the city lerps existing meshes via GSAP; no meshes are repeatedly destroyed or garbage collected during standard decree transformations.
2. **Procedural Entity Cleanup**:
   - When new zero-shot procedural entities (e.g. tentacles or crystals) are spawned, previous dynamic meshes have their geometries and materials disposed cleanly to prevent WebGL memory leaks.
3. **Canvas Texture Optimization**:
   - The dynamic sky-billboard canvas is $1024 \times 384$. In the animation loop, `billboardTexture.needsUpdate = true` runs smoothly at 60 FPS.
