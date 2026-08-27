# Active Context: "2127 World Shaper"

## 1. Current State of the Codebase
The application is fully functional, verified, and running as a self-contained web prototype in [`/Users/fatboy/2127/index.html`](file:///Users/fatboy/2127/index.html).

---

## 2. Key Recent Implementations & Enhancements

1. **Target Year Re-Branding**:
   - Re-branded all systems, UI readouts, system prompts, sky-billboards, and storage keys to **2127**.

2. **Autonomous Pedestrian / Citizen Fleet**:
   - 50 animated 2127 citizens navigating across sidewalks, crosswalks, and plazas.
   - Distinct walking leg swings, arm counter-swings, step bobbing, and pathfinding.

3. **Real-Time Holographic Sky-Billboard & Progress Bar**:
   - Real-time $0\% \to 100\%$ progress bar rendered onto the hovering 3D canvas texture during decree ingestion.
   - Stage diagnostics (`"DECODING SEMANTICS"` $\to$ `"EVALUATING VECTORS"` $\to$ `"COMPUTING PROCEDURAL LERP"` $\to$ `"DECREE ENACTED"`).
   - Seamless transition into the 2127 breaking news broadcast with dynamic audio waveform equalizers.

4. **Auto-Stream Exhibition Mode**:
   - Automatically cycles through curated 2127 guest decrees every 14 seconds when idle.
   - Instant guest priority: typing, speaking, or clicking presets pauses the auto-stream.
   - Added header toggle button (`#btn-auto-stream`) with live countdown ticker.

5. **High-Luminescence Lighting Rig**:
   - Super-bright exposure ($1.45$).
   - Multi-point lighting: Hemisphere sky fill, directional sunlight ($2.2$), central $4.8$-intensity cyan beacon, and 4 multi-district point lights.
   - 24+ cyber streetlights with glowing neon bulbs and ground illumination discs.
   - 5 rotating volumetric searchlights sweeping across the sky.
   - Procedural glowing window matrices across skyscraper facades.
   - Lighting Atmosphere Switcher (`Light: Ultra` / `Light: Sun` / `Light: Dusk`).

6. **Universal Parametric Anatomy & Physics Rig (`updateUniversalCitizenRig`)**:
   - Zero-manual-coding pipeline: enables Gemini 2.5 Flash and local parser to resolve arbitrary novel guest decrees in under 800ms.
   - **Continuous Parametric Anatomy**: dynamic spine tilt (`spinePitch` $0^\circ \dots 90^\circ$), vertical/width scaling (`heightScale`, `widthScale` $0.3\times \dots 2.5\times$), and hover elevation.
   - **Dynamic Headwear Primitive Synthesizer**: constructs custom 3D primitives (`cylinder`, `box`, `cone`, `sphere`, `torus`, `horns`, `halo`) with colors and scale on the fly.
   - **Continuous Locomotion**: alternates between bipedal walking, military marching, rave dancing, anti-gravity floating, and 4-legged quadruped trot gait.
   - **Procedural Spawners**: tentacles, crystal monoliths, and planetary rings.
7. **Selective Building Demolition & Density Engine**:
   - Added `buildingCount` and `buildingSurvivalRate` parameters to the procedural building morph pipeline.
   - For prompts like *"only one building left"*, all peripheral buildings smoothly collapse and flatten into ground rubble, while the single central landmark skyscraper expands into a colossal, illuminated 2127 mega-monolith.
   - For prompts like *"flatten the city"* or *"ground zero"*, all buildings demolish cleanly to level-0 desolation.

8. **Cyber Telemetry & Vector Breakdown Decoder (`#debug-panel`)**:
   - Real-time diagnostic popup showing exact mathematical matrix mapping (`buildingCount`, `spinePitch`, `heightScale`, `wardrobePrimitive`, `locomotionGait`, `proceduralSpawn`, `mood`).
   - Indicates engine status (`LOCAL ZERO-SHOT NLP` vs `GEMINI 2.5 FLASH API`).
   - Extended procedural spawner to support celestial quantum singularities (`black_hole`), cyber alien fleets (`ufo`), and inverted golden monoliths (`pyramids`).

9. **Persistent World Accretion (`worldLayers`)**:
   - Decrees no longer wipe the world. Each spawning decree creates its own layer
     (`THREE.Group`) rotated into a fresh sector by the golden angle, so successive
     guests accrete around the city instead of stacking on identical plots.
   - `MAX_WORLD_ENTITIES` (32) caps skyline density; `enforceWorldBudget()` retires
     the oldest **ambient** (auto-stream) layer before ever touching a **guest** layer,
     so a visitor's decree outlives the auto-stream that follows it.
   - `retireLayer()` fades a layer out, then removes AND disposes it. `disposeObject3D()`
     walks the subtree freeing geometries/materials — scene-graph removal alone leaks VRAM.
   - `#decree-ledger` HUD panel lists standing decrees (prompt, GUEST/AMBIENT tag, time,
     object count) so visitors can see their mark persisting in the world.
   - Decree provenance flows `handleDecreeSubmission(prompt, origin)` →
     `targetState.sourcePrompt` / `sourceOrigin` → the layer record.

10. **Generative Scene DSL (`sanitizeComposition` / `buildComposition`)**:
   - The model no longer only picks from the 6-type `proceduralSpawn` enum. It can emit a
     `composition` node tree — 1-14 parts from a primitive whitelist (box/sphere/cylinder/
     cone/torus/torusKnot/plane/ring/icosa/octa/tetra), each with size/pos/rot/color/
     emissive/opacity/metal, plus `mirror` for bilateral symmetry (wings, limbs, horns).
   - `anchor` (ground/sky/center), `count` (1-6 copies ringing the city), `radius`, `scale`,
     and an `animate` block (spin/bob/orbit/undulate/pulse) complete the form.
   - **Strictly data — never eval model output.** `sanitizeComposition()` rejects structurally
     broken specs, drops unknown primitives, clamps every number, validates hex colours, and
     enforces `DSL_MAX_MESHES` (60) by reducing `count`. Failure returns null and the pipeline
     falls back to the hand-built enum spawners, so a guest never sees nothing happen.
   - Materials darken albedo to 0.32 and carry hue in emissive: the lighting rig is
     deliberately super-luminous (ambient 0.65 + hemi 1.3 + sun 2.2 @ exposure 1.45) and a
     mid-tone albedo saturates straight to white.

---

## 3. Active Decisions & Conventions
- **Single-File Preference**: Currently maintained inside `index.html` for instant portability and zero-build kiosk execution.
- **Parametric LERPs over Reloads**: All city transformations are done by lerping numeric values over 2.0–2.4s using GSAP.
- **Dual Engine Standard**: Any new prompt feature or schema modification must be mirrored in both `queryGeminiSocietalAI` and `localSemanticParser`.
  - **Documented exception — `composition`**: the scene DSL is Gemini-only by design. A keyword
    parser cannot author novel form, so `localSemanticParser` continues to return enum
    `proceduralSpawn` values and no `composition`. That path is exactly the DSL's own
    validation-failure fallback, so behaviour stays coherent with no API key set.
- **Never Evaluate Model Output**: composition specs are inert data run through
  `sanitizeComposition()`. Do not add a DSL feature that requires eval, Function(), or
  injecting model-supplied strings into the DOM — this runs unattended in a public space.
- **The World Accumulates**: Never clear `dynamicEntitiesGroup` wholesale. Anything added
  to the scene at runtime must join a layer via `registerEntity()` and be released through
  `retireLayer()`, so lifetime and GPU disposal stay in one place.
- **Guest Marks Outlive Guests**: Auto-stream is ambient drift *between* visitors, never an
  eraser of their decrees. Eviction priority is ambient-first, oldest-first, newest-never.
