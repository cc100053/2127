#!/usr/bin/env node
'use strict';
/**
 * index.html carries ~4,000 lines of JavaScript with no build step, so nothing sits
 * between a stray typo and the exhibition floor. This parses every inline <script>
 * block (and src/*.js) and fails loudly on a syntax error. Syntax only — it does not
 * resolve browser globals.
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
let failures = 0;

function check(label, source) {
  try {
    new vm.Script(source, { filename: label });
    console.log(`  ok  ${label}`);
  } catch (err) {
    failures++;
    console.error(`  FAIL ${label}: ${err.message}`);
  }
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const blocks = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
if (blocks.length === 0) {
  console.error('  FAIL index.html: no inline <script> blocks found — did the parse break?');
  failures++;
}
blocks.forEach((m, i) => {
  const line = html.slice(0, m.index).split('\n').length;
  check(`index.html inline script #${i + 1} (line ${line})`, m[1]);
});

for (const f of fs.readdirSync(path.join(root, 'src'))) {
  if (f.endsWith('.js')) {
    check(`src/${f}`, fs.readFileSync(path.join(root, 'src', f), 'utf8'));
  }
}

if (failures > 0) {
  console.error(`\n${failures} syntax failure(s).`);
  process.exit(1);
}
console.log('\nAll scripts parse.');
