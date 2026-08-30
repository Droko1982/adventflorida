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

/* Que banda pinta una seccion: BASE, ALT, o hereda del body (BASE) */
function banda(sec) {
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

/* La alternancia se mide DENTRO de cada parte. Antes se medía de punta
   a punta porque la pagina era un solo desplazamiento; ahora dos partes
   distintas no llegan a verse juntas nunca, asi que exigir que la
   ultima seccion de una case con la primera de la siguiente seria pedir
   algo que nadie va a ver. */
console.log("\n=== Alternancia de bandas, parte por parte ===\n");
const secciones = [...doc.querySelectorAll("section")];
const partes = [...doc.querySelectorAll(".part")];
ok(partes.length >= 3 && partes.length <= 4, "la pagina va en 3 o 4 partes",
  partes.map((p) => p.id.replace("parte-", "")).join(", "));
ok(secciones.every((s) => s.closest(".part")), "ninguna seccion fuera de su parte",
  secciones.length + " secciones repartidas");

/* El reparto vive en dos sitios que pueden separarse sin que nadie se entere:
   la lista window.FAM_PARTES del <head>, que es quien elige la parte antes del
   primer pintado, y los <div class="part"> del cuerpo, que es donde estan de
   verdad las secciones. Si alguien mueve una seccion de div y se olvida de la
   lista, el enlace del menu abre la parte equivocada y la seccion no aparece:
   nada peta, simplemente no esta. Esto es lo que lo vigila. */
{
  const m = /window\.FAM_PARTES\s*=\s*\[([\s\S]*?)\];/.exec(html);
  const declarado = new Map();
  if (m) {
    const re = /id:\s*"([^"]+)"[\s\S]*?secs:\s*\[([^\]]*)\]/g;
    let d;
    while ((d = re.exec(m[1]))) {
      declarado.set(d[1], (d[2].match(/"([^"]+)"/g) || []).map((x) => x.slice(1, -1)));
    }
  }
  ok(declarado.size > 0, "el <head> declara el reparto", declarado.size + " partes en FAM_PARTES");

  /* Toda ancla declarada tiene que existir en el HTML */
  const anclas = [...declarado.values()].flat();
  const fantasmas = anclas.filter((id) => !doc.getElementById(id));
  ok(fantasmas.length === 0, "el reparto no nombra anclas que no existen",
    fantasmas.length ? "no existen: " + fantasmas.join(", ") : anclas.length + " anclas resuelven");

  /* Y cada seccion tiene que estar declarada en la parte donde de verdad vive */
  const desviadas = [];
  for (const [parte, secs] of declarado) {
    for (const id of secs) {
      const el = doc.getElementById(id);
      if (!el) continue;
      const caja = el.closest(".part");
      if (!caja || caja.id !== "parte-" + parte) {
        desviadas.push(id + " (declarada en " + parte + ", vive en " + (caja ? caja.id : "ninguna parte") + ")");
      }
    }
  }
  /* Y al reves: ninguna seccion puede quedarse fuera de la lista */
  const olvidadas = secciones.filter((s) => s.id && !anclas.includes(s.id)).map((s) => s.id);
  ok(desviadas.length === 0, "cada ancla declarada vive donde dice",
    desviadas.length ? desviadas.join(" · ") : "las " + declarado.size + " partes cuadran");
  ok(olvidadas.length === 0, "ninguna seccion se queda fuera del reparto",
    olvidadas.length ? "sin declarar: " + olvidadas.join(", ") : "las " + secciones.length + " estan");

  /* Cada enlace del menu de cabecera es la puerta de una parte, y una
     puerta se abre por el principio: tiene que apuntar a la PRIMERA
     seccion de su parte. Si apuntara a una de en medio, quien pulsase
     "Recursos gratis" entraria con el libro ya pasado y sin nada arriba
     que le dijera que se ha saltado algo. */
  const puertas = [...doc.querySelectorAll(".main-nav a[data-parte]")];
  const torcidas = puertas.filter((a) => {
    const secs = declarado.get(a.getAttribute("data-parte"));
    return !secs || a.getAttribute("href") !== "#" + secs[0];
  }).map((a) => a.getAttribute("data-parte") + " -> " + a.getAttribute("href"));
  ok(puertas.length === declarado.size, "una puerta por parte en el menu",
    puertas.length + " enlaces para " + declarado.size + " partes");
  ok(torcidas.length === 0, "cada puerta abre por el principio de su parte",
    torcidas.length ? torcidas.join(" · ") : "las " + puertas.length + " apuntan a su primera seccion");
}

const repetidas = [], conDegradado = [];
for (const parte of partes) {
  console.log("   " + parte.id);
  let previa = null;
  for (const s of parte.querySelectorAll("section")) {
    const b = banda(s);
    const id = s.id || "(sin id)";
    const igual = previa !== null && b === previa;
    if (igual) repetidas.push(id);
    if (tieneDegradado(s)) conDegradado.push(id);
    console.log("     " + id.padEnd(14) + b + (igual ? "   <-- igual que la anterior" : ""));
    previa = b;
  }
}

console.log();
ok(repetidas.length === 0, "sin dos bandas iguales seguidas",
  repetidas.length ? repetidas.join(", ") : secciones.length + " secciones");
ok(conDegradado.length <= 4, "el degradado de acento es escaso",
  conDegradado.length + ": " + conDegradado.join(", "));

/* El estado en el que la pagina esta HOY: js/events.js vacio, asi que
   #misiones no se muestra. Ahora cierra su parte, de modo que quitarla
   no puede descolocar a nadie; esta pasada lo comprueba en vez de
   darlo por supuesto. */
console.log("\n=== Alternancia con #misiones oculta ===\n");
const rep2 = [];
for (const parte of partes) {
  let prev2 = null;
  for (const s of parte.querySelectorAll("section")) {
    if (s.id === "misiones") continue;
    const b = banda(s);
    if (prev2 !== null && b === prev2) rep2.push(s.id || "(sin id)");
    prev2 = b;
  }
}
ok(rep2.length === 0, "el ritmo aguanta sin misiones",
  rep2.length ? rep2.join(", ") : "las " + partes.length + " partes alternan igual");

/* =========================================================
   Cada seccion tiene que distinguirse de la de al lado
   ========================================================= */
console.log("\n=== Distintivo y titulo de cada seccion ===\n");

const conTitulo = secciones.filter((s) => s.id !== "inicio");
const sinInsignia = conTitulo.filter((s) => !s.querySelector(".sec-badge")).map((s) => s.id);
ok(sinInsignia.length === 0, "todas llevan su insignia",
  sinInsignia.length ? "falta en " + sinInsignia.join(", ") : conTitulo.length + " secciones");

/* Dos secciones con el mismo icono no se distinguen: seria peor que nada */
const dibujos = new Map();
const repes = [];
for (const s of conTitulo) {
  const b = s.querySelector(".sec-badge svg");
  if (!b) continue;
  const d = b.innerHTML.replace(/\s+/g, "");
  if (dibujos.has(d)) repes.push(s.id + " = " + dibujos.get(d));
  else dibujos.set(d, s.id);
}
ok(repes.length === 0, "ningun icono repetido",
  repes.length ? repes.join(", ") : dibujos.size + " iconos distintos");

/* El icono es decorativo: el titulo ya dice de que va la seccion */
const sinOcultar = conTitulo
  .map((s) => s.querySelector(".sec-badge"))
  .filter(Boolean)
  .filter((b) => b.getAttribute("aria-hidden") !== "true").length;
ok(sinOcultar === 0, "los iconos no hablan al lector", "son decorativos, el titulo ya lo dice");

/* Un solo tamano de titulo. Antes "cerca" y "donar" salian a 37 px por
   estar dentro de una tarjeta, y se leian como secciones de segunda. */
const sinClase = conTitulo
  .filter((s) => { const h = s.querySelector("h2"); return h && !h.classList.contains("section-title"); })
  .map((s) => s.id);
ok(sinClase.length === 0, "todos los h2 son section-title",
  sinClase.length ? sinClase.join(", ") : conTitulo.length + " titulos");

/* Y que nadie vuelva a pisar ese tamano desde otra regla */
const pisan = [...css.matchAll(/([^{}]*\bh2\b[^{}]*)\{([^{}]*font-size[^{}]*)\}/g)]
  .map((m) => m[1].trim())
  .filter((sel) => sel !== "h2.section-title" && !/^h1, h2/.test(sel));
ok(pisan.length === 0, "sin reglas que cambien ese tamano",
  pisan.length ? pisan.join(" | ") : "solo manda h2.section-title");

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
