#!/usr/bin/env node
/* =========================================================
   test-loader.js — comprueba que el navegador descarga UN
   solo archivo de idioma, el que la persona va a leer.
   Ejecuta los scripts de verdad, incluido el document.write
   del head, y mira que idiomas acaban en memoria.
   Autor: Dr. Mauricio Rodriguez Herrera

     npm install --no-save jsdom
     node tools/test-loader.js
   ========================================================= */
"use strict";

const path = require("node:path");
const fs = require("node:fs");

let JSDOM, VirtualConsole;
try {
  ({ JSDOM, VirtualConsole } = require("jsdom"));
} catch (e) {
  console.error("Falta jsdom. Instalalo con:  npm install --no-save jsdom");
  process.exit(2);
}

const ROOT = path.resolve(__dirname, "..");
const INDEX = path.join(ROOT, "index.html");
const fileUrl = "file:///" + INDEX.split(path.sep).join("/");

let fallos = 0;

async function probar(lang, esperado, etiqueta) {
  const vc = new VirtualConsole();
  const errs = [];
  vc.on("jsdomError", (e) => errs.push(e.message));

  const dom = await JSDOM.fromFile(INDEX, {
    runScripts: "dangerously",
    resources: "usable",
    url: fileUrl + (lang ? "?lang=" + lang : ""),
    pretendToBeVisual: true,
    virtualConsole: vc,
  });

  const w = dom.window;
  w.matchMedia = w.matchMedia || (() => ({
    matches: false, addListener() {}, removeListener() {},
    addEventListener() {}, removeEventListener() {},
  }));

  await new Promise((r) => {
    if (w.document.readyState === "complete") return r();
    w.addEventListener("load", r);
  });
  await new Promise((r) => setTimeout(r, 700));

  const cargados = Object.keys(w.FAM_I18N || {});
  const titulo = w.document.querySelector('[data-i18n="sab.title"]');
  const texto = titulo ? titulo.textContent.trim() : "";
  const htmlLang = w.document.documentElement.getAttribute("lang");

  /* El canonical tiene que apuntar a esta variante, no a la raiz:
     si no, Google descarta ocho de los nueve idiomas. */
  const BASE = "https://droko1982.github.io/adventflorida/";
  const canonEsperado = BASE + (esperado === "en" ? "" : "?lang=" + esperado);
  const canonReal = w.document.querySelector('link[rel="canonical"]').getAttribute("href");
  const ogReal = w.document.querySelector('meta[property="og:url"]').getAttribute("content");

  const unoSolo = cargados.length === 1 && cargados[0] === esperado;
  const traducido = htmlLang === esperado && texto.length > 3 && texto !== "sab.title";
  const canonOk = canonReal === canonEsperado && ogReal === canonEsperado;
  const ok = unoSolo && traducido && canonOk && errs.length === 0;
  if (!ok) fallos++;
  if (!canonOk) console.log("       canonical: " + canonReal + "  (esperado " + canonEsperado + ")");

  console.log(
    "  " + (ok ? "ok  " : "FALLA") + " " + (etiqueta + "                    ").slice(0, 20) +
    "descarga: " + (cargados.join(",") || "nada").padEnd(6) +
    " · html lang=" + String(htmlLang).padEnd(3) +
    ' · "' + texto.slice(0, 30) + '"'
  );
  if (errs.length) console.log("       errores: " + errs.slice(0, 2).join(" | "));
  w.close();
}

(async () => {
  console.log("\n=== El navegador descarga solo el idioma que se lee ===\n");
  await probar(null, "en", "sin parametro");
  for (const c of ["es", "fr", "ht", "pt", "de", "nl", "ru", "uk"]) {
    await probar(c, c, "?lang=" + c);
  }

  /* Cambiar de idioma en caliente debe traer el segundo archivo */
  console.log("\n=== Cambio de idioma sin recargar la pagina ===\n");
  {
    const vc = new VirtualConsole();
    const errs = [];
    vc.on("jsdomError", (e) => errs.push(e.message));
    const dom = await JSDOM.fromFile(INDEX, {
      runScripts: "dangerously", resources: "usable",
      url: fileUrl + "?lang=en", pretendToBeVisual: true, virtualConsole: vc,
    });
    const w = dom.window;
    w.matchMedia = w.matchMedia || (() => ({
      matches: false, addListener() {}, removeListener() {},
      addEventListener() {}, removeEventListener() {},
    }));
    await new Promise((r) => {
      if (w.document.readyState === "complete") return r();
      w.addEventListener("load", r);
    });
    await new Promise((r) => setTimeout(r, 700));

    const antes = Object.keys(w.FAM_I18N || {});
    [...w.document.querySelectorAll("#langMenu button")]
      .find((b) => b.getAttribute("data-lang") === "ht")
      .dispatchEvent(new w.Event("click"));
    await new Promise((r) => setTimeout(r, 900));

    const despues = Object.keys(w.FAM_I18N || {});
    const titulo = w.document.querySelector('[data-i18n="sab.title"]').textContent.trim();
    const ok = antes.join() === "en" && despues.sort().join() === "en,ht" &&
               w.document.documentElement.getAttribute("lang") === "ht" &&
               titulo.indexOf("Bondye") > -1 && errs.length === 0;
    if (!ok) fallos++;
    console.log("  " + (ok ? "ok  " : "FALLA") + " en -> ht          " +
                "antes: " + antes.join(",") + " · despues: " + despues.join(",") +
                ' · "' + titulo.slice(0, 30) + '"');
    if (errs.length) console.log("       errores: " + errs.slice(0, 2).join(" | "));
    w.close();
  }

  /* Ninguna pagina deberia cargar los nueve */
  const pesos = fs.readdirSync(path.join(ROOT, "js", "lang"))
    .map((f) => fs.statSync(path.join(ROOT, "js", "lang", f)).size);
  const mayor = Math.max(...pesos);
  const suma = pesos.reduce((a, b) => a + b, 0);
  console.log("\n  El idioma mas pesado son " + Math.round(mayor / 1024) + " KB." +
              " Cargarlos todos serian " + Math.round(suma / 1024) + " KB.");

  console.log(fallos === 0 ? "\nTodo correcto.\n" : "\n*** " + fallos + " fallo(s) ***\n");
  process.exit(fallos === 0 ? 0 : 1);
})();
