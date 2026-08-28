#!/usr/bin/env node
/* =========================================================
   test-i18n.js — cruza las claves que usa el HTML contra los
   diccionarios de js/lang/ y comprueba que ningun idioma se
   quede atras.
   Autor: Dr. Mauricio Rodriguez Herrera

     node tools/test-i18n.js
   ========================================================= */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const LANG_DIR = path.join(ROOT, "js", "lang");

global.window = global.window || {};
eval(fs.readFileSync(path.join(ROOT, "js", "i18n.js"), "utf8"));
for (const f of fs.readdirSync(LANG_DIR).filter(f => f.endsWith(".js"))) {
  eval(fs.readFileSync(path.join(LANG_DIR, f), "utf8"));
}

const LANGS = window.FAM_LANGS;
const I18N = window.FAM_I18N;
const VERSES = window.FAM_VERSES;

const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const keys = new Set();
for (const m of html.matchAll(/data-i18n(?:-html|-placeholder|-aria)?="([^"]+)"/g)) keys.add(m[1]);

/* Claves que no aparecen en el HTML porque las pone el JS al renderizar */
const DEFAULT = "en";
const SOLO_JS = ["book.legalHt", "sab.now", "sab.next", "near.lead", "near.lead0",
  "prayer.f.privacy", "prayer.f.privacyOnline", "prayer.f.ok",
  "contact.f.privacy", "contact.f.ok", "contact.f.needMsg", "contact.f.needReply",
  "form.sending", "form.err",
  "book.download", "book.library", "a11y.verseN",
  "st.prev", "st.next", "st.close",
  "lib.count", "lib.pdf", "lib.read", "lib.listen",
  "lib.short", "lib.medium", "lib.long", "lib.heavy",
  "mis.title", "mis.lead", "mis.title0", "mis.lead0", "mis.lead.stale", "mis.titlePast"];
const PREFIJOS_JS = ["ev.type.", "lib.g.", "st.play", "st.langNote", "mis.empty", "mis.less", "mis.join", "mis.moreInfo", "mis.langNote", "wa.",
  "near.sunsetLine", "near.church", "near.time", "near.mapLink", "near.person", "near.none"];
const OPCIONALES = ["meta.description", "book.legalAlt", "prayer.f.needMsg"];
/* Iguales en los nueve a proposito: un telefono y una linea legal con el
   nombre registrado y el EIN. Traducirlos seria un error. */
const IGUAL_A_PROPOSITO = ["contact.cta", "footer.rights", "contact.langs"];

let fallos = 0;

console.log("\nIdiomas   : " + LANGS.map(l => l.code).join(", "));
console.log("Claves HTML: " + keys.size + "\n");

for (const l of LANGS) {
  const d = I18N[l.code];
  if (!d) { console.log("  FALLA " + l.code + ": sin diccionario"); fallos++; continue; }
  const faltan = [...keys].filter(k => d[k] === undefined);
  /* Que la clave exista no basta: una traduccion vaciada dejaba pasar
     esta prueba con un "todo correcto" mientras la pagina enseñaba un
     hueco donde iba la respuesta. Comprobado metiendo faq.a1 = "". */
  const vacias = Object.keys(d).filter(k => typeof d[k] !== "string" || !d[k].trim());
  /* Y una que se quedo en ingles dentro de otro idioma tampoco vale.
     Se compara contra el ingles, saltando lo que es igual a proposito:
     nombres propios, siglas y las etiquetas de una sola palabra. */
  const en = I18N[DEFAULT] || {};
  const copiadas = l.code === DEFAULT ? [] : Object.keys(d).filter(k => {
    if (IGUAL_A_PROPOSITO.includes(k)) return false;
    const a = String(d[k] || ""), b = String(en[k] || "");
    if (!a || !b || a !== b) return false;
    if (a.split(/\s+/).length < 4) return false;      /* etiquetas cortas */
    return true;
  });
  const versos = (VERSES[l.code] || []).length;
  const ok = faltan.length === 0 && versos === 4 && vacias.length === 0 && copiadas.length === 0;
  if (!ok) fallos++;
  console.log(
    "  " + (ok ? "ok  " : "FALLA") + " " + l.code.padEnd(4) +
    String(Object.keys(d).length).padStart(4) + " claves · " + versos + " versiculos" +
    (faltan.length ? "  FALTAN: " + faltan.join(", ") : "") +
    (vacias.length ? "  VACIAS: " + vacias.slice(0, 4).join(", ") : "") +
    (copiadas.length ? "  SIN TRADUCIR: " + copiadas.slice(0, 4).join(", ") : "")
  );
}

/* Todos los idiomas deben tener exactamente el mismo juego de claves */
const base = Object.keys(I18N[LANGS[0].code]).sort().join("|");
for (const l of LANGS.slice(1)) {
  const otras = Object.keys(I18N[l.code]).sort();
  if (otras.join("|") !== base) {
    const falta = Object.keys(I18N[LANGS[0].code]).filter(k => I18N[l.code][k] === undefined);
    const sobra = otras.filter(k => I18N[LANGS[0].code][k] === undefined);
    console.log("  FALLA " + l.code + " no coincide con " + LANGS[0].code +
      (falta.length ? " · le falta: " + falta.join(", ") : "") +
      (sobra.length ? " · le sobra: " + sobra.join(", ") : ""));
    fallos++;
  }
}

/* Claves definidas que nadie usa: suelen ser restos de una version anterior */
const enKeys = Object.keys(I18N.en);
const huerfanas = enKeys.filter(k =>
  !keys.has(k) && !SOLO_JS.includes(k) && !OPCIONALES.includes(k) &&
  !PREFIJOS_JS.some(p => k.startsWith(p))
);
if (huerfanas.length) { console.log("\n  AVISO claves definidas y sin usar: " + huerfanas.join(", ")); fallos++; }

console.log(fallos === 0 ? "\nTodo correcto en los " + LANGS.length + " idiomas.\n"
                         : "\n*** " + fallos + " problema(s) ***\n");
process.exit(fallos === 0 ? 0 : 1);
