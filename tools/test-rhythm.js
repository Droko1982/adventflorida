#!/usr/bin/env node
/* =========================================================
   test-rhythm.js — ritmo visual de la pagina.
   Comprueba que las bandas de fondo alternen, que el
   degradado de acento siga siendo escaso y que el sistema
   de transiciones no se disperse.
   Autor: Dr. Mauricio Rodriguez Herrera

     npm install --no-save jsdom
     node tools/test-rhythm.js
   ========================================================= */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

let JSDOM;
try { ({ JSDOM } = require("jsdom")); }
catch (e) { console.error("Falta jsdom:  npm install --no-save jsdom"); process.exit(2); }

const ROOT = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const css = fs.readFileSync(path.join(ROOT, "css", "styles.css"), "utf8");
const doc = new JSDOM(html).window.document;

let fallos = 0;
function ok(cond, etiqueta, detalle) {
  if (!cond) fallos++;
  console.log("  " + (cond ? "ok   " : "FALLA") + " " + (etiqueta + " ".repeat(36)).slice(0, 36) + (detalle || ""));
}

/* Extrae el bloque de una regla de clase, degradados incluidos */
function regla(cls) {
  /* La clase tiene que ser el selector entero, no la cola de otro:
     buscar ".contact {" a pelo encontraba ".no-missions .contact {". */
  const re = new RegExp("(?:^|[\\n,}])\\s*\\." + cls + "\\s*\\{", "m");
  const m = re.exec(css);
  if (!m) return null;
  const i = m.index + m[0].length;
  return css.slice(i, css.indexOf("}", i));
}

/* Reglas que solo aplican con la seccion de misiones oculta, que es el
   estado en el que vive la pagina mientras js/events.js este vacio.
   Devuelve BASE o ALT si hay una anulacion para esa seccion. */
const SIN_MIS = (() => {
  /* Un mapa selector -> banda con todas las reglas .no-missions */
  const mapa = new Map();
  /* Sin comentarios: si no, el bloque de arriba se pega al primer
     selector de la regla y ese selector deja de reconocerse. */
  const limpio = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const re = /([^{}]*\.no-missions[^{}]*)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(limpio))) {
    const decl = /background:\s*([\s\S]*?);/.exec(m[2]);
    if (!decl) continue;
    const b = /var\(--bg-alt\)/.test(decl[1]) ? "ALT" : "BASE";
    m[1].split(",").forEach((sel) => {
      const s = sel.trim().replace(/^\.no-missions\s+/, "");
      if (s) mapa.set(s, b);
    });
  }
  return mapa;
})();

function anulacion(sec) {
  if (sec.id && SIN_MIS.has("#" + sec.id)) return SIN_MIS.get("#" + sec.id);
  for (const c of sec.classList) if (SIN_MIS.has("." + c)) return SIN_MIS.get("." + c);
  return null;
}

/* Que banda pinta una seccion: BASE, ALT, o hereda del body (BASE) */
function banda(sec, sinMisiones) {
  if (sinMisiones) {
    const a = anulacion(sec);
    if (a) return a;
  }
  if (sec.classList.contains("section-alt")) return "ALT";
  for (const c of sec.classList) {
    const r = regla(c);
    if (!r) continue;
    const m = /background:\s*([\s\S]*?);/.exec(r);
    if (!m) continue;
    if (/var\(--bg-alt\)/.test(m[1])) return "ALT";
    if (/var\(--bg\)/.test(m[1])) return "BASE";
    return "BASE";               /* solo degradados sobre el fondo del body */
  }
  return "BASE";
}

function tieneDegradado(sec) {
  for (const c of sec.classList) {
    const r = regla(c);
    if (r && /radial-gradient/.test(r)) return true;
  }
  return false;
}

console.log("\n=== Alternancia de bandas ===\n");
const secciones = [...doc.querySelectorAll("section")];
let previa = null, repetidas = [], conDegradado = [];

for (const s of secciones) {
  const b = banda(s);
  const id = s.id || "(sin id)";
  if (previa !== null && b === previa) repetidas.push(id);
  if (tieneDegradado(s)) conDegradado.push(id);
  console.log("   " + id.padEnd(14) + b + (previa !== null && b === previa ? "   <-- igual que la anterior" : ""));
  previa = b;
}

console.log();
ok(repetidas.length === 0, "sin dos bandas iguales seguidas",
  repetidas.length ? repetidas.join(", ") : secciones.length + " secciones");
ok(conDegradado.length <= 4, "el degradado de acento es escaso",
  conDegradado.length + ": " + conDegradado.join(", "));

/* Y ahora el estado en el que la pagina esta HOY: js/events.js vacio,
   asi que #misiones no se muestra. Al quitar una banda de en medio, las
   de abajo quedaban al reves y Ministerios y Oracion salian pegadas con
   el mismo fondo. Esta segunda pasada es la que lo vigila. */
console.log("\n=== Alternancia con #misiones oculta ===\n");
const visibles = secciones.filter((s) => s.id !== "misiones");
let prev2 = null; const rep2 = [];
for (const s of visibles) {
  const b = banda(s, true);
  const id = s.id || "(sin id)";
  if (prev2 !== null && b === prev2) rep2.push(id);
  console.log("   " + id.padEnd(14) + b + (prev2 !== null && b === prev2 ? "   <-- igual que la anterior" : ""));
  prev2 = b;
}
console.log();
ok(rep2.length === 0, "el ritmo aguanta sin misiones",
  rep2.length ? rep2.join(", ") : visibles.length + " secciones");

console.log("\n=== Los menus siguen el orden de la pagina ===\n");
const orden = secciones.map(s => s.id);
function enOrden(enlaces) {
  let ult = -1;
  const mal = [];
  for (const a of enlaces) {
    const id = (a.getAttribute("href") || "").slice(1);
    const i = orden.indexOf(id);
    if (i === -1) continue;
    if (i < ult) mal.push(id);
    ult = i;
  }
  return mal;
}
const movil = enOrden([...doc.querySelectorAll(".mobile-nav ul a")]);
ok(movil.length === 0, "menu movil", movil.length ? "desordenado: " + movil.join(", ") : "en orden");
const escritorio = enOrden([...doc.querySelectorAll(".main-nav a")]);
ok(escritorio.length === 0, "menu de escritorio", escritorio.length ? "desordenado: " + escritorio.join(", ") : "en orden");
/* El pie tiene dos columnas: cada una se comprueba por separado */
[...doc.querySelectorAll(".footer-col")].forEach((col, i) => {
  const mal = enOrden([...col.querySelectorAll("a")]);
  ok(mal.length === 0, "columna " + (i + 1) + " del pie", mal.length ? "desordenada: " + mal.join(", ") : "en orden");
});

console.log("\n=== Sistema de transiciones ===\n");
const duraciones = (css.match(/transition:[^;]*/g) || [])
  .flatMap(t => t.match(/\d*\.?\d+m?s/g) || []);
const distintas = [...new Set(duraciones)].sort();
ok(distintas.length <= 4, "pocas duraciones distintas", distintas.join(" · "));

const curvas = [...new Set((css.match(/transition:[^;]*/g) || [])
  .flatMap(t => t.match(/cubic-bezier\([^)]*\)|ease-in-out|ease-out|ease-in|linear|\bease\b/g) || []))];
ok(!curvas.includes("ease") || curvas.length <= 3, "curvas coherentes", curvas.join(" · "));

ok(!/transition:\s*all/.test(css), "sin transition: all",
  "animar todo provoca tirones");

const sombras = (css.match(/transition:[^;]*box-shadow/g) || []).length;
ok(sombras <= 16, "transiciones de sombra bajo control", sombras + " reglas");

console.log("\n=== Movimiento y accesibilidad ===\n");
ok(/prefers-reduced-motion/.test(css), "respeta prefers-reduced-motion");
ok(/scroll-padding-top/.test(css), "scroll-padding-top para las anclas",
  (/scroll-padding-top:\s*([^;]+);/.exec(css) || [])[1]);

/* WCAG 2.2.2: nada que se mueva solo mas de cinco segundos sin poder pararlo.
   El carrusel de versiculos cambia solo: tiene que poder controlarse. */
ok(/#verseDots/.test(fs.readFileSync(path.join(ROOT, "js", "main.js"), "utf8")),
  "el carrusel tiene controles", "WCAG 2.2.2");

/* Ninguna animacion infinita salvo la burbuja, que es decorativa */
const infinitas = (css.match(/animation:[^;]*infinite/g) || []);
ok(infinitas.length <= 1, "animaciones infinitas contadas",
  infinitas.length + (infinitas.length ? ": " + infinitas.join(" | ").slice(0, 50) : ""));

console.log(fallos === 0 ? "\nEl ritmo esta bien.\n" : "\n*** " + fallos + " problema(s) ***\n");
process.exit(fallos === 0 ? 0 : 1);
