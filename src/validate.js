/**
 * 2127 World Shaper — input validators for model-authored data.
 *
 * Everything the Gemini call returns is untrusted: it is never evaluated, only
 * validated into a shape the scene builders can consume. That makes these four
 * functions the security and stability boundary of the whole installation, and
 * the only part of it that is pure enough to test without a browser or a GPU.
 * They live here so `npm test` can hammer them with malformed input.
 *
 * The vocabulary (which macro parts, primitives, skins and covers exist) stays in
 * index.html next to the geometry that implements it, and is injected here — so
 * this module never needs to know about THREE.js, and the tests can pass a stub.
 *
 * Loaded as a plain <script> in the browser (exposing window.Validate2127) and as
 * a CommonJS module under `node --test`. No build step either way.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Validate2127 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const DSL_ANIMATORS = ['none', 'spin', 'bob', 'orbit', 'undulate', 'pulse'];
  const DSL_ANCHORS = { ground: 0.0, sky: 17.0, center: 3.0 };  // sky clears the HUD band
  const DSL_MAX_NODES = 20;    // per form, before mirroring
  const DSL_MAX_COPIES = 6;    // placements of the form around the city
  const DSL_MAX_MESHES = 60;   // hard ceiling on total meshes the form may produce
  const MAX_OPS_PER_DECREE = 12;

  const clampNum = (v, lo, hi, dflt) => {
    const n = typeof v === 'number' ? v : parseFloat(v);
    return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : dflt;
  };

  const clampVec3 = (v, lo, hi, dflt) => {
    const a = Array.isArray(v) ? v : [];
    return [0, 1, 2].map((i) => clampNum(a[i], lo, hi, dflt[i]));
  };

  const safeHex = (c, dflt) =>
    (typeof c === 'string' && /^#[0-9a-fA-F]{6}$/.test(c.trim())) ? c.trim() : dflt;

  /**
   * @param {object} vocab
   * @param {object} vocab.macros  part name -> { cost, bilateral, ... }
   * @param {object} vocab.prims   primitive name -> anything truthy
   * @param {object} vocab.skins   building skin name -> anything truthy
   * @param {object} vocab.covers  ground cover name -> anything truthy
   * @param {string[]} vocab.ops   permitted city op names
   */
  function createValidators(vocab) {
    const macros = vocab.macros || {};
    const prims  = vocab.prims  || {};
    const skins  = vocab.skins  || {};
    const covers = vocab.covers || {};
    const ops    = vocab.ops    || [];

    // Reject rather than repair anything structurally wrong; clamp anything merely
    // out of range. Returns null when the form is unusable.
    function sanitizeComposition(raw) {
      if (!raw || typeof raw !== 'object') return null;
      if (!Array.isArray(raw.nodes) || raw.nodes.length === 0) return null;

      const nodes = [];
      for (const n of raw.nodes.slice(0, DSL_MAX_NODES)) {
        if (!n || typeof n !== 'object') continue;

        // A node is either a macro part or a raw primitive. `part` wins when both
        // are present, since a macro is always the better silhouette.
        const part = typeof n.part === 'string' ? n.part.trim() : '';
        const prim = typeof n.prim === 'string' ? n.prim.trim() : '';
        const macro = Object.prototype.hasOwnProperty.call(macros, part) ? macros[part] : null;
        const hasPrim = Object.prototype.hasOwnProperty.call(prims, prim);
        if (!macro && !hasPrim) continue;                  // unknown node: drop it

        const pos = clampVec3(n.pos, -14, 14, [0, 0, 0]);
        nodes.push({
          part: macro ? part : null,
          prim: macro ? null : prim,
          cost: macro ? macro.cost : 1,
          size: clampVec3(n.size, 0.05, 14, [1, 1, 1]),
          pos,
          rot:  clampVec3(n.rot, -360, 360, [0, 0, 0]),
          color: safeHex(n.color, null),
          emissive: clampNum(n.emissive, 0, 1, 0.22),
          opacity: clampNum(n.opacity, 0.15, 1, 1),
          metal: clampNum(n.metal, 0, 1, 0.4),
          // A bilateral macro is paired in code off the sign of pos.x. The model
          // was measured to ignore `mirror` entirely, so for those parts we stop
          // asking and infer it; `mirror` still works for hand-built primitives.
          mirror: (macro && macro.bilateral) ? Math.abs(pos[0]) > 0.001 : n.mirror === true
        });
      }
      if (nodes.length === 0) return null;

      const meshesPerCopy = nodes.reduce((n, d) => n + d.cost * (d.mirror ? 2 : 1), 0);
      let count = Math.round(clampNum(raw.count, 1, DSL_MAX_COPIES, 1));
      while (count > 1 && meshesPerCopy * count > DSL_MAX_MESHES) count--;
      if (meshesPerCopy * count > DSL_MAX_MESHES) return null;   // one copy is already too heavy

      const anim = (raw.animate && typeof raw.animate === 'object') ? raw.animate : {};
      const animType = DSL_ANIMATORS.includes(anim.type) ? anim.type : 'none';
      const axis = ['x', 'y', 'z'].includes(anim.axis) ? anim.axis : 'y';

      return {
        name: String(raw.name || 'unnamed form').slice(0, 48),
        anchor: Object.prototype.hasOwnProperty.call(DSL_ANCHORS, raw.anchor) ? raw.anchor : 'ground',
        count,
        radius: clampNum(raw.radius, 0, 16, 9),
        scale: clampNum(raw.scale, 0.2, 4, 1),
        nodes,
        animate: {
          type: animType,
          speed: clampNum(anim.speed, 0.05, 4, 1),
          amp: clampNum(anim.amp, 0, 3, 1),
          axis
        }
      };
    }

    // Reject anything structurally wrong, clamp anything merely out of range,
    // drop anything unrecognised. Returns [] rather than null so callers can
    // iterate unconditionally.
    function sanitizeCityOps(raw) {
      if (!Array.isArray(raw)) return [];
      const out = [];
      const seen = new Set();

      for (const o of raw.slice(0, MAX_OPS_PER_DECREE)) {
        if (!o || typeof o !== 'object') continue;
        const op = typeof o.op === 'string' ? o.op.trim() : '';
        if (!ops.includes(op)) continue;
        if (seen.has(op)) continue;          // one of each kind per decree; first wins
        seen.add(op);

        switch (op) {
          case 'retexture_buildings': {
            const material = Object.prototype.hasOwnProperty.call(skins, o.material) ? o.material : null;
            if (!material) continue;
            out.push({ op, material, color: safeHex(o.color, null) });
            break;
          }
          case 'set_building_height':
            out.push({ op, multiplier: clampNum(o.multiplier, 0.05, 4, 1) });
            break;
          case 'tilt_buildings':
            out.push({ op, degrees: clampNum(o.degrees, 0, 45, 0) });
            break;
          case 'flood':
            out.push({
              op,
              height: clampNum(o.height, 0, 9, 1.5),
              color: safeHex(o.color, '#0d3a55'),
              opacity: clampNum(o.opacity, 0.2, 0.95, 0.72)
            });
            break;
          case 'ground_cover': {
            const material = Object.prototype.hasOwnProperty.call(covers, o.material) ? o.material : null;
            if (!material) continue;
            out.push({ op, material, color: safeHex(o.color, null) });
            break;
          }
          case 'set_sky': {
            const color = safeHex(o.color, null);
            if (!color) continue;
            out.push({ op, color, fogDensity: clampNum(o.fogDensity, 0, 0.08, 0.018) });
            break;
          }
          case 'set_windows':
            out.push({ op, lit: clampNum(o.lit, 0, 1, 0.8), color: safeHex(o.color, null) });
            break;
          case 'replace_buildings': {
            // The dramatic one: swap part of the actual skyline for a composed form.
            const composition = sanitizeComposition(o.composition);
            if (!composition) continue;
            out.push({ op, fraction: clampNum(o.fraction, 0.05, 1, 0.4), composition });
            break;
          }
        }
      }
      return out;
    }

    return { sanitizeComposition, sanitizeCityOps };
  }

  return {
    clampNum, clampVec3, safeHex, createValidators,
    DSL_ANIMATORS, DSL_ANCHORS, DSL_MAX_NODES, DSL_MAX_COPIES, DSL_MAX_MESHES,
    MAX_OPS_PER_DECREE
  };
});
