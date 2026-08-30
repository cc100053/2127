'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');

const V = require('../src/validate.js');
const { clampNum, clampVec3, safeHex } = V;

// A stub vocabulary: the validators only ever read cost/bilateral and key presence,
// so the tests never need THREE.js or the real geometry builders.
const vocab = {
  macros: {
    limb: { cost: 3, bilateral: true },
    head: { cost: 2, bilateral: false },
    spire: { cost: 8, bilateral: false },
    wing: { cost: 4, bilateral: true }
  },
  prims: { box: 1, sphere: 1, plane: 1, ring: 1 },
  skins: { fungal: 1, crystal: 1, rusted: 1 },
  covers: { moss: 1, sand: 1 },
  ops: ['retexture_buildings', 'set_building_height', 'tilt_buildings', 'flood',
        'ground_cover', 'set_sky', 'set_windows', 'replace_buildings']
};
const { sanitizeComposition, sanitizeCityOps } = V.createValidators(vocab);

const node = (over = {}) => Object.assign({ part: 'head', size: [1, 1, 1], pos: [0, 0, 0] }, over);
const form = (over = {}) => Object.assign({ name: 'thing', nodes: [node()] }, over);

/* -------------------------------------------------------------------------- */
test('clampNum', async (t) => {
  await t.test('clamps into range', () => {
    assert.equal(clampNum(99, 0, 1, 0.5), 1);
    assert.equal(clampNum(-99, 0, 1, 0.5), 0);
    assert.equal(clampNum(0.25, 0, 1, 0.5), 0.25);
  });

  await t.test('falls back for anything non-finite', () => {
    for (const bad of [undefined, null, NaN, Infinity, -Infinity, {}, [], 'abc', true]) {
      assert.equal(clampNum(bad, 0, 1, 0.5), 0.5, `expected fallback for ${String(bad)}`);
    }
  });

  await t.test('accepts numeric strings, which the model does emit', () => {
    assert.equal(clampNum('0.75', 0, 1, 0.5), 0.75);
    assert.equal(clampNum('4', 0, 1, 0.5), 1);
  });
});

test('safeHex accepts only a full 6-digit hex', () => {
  assert.equal(safeHex('#00f0ff', null), '#00f0ff');
  assert.equal(safeHex('  #AABBCC  ', null), '#AABBCC');   // trimmed
  for (const bad of ['#fff', 'red', 'rgb(1,2,3)', '#00f0f', '#00f0fff', '', null, 42,
                     '#00f0ff;background:url(x)', '"><script>alert(1)</script>']) {
    assert.equal(safeHex(bad, '#fallback'), '#fallback', `expected reject for ${String(bad)}`);
  }
});

test('clampVec3 always yields three finite numbers', () => {
  assert.deepEqual(clampVec3([1, 2, 3], 0, 10, [0, 0, 0]), [1, 2, 3]);
  assert.deepEqual(clampVec3('not an array', 0, 10, [7, 8, 9]), [7, 8, 9]);
  assert.deepEqual(clampVec3([1], 0, 10, [7, 8, 9]), [1, 8, 9]);          // short array
  assert.deepEqual(clampVec3([99, -99, NaN], 0, 10, [5, 5, 5]), [10, 0, 5]);
});

/* -------------------------------------------------------------------------- */
test('sanitizeComposition rejects structurally unusable forms', () => {
  for (const bad of [null, undefined, 42, 'dragon', {}, { nodes: [] }, { nodes: 'x' },
                     { nodes: [{ part: 'unknown_part' }] },
                     { nodes: [null, 'x', 7] }]) {
    assert.equal(sanitizeComposition(bad), null, `expected null for ${JSON.stringify(bad)}`);
  }
});

test('sanitizeComposition drops unknown nodes but keeps the valid ones', () => {
  const out = sanitizeComposition(form({ nodes: [node({ part: 'wat' }), node({ prim: 'box', part: '' })] }));
  assert.equal(out.nodes.length, 1);
  assert.equal(out.nodes[0].prim, 'box');
  assert.equal(out.nodes[0].part, null);
});

test('sanitizeComposition prefers a macro part over a raw primitive', () => {
  const out = sanitizeComposition(form({ nodes: [node({ part: 'head', prim: 'box' })] }));
  assert.equal(out.nodes[0].part, 'head');
  assert.equal(out.nodes[0].prim, null);
  assert.equal(out.nodes[0].cost, 2);
});

test('sanitizeComposition infers bilateral mirroring from the sign of pos.x', () => {
  const offCentre = sanitizeComposition(form({ nodes: [node({ part: 'limb', pos: [1.5, 0, 0], mirror: false })] }));
  assert.equal(offCentre.nodes[0].mirror, true, 'a bilateral part off the midline pairs itself');

  const onCentre = sanitizeComposition(form({ nodes: [node({ part: 'limb', pos: [0, 2, 0], mirror: true })] }));
  assert.equal(onCentre.nodes[0].mirror, false, 'a bilateral part on the midline does not');

  const primNode = sanitizeComposition(form({ nodes: [node({ part: '', prim: 'box', pos: [3, 0, 0], mirror: true })] }));
  assert.equal(primNode.nodes[0].mirror, true, 'raw primitives still honour an explicit mirror');
});

test('sanitizeComposition clamps every numeric field', () => {
  const out = sanitizeComposition(form({
    count: 999, radius: -50, scale: 1e6,
    nodes: [node({ size: [1e9, 0, -4], pos: [500, -500, 0], emissive: 42, opacity: -1, metal: 'nope' })],
    animate: { type: 'spin', speed: 1e6, amp: -3, axis: 'q' }
  }));
  assert.deepEqual(out.nodes[0].size, [14, 0.05, 0.05]);
  assert.deepEqual(out.nodes[0].pos, [14, -14, 0]);
  assert.equal(out.nodes[0].emissive, 1);
  assert.equal(out.nodes[0].opacity, 0.15);
  assert.equal(out.nodes[0].metal, 0.4);        // fallback, not a clamp
  assert.equal(out.radius, 0);
  assert.equal(out.scale, 4);
  assert.equal(out.animate.speed, 4);
  assert.equal(out.animate.amp, 0);
  assert.equal(out.animate.axis, 'y');          // 'q' is not an axis
});

test('sanitizeComposition caps the node list', () => {
  const many = Array.from({ length: 100 }, () => node({ part: 'head' }));
  const out = sanitizeComposition(form({ nodes: many, count: 1 }));
  assert.ok(out.nodes.length <= V.DSL_MAX_NODES);
});

test('sanitizeComposition enforces the mesh budget by reducing copies', () => {
  // head costs 2, so 10 nodes = 20 meshes per copy; 6 copies would be 120 > 60.
  const nodes = Array.from({ length: 10 }, () => node({ part: 'head' }));
  const out = sanitizeComposition(form({ nodes, count: 6 }));
  assert.equal(out.count, 3, '20 meshes per copy fits three times under a 60 ceiling');
});

test('sanitizeComposition rejects a form too heavy even as a single copy', () => {
  // spire costs 8; 10 of them is 80 meshes for one copy, over the 60 ceiling.
  const nodes = Array.from({ length: 10 }, () => node({ part: 'spire' }));
  assert.equal(sanitizeComposition(form({ nodes, count: 1 })), null);
});

test('sanitizeComposition falls back on an unknown anchor and truncates the name', () => {
  const out = sanitizeComposition(form({ anchor: 'the_moon', name: 'x'.repeat(500) }));
  assert.equal(out.anchor, 'ground');
  assert.equal(out.name.length, 48);
});

test('sanitizeComposition is not fooled by inherited Object properties', () => {
  // `DSL_MACROS['constructor']` is truthy on a plain object, so a prototype-chain
  // lookup would admit this node with an undefined cost and poison the mesh budget.
  assert.equal(sanitizeComposition(form({ nodes: [node({ part: 'constructor' })] })), null);
  assert.equal(sanitizeComposition(form({ nodes: [node({ part: '', prim: 'toString' })] })), null);
});

/* -------------------------------------------------------------------------- */
test('sanitizeCityOps returns an array for any input', () => {
  for (const bad of [null, undefined, 'flood', 42, {}]) {
    assert.deepEqual(sanitizeCityOps(bad), []);
  }
});

test('sanitizeCityOps drops unknown ops and keeps only the first of each kind', () => {
  const out = sanitizeCityOps([
    { op: 'demolish_everything' },
    { op: 'tilt_buildings', degrees: 10 },
    { op: 'tilt_buildings', degrees: 40 },
    null, 'flood', { op: '  set_windows  ', lit: 0.5 }
  ]);
  assert.deepEqual(out.map((o) => o.op), ['tilt_buildings', 'set_windows']);
  assert.equal(out[0].degrees, 10, 'first of a kind wins');
});

test('sanitizeCityOps validates enum-valued materials against the vocabulary', () => {
  assert.deepEqual(sanitizeCityOps([{ op: 'retexture_buildings', material: 'not_a_skin' }]), []);
  assert.deepEqual(sanitizeCityOps([{ op: 'ground_cover', material: 'hasOwnProperty' }]), []);
  const ok = sanitizeCityOps([{ op: 'retexture_buildings', material: 'fungal', color: 'chartreuse' }]);
  assert.equal(ok[0].material, 'fungal');
  assert.equal(ok[0].color, null, 'an unparseable colour becomes null, not the raw string');
});

test('sanitizeCityOps drops set_sky without a usable colour but defaults flood colour', () => {
  assert.deepEqual(sanitizeCityOps([{ op: 'set_sky', color: 'midnight' }]), []);
  const flood = sanitizeCityOps([{ op: 'flood', height: 999, opacity: 5, color: 'nope' }]);
  assert.equal(flood[0].height, 9);
  assert.equal(flood[0].opacity, 0.95);
  assert.equal(flood[0].color, '#0d3a55');
});

test('sanitizeCityOps drops replace_buildings whose composition is unusable', () => {
  assert.deepEqual(sanitizeCityOps([{ op: 'replace_buildings', fraction: 0.5 }]), []);
  const ok = sanitizeCityOps([{ op: 'replace_buildings', fraction: 99, composition: form() }]);
  assert.equal(ok[0].fraction, 1);
  assert.equal(ok[0].composition.nodes.length, 1);
});

test('sanitizeCityOps caps how many ops one decree may issue', () => {
  const flood = Array.from({ length: 50 }, () => ({ op: 'flood' }));
  assert.ok(sanitizeCityOps(flood).length <= V.MAX_OPS_PER_DECREE);
});

test('sanitizeCityOps never returns an op outside the permitted vocabulary', () => {
  const out = sanitizeCityOps([
    { op: 'retexture_buildings', material: 'crystal' }, { op: 'set_building_height', multiplier: 2 },
    { op: 'tilt_buildings' }, { op: 'flood' }, { op: 'ground_cover', material: 'moss' },
    { op: 'set_sky', color: '#112233' }, { op: 'set_windows' },
    { op: 'replace_buildings', composition: form() }
  ]);
  assert.equal(out.length, 8);
  for (const o of out) assert.ok(vocab.ops.includes(o.op));
});
