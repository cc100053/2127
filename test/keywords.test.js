'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');

const { word, stem } = require('../src/keywords.js');

/* --------------------------------------------------------------------------
   The regressions this module exists to prevent. Every pair below is a real
   false positive the old `lower.includes(term)` matching produced, and on a
   keyless kiosk the offline parser IS the engine — so each one was a visitor
   getting a city they did not ask for.
   -------------------------------------------------------------------------- */
const falsePositives = [
  ['ai',   ['the rain returns', 'clean air for all', 'she said so', 'repair the grid']],
  ['hat',  ['that tower', 'what happens next', 'a hatch opens']],
  ['ring', ['during the night', 'spring returns', 'bring back the trees']],
  ['tree', ['street lights everywhere']],
  ['ice',  ['more police patrols', 'better service', 'justice for all', 'a new device']],
  ['sand', ['a thousand towers']],
  ['tide', ['outside the wall']],
  ['red',  ['a hundred years', 'restored to glory', 'covered in moss', 'required by law']],
  ['ash',  ['pay in cash', 'a crash landing', 'high fashion']],
  ['war',  ['a warm climate', 'toward the sea', 'a warehouse district', 'award the prize']],
  ['emp',  ['the empire falls', 'employ everyone', 'an empty plaza']],
  ['gem',  ['ask gemini']],
  ['law',  ['a green lawn']],
  ['bone', ['carbone tower']]
];

test('word() never fires on a term buried inside another word', () => {
  for (const [term, sentences] of falsePositives) {
    for (const sentence of sentences) {
      assert.equal(word(sentence, [term]), false,
        `"${term}" must not match "${sentence}"`);
    }
  }
});

test('word() still fires on the real term', () => {
  const truePositives = [
    ['ai',   'ban ai surveillance'],
    ['hat',  'everyone wears a hat'],
    ['ring', 'a ring above the city'],
    ['ice',  'encase the city in ice'],
    ['sand', 'bury the streets in sand'],
    ['tide', 'let the tide come in'],
    ['red',  'a red sky forever'],
    ['ash',  'the world turns to ash'],
    ['war',  'endless war'],
    ['emp',  'set off an emp'],
    ['law',  'a new law for all'],
    ['gem',  'towers of gem'],
    ['bone', 'built from bone']
  ];
  for (const [term, sentence] of truePositives) {
    assert.equal(word(sentence, [term]), true, `"${term}" must match "${sentence}"`);
  }
});

test('word() matches at the very start and end of the text', () => {
  assert.equal(word('ai', ['ai']), true);
  assert.equal(word('ban ai', ['ai']), true);
  assert.equal(word('ai rules', ['ai']), true);
});

test('word() is punctuation-tolerant, which is how people actually type', () => {
  for (const s of ['ban ai.', 'ai, everywhere', '"ai"', 'ai-driven', '(ai)']) {
    assert.equal(word(s, ['ai']), true, `should match in ${s}`);
  }
});

/* -------------------------------------------------------------------------- */
test('stem() matches a word beginning with the term', () => {
  assert.equal(stem('pollution everywhere', ['pollut']), true);
  assert.equal(stem('the city is polluted', ['pollut']), true);
  assert.equal(stem('buildings crumbling', ['crumbl']), true);
  assert.equal(stem('volcanic ash', ['volcan']), true);
  assert.equal(stem('plant trees', ['tree']), true);
  assert.equal(stem('a treehouse', ['tree']), true);
  assert.equal(stem('levitating citizens', ['levitat']), true);
  assert.equal(stem('celebrate forever', ['celebrat']), true);
});

test('stem() still refuses a match mid-word', () => {
  assert.equal(stem('street lights', ['tree']), false);
  assert.equal(stem('that tower', ['hat']), false);
  assert.equal(stem('during the night', ['ring']), false);
  assert.equal(stem('the rain', ['ai']), false);
  assert.equal(stem('a thousand', ['sand']), false);
});

/* -------------------------------------------------------------------------- */
test('multi-word phrases match as phrases', () => {
  assert.equal(word('declare a stone age', ['stone age']), true);
  assert.equal(word('walk in unison', ['in unison']), true);
  assert.equal(word('raise the sea level', ['sea level']), true);
  assert.equal(word('a stonemason age', ['stone age']), false);
});

test('terms with regex metacharacters are matched literally', () => {
  assert.equal(word('minimum height 1.8m', ['1.8m']), true);
  assert.equal(word('minimum height 148m', ['1.8m']), false, 'the dot must not act as a wildcard');
  assert.equal(word('four-leg citizens', ['four-leg']), true);
});

test('any term in the list can match', () => {
  assert.equal(word('the tide is rising', ['sea level', 'tide', 'canal']), true);
  assert.equal(word('nothing relevant here', ['sea level', 'tide', 'canal']), false);
});

test('empty and malformed inputs are safe', () => {
  assert.equal(word('', ['ai']), false);
  assert.equal(word(null, ['ai']), false);
  assert.equal(word(undefined, ['ai']), false);
  assert.equal(word('anything', []), false);
  assert.equal(word('anything', [null, undefined, '']), false);
  assert.equal(stem('anything', []), false);
});

test('a bare string is accepted in place of a list', () => {
  assert.equal(word('ban ai now', 'ai'), true);
  assert.equal(word('the rain', 'ai'), false);
});

test('matching is case-insensitive in both directions', () => {
  assert.equal(word('BAN AI NOW', ['ai']), true);
  assert.equal(word('ban ai now', ['AI']), true);
  assert.equal(stem('POLLUTION', ['pollut']), true);
});

/* --------------------------------------------------------------------------
   Whole-decree checks: the exact sentences that used to produce a wrong city.
   -------------------------------------------------------------------------- */
test('a decree about policing does not read as a decree about ice', () => {
  const decree = 'increase police patrols and enforce a curfew';
  assert.equal(word(decree, ['ice', 'icy']), false, 'ICE skin must not trigger');
  assert.equal(stem(decree, ['frozen', 'glacier']), false);
  // ...while the order keywords it is actually about do fire.
  assert.equal(stem(decree, ['polic', 'enforc']), true);
  assert.equal(word(decree, ['curfew']), true);
});

test('a decree about a thousand towers does not bury the city in sand', () => {
  const decree = 'raise a thousand towers into the sky';
  assert.equal(word(decree, ['sand', 'sands', 'sandy']), false);
  assert.equal(stem(decree, ['desert', 'dune']), false);
});

test('a decree about the outside world does not flood the city', () => {
  const decree = 'open the gates to everyone outside the wall';
  assert.equal(word(decree, ['sea level', 'tide', 'tides']), false);
  assert.equal(stem(decree, ['flood', 'drown', 'underwater', 'submerge', 'canal', 'ocean']), false);
});

test('a decree mentioning a hundred years does not turn the sky blood red', () => {
  const decree = 'a hundred years of peace, restored';
  assert.equal(word(decree, ['blood', 'red']), false);
});

test('a decree about clean air does not read as a decree about AI', () => {
  const decree = 'clean air and rain for every district';
  assert.equal(word(decree, ['ai', 'a.i.']), false);
  // It should read as nature instead.
  assert.equal(stem(decree, ['natur', 'clean']), true);
});
