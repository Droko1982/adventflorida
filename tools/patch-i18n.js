#!/usr/bin/env node
/* =========================================================
   patch-i18n.js — edita los diccionarios de los 9 idiomas
   sin romper el formato de js/lang/*.js
   Autor: Dr. Mauricio Rodriguez Herrera

   Uso:
     node tools/patch-i18n.js tools/patches/mi-parche.json

   Formato del parche:
     { "en": { "clave": "valor", ... }, "es": { ... }, ... }

   - Si la clave ya existe en ese idioma, se reemplaza su valor.
   - Si no existe, se anade al final de ese diccionario.
   - Si el valor es null, la clave se BORRA. Sirve para limpiar
     los restos de una seccion que ya no existe.
   - Falla si un idioma del parche no existe en los archivos.
   ========================================================= */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT  = path.resolve(__dirname, "..");
const LANG_DIR = path.join(ROOT, "js", "lang");
const FILES = fs.readdirSync(LANG_DIR).filter(f => f.endsWith(".js")).map(f => path.join(LANG_DIR, f));

const patchPath = process.argv[2];
if (!patchPath) {
  console.error("Uso: node tools/patch-i18n.js <archivo-de-parche.json>");
  process.exit(1);
}
const patch = JSON.parse(fs.readFileSync(patchPath, "utf8"));

/* Escapa una clave para usarla dentro de una expresion regular */
function rxKey(k) {
  return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* Escapa un valor para insertarlo como literal JS entre comillas dobles */
function jsString(v) {
  return '"' + String(v)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n") + '"';
}

/* Localiza el bloque `window.FAM_I18N.<code> = { ... };` dentro del texto */
function findDict(src, code) {
  const head = new RegExp("window\\.FAM_I18N\\." + code + "\\s*=\\s*\\{");
  const m = head.exec(src);
  if (!m) return null;

  const open = m.index + m[0].length - 1;   // posicion de la '{'
  let depth = 0, inStr = false, quote = "", esc = false;

  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (ch === "\\") { esc = true; continue; }
      if (ch === quote) inStr = false;
      continue;
    }
    if (ch === '"' || ch === "'") { inStr = true; quote = ch; continue; }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return { start: open, end: i };   // end = posicion de la '}'
    }
  }
  return null;
}

const seen = new Set();
let totalUpdated = 0, totalAdded = 0, totalRemoved = 0;

for (const file of FILES) {
  let src = fs.readFileSync(file, "utf8");
  let touched = false;

  for (const code of Object.keys(patch)) {
    const dict = findDict(src, code);
    if (!dict) continue;
    seen.add(code);

    let body = src.slice(dict.start, dict.end + 1);
    let updated = 0, added = 0;
    const pending = [];

    let removed = 0;

    for (const [key, value] of Object.entries(patch[code])) {
      const rx = new RegExp('"' + rxKey(key) + '"\\s*:\\s*"(?:[^"\\\\]|\\\\.)*"');

      /* Un valor null borra la clave: asi se limpian los restos
         de una seccion que ya no existe. */
      if (value === null) {
        const rxLinea = new RegExp(
          '\\n?\\s*"' + rxKey(key) + '"\\s*:\\s*"(?:[^"\\\\]|\\\\.)*",?'
        );
        if (rxLinea.test(body)) { body = body.replace(rxLinea, ""); removed++; }
        continue;
      }

      if (rx.test(body)) {
        body = body.replace(rx, '"' + key + '": ' + jsString(value));
        updated++;
      } else {
        pending.push('    "' + key + '": ' + jsString(value));
        added++;
      }
    }

    /* Borrar puede dejar una coma colgando antes de la llave */
    if (removed) body = body.replace(/,(\s*)\}$/, "$1}");

    if (pending.length) {
      /* Inserta antes de la llave de cierre, respetando la coma final */
      const close = body.lastIndexOf("}");
      let before = body.slice(0, close).replace(/\s*$/, "");
      if (!before.endsWith(",")) before += ",";
      body = before + "\n" + pending.join(",\n") + "\n  }";
    }

    if (updated || added || removed) {
      src = src.slice(0, dict.start) + body + src.slice(dict.end + 1);
      touched = true;
      totalUpdated += updated;
      totalAdded += added;
      totalRemoved += removed;
      console.log(`  ${path.basename(file)} · ${code}: ${updated} actualizadas, ${added} nuevas` +
        (removed ? `, ${removed} borradas` : ""));
    }
  }

  if (touched) fs.writeFileSync(file, src, "utf8");
}

const missing = Object.keys(patch).filter(c => !seen.has(c));
if (missing.length) {
  console.error("\nERROR: idiomas no encontrados en los archivos: " + missing.join(", "));
  process.exit(1);
}

console.log(`\nTotal: ${totalUpdated} actualizadas, ${totalAdded} anadidas` +
  (totalRemoved ? `, ${totalRemoved} borradas` : "") + ` en ${seen.size} idiomas.`);
