#!/usr/bin/env node
/* test-i18n.js — cruza las claves del HTML contra los 9 diccionarios */
const fs = require('fs');
global.window = {};
['js/i18n.js','js/i18n2.js','js/i18n3.js'].forEach(f => eval(fs.readFileSync(f,'utf8')));
const I18N = window.FAM_I18N, LANGS = window.FAM_LANGS, VERSES = window.FAM_VERSES;
const html = fs.readFileSync('index.html','utf8');

const keys = new Set();
for (const m of html.matchAll(/data-i18n(?:-html|-placeholder|-aria)?="([^"]+)"/g)) keys.add(m[1]);

console.log('Idiomas declarados :', LANGS.map(l=>l.code).join(', '));
console.log('Claves usadas en HTML:', keys.size);

let bad = 0;
for (const l of LANGS) {
  const d = I18N[l.code];
  if (!d) { console.log(`FALTA diccionario: ${l.code}`); bad++; continue; }
  const missing = [...keys].filter(k => d[k] === undefined);
  const verses = (VERSES[l.code]||[]).length;
  console.log(`  ${l.code}: ${Object.keys(d).length} claves | faltan ${missing.length} | versiculos ${verses}` +
    (missing.length ? ' -> ' + missing.join(', ') : ''));
  if (missing.length || verses !== 4) bad++;
}

// claves definidas pero no usadas (informativo)
const en = Object.keys(I18N.en);
const APLICADAS_POR_JS = ['book.legalHt','sab.now','sab.next'];
const unused = en.filter(k => !keys.has(k) && !k.startsWith('wa.') && k !== 'meta.description' && !k.startsWith('prayer.f.need') && k !== 'book.legalAlt' && !APLICADAS_POR_JS.includes(k));
console.log('Definidas y no usadas en HTML:', unused.length ? unused.join(', ') : 'ninguna');
console.log(bad ? `\n*** ${bad} idioma(s) con problemas ***` : '\nTodo correcto en los 9 idiomas.');

process.exit(bad ? 1 : 0);
