# Project Brief: "2127 World Shaper" // 3D Interactive Exhibition Prototype

## 1. Executive Summary
**"2127 World Shaper"** is a fast, browser-based interactive 3D simulation prototype designed for an exhibition installation set in the year **2127**. 

Visitors transmit text or spoken voice decrees describing their visions or laws for the future (e.g., *"Ban all fossil fuels and build vertical algae towers"*, *"All citizens must wear bright green hats and march"*). An LLM layer (**Gemini 2.5 Flash API** with structured JSON output) parses these decrees into structured parameters and zero-shot procedural descriptors, instantly morphing a procedural Three.js metropolis in real time via **GSAP**.

---

## 2. Core Vision & Objectives
1. **Instant Gratification**: Sub-second visual and auditory feedback for exhibition visitors.
2. **Procedural 3D Metropolis**: A living $10 \times 10$ isometric city grid that dynamically transforms its architecture, flora, vehicles, citizens, and lighting in real time.
3. **Zero-Shot Procedural Reaction**: Ability to handle both standard societal vectors (Nature, Tech, Order) and totally open-ended/unprepared guest prompts (e.g., custom citizen hats, tentacles, crystals, orbital rings).
4. **Dual Ingestion Engine**: Google Gemini 2.5 Flash API with strict response schemas + zero-latency built-in offline NLP fallback engine (guaranteeing 100% uptime at exhibition venues).
5. **Zero-Dependency Architecture**: Entire simulation runs self-contained in a single `index.html` file with zero build step, zero npm dependencies, and zero external 3D asset files required.

---

## 3. Target Audience & Exhibition Context
- **Exhibition Visitors**: General public, museum guests, and conference attendees.
- **Interaction Duration**: Fast, engaging turns (~10–30 seconds per visitor).
- **Hardware Targets**: Interactive touchscreen kiosks, iPads, Mac Studio displays, projection walls, or standard desktop web browsers.
- **Framerate Target**: Locked 60–120 FPS.

---

## 4. Key Constraints & Non-Negotiables
- **Year Setting**: Must strictly reflect the year **2127** across all UI headers, sky-billboards, logs, and headlines.
- **Reliability**: Must never crash, freeze, or display an error modal if the venue Wi-Fi disconnects; it must seamlessly fall back to local semantic parsing.
- **Smooth Transitions**: No abrupt pop-ins or scene reloads; all geometry, materials, and citizen behaviors must lerp smoothly over 2 seconds with GSAP.
