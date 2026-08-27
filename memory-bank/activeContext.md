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

---

## 3. Active Decisions & Conventions
- **Single-File Preference**: Currently maintained inside `index.html` for instant portability and zero-build kiosk execution.
- **Parametric LERPs over Reloads**: All city transformations are done by lerping numeric values over 2.0–2.4s using GSAP.
- **Dual Engine Standard**: Any new prompt feature or schema modification must be mirrored in both `queryGeminiSocietalAI` and `localSemanticParser`.
