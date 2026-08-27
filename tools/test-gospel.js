#!/usr/bin/env node
/* =========================================================
   test-gospel.js — la seccion "fe en Cristo" es el corazon
   de la pagina y la mas facil de romper sin darse cuenta:
   una palabra movida cambia la doctrina. Esto la fija.
   Autor: Dr. Mauricio Rodriguez Herrera

   Necesita jsdom, que NO es dependencia del sitio:
     npm install --no-save jsdom
   ========================================================= */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

let JSDOM;
try {
  ({ JSDOM } = require("jsdom"));
} catch (e) {
  console.error("Falta jsdom. Instalalo con:  npm install --no-save jsdom");
  process.exit(2);
}

const ROOT = path.resolve(__dirname, "..");
const errores = [];

const dom = new JSDOM(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), {
  runScripts: "outside-only",
  url: "https://droko1982.github.io/adventflorida/",
  pretendToBeVisual: true,
});
const { window } = dom;
window.matchMedia = window.matchMedia || (() => ({
  matches: false, addListener() {}, removeListener() {},
  addEventListener() {}, removeEventListener() {},
}));
window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
window.onerror = (m) => errores.push(String(m));

const LANGF = fs.readdirSync(path.join(ROOT, "js", "lang")).map((f) => "js/lang/" + f);
for (const f of [...LANGF, "js/i18n.js", "js/sabbath.js", "js/videos.js",
                 "js/near.js", "js/events.js", "js/main.js"]) {
  try { window.eval(fs.readFileSync(path.join(ROOT, f), "utf8")); }
  catch (e) { errores.push(f + ": " + e.message); }
}
window.document.dispatchEvent(new window.Event("DOMContentLoaded"));

const doc = window.document;
const idioma = (code) =>
  [...doc.querySelectorAll("#langMenu button")]
    .find((b) => b.getAttribute("data-lang") === code)
    .dispatchEvent(new window.Event("click"));

let fallos = 0;
function ok(cond, etiqueta, detalle) {
  if (!cond) fallos++;
  console.log("  " + (cond ? "ok   " : "FALLA") + " " + (etiqueta + " ".repeat(36)).slice(0, 36) + (detalle || ""));
}

const seccion = doc.querySelector("#cristo");
const tarjetas = () => [...seccion.querySelectorAll(".gospel-card, .cristo-card, article, li")]
  .map((e) => e.textContent.replace(/\s+/g, " ").trim()).filter(Boolean);
const texto = () => seccion.textContent.replace(/\s+/g, " ").trim();

console.log("\n=== La seccion existe y esta entera ===\n");
ok(errores.length === 0, "carga sin errores", errores.join(" · "));
ok(!!seccion, "#cristo existe");
ok(!seccion.hidden, "y se muestra");
ok(texto().length > 800, "tiene contenido de verdad", texto().length + " caracteres");
ok(!!seccion.querySelector("h2"), "con su encabezado");

console.log("\n=== Los cinco pasos, en orden ===\n");
const PASOS = [
  [/God already loves you/i,               "1. Dios ya te ama"],
  [/Something is broken/i,                 "2. Algo esta roto"],
  [/did not send a stand-?in/i,            "3. No envio a un sustituto"],
  [/coming back for you/i,                 "4. Vuelve por ti"],
  [/[Yy]our part is small/i,               "5. Tu parte es pequena"],
];
const t = texto();
let anterior = -1;
for (const [re, nombre] of PASOS) {
  const pos = t.search(re);
  ok(pos > anterior, nombre, pos > -1 ? "en su sitio" : "NO APARECE");
  if (pos > -1) anterior = pos;
}

console.log("\n=== Doctrina: los errores faciles de colar ===\n");

/* Modalismo / patripasianismo: decir que "Dios no mando a otro, vino El"
   se lee en espanol como que vino el PADRE. La correccion fue explicita
   y no puede volver atras sin que salte esto. */
idioma("es");
const es = texto();
ok(/no envi[oó] a un sustituto/i.test(es), "es: 'no envio a un sustituto'",
  (es.match(/Dios no envi[oó][^.]{0,40}/i) || ["(no encontrado)"])[0]);
ok(!/Dios no mand[oó] a otro/i.test(es), "es: sin 'no mando a otro'", "leeria como que vino el Padre");
ok(/Vino [ÉE]l mismo/i.test(es), "es: 'Vino El mismo'");

/* La salvacion no se gana: si alguna vez aparece un texto que la
   condicione a obras, es un problema doctrinal serio en un sitio adventista. */
ok(/Efesios 2:8-9/.test(es), "es: cita Efesios 2:8-9", "la gracia, no las obras");

/* Acentos: el espanol de esta seccion se escribio dos veces mal */
const SIN_TILDE = [/\bpequena\b/, /\bmanana\b/, /\bcorazon\b/, /\bperdon\b/, /\bdecision\b/];
const malos = SIN_TILDE.filter((re) => re.test(es)).map((re) => String(re));
ok(malos.length === 0, "es: sin palabras sin tilde", malos.join(", ") || "acentuacion correcta");

/* Nada que asuma el genero de quien lee */
const GENERO = [/\bestoy convencido\b/i, /\bestoy listo\b/i, /\bcansado de\b/i, /\bsolo\b(?= y)/i];
const generados = GENERO.filter((re) => re.test(es)).map((re) => String(re));
ok(generados.length === 0, "es: no asume el genero del lector", generados.join(", ") || "neutro");

console.log("\n=== Las dos puertas del cierre ===\n");
idioma("en");
ok(/where does that leave you/i.test(texto()), "en: el cierre pregunta");
ok(/I want to know Jesus/i.test(texto()), "en: puerta 1 · quiero conocerle");
ok(/I have questions first/i.test(texto()), "en: puerta 2 · primero tengo preguntas");
idioma("es");
ok(/Primero tengo preguntas/i.test(texto()), "es: la puerta de las dudas existe",
  "sin ella la seccion solo sirve al que ya esta convencido");

const puertas = [...seccion.querySelectorAll("a, button")];
ok(puertas.length >= 2, "las dos puertas son pulsables", puertas.length + " elementos");
ok(puertas.every((b) => b.textContent.trim().length > 0), "ninguna puerta esta muda");

console.log("\n=== No se hace solo: la invitacion a hablar con alguien ===\n");
ok(/no lo hagas? sol[oa]|[Dd]o not do it alone/i.test(texto() + " " + t),
  "invita a contarselo a alguien", "el paso siguiente es una persona, no un boton");

console.log("\n=== En los nueve idiomas ===\n");
for (const code of ["en", "es", "fr", "ht", "pt", "de", "nl", "ru", "uk"]) {
  idioma(code);
  const cuerpo = texto();
  const crudo = /(^|\s)(cristo|gospel|christ)\.[a-z0-9.]+/i.test(cuerpo);
  ok(cuerpo.length > 600 && !crudo, code,
    cuerpo.length + " caracteres" + (crudo ? " · HAY CLAVES SIN TRADUCIR" : ""));
}

console.log(fallos === 0 ? "\nLa seccion del evangelio esta intacta.\n"
                         : "\n*** " + fallos + " problema(s) ***\n");
process.exit(fallos === 0 ? 0 : 1);
