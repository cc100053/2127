# Active Context: "2127 World Shaper"

## 1. Current State of the Codebase
The application is fully functional, verified, and running as a self-contained web prototype in [`/Users/fatboy/2127/index.html`](file:///Users/fatboy/2127/index.html).

---

## 2. Key Recent Implementations & Enhancements

000. **Live-API Verification Pass** (most recent — found two defects nothing else could):

   - **The response schema's `part` enum was stale.** It still listed the original ten parts
     after twenty existed, so structured output made the ten new ones *unemittable*. This is
     why "cargo walkers rolling" came back as `box, box, limb, limb, box` and "surveillance
     eyes" as `cylinder, segment_body` — the model was not ignoring the parts, it was
     forbidden from naming them. No prompt wording could ever have fixed it, and only a live
     call could have revealed it. **Every schema enum is now derived from the runtime
     vocabulary** (`DSL_MACROS`, `DSL_PRIMITIVES`, `CITY_SKINS`, `GROUND_COVERS`, `CITY_OPS`,
     `DSL_ANIMATORS`, `DSL_ANCHORS`). Never restate a vocabulary in a schema.
     After the fix the same two prompts returned `pod, wheel, wheel, rotor, sensor_orb` and
     `antenna, sensor_orb`, with zero primitives.
   - **The 8s timeout was silently demoting every phase-B call.** Flash answers phase B in
     9-25s; an 8s deadline aborted it every time and served the form from Flash-Lite, which
     is the inverse of what FORM_MODEL_CHAIN asks for. Split into `VECTOR_TIMEOUT_MS` (8s,
     guest waiting) and `FORM_TIMEOUT_MS` (30s, nobody blocked).
   - `FORM_PARTS_PROMPT` is hoisted out of the prompt so `verifyMacroVocabulary()` can assert
     at boot that every implemented part is both correctly costed AND named in the prompt.
   - Prompt gains a subject->part routing table and a second worked example (a machine), so
     the machine parts are demonstrated the way the dragon demonstrates the creature parts.
   - Measured good: bilateral pairing works end to end (two `wheel` nodes at +x became four
     wheels in the scene), declared mesh cost matches meshes built exactly (19 and 27 on two
     live forms), and a full decree completes with the tab HIDDEN — confirming the
     `settleWithin` fix under real ~50s two-phase latency.


00. **Vocabulary, Parser & Ledger Pass** (most recent):
   - **Macro parts 10 -> 20.** Added `wheel`, `rotor`, `pod` (machine/vehicle), `dome`,
     `stair_terrace`, `panel_array`, `antenna` (structure), `sensor_orb`, `tentacle`,
     `root_web` (organic/surveillance). The gap they close: anything outside the old ten
     degraded to raw primitives and read as an abstract shape. The phase-B prompt now
     groups the list by category so the model can find the right part fast.
   - **`verifyMacroCosts()`** builds every macro once at boot with counting stubs and warns
     on drift, because a wrong `cost` silently corrupts the 60-mesh ceiling.
   - Two parts were corrected against the render, not on paper: `panel_array`'s mullions
     sat flush with the face and vanished into the slab (now proud of it at z=+0.06), and
     `root_web` splayed upward like a flower opening (now thick at the crown with the tips
     going down and outward).
   - **Word-boundary keyword matching** (`src/keywords.js`, 17 tests). Substring `includes`
     had `ai` firing on "rain"/"air"/"said", `hat` on "that", `ring` on "during", `tree` on
     "street", and in `localCityOps` — never previously audited — `ice` on "police", `sand`
     on "thousand", `tide` on "outside", `red` on "hundred", `ash` on "crash", `war` on
     "warm", `emp` on "empire". A keyless kiosk runs on this parser, so "increase police
     patrols" literally encased the city in ice. Two matchers, `word()` and `stem()`,
     because the vocabulary needs both.
   - **Ledger renders per DECREE, not per layer.** It read off `worldLayers`, which only
     exist for decrees that produce geometry, so an edit-only decree left the panel saying
     "City unmarked" while the city was visibly flooded. Rows now come from the persisted
     history; layers carry a `recordId` so a decree's ops and its form group into one row
     reading "form · N edits · N obj". Presets and ambient spawns, which are not decrees,
     still get their own rows. Snapshot format is v2; v1 is still readable.


0. **Exhibition Robustness Pass** (most recent):
   - **Bounded inference**: every Gemini request carries an 8s `AbortController` deadline.
     Previously a stalled (not failed) request left the `await` unsettled, so the decree
     lock and the transmit button were never released — the kiosk was dead until reloaded.
   - **No load-bearing animation**: `settleWithin()` races any wait on a GSAP callback
     against a real timer. rAF and the GSAP ticker freeze whenever the page is hidden
     (minimised window, covered display, another virtual desktop), which hung a decree
     indefinitely — reproduced directly in a hidden tab, and fixed.
   - **Decree lock is turn-scoped**: `releaseDecreeControls(myTurn)` no-ops for a superseded
     turn, so a decree finishing its slower phase B can no longer unlock a newer one.
   - **Frame-rate independence**: `animate()` derives `delta` (clamped to 50ms) and
     `frameScale`; every per-frame `+=` is scaled by it. Drones, halos, citizen gaits and
     composed-form spins previously ran at double speed on a 120Hz display.
   - **WebGL context recovery**: `webglcontextlost` / `webglcontextrestored` are handled and
     the render loop parks and resumes, instead of the installation going to a black canvas.
   - **Billboard throttling**: the 1024x384 canvas repaint plus texture upload now runs at
     20fps while resolving and 10fps while broadcasting, not once per rendered frame.
   - **World persistence**: enacted decrees are stored as validated recipes in
     `localStorage` (`2127_WORLD_SNAPSHOT`) and replayed on boot, so the accreted city
     survives a reload. `#btn-wipe-world` on the ledger clears it deliberately.
   - **Validators extracted**: `src/validate.js` holds `sanitizeComposition` /
     `sanitizeCityOps` / `clampNum` / `clampVec3` / `safeHex`, loaded verbatim by the page
     and by `node --test`. The vocabulary is injected, so the module needs no THREE.js.
     Extraction also closed a latent prototype-chain hole (`part: "constructor"` was truthy
     against `DSL_MACROS` and poisoned the mesh budget); `hasOwnProperty` now gates it.
   - **Input hardening**: 280-char cap on the decree (markup and handler), and the debug
     panel's model-authored colours and labels go through `safeHex` / `escapeLedgerText`.


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

11. **Auto-Stream Removed & Layered Model Chain**:
   - The exhibition auto-stream is **gone** (button, queue, countdown, 1s interval, all
     `autoStreamCountdown` resets). It was cycling 8 curated prompts every 16s — ~1,800 API
     calls per 8-hour day to obtain 8 distinct answers, which was the entire quota problem.
     The app is now silent when idle and costs nothing until a guest actually transmits.
   - `MODEL_CHAIN = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash-lite',
     'gemini-2.5-flash']` is walked in order by both phases.
     429/5xx/network errors fall through to the next model; **400/401/403 break immediately**
     (malformed request or bad key would fail identically on the next model — don't pay twice).
     If every model fails, `localSemanticParser` still answers.
   - `lastEngineLabel` drives the header status and telemetry tag, so the HUD names the model
     that actually served the decree rather than assuming Flash.
   - Auth moved from `?key=` in the URL to the `x-goog-api-key` header.

12. **DSL corrections forced by the first live Gemini test**:
   - **`size` is now a bounding box for every primitive.** It previously mapped to per-prim
     constructor args (cylinder = radiusTop/height/radiusBottom), but the model always means
     [width, height, depth] — it does that correctly for `box` and assumes it everywhere.
     A dragon body of [1.5,1.5,8] was becoming a squat 8-wide cone. Every primitive is now
     authored to a 1x1x1 box and scaled by `size`, which also gives ellipsoids for free.
   - **`composition` is a REQUIRED schema field.** As an optional field the model omitted it on
     roughly half of identical prompts. "No form" is now expressed as `nodes: []`, which the
     validator already rejects into the enum fallback.
   - **`DSL_MAX_EXTENT` (20 units) fits the assembled form.** Clamping node size and `scale`
     independently was insufficient: the first real dragon came back 32x51x30 in a 30-unit
     city. `buildComposition` now measures the built group and derives a fitted scale.

13. **Vendored Dependencies (`vendor/`)**:
   - Tailwind 3.4.16, three r128, OrbitControls 0.128.0, GSAP 3.12.5, Lucide 0.468.0 and all
     three font families (30 woff2 files) are served locally. `vendor/README.md` records
     versions, provenance and licences.
   - `lucide@latest` was previously unpinned — an upstream release could have broken the
     kiosk overnight. Everything is pinned now.
   - The only remaining outbound request is `generativelanguage.googleapis.com`. Verified by
     network trace: 14 requests on load, all localhost.

14. **Two-Phase Decree Pipeline**:
   - **Phase A** (`queryGeminiSocietalAI`, `VECTOR_MODEL_CHAIN` = Lite -> Flash): societal
     vectors, headline, colour, anatomy, wardrobe, locomotion. Lands in ~2s; the city morphs
     and the input is released immediately.
   - **Phase B** (`queryProceduralForm`, `FORM_MODEL_CHAIN` = Flash -> Lite): the composed
     form only, given the decree plus phase A's resolved state as context. Lands ~10s later
     and materialises into an already-transformed city.
   - `callModelChain()` is now shared by both phases.
   - `decreeSequence` guards the async gap: a form returning after a newer decree has started
     is discarded rather than spawned into a city that has moved on.
   - **Phase A never spawns.** All spawn decisions belong to phase B: composition if one
     validates, otherwise phase A's enum `proceduralSpawn` as the fallback. This keeps it to
     exactly one layer per decree.

15. **Phase-B Prompt Tuning (measured, 2026-08-27)**:
   - The form prompt now opens with an explicit axis convention (+X right, +Y up, +Z forward),
     states that anything which flies/swims/walks lies ALONG Z while only towers and statues
     are tall in Y, and closes with a full worked exemplar (a 4-part "sky-ray") annotated with
     why its proportions work.
   - **Result: orientation fixed.** dragon z/y 5.08 and cargo-walker 4.32 (both now lie along
     travel), while cathedral 0.54 and jellyfish 0.84 stayed correctly vertical — the model
     distinguishes correctly rather than over-applying the rule.
   - **`mirror` remains ignored** despite being stated as a hard rule. Mitigated in code by
     raising `DSL_MAX_NODES` to 20. Do not assume `mirror` will be used when budgeting nodes.

16. **City Edit Ops (phase B, added 2026-08-27)**:
   - Phase B now returns `{ composition, ops }`. `ops` is a closed vocabulary of eight
     bounded edits against the city that is ALREADY STANDING: `retexture_buildings`,
     `set_building_height`, `tilt_buildings`, `flood`, `ground_cover`, `set_sky`,
     `set_windows`, `replace_buildings`.
   - **Why**: three societal scalars are a 3-D latent space, and every decree was being
     projected onto it. "Flood the streets", "grow fungus on the towers" and "plant a
     forest" all landed on the same city plus a decorative object beside it. Ops widen
     the channel between the guest's language and the metropolis.
   - **Ops persist.** `cityOverrides` holds one slot per op kind; a later decree's op of
     the same kind supersedes it. `applyStateTransformation()` re-derives everything from
     the vectors, so `applyCityOverrides(duration)` runs at its end (step 9) to re-assert
     them. Those tweens use `overwrite: true` — GSAP 3 otherwise runs competing tweens on
     the same property concurrently and the city flickers.
   - `replace_buildings` is the only op that makes geometry. It marks buildings
     `b.replaced`, which `applyStateTransformation()` skips, and registers an `onRetire`
     hook so evicting the layer restores the skyline. Capped at `MAX_WORLD_ENTITIES`.
   - **Offline parity**: `localCityOps()` keyword-matches ops in `localSemanticParser`.
     Ops are a closed enum, so unlike `composition` they do NOT need the Gemini-only
     exception — a keyless kiosk still visibly rewrites its city.

17. **Macro Parts in the Scene DSL (added 2026-08-27)**:
   - A DSL node is now either a macro `part` or a raw `prim`. `DSL_MACROS` holds ten
     hand-tuned primitive clusters: `limb`, `wing`, `fin`, `tail`, `head`, `spire`,
     `arch`, `trunk_canopy`, `segment_body`, `ring_halo`. Each is authored in a unit box
     and scaled to `size`, exactly like a primitive.
   - **`mirror` is no longer asked of the model for anatomy.** Item 15 measured that it
     ignores the flag entirely. `limb`/`wing`/`fin` are marked `bilateral` and are paired
     in CODE off the sign of `pos.x`. A macro twin gets `scale.x *= -1` (a real
     reflection, since macros are authored one-handed) plus `DoubleSide`, because negative
     scale reverses face winding. `mirror` still works for hand-authored prims.
   - Mesh budget now counts `node.cost * (mirror ? 2 : 1)` against `DSL_MAX_MESHES`.
   - Verified with a stubbed `window.fetch`: a 5-node dragon builds 7 parts (body, head,
     tail, wing x2, limb x2) with correct bilateral symmetry.

18. **One Layer Per Decree, enforced (2026-08-27)**:
   - `openDecreeLayer()` / `closeDecreeLayer()` are now explicit. `handleDecreeSubmission`
     opens ONE layer for the whole of phase B and passes it to both `applyCityOps()` and
     `spawnProceduralEntities()`, which append to `layer.form` rather than opening their
     own. A first cut had `replace_buildings` open a second layer and the ledger showed a
     single decree twice.

---

## 3. Active Decisions & Conventions
- **Single-File Preference**: Currently maintained inside `index.html` for instant portability and zero-build kiosk execution.
- **Parametric LERPs over Reloads**: All city transformations are done by lerping numeric values over 2.0–2.4s using GSAP.
- **Dual Engine Standard**: Any new prompt feature or schema modification must be mirrored in both `queryGeminiSocietalAI` and `localSemanticParser`.
  - **Ops are NOT an exception**: `localCityOps()` mirrors the op vocabulary offline.
  - **Documented exception — `composition`**: the scene DSL is Gemini-only by design. A keyword
    parser cannot author novel form, so `localSemanticParser` continues to return enum
    `proceduralSpawn` values and no `composition`. That path is exactly the DSL's own
    validation-failure fallback, so behaviour stays coherent with no API key set.
- **One Layer Per Decree**: phase A transforms, phase B edits and spawns. Never let both
  spawn, and never let ops and the composition open separate layers — `handleDecreeSubmission`
  owns the layer and passes it down.
- **Ask Before Live API Calls**: the key is on a free tier. Stub `window.fetch` to exercise
  code paths offline; only spend real calls with the user's explicit go-ahead.
- **No Idle API Traffic**: nothing may call the model unless a guest acted. Any future
  ambient/attract mode must serve pre-computed responses from a static file, never live calls.
- **Key Precedence**: `.env` (fetched at runtime, dev only) > `localStorage` (in-app modal,
  the kiosk path). `.env` is gitignored; `.env.example` is the committed template. The
  placeholder value `your_api_key_here` is explicitly treated as "no key".
- **Never Evaluate Model Output**: composition specs are inert data run through
  `sanitizeComposition()`. Do not add a DSL feature that requires eval, Function(), or
  injecting model-supplied strings into the DOM — this runs unattended in a public space.
- **The World Accumulates**: Never clear `dynamicEntitiesGroup` wholesale. Anything added
  to the scene at runtime must join a layer via `registerEntity()` and be released through
  `retireLayer()`, so lifetime and GPU disposal stay in one place.
- **Guest Marks Outlive Guests**: Auto-stream is ambient drift *between* visitors, never an
  eraser of their decrees. Eviction priority is ambient-first, oldest-first, newest-never.
