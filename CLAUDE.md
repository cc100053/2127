# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # serve over HTTP on :8080 (npx serve) — needed for .env to load
npm run check      # syntax-only: vm.Script-parses every inline <script> in index.html + src/*.js
npm test           # runs check, then node --test over test/**/*.test.js
node --test test/validate.test.js     # a single test file
node --test --test-name-pattern "sanitizeCityOps caps"   # a single test by name
```

There is **no build step and no framework**. `index.html` is the entire app; `three.min.js`, `gsap`, `OrbitControls`, Tailwind and Lucide are vendored under `vendor/`. Opening `index.html` via `file://` works but skips `.env` (use the in-app **API KEY** modal or the offline parser). Copy `.env.example` → `.env` and paste a Gemini key from https://aistudio.google.com/apikey to enable live inference.

## Architecture

### One file, numbered sections

`index.html` holds ~4,700 lines of simulation engine in a single inline `<script>` starting ~line 582, organised into commented sections:

| Section | Lines | Contents |
|---|---|---|
| 1 Global state | ~587 | `cityState` (nature/tech/order 0–1), `PRESETS` |
| 2 Web Audio synth | ~637 | ambient drone + FX, no assets |
| 3 Three.js city engine | ~733 | lighting rig, ground grid, `createProceduralCity`, streetlights/searchlights, billboard, flora, drones, citizens, particles |
| — DSL vocabulary | ~1863–2565 | `DSL_PRIMITIVES`, `DSL_MACROS`, `CITY_SKINS`, `GROUND_COVERS` + `verifyMacroVocabulary()` boot check |
| 4 GSAP morph engine | ~3284 | `applyStateTransformation` — the one function that re-derives the whole scene from the 3 scalars |
| 5 HUD helpers | ~3602 | gauge bars, civilization-state label |
| 6 Render loop | ~3636 | `animate()`; per-frame motion scaled by `frameScale` (delta clamped to 50ms) |
| 7 AI engine | ~3810 | model chain, `queryGeminiSocietalAI` (phase A), `queryProceduralForm` (phase B), `localSemanticParser` (offline) |
| 8 Interaction | ~4638 | `handleDecreeSubmission`, billboard progress, Web Speech, debug panel |
| 8b World persistence | ~5090 | `saveWorldSnapshot` / `restoreWorldSnapshot`, `wipeWorld` |
| 9 Init | ~5214 | `DOMContentLoaded` bootstrap |

The `process.md` line numbers in `memory-bank/` are stale; trust the table above or grep.

### The testable boundary: `src/`

`src/validate.js` (`window.Validate2127`) and `src/keywords.js` (`window.Keywords2127`) are the **only** browser-free modules. They are loaded verbatim by both `index.html` (as `<script>`) and `node --test` (as CommonJS). They are the security and stability boundary — **nothing the model returns is ever evaluated**; `sanitizeComposition` / `sanitizeCityOps` clamp, drop, or reject it into shape, and the offline parser matches guest text on word boundaries (`word()` = whole words, `stem()` = word-start + any suffix). Changes here need a matching test.

### Vocabulary lives in `index.html`, is injected into the validators

`DSL_MACROS`, `DSL_PRIMITIVES`, `CITY_SKINS`, `GROUND_COVERS`, `CITY_OPS`, `DSL_ANIMATORS`, `DSL_ANCHORS` are defined in `index.html` next to the geometry that implements them, then passed in via `Validate2127.createValidators({ macros, prims, skins, ... })`. **Every structured-output response-schema enum is derived from these objects at runtime — never hand-write a copy of a vocabulary list in the schema.** A stale hand-written `part` enum once made ten macro parts literally unemittable.

### Two-phase AI pipeline with graceful degradation

1. **Phase A** (`queryGeminiSocietalAI`, `VECTOR_TIMEOUT_MS` = 8s): decree → `{ natureLevel, techLevel, orderLevel, headline, dominantColor, anatomy, wardrobe, locomotion }`. Fast, because a guest is watching a progress bar. `applyStateTransformation` runs immediately and controls are released.
2. **Phase B** (`queryProceduralForm`, `FORM_TIMEOUT_MS` = 30s): the slower/stronger model composes a node-tree **form** the decree summons plus **city ops** that edit the standing metropolis. Skipped entirely when no API key is set.
3. **Model chain**: `gemini-3.5-flash-lite` → `gemini-3.1-flash-lite` → `gemini-2.5-flash-lite` → `gemini-2.5-flash`. A 429/5xx/timeout advances the chain; a 400/401/403 aborts it (bad key — don't burn quota). If nothing responds, `localSemanticParser` + `Keywords2127` produce the same shape offline, then hand-built spawners are the final fallback.

**Dual-engine parity is a hard requirement:** any new prompt-driven feature must work both through Gemini (add to the schema-feeding vocabulary/enum) and through the offline keyword parser (add `Keywords2127` detection in `localSemanticParser` / `localCityOps`).

### Persistent world accretion

Decrees **layer onto** the city, they don't reset it (`worldLayers`, `decreeHistory`, the `STANDING DECREES` ledger). City ops persist one slot per kind until superseded. Each enacted decree's *validated recipe* (its ops + composed form, not the scene graph) is written to `localStorage` (`2127_WORLD_SNAPSHOT`) and replayed on boot, re-sanitised on the way back in. `wipeWorld()` / the ledger **WIPE** button clears it.

### Exhibition robustness (runs unattended for days)

Bounded inference timeouts; frame-rate independence via `frameScale`; `webglcontextlost`/`webglcontextrestored` recovery; billboard canvas repaint throttled (20fps resolving / 10fps broadcasting); rAF-based waits raced against real timers because rAF freezes on a hidden tab.

## Localization

All visitor-facing UI is Japanese (`<html lang="ja">`, `recognition.lang = 'ja-JP'`, phase-A prompt requests a Japanese `headline`). Deliberately left English: debug-panel enum tokens (they mirror the DSL vocabulary), and the offline parser's `st()`/`w()` keyword arguments plus `submitWildPrompt('…')` demo strings (the offline matcher only recognises English).

## Memory bank protocol

`AGENTS.md` requires reading `memory-bank/` before starting work and updating `memory-bank/activeContext.md` + `memory-bank/progress.md` after completing significant changes.
