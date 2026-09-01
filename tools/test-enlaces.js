#!/usr/bin/env node
/* =========================================================
   test-enlaces.js — pide de verdad todos los enlaces externos
   de la biblioteca y del libro, y dice cuales se han caido.
   Autor: Dr. Mauricio Rodriguez Herrera

     node tools/test-enlaces.js
     node tools/test-enlaces.js --solo es      un idioma
     node tools/test-enlaces.js --lento        de uno en uno

   PENDIENTES dice "si algun enlace se cae, quitalo de
   js/library.js y la obra desaparece sola de ese idioma".
   Bien, pero nadie se entera de que se ha caido: son 124
   ediciones en nueve idiomas apuntando a servidores ajenos.
   Esto lo comprueba en un minuto.

   No se conforma con el codigo HTTP, que es la trampa de
   siempre: hay servidores que devuelven 200 con una pagina
   de error dentro. De un PDF se piden los primeros bytes y
   se mira que empiece por %PDF; de una pagina, que no sea
   un 404 disfrazado.
   ========================================================= */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");
const http = require("node:http");

const ROOT = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const SOLO = (args.indexOf("--solo") > -1) ? args[args.indexOf("--solo") + 1] : null;
const A_LA_VEZ = args.includes("--lento") ? 1 : 6;
const ESPERA = 20000;

/* ---- Se cargan los datos, que son solo asignaciones a window ---- */
function datos(rel, clave) {
  const window = {};
  new Function("window", fs.readFileSync(path.join(ROOT, rel), "utf8"))(window);
  return window[clave];
}
const LIB = datos("js/library.js", "FAM_LIBRARY");
const LANGS = datos("js/i18n.js", "FAM_LANGS");

/* ---- Todo lo que hay que pedir ---- */
const cola = [];
for (const obra of LIB) {
  for (const [lang, ed] of Object.entries(obra.ed || {})) {
    if (SOLO && lang !== SOLO) continue;
    if (ed.pdf)  cola.push({ url: ed.pdf,  tipo: "pdf",    donde: "library.js", que: obra.slug + " · " + lang + " · pdf" });
    if (ed.leer) cola.push({ url: ed.leer, tipo: "pagina", donde: "library.js", que: obra.slug + " · " + lang + " · leer" });
  }
}
for (const l of LANGS) {
  if (SOLO && l.code !== SOLO) continue;
  if (l.book && l.book.pdf)  cola.push({ url: l.book.pdf,  tipo: "pdf",    donde: "i18n.js", que: "libro · " + l.code + " · pdf" });
  if (l.book && l.book.read) cola.push({ url: l.book.read, tipo: "pagina", donde: "i18n.js", que: "libro · " + l.code + " · leer" });
}

/* Las mismas direcciones repetidas no se piden dos veces. */
const unicas = new Map();
for (const p of cola) {
  if (!unicas.has(p.url)) unicas.set(p.url, { ...p, tambien: [] });
  else unicas.get(p.url).tambien.push(p.que);
}
const trabajos = [...unicas.values()];

/* ---- Una peticion, siguiendo redirecciones ---- */
function pedir(url, tipo, saltos) {
  return new Promise((res) => {
    if (saltos > 5) return res({ ok: false, por: "demasiadas redirecciones" });
    let u;
    try { u = new URL(url); } catch (e) { return res({ ok: false, por: "direccion invalida" }); }
    const mod = u.protocol === "http:" ? http : https;
    /* De un PDF basta el principio; de una pagina, un trozo. */
    const req = mod.request(u, {
      method: "GET",
      headers: {
        "Range": "bytes=0-2047",
        "User-Agent": "Mozilla/5.0 (compatible; adventflorida-test-enlaces/1.0)",
        "Accept": "*/*",
      },
      timeout: ESPERA,
    }, (r) => {
      const cod = r.statusCode;
      if (cod >= 300 && cod < 400 && r.headers.location) {
        r.resume();
        return res(pedir(new URL(r.headers.location, u).href, tipo, saltos + 1));
      }
      const trozos = [];
      r.on("data", (d) => { trozos.push(d); if (Buffer.concat(trozos).length > 4096) r.destroy(); });
      r.on("close", () => {
        const cuerpo = Buffer.concat(trozos);
        if (cod !== 200 && cod !== 206) return res({ ok: false, por: "HTTP " + cod });
        if (tipo === "pdf") {
          const cabecera = cuerpo.slice(0, 5).toString("latin1");
          if (cabecera.startsWith("%PDF")) return res({ ok: true, nota: "%PDF" });
          return res({ ok: false, por: "responde 200 pero NO es un PDF (" + JSON.stringify(cabecera) + ")" });
        }
        const texto = cuerpo.toString("utf8").toLowerCase();
        if (/not found|page not found|no existe|404 error/.test(texto)) {
          return res({ ok: false, por: "200 con pagina de error dentro" });
        }
        return res({ ok: true, nota: "HTTP " + cod });
      });
      r.on("error", (e) => res({ ok: false, por: e.message }));
    });
    req.on("timeout", () => { req.destroy(); res({ ok: false, por: "sin respuesta en " + (ESPERA / 1000) + " s" }); });
    req.on("error", (e) => res({ ok: false, por: e.code || e.message }));
    req.end();
  });
}

/* ---- A trabajar, de A_LA_VEZ en A_LA_VEZ ---- */
(async () => {
  console.log("\n  " + trabajos.length + " direcciones distintas (" + cola.length + " usos)" +
    (SOLO ? ", solo " + SOLO : "") + ". Paciencia.\n");
  const caidos = [];
  let hechos = 0;
  const turno = [...trabajos];
  async function obrero() {
    for (;;) {
      const t = turno.shift();
      if (!t) return;
      const r = await pedir(t.url, t.tipo, 0);
      hechos++;
      if (!r.ok) caidos.push({ ...t, por: r.por });
      if (hechos % 25 === 0 || hechos === trabajos.length) {
        process.stdout.write("  " + hechos + " de " + trabajos.length +
          "   caidos hasta ahora: " + caidos.length + "\n");
      }
    }
  }
  await Promise.all(Array.from({ length: A_LA_VEZ }, obrero));

  if (!caidos.length) {
    console.log("\n  Las " + trabajos.length + " responden y sirven lo que dicen servir.\n");
    process.exit(0);
  }

  console.log("\n=== " + caidos.length + " enlace(s) caidos ===\n");
  for (const c of caidos) {
    console.log("  " + c.que);
    console.log("      " + c.url);
    console.log("      " + c.por + "   (esta en " + c.donde + ")");
    if (c.tambien.length) console.log("      la usan tambien: " + c.tambien.join(", "));
  }
  console.log("\n  Quitalos del archivo que dice cada uno. La obra desaparece sola");
  console.log("  de ese idioma, y si desaparece de todos, desaparece la obra.");
  console.log("  Despues: node tools/gen-biblioteca-jsonld.js  y  node tools/test-seo.js\n");
  process.exit(1);
})();
