/**
 * 2127 World Shaper — keyword matching for guest decree text.
 *
 * The offline parser (and the city-op keyword pass) used bare substring `includes`,
 * which fires on fragments inside unrelated words: `ai` matched "rain" and "said",
 * `hat` matched "that", `ring` matched "during", `tree` matched "street", `ice`
 * matched "police", `sand` matched "thousand", `tide` matched "outside", `red`
 * matched "hundred". On a kiosk with no API key this IS the engine, so a visitor
 * asking for more police got a city encased in ice.
 *
 * A blanket \b...\b is not the fix either: the vocabulary is deliberately full of
 * stems (`pollut` must catch "pollution", `crumbl` must catch "crumbling"). So there
 * are two matchers, and every term is anchored at a word START:
 *
 *   word(text, ['ai'])      only the complete word — "ai", never "rain" or "air"
 *   stem(text, ['pollut'])  a word beginning with it — "pollution", never "unpollute"
 *
 * Loaded as a plain <script> in the browser (window.Keywords2127) and as a CommonJS
 * module under `node --test`. No build step either way.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Keywords2127 = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const escapeTerm = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Decree text is short, but these run on every keyword group, so the compiled
  // patterns are memoised by their term list.
  const cache = new Map();

  function pattern(terms, anchorEnd) {
    const list = terms.filter((t) => typeof t === 'string' && t.length > 0);
    if (list.length === 0) return null;
    const key = (anchorEnd ? 'w:' : 's:') + list.join(' ');
    let re = cache.get(key);
    if (!re) {
      re = new RegExp('\\b(?:' + list.map(escapeTerm).join('|') + ')' + (anchorEnd ? '\\b' : ''), 'i');
      cache.set(key, re);
    }
    return re;
  }

  /** True when `text` contains any term as a complete word. */
  function word(text, terms) {
    const re = pattern(Array.isArray(terms) ? terms : [terms], true);
    return re ? re.test(String(text || '')) : false;
  }

  /** True when `text` contains a word starting with any term. */
  function stem(text, terms) {
    const re = pattern(Array.isArray(terms) ? terms : [terms], false);
    return re ? re.test(String(text || '')) : false;
  }

  return { word, stem };
});
