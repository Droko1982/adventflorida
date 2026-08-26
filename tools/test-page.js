#!/usr/bin/env node
/* =========================================================
   test-page.js — carga index.html en un DOM real y prueba
   el widget del sabado, los 9 idiomas, los enlaces del libro
   y que no quede ninguna clave sin traducir.
   Autor: Dr. Mauricio Rodriguez Herrera

   Necesita jsdom, que NO es dependencia del sitio:
     npm install --no-save jsdom  (o instalalo en otra carpeta)
   ========================================================= */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const ROOT = require('path').resolve(__dirname, '..');

const html = fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const errores = [];
const dom = new JSDOM(html, {
  runScripts: 'outside-only',
  url: 'https://droko1982.github.io/adventflorida/',
  pretendToBeVisual: true,
});
const { window } = dom;
window.matchMedia = window.matchMedia || (q => ({ matches:false, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} }));
window.IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} };
window.onerror = (m)=>errores.push(String(m));

for (const f of ['js/i18n.js','js/i18n2.js','js/i18n3.js','js/sabbath.js','js/main.js']) {
  try { window.eval(fs.readFileSync(path.join(ROOT,f),'utf8')); }
  catch(e){ errores.push(f+': '+e.message); }
}
window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

const $ = s => window.document.querySelector(s);
const txt = s => { const e=$(s); return e ? e.textContent.trim() : '(no existe)'; };

console.log('=== Widget del sabado ===');
console.log('  ciudades en el selector :', $('#sabCity').options.length);
console.log('  ciudad seleccionada     :', $('#sabCity').value);
console.log('  estado                  :', txt('#sabStatusText'));
console.log('  empieza                 :', txt('#sabStartTime'), '·', txt('#sabStartDay'));
console.log('  termina                 :', txt('#sabEndTime'), '·', txt('#sabEndDay'));

console.log('\n=== Cambio de ciudad (Pensacola, hora central) ===');
$('#sabCity').value = 'pensacola';
$('#sabCity').dispatchEvent(new window.Event('change'));
console.log('  empieza                 :', txt('#sabStartTime'), '·', txt('#sabStartDay'));

console.log('\n=== Cambio de idioma ===');
for (const code of ['es','ht','de','ru','uk']) {
  const btn = [...window.document.querySelectorAll('#langMenu button')].find(b=>b.getAttribute('data-lang')===code);
  btn.dispatchEvent(new window.Event('click'));
  console.log('  '+code+': titulo="'+txt('[data-i18n="sab.title"]')+'" | estado="'+txt('#sabStatusText')+'" | empieza '+txt('#sabStartTime'));
}

console.log('\n=== Enlace del libro por idioma ===');
for (const code of ['en','ht','ru']) {
  const btn = [...window.document.querySelectorAll('#langMenu button')].find(b=>b.getAttribute('data-lang')===code);
  btn.dispatchEvent(new window.Event('click'));
  console.log('  '+code+': '+$('#bookPdf').getAttribute('href').slice(0,62));
  console.log('        aviso: '+txt('#bookLegal').slice(0,72)+'…');
}

console.log('\n=== Donaciones (GIVE vacio) ===');
console.log('  boton en linea oculto:', $('#giveOnline').hasAttribute('hidden'));
console.log('  bloque Zelle oculto  :', $('#giveZelle').hasAttribute('hidden'));

console.log('\n=== Claves sin traducir en el DOM ===');
const crudas = [...window.document.querySelectorAll('[data-i18n],[data-i18n-html]')]
  .filter(e => /^[a-z]+(\.[a-zA-Z0-9]+)+$/.test(e.textContent.trim()));
console.log('  ', crudas.length ? crudas.map(e=>e.textContent.trim()).join(', ') : 'ninguna');

console.log('\n=== Errores de ejecucion ===');
console.log('  ', errores.length ? errores.join('\n   ') : 'ninguno');

process.exit(errores.length ? 1 : 0);
