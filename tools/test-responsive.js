#!/usr/bin/env node
/* =========================================================
   test-responsive.js — comprueba que la pagina aguante en
   telefono, tableta y escritorio: nada que desborde, areas
   tactiles suficientes y puntos de ruptura cubiertos.
   Autor: Dr. Mauricio Rodriguez Herrera

     node tools/test-responsive.js
   ========================================================= */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(ROOT, "css", "styles.css"), "utf8");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

/* El telefono mas estrecho que sigue siendo comun */
const PANTALLA_MIN = 320;
const PADDING_MIN = 18;                      /* .container por debajo de 620px */
const UTIL = PANTALLA_MIN - PADDING_MIN * 2; /* 284px de contenido */

let fallos = 0;
function ok(cond, etiqueta, detalle) {
  if (!cond) fallos++;
  console.log("  " + (cond ? "ok   " : "FALLA") + " " + (etiqueta + " ".repeat(38)).slice(0, 38) + (detalle || ""));
}

console.log("\n=== Desbordamiento horizontal ===\n");
console.log("   Pantalla de " + PANTALLA_MIN + "px menos " + PADDING_MIN * 2 + "px de padding = " + UTIL + "px utiles\n");

/* Una rejilla con minmax(Npx, 1fr) reserva N aunque no quepa.
   min(Npx, 100%) lo topa al ancho disponible. */
const sinMin = [...css.matchAll(/minmax\((\d+)px/g)].map(m => +m[1]).filter(n => n > UTIL);
ok(sinMin.length === 0, "rejillas topadas con min()",
  sinMin.length ? sinMin.join(", ") + "px sin topar" : (css.match(/minmax\(min\(/g) || []).length + " rejillas");

/* Anchos fijos que no quepan */
const anchos = [...css.matchAll(/(?:^|[^-\w])width:\s*(\d{3,})px/g)].map(m => +m[1]).filter(n => n > UTIL);
ok(anchos.length === 0, "sin anchos fijos que desborden", anchos.length ? anchos.join(", ") + "px" : "");

/* El body no debe poder desplazarse en horizontal */
ok(/overflow-x:\s*hidden/.test(css), "el body no se desplaza en horizontal");

/* Contenido ancho que deba poder desplazarse dentro de su caja */
ok(/overflow-x:\s*auto/.test(css) || !/\<table/.test(html),
  "sin tablas anchas sin desplazamiento");

console.log("\n=== Areas tactiles ===\n");

function bloque(sel) {
  /* Las reglas se escriben con espacios variables antes de la llave */
  const escapado = sel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = new RegExp(escapado + "\\s*\\{([^}]*)\\}").exec(css);
  return m ? m[1] : "";
}
/* Alto aproximado: relleno arriba y abajo mas una linea de texto */
function alto(sel, textoAprox) {
  const b = bloque(sel);
  const h = /(?:^|[^-\w])height:\s*(\d+)px/.exec(b);
  if (h) return +h[1];
  const p = /padding:\s*(\d+)px/.exec(b);
  return p ? +p[1] * 2 + (textoAprox || 16) : null;
}

/* WCAG 2.5.8 (AA) pide 24x24 como minimo absoluto */
for (const [sel, texto] of [[".btn", 15], [".btn-sm", 14], [".icon-btn", 0],
                            [".lang-btn", 0], [".mis-tab", 14], [".verse-dots button", 0],
                            [".acc-item summary", 16]]) {
  const a = alto(sel, texto);
  ok(a !== null && a >= 24, sel + " ≥ 24px (WCAG 2.5.8)", a ? a + "px" : "no medido");
}

/* Y en pantalla tactil deberian llegar a 44px */
ok(/@media \(pointer: coarse\)/.test(css), "bloque para pantallas tactiles",
  "sube los objetivos a 44px solo donde se toca");
const coarse = css.slice(css.indexOf("@media (pointer: coarse)"));
ok(/\.icon-btn\s*\{[^}]*44px/.test(coarse), "los botones de icono llegan a 44px en tactil");
ok(/transform:\s*none/.test(coarse), "sin efectos de hover donde no hay raton");

console.log("\n=== Puntos de ruptura ===\n");
const mq = [...new Set([...css.matchAll(/@media \(([^)]*width[^)]*)\)/g)].map(m => m[1].trim()))];
ok(mq.length >= 4, "cobertura de anchos", mq.join(" · "));
ok(mq.some(q => /max-width:\s*6[0-9][0-9]px/.test(q)), "corte de telefono");
ok(mq.some(q => /min-width:\s*7[0-9][0-9]px/.test(q)), "corte de tableta");
ok(mq.some(q => /max-width:\s*10[0-9][0-9]px/.test(q)), "corte de escritorio");

console.log("\n=== Tipografia y zoom ===\n");
ok(/viewport/.test(html) && !/user-scalable\s*=\s*no/.test(html),
  "no se bloquea el zoom", "impedirlo es un fallo de accesibilidad");
ok(!/maximum-scale\s*=\s*1/.test(html), "sin maximum-scale=1");
const clamps = [...css.matchAll(/font-size:\s*clamp\(([^,]+),/g)].map(m => m[1].trim());
const chicos = clamps.filter(v => /^(\d*\.?\d+)rem$/.test(v) && parseFloat(v) < 0.7);
ok(chicos.length === 0, "ningun clamp baja de 0.7rem", chicos.join(", ") || clamps.length + " clamps");
ok(/font-size:\s*1[6-9]px|font-size:\s*17px/.test(css), "el cuerpo no baja de 16px en movil",
  (/body\s*\{[\s\S]*?font-size:\s*(\d+)px/.exec(css) || [])[1] + "px base");

console.log("\n=== Imagenes ===\n");
ok(/img[^{]*\{[^}]*max-width:\s*100%/.test(css) || /img, svg, iframe/.test(css),
  "las imagenes no desbordan");
/* Las miniaturas de los testimonios y los eventos las inyecta el JS,
   asi que el HTML estatico no las lleva: hay que mirar tambien ahi. */
const mainJs = fs.readFileSync(path.join(ROOT, "js", "main.js"), "utf8");
const imgs = [...html.matchAll(/<img[^>]*>/g)].map(m => m[0]);
const imgsJs = [...mainJs.matchAll(/<img class[^;]{0,200}/g)].map(m => m[0]);
const todas = imgs.concat(imgsJs);
ok(todas.length > 0 && todas.every(i => /loading=.{0,3}lazy/.test(i)),
  "imagenes con carga diferida",
  todas.length + " (" + imgs.length + " en el HTML, " + imgsJs.length + " desde JS)");

console.log(fallos === 0 ? "\nAguanta en telefono, tableta y escritorio.\n"
                         : "\n*** " + fallos + " problema(s) ***\n");
process.exit(fallos === 0 ? 0 : 1);
