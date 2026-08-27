# Process & AI Handover Guide: "2127 World Shaper"

## 1. Onboarding Protocol for Incoming AI Agents
When starting work on this project, follow this exact workflow:

1. **Read Memory Bank First**:
   - Read `memory-bank/projectbrief.md` for core goals and non-negotiables.
   - Read `memory-bank/systemPatterns.md` for architecture, Three.js object models, and procedural generation logic.
   - Read `memory-bank/activeContext.md` for the latest codebase state and active conventions.
2. **Review `index.html` Structure**:
   - Lines ~1–500: Tailwind CSS, Futuristic HUD Layout, Modals, Preset Chips.
   - Lines ~500–630: Web Audio API synth soundscape engine.
   - Lines ~630–860: Three.js initialization, lighting rig, ground grid, procedural buildings.
   - Lines ~860–1050: 24+ Cyber streetlights & 5 sweeping searchlights.
   - Lines ~1050–1290: Dynamic Holographic Sky-Billboard engine with live progress bar canvas.
   - Lines ~1290–1540: Flora ecosystem & autonomous flying drones fleet.
   - Lines ~1540–1800: 50 Pedestrians, pathfinding, accessory slots (`updateCitizenAccessories`), and procedural entity spawner (`spawnProceduralEntities`).
   - Lines ~1800–2100: GSAP state morphing engine (`applyStateTransformation`) & 60fps render loop (`animate`).
   - Lines ~2100–2520: Gemini 2.5 Flash structured API integration & Smart offline local NLP parser.
   - Lines ~2520–2800: Decree submission handler, Auto-Stream countdown, Web Speech API, and initialization.

---

## 2. Feature Extension Playbook

### How to Add a New Zero-Shot Citizen Accessory
1. In `updateCitizenAccessories(modifier)` (~line 1540):
   - Add a new `if (hatType === 'my_new_accessory')` block.
   - Build procedural geometry (e.g. `CylinderGeometry`, `TorusGeometry`, `SphereGeometry`), assign standard/basic material, and add to `c.hatGroup` or `c.auraGroup`.
   - Apply the pop-in GSAP tween: `gsap.to(c.hatGroup.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: "back.out(2)" });`.
2. In `queryGeminiSocietalAI` (~line 2370):
   - Add the new accessory type to the `hatType` enum in the structured response schema.
3. In `localSemanticParser` (~line 2450):
   - Add keyword regex detection for the new accessory and assign `citizenModifier.hatType`.
4. In `index.html` footer UI (~line 360):
   - Add a quick test chip: `<button onclick="submitWildPrompt('...')">`.

### How to Add a New Procedural Spawner Entity (e.g., Flying Jellyfish, Giant Mechs)
1. In `spawnProceduralEntities(spawnConfig)` (~line 1660):
   - Add a new `else if (type === 'my_new_entity')` block.
   - Create the Three.js mesh/group, set coordinates, add to `dynamicEntitiesGroup`.
   - Push to `dynamicEntities` array with an animation descriptor (`rotSpeed`, `speed`, `joints`, `phase`).
2. In `animate()` render loop (~line 2170):
   - Add the motion math for `ent.type === 'my_new_entity'`.
3. Mirror the enum in both `queryGeminiSocietalAI` and `localSemanticParser`.

---

## 3. Verification & Quality Checklist
Before handing over or finalizing code edits:

- [ ] **HTML & Syntax Validation**:
  ```bash
  python3 -c "import html.parser; html.parser.HTMLParser().feed(open('/Users/fatboy/2127/index.html').read()); print('HTML is valid')"
  ```
- [ ] **Dual Engine Parity**: Verify that any new prompt feature works both with Gemini API active AND with offline local fallback.
- [ ] **Performance Check**: Ensure no memory leaks or runaway mesh creation in the render loop.
- [ ] **Memory Bank Sync**: Update `activeContext.md` and `progress.md` after completing significant changes.
