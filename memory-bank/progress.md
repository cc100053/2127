# Progress: "2127 World Shaper"

## 1. Feature Completion Status

### Core 3D Scene & Engine
- [x] Three.js $10 \times 10$ procedural isometric city grid
- [x] Smooth GSAP morphing engine (heights, colors, wireframes, foliage)
- [x] Chaos structural tilt angles ($\pm 15^\circ$) for Wasteland / Anarchy
- [x] Autonomous sky-drones fleet with speed & swarm scaling
- [x] Atmospheric particle systems (cyber motes, bio-spores, smoke)
- [x] Procedural flora / trees with organic wind sway
- [x] Camera OrbitControls with damping, auto-orbit, and reset

### Agents & Zero-Shot Generative Systems
- [x] 50 animated low-poly pedestrians with walking arm/leg cycles
- [x] Pedestrian pathfinding across sidewalks, crosswalks, and plaza
- [x] Modular Citizen Wardrobe (Green hats, top hats, glowing halos, cyber horns, helmets)
- [x] Citizen Behavioral Modes (Marching, dancing, floating, panicking)
- [x] Zero-Shot Procedural Spawner (Bioluminescent tentacles, crystal monoliths, planetary rings)

### Lighting & Visual Polish
- [x] High-luminescence multi-point lighting rig (Tone mapping exposure 1.45)
- [x] 4 Multi-district colorful glow beacons (Cyan, Pink, Emerald, Amber)
- [x] 24+ Cyber streetlights with ground illumination discs
- [x] 5 Sweeping volumetric skyscraper searchlights
- [x] Procedural glowing window matrices on building facades
- [x] Lighting Atmosphere Mode Switcher in HUD (Ultra-Neon / Sun / Dusk)

### Ingestion & AI Layer
- [x] Gemini 2.5 Flash API with structured JSON output schema
- [x] Smart offline local semantic NLP parser fallback
- [x] API Key management modal with local storage persistence
- [x] Web Speech API speech-to-text voice recognition integration

### Exhibition HUD & Audio
- [x] Real-time 3D Holographic Sky-Billboard with live progress bar ($0\% \to 100\%$)
- [x] Breaking news headline broadcast with dynamic audio waveforms
- [x] 3 Live vector gauge bars (Nature, Technology, Order)
- [x] 4 Quick societal preset chips
- [x] 5 Zero-shot AI test chips (Green hats, tentacles, crystals, rings, dance)
- [x] Auto-Stream Exhibition Mode with countdown ticker and manual override
- [x] Pure Web Audio API synthesized cyber soundscape

---

### World Persistence
- [x] Per-decree layers with golden-angle sector placement (no overlap between decrees)
- [x] Density budget with ambient-first / guest-protected eviction
- [x] Recursive GPU disposal on layer retire and on citizen wardrobe swaps
- [x] Standing Decree Ledger HUD panel with GUEST / AMBIENT provenance

---

## 2. Future Roadmap & Potential Enhancements
- [ ] **Generative scene DSL**: replace the fixed 6-type `proceduralSpawn` enum with an
      LLM-authored node tree (primitives + transforms + animators) interpreted client-side,
      so guests can summon forms nobody pre-modelled. Keep the 6 hand-built spawns as the
      validation-failure fallback. *(This is the main unlock for "the guest really changed it".)*
- [ ] Widen world axes beyond nature/tech/order: weather, time-of-day, water level, density.
- [ ] Word-boundary fixes in `localSemanticParser` — `ai` currently matches *rain/air/said*,
      `hat` matches *that/what*, `ring` matches *during*. Default engine when no API key is set.
- [ ] Three.js `EffectComposer` + `UnrealBloomPass` for optical lens bloom.
- [ ] Live microphone audio waveform visualizer rendered directly onto the billboard during speech.
- [ ] External `.glb` / Blender asset loader with Draco compression.
- [ ] Multi-kiosk WebSocket synchronization (for multi-screen museum galleries).
