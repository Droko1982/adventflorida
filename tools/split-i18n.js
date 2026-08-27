#!/usr/bin/env node
/* =========================================================
   split-i18n.js — parte los tres js/i18n*.js en un archivo
   por idioma dentro de js/lang/, para que cada visitante
   descargue solo el idioma que lee.
   Autor: Dr. Mauricio Rodriguez Herrera

   Se ejecuta UNA VEZ. Despues, los idiomas se editan en
   js/lang/<codigo>.js con tools/patch-i18n.js, igual que antes.

     node tools/split-i18n.js
   ========================================================= */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const VIEJOS = ["js/i18n.js", "js/i18n2.js", "js/i18n3.js"].map(f => path.join(ROOT, f));
const DESTINO = path.join(ROOT, "js", "lang");

/* Se cargan los archivos actuales para tener los datos ya resueltos */
global.window = global.window || {};
for (const f of VIEJOS) {
  if (!fs.existsSync(f)) { console.error("Falta " + f); process.exit(1); }
  eval(fs.readFileSync(f, "utf8"));
}

const LANGS = window.FAM_LANGS;
const I18N = window.FAM_I18N;
const VERSES = window.FAM_VERSES;

if (!LANGS || !I18N) { console.error("No encontre FAM_LANGS o FAM_I18N"); process.exit(1); }

fs.mkdirSync(DESTINO, { recursive: true });

/* Serializa un valor como literal JS con comillas dobles */
function lit(v) {
  return JSON.stringify(v);
}

let total = 0;
for (const l of LANGS) {
  const code = l.code;
  const dict = I18N[code];
  if (!dict) { console.error("Sin diccionario: " + code); process.exit(1); }

  let out = "/* =========================================================\n" +
            "   Florida Advent Missionaries · " + l.native + " (" + code + ")\n" +
            "\n" +
            "   Este archivo lo carga solo quien lee en este idioma.\n" +
            "   No lo edites a mano: usa un parche y\n" +
            "     node tools/patch-i18n.js tools/patches/<parche>.json\n" +
            "   ========================================================= */\n" +
            "(function () {\n" +
            '  "use strict";\n' +
            "  window.FAM_I18N = window.FAM_I18N || {};\n" +
            "  window.FAM_VERSES = window.FAM_VERSES || {};\n\n";

  const versos = VERSES[code] || [];
  out += "  window.FAM_VERSES." + code + " = [\n" +
         versos.map(v => "    { t: " + lit(v.t) + ", r: " + lit(v.r) + " }").join(",\n") +
         "\n  ];\n\n";

  out += "  window.FAM_I18N." + code + " = {\n" +
         Object.keys(dict).map(k => "    " + lit(k) + ": " + lit(dict[k])).join(",\n") +
         "\n  };\n\n})();\n";

  const destino = path.join(DESTINO, code + ".js");
  fs.writeFileSync(destino, out, "utf8");
  const kb = Math.round(fs.statSync(destino).size / 1024);
  total += kb;
  console.log("  js/lang/" + (code + ".js         ").slice(0, 10) + String(kb).padStart(4) + " KB  ·  " +
              Object.keys(dict).length + " claves, " + versos.length + " versiculos");
}

/* js/i18n.js se queda solo con la lista de idiomas: lo carga todo el mundo */
const meta =
`/* =========================================================
   Florida Advent Missionaries · Idiomas disponibles

   Este archivo es pequeno a proposito: lo descarga todo el
   mundo. Los textos de cada idioma viven en js/lang/<codigo>.js
   y solo se descarga el que la persona esta leyendo.

   book.pdf  enlace directo al PDF de El Camino a Cristo,
             verificado. Si un idioma no lo tiene, se apunta
             a la biblioteca en ese idioma y se anade el
             codigo a FAM_NO_DIRECT_PDF para que la pagina
             lo advierta.
   ========================================================= */
(function () {
  "use strict";

  window.FAM_LANGS = [
${LANGS.map(l =>
`    { code: ${lit(l.code)}, native: ${lit(l.native)}, label: ${lit(l.label)}, flag: ${lit(l.flag)}, locale: ${lit(l.locale)},
      book: { title: ${lit(l.book.title)}, pdf: ${lit(l.book.pdf)}, read: ${lit(l.book.read)} } }`
).join(",\n")}
  ];

  /* Idiomas sin PDF directo del libro: la pagina lo dice con franqueza */
  window.FAM_NO_DIRECT_PDF = ${lit(window.FAM_NO_DIRECT_PDF || [])};

})();
`;

fs.writeFileSync(path.join(ROOT, "js", "i18n.js"), meta, "utf8");
const metaKb = Math.round(fs.statSync(path.join(ROOT, "js", "i18n.js")).size / 1024);

for (const f of ["js/i18n2.js", "js/i18n3.js"]) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p)) { fs.unlinkSync(p); console.log("  borrado " + f); }
}

console.log("\n  js/i18n.js (solo la lista): " + metaKb + " KB");
console.log("  Antes: 401 KB en cada visita. Ahora: " + (metaKb + Math.round(total / LANGS.length)) + " KB aproximados.\n");
