#!/usr/bin/env node
/* =========================================================
   test-contrast.js — comprueba el contraste de la paleta
   contra WCAG 2.1 AA en los dos temas.
   Autor: Dr. Mauricio Rodriguez Herrera

   Umbrales: 4.5:1 texto normal · 3:1 texto grande (>=24px
   o >=18.66px en negrita) y elementos de interfaz.
   ========================================================= */
"use strict";

const fs = require("fs");
const path = require("path");

const css = fs.readFileSync(path.join(__dirname, "..", "css", "styles.css"), "utf8");

/* Lee los tokens de un bloque :root o [data-theme="dark"] */
function leerTokens(selector) {
  const rx = new RegExp(selector + "\\s*\\{([\\s\\S]*?)\\}");
  const m = rx.exec(css);
  if (!m) return null;
  const t = {};
  for (const linea of m[1].split("\n")) {
    const d = /--([a-z0-9-]+)\s*:\s*([^;]+);/i.exec(linea);
    if (d) t[d[1].trim()] = d[2].trim();
  }
  return t;
}

function hexARgb(h) {
  h = h.trim().replace("#", "");
  if (h.length === 3) h = h.split("").map(c => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/* rgba(r,g,b,a) compuesto sobre un fondo opaco */
function rgbaSobre(valor, fondo) {
  const m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?\s*\)/i.exec(valor);
  if (!m) return null;
  const a = m[4] === undefined ? 1 : parseFloat(m[4]);
  const c = [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
  return c.map((v, i) => Math.round(v * a + fondo[i] * (1 - a)));
}

function color(valor, fondo) {
  if (!valor) return null;
  if (valor.startsWith("#")) return hexARgb(valor);
  if (valor.startsWith("rgb")) return rgbaSobre(valor, fondo || [255, 255, 255]);
  return null;
}

function luminancia(rgb) {
  const c = rgb.map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function ratio(a, b) {
  const l1 = luminancia(a), l2 = luminancia(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/* Pares que aparecen de verdad en la pagina */
const PARES = [
  ["text", "bg", 4.5, "texto sobre el fondo"],
  ["text", "bg-alt", 4.5, "texto sobre el fondo alterno"],
  ["text", "surface", 4.5, "texto sobre tarjeta"],
  ["text", "surface-2", 4.5, "texto sobre el pie"],
  ["text-soft", "bg", 4.5, "texto atenuado sobre el fondo"],
  ["text-soft", "bg-alt", 4.5, "texto atenuado sobre el fondo alterno"],
  ["text-soft", "surface", 4.5, "texto atenuado sobre tarjeta"],
  ["accent", "bg", 4.5, "acento sobre el fondo (eyebrow, refs)"],
  ["accent", "bg-alt", 4.5, "acento sobre el fondo alterno"],
  ["accent", "surface", 4.5, "acento sobre tarjeta"],
  ["accent", "accent-soft", 3, "acento sobre su propio fondo suave"],
  ["accent-ink", "accent", 4.5, "texto del boton principal"],
  ["deep-ink", "deep", 4.5, "texto del boton oscuro"],
  ["deep", "deep-soft", 3, "icono sobre fondo suave"],
  ["deep", "bg", 4.5, "azul sobre el fondo"],

  /* Elementos de interfaz. WCAG 1.4.11 pide 3:1 al borde que
     identifica un control y al indicador de foco. La primera
     version de esta auditoria solo medía texto, y por eso se
     le escaparon los dos fallos de abajo durante semanas. */
  ["ring", "bg", 3, "anillo de foco sobre el fondo"],
  ["ring", "surface", 3, "anillo de foco sobre tarjeta"],
  ["ring", "bg-alt", 3, "anillo de foco sobre el fondo alterno"],
  ["line-btn", "bg", 3, "borde del boton fantasma"],
  ["line-btn", "surface", 3, "borde del boton fantasma en tarjeta"],
  ["line-btn", "bg-alt", 3, "borde del boton fantasma en fondo alterno"],

  /* El verde de WhatsApp lleva texto blanco en catorce botones. El de la
     marca (#1FA855) daba 3.09:1: por debajo de AA para texto. */
  ["wa-ink", "wa", 4.5, "texto del boton de WhatsApp"],
  ["wa-ink", "wa-hover", 4.5, "texto del boton de WhatsApp al pasar por encima"],
];

const TEMAS = [
  { nombre: "CLARO", tokens: leerTokens(":root,\\s*\\n?\\[data-theme=\"light\"\\]") || leerTokens("\\[data-theme=\"light\"\\]") },
  { nombre: "OSCURO", tokens: leerTokens("\\[data-theme=\"dark\"\\]") },
];

let fallos = 0;

for (const tema of TEMAS) {
  if (!tema.tokens) { console.log("No pude leer el tema " + tema.nombre); fallos++; continue; }
  console.log("\n=== TEMA " + tema.nombre + " ===\n");
  const fondoBase = hexARgb(tema.tokens["bg"]) || [255, 255, 255];

  for (const [fg, bg, min, desc] of PARES) {
    const cb = color(tema.tokens[bg], fondoBase);
    const cf = color(tema.tokens[fg], cb || fondoBase);
    if (!cf || !cb) { console.log("   ?    " + desc + " (token sin resolver)"); continue; }
    const r = ratio(cf, cb);
    const ok = r >= min;
    if (!ok) fallos++;
    console.log(
      "  " + (ok ? "ok  " : "FALLA") + " " +
      r.toFixed(2).padStart(5) + ":1  (min " + min + ")  " +
      (desc + "                                        ").slice(0, 42) +
      tema.tokens[fg] + " sobre " + tema.tokens[bg]
    );
  }
}

console.log(fallos === 0
  ? "\nToda la paleta cumple WCAG AA.\n"
  : "\n*** " + fallos + " par(es) por debajo del minimo ***\n");
process.exit(fallos === 0 ? 0 : 1);
