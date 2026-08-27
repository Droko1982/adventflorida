#!/usr/bin/env node
/* =========================================================
   test-page.js — carga index.html en un DOM real y prueba
   el reloj del sabado, la seccion de misiones, los nueve
   idiomas, los enlaces del libro y que no quede ninguna
   clave sin traducir.
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

const LANGF = fs.readdirSync(path.join(ROOT,"js","lang")).map(f => "js/lang/"+f);
for (const f of [...LANGF, "js/i18n.js", "js/sabbath.js", "js/videos.js", "js/near.js", "js/events.js", "js/main.js"]) {
  try { window.eval(fs.readFileSync(path.join(ROOT, f), "utf8")); }
  catch (e) { errores.push(f + ": " + e.message); }
}
window.document.dispatchEvent(new window.Event("DOMContentLoaded"));

const sel = (s) => window.document.querySelector(s);
const txt = (s) => { const e = sel(s); return e ? e.textContent.trim().replace(/\s+/g, " ") : "(no existe)"; };
const clic = (s) => sel(s).dispatchEvent(new window.Event("click"));
const idioma = (code) =>
  [...window.document.querySelectorAll("#langMenu button")]
    .find((b) => b.getAttribute("data-lang") === code)
    .dispatchEvent(new window.Event("click"));

let fallos = 0;
function comprobar(cond, etiqueta, detalle) {
  if (!cond) fallos++;
  console.log("  " + (cond ? "ok  " : "FALLA") + " " + (etiqueta + "                              ").slice(0, 30) + (detalle || ""));
}

/* ---------------- Reloj del sabado ---------------- */
console.log("\n=== Reloj del sabado ===\n");
comprobar(sel("#sabCity").options.length === 22, "22 ciudades", sel("#sabCity").options.length + " en el selector");
comprobar(/\d/.test(txt("#sabStartTime")), "hora de inicio", txt("#sabStartTime") + " · " + txt("#sabStartDay"));
comprobar(/\d/.test(txt("#sabEndTime")), "hora de fin", txt("#sabEndTime") + " · " + txt("#sabEndDay"));

sel("#sabCity").value = "pensacola";
sel("#sabCity").dispatchEvent(new window.Event("change"));
comprobar(/\d/.test(txt("#sabStartTime")), "cambio de ciudad", "Pensacola (hora central): " + txt("#sabStartTime"));

/* ---------------- Testimonios en video ---------------- */
console.log("\n=== Testimonios en video ===\n");
const tarjetas = [...window.document.querySelectorAll("#stGrid .st-card")];
comprobar(tarjetas.length === 5, "5 testimonios", tarjetas.length + " tarjetas");
comprobar(tarjetas[0].classList.contains("is-lead"), "el primero destacado",
  txt("#stGrid .st-who"));
comprobar(tarjetas.every((c) => /i\.ytimg\.com/.test(c.querySelector("img").getAttribute("src"))),
  "miniaturas de YouTube", "enlazadas, no descargadas");
comprobar(tarjetas.every((c) => c.querySelector("img").getAttribute("loading") === "lazy"),
  "carga diferida de imagenes");
comprobar(window.document.querySelectorAll("#stGrid iframe").length === 0,
  "nada de YouTube antes de pulsar");
sel("#stGrid button.st-thumb").dispatchEvent(new window.Event("click"));
const marco = sel("#stGrid iframe");
comprobar(!!marco && /youtube-nocookie\.com/.test(marco.getAttribute("src")),
  "al pulsar, dominio sin cookies");

/* ---------------- Alguien cerca de ti ---------------- */
console.log("\n=== Alguien cerca de ti ===\n");
comprobar(sel("#nearCity").options.length === 22, "22 ciudades");
comprobar(sel("#nearLang").options.length === 9, "9 idiomas");
comprobar(/\d/.test(txt("#nearOut .near-line")), "da la hora del ocaso", txt("#nearOut .near-line").slice(0, 46) + "…");
comprobar(!!sel("#nearOut .muted"), "sin datos, lo dice con franqueza");
comprobar(!sel("#nearOut .near-where"), "no inventa una direccion");
comprobar(decodeURIComponent(sel("#nearCta").getAttribute("href")).includes("Delray Beach"),
  "WhatsApp con la ciudad puesta");

window.FAM_NEAR.orlando = {
  church: "Iglesia de prueba", address: "123 Main St, Orlando, FL",
  map: "https://maps.google.com/?q=Orlando", time: "11:00", langs: ["es", "en"], person: "Ana"
};
sel("#nearCity").value = "orlando";
sel("#nearCity").dispatchEvent(new window.Event("change"));
comprobar(txt("#nearOut .near-where p strong") === "Iglesia de prueba", "muestra la iglesia");
comprobar(!!sel("#nearOut .near-where a"), "y el enlace al mapa");
comprobar(txt("#nearOut .near-line:last-child").includes("Ana"), "y quien te espera",
  txt("#nearOut .near-line:last-child").slice(0, 44));

/* ---------------- Misiones: arranca sin eventos ---------------- */
console.log("\n=== Misiones, sin ningun evento ===\n");
comprobar(!!sel("#misUpcoming .mis-empty"), "estado vacio", txt("#misUpcoming .mis-empty h3"));
comprobar(!!sel("#misUpcoming .mis-empty .btn"), "invita, no falla", txt("#misUpcoming .mis-empty .btn"));
comprobar(sel("#misMore").hidden, "boton ver mas oculto");
comprobar(!sel("#eventSchema"), "sin JSON-LD de eventos");

/* ---------------- Misiones: con eventos de prueba ---------------- */
console.log("\n=== Misiones, con eventos de prueba ===\n");
window.FAM_EVENTS.push(
  { start: "2099-12-05", time: "10:00", type: "health", city: "Orlando", lang: "es", title: "Prueba futura" },
  { start: "2099-12-20", type: "evangelism", city: "Miami", lang: "es",
    title: { es: "Con traduccion", en: "Translated" } },
  { start: "2000-01-01", type: "community", city: "Miami", lang: "es", title: "Pasada A" },
  { start: "2000-02-01", type: "visit", city: "Tampa", lang: "es", title: "Pasada B" },
  { start: "2000-03-01", type: "prayer", city: "Naples", lang: "es", title: "Pasada C" },
  { start: "2000-04-01", type: "literature", city: "Ocala", lang: "es", title: "Pasada D" }
);
clic("#tabUp");
const prox = sel("#misUpcoming").querySelectorAll(".ev-card");
comprobar(prox.length === 2, "2 proximos", prox.length + " tarjetas");
comprobar(prox[0].classList.contains("is-next"), "el primero destacado");
comprobar(txt("#tabUpCount") === "2", "contador de proximos", txt("#tabUpCount"));
comprobar(!!sel("#eventSchema"), "JSON-LD generado",
  sel("#eventSchema") ? JSON.parse(sel("#eventSchema").textContent).length + " eventos" : "");

clic("#tabPast");
comprobar(sel("#misPast").querySelectorAll(".ev-card").length === 3, "pasados limitados a 3");
comprobar(!sel("#misMore").hidden, "aparece ver mas", txt("#misMoreBtn"));
const ordenPasados = [...sel("#misPast").querySelectorAll(".ev-card h3")].map((e) => e.textContent.trim());
comprobar(ordenPasados[0] === "Pasada D", "del mas reciente al mas viejo", ordenPasados.join(" | "));
clic("#misMoreBtn");
comprobar(sel("#misPast").querySelectorAll(".ev-card").length === 4, "ver mas los muestra todos");

/* ---------------- Reserva de idioma en los eventos ---------------- */
console.log("\n=== Eventos escritos en otro idioma ===\n");
idioma("en");
clic("#tabUp");
const c = sel("#misUpcoming").querySelectorAll(".ev-card");
comprobar(!!c[0].querySelector(".ev-lang-note"), "avisa del idioma original",
  c[0].querySelector(".ev-lang-note").textContent.trim());
comprobar(!c[1].querySelector(".ev-lang-note"), "sin aviso si hay traduccion",
  c[1].querySelector("h3").textContent.trim());
comprobar(c[0].querySelector("h3").getAttribute("lang") === "es",
  "marca lang= en el texto", 'lang="' + c[0].querySelector("h3").getAttribute("lang") + '"');
comprobar(!c[1].querySelector("h3").getAttribute("lang"),
  "sin lang= si esta traducido");

/* ---------------- Los nueve idiomas ---------------- */
console.log("\n=== Los nueve idiomas ===\n");
for (const code of ["en", "es", "fr", "ht", "pt", "de", "nl", "ru", "uk"]) {
  idioma(code);
  const t1 = txt('[data-i18n="sab.title"]');
  const t2 = txt('[data-i18n="mis.title"]');
  comprobar(t1 !== "sab.title" && t2 !== "mis.title", code,
    t1.slice(0, 32) + " · " + t2.slice(0, 32));
}

/* ---------------- Enlaces del libro ---------------- */
console.log("\n=== Enlace del libro por idioma ===\n");
for (const [code, esperado] of [["en", "en_SC"], ["ht", "fr_VJC"], ["ru", "allCollection/ru"]]) {
  idioma(code);
  const href = sel("#bookPdf").getAttribute("href");
  comprobar(href.includes(esperado), code, href.slice(-34));
}

/* ---------------- Donaciones ---------------- */
console.log("\n=== Donaciones (GIVE vacio) ===\n");
comprobar(sel("#giveOnline").hasAttribute("hidden"), "boton en linea oculto");
comprobar(sel("#giveZelle").hasAttribute("hidden"), "bloque Zelle oculto");

/* ---------------- Claves crudas ---------------- */
console.log("\n=== Claves sin traducir en el DOM ===\n");
const crudas = [...window.document.querySelectorAll("[data-i18n],[data-i18n-html]")]
  .filter((e) => /^[a-z]+(\.[a-zA-Z0-9]+)+$/.test(e.textContent.trim()))
  .map((e) => e.textContent.trim());
comprobar(crudas.length === 0, "ninguna clave visible", crudas.join(", "));

/* ---------------- Errores ---------------- */
console.log("\n=== Errores de ejecucion ===\n");
comprobar(errores.length === 0, "sin errores", errores.join(" | "));

console.log(fallos === 0 ? "\nTodo correcto.\n" : "\n*** " + fallos + " comprobacion(es) fallida(s) ***\n");
process.exit(fallos === 0 ? 0 : 1);
