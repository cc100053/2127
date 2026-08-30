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

### Resilience & Pipeline
- [x] All CDN dependencies vendored and pinned (`vendor/`), fonts included
- [x] Two-phase decree: fast vectors (~2s) then composed form (~10s later)
- [x] Superseded-decree guard so a late form never lands in a changed city
- [x] Single spawn authority in phase B, with the preset enum as fallback

### AI Engine & Quota
- [x] Auto-stream removed — zero API calls while idle
- [x] Ordered model chain: 2.5 Flash -> 2.5 Flash-Lite -> offline parser
- [x] Early break on 400/401/403 so a bad key/request costs one call, not two
- [x] `.env` runtime loader (gitignored) with `.env.example` template
- [x] Header + telemetry name the model that actually served each decree

### Generative Scene DSL
- [x] Primitive whitelist + node-tree interpreter (`buildComposition`)
- [x] Hardened validator (`sanitizeComposition`) — 29 unit assertions, no eval of model output
- [x] Bilateral `mirror` flag, 5 animators, anchor/count/radius placement
- [x] Gemini system prompt + `responseSchema` extended with `composition`
- [x] Graceful fallback to the 6 hand-built spawners on validation failure

### World Persistence
- [x] Per-decree layers with golden-angle sector placement (no overlap between decrees)
- [x] Density budget with ambient-first / guest-protected eviction
- [x] Recursive GPU disposal on layer retire and on citizen wardrobe swaps
- [x] Standing Decree Ledger HUD panel with GUEST / AMBIENT provenance

---

## 2. Future Roadmap & Potential Enhancements
- [ ] **Art-direct composed forms**: the DSL interpreter is in and verified, but a form built
      from ~5 primitives currently reads as abstract shapes rather than a creature. Needs
      iteration on the system-prompt exemplars (silhouette guidance, part counts) against
      real Gemini output with a live API key.
- [x] **End-to-end test with a real Gemini key** — done. Findings below.
- [ ] **Latency is the blocking problem**: 2.5 Flash took 6.6-17.7s per decree (median ~13s).
      2.5 Flash-Lite answered the same prompts in 1.5-3.2s and still composed. For a kiosk
      where a guest is watching a progress bar, Lite should probably be the PRIMARY and Flash
      the quality fallback — the inverse of the current MODEL_CHAIN order.
- [x] **Forms compose vertically** — FIXED by an explicit axis convention (+Z forward) plus a
      worked exemplar in the phase-B prompt. Measured after: dragon z/y 5.08 (was a vertical
      totem), cargo-walker 4.32, while cathedral stayed correctly tall at 0.54 and jellyfish
      at 0.84. The model now distinguishes things that travel from things that stand.
- [ ] **Model still ignores `mirror`** — 0 uses across 4 probes even with a hard prompt rule;
      it hand-duplicates bilateral parts (cargo-walker: 25 duplicate-pair matches). Mitigated
      by raising DSL_MAX_NODES 14 -> 20 rather than spending more calls. Worth one more prompt
      iteration someday, or drop `mirror` from the schema as dead weight.
- [x] **Exhibition robustness pass** — done. Request timeouts, turn-scoped decree lock,
      frame-rate-independent motion, WebGL context recovery, throttled billboard repaints,
      persisted world accretion, and a validator test suite (`npm test`, 23 tests).
      Verified in a browser: reload restores the standing city, the wipe control clears it,
      a forced `WEBGL_lose_context` loss recovers, and a decree completes in a hidden tab.
- [x] **The ledger under-reported** — FIXED. Rows now come from the persisted
      `decreeHistory`, with layers carrying a `recordId` so one decree is one row showing
      "form · N edits · N obj". Edit-only decrees appear; presets keep their own rows.
- [ ] **Cache guest decrees** in localStorage keyed by normalised prompt — exhibition visitors
      repeat each other heavily, so a 30-50% hit rate is realistic once traffic is real.
- [ ] Widen world axes beyond nature/tech/order: weather, time-of-day, water level, density.
- [x] **Word-boundary fixes** — FIXED in `src/keywords.js` (17 tests). Covered both
      `localSemanticParser` AND `localCityOps`, which had the worse bugs: `ice` matched
      "police", `sand` "thousand", `tide` "outside", `red` "hundred", `war` "warm".
- [x] **Macro vocabulary 10 -> 20 parts** — added wheel/rotor/pod, dome/stair_terrace/
      panel_array/antenna, sensor_orb/tentacle/root_web, with a boot-time check that each
      part's declared `cost` matches the meshes it builds.
- [ ] **Measure the wider vocabulary against live Gemini.** The parts are verified to build
      and to read correctly in isolation, but which of the twenty the model actually reaches
      for — and whether the categorised prompt list improves part selection — is unmeasured.
      Re-run the four probes (dragon, cathedral, cargo-walker, jellyfish) plus vehicle- and
      surveillance-shaped decrees that the old ten could not serve.
- [ ] Three.js `EffectComposer` + `UnrealBloomPass` for optical lens bloom.
- [ ] Live microphone audio waveform visualizer rendered directly onto the billboard during speech.
- [ ] External `.glb` / Blender asset loader with Draco compression.
- [ ] Multi-kiosk WebSocket synchronization (for multi-screen museum galleries).
