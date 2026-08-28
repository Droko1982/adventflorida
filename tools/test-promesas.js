#!/usr/bin/env node
/* =========================================================
   test-promesas.js — las dos cosas que mas dano hacen en una
   pagina de ministerio y que ninguna otra prueba ve:

     1. Prometer algo que no hay nadie para cumplir.
     2. Dar por hecho el sexo de quien lee o de quien escribe.

   Las dos ya pasaron. La seccion "a donde ir" prometia en los
   nueve idiomas que alguien entraria contigo, con js/near.js
   vacio y sin una sola persona comprometida. Y los mensajes
   que el visitante manda por WhatsApp hablaban de si mismo en
   masculino en ruso, ucraniano, espanol y portugues, asi que
   toda mujer que pulsara un boton se presentaba en masculino.

   Esto vigila que no vuelvan.
   Autor: Dr. Mauricio Rodriguez Herrera

     node tools/test-promesas.js
   ========================================================= */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const L = ["en", "es", "fr", "ht", "pt", "de", "nl", "ru", "uk"];

function dic(code) {
  const src = fs.readFileSync(path.join(ROOT, "js", "lang", code + ".js"), "utf8");
  return new Function("window", "return (function(){" + src + "; return window.FAM_I18N;})()")({})[code];
}
const D = {};
L.forEach((l) => { D[l] = dic(l); });

let fallos = 0;
function ok(cond, etiqueta, detalle) {
  if (!cond) fallos++;
  console.log("  " + (cond ? "ok   " : "FALLA") + " " + (etiqueta + " ".repeat(30)).slice(0, 30) + (detalle || ""));
}

/* =========================================================
   1. Compania que no hay quien la garantice
   ========================================================= */
console.log("\n=== Promesas de compania ===\n");
console.log("   js/near.js esta vacio: no hay ni una ciudad ni una persona\n");

/* No se prohibe hablar de compania: se prohibe prometerla sin condicion.
   Toda oracion que mencione que alguien te acompana tiene que llevar en
   la misma oracion un "si hay alguien". Asi el texto puede seguir siendo
   una invitacion sin convertirse en un compromiso que nadie ha firmado. */
/* Ojo con \b y el cirilico: en JavaScript solo conoce letras ASCII, asi
   que /\bесли\b/ NO encuentra "если". En ruso y ucraniano va sin \b. */
const COMPANIA = {
  en: { promesa: /go in with you|walk in with you|meet you there|sit with you/i,
        matiz: /\bif\b|we will look for|we will find out/i },
  es: { promesa: /entrar? contigo|acompa[ñn]arte|recibirte|sentarse contigo|esperarte/i,
        matiz: /\bsi\b|buscamos|averiguamos/i },
  fr: { promesa: /entrer avec vous|vous accueillir|s'asseoir|vous retrouver/i,
        matiz: /\bs'il\b|\bsi\b|nous chercherons|nous cherchons/i },
  ht: { promesa: /antre av[èe]k ou|chita av[èe]k ou|kontre ou|tann ou/i,
        matiz: /\bsi\b|n ap ch[èe]che/i },
  pt: { promesa: /entrar? com voc[êe]|receber voc[êe]|sentar do seu lado|esperar voc[êe]|entrar junto/i,
        matiz: /\bse\b|procura|vamos procurar/i },
  de: { promesa: /mit Ihnen hinein|empfangen|neben Sie setzen|auf Sie warten/i,
        matiz: /\bwenn\b|wir suchen|wir finden heraus/i },
  nl: { promesa: /met u mee naar binnen|ontvangen|naast u|opwachten/i,
        matiz: /\bals\b|wij zoeken|we zoeken uit/i },
  ru: { promesa: /вместе с вами|встретить|сесть рядом|подожд/i,
        matiz: /если|поищем|выясним/i },
  uk: { promesa: /разом і?з вами|зустріти|сісти поруч|зачека/i,
        matiz: /якщо|пошукаємо|з'ясуємо/i },
};

/* near.lead NO entra: es la version que solo sale cuando FAM_NEAR tiene
   ciudades, es decir, cuando si hay alguien detras. Ahi la promesa vale. */
const CLAVES_COMPANIA = ["near.none", "near.lead0", "sab.g.lead", "sab.e.2.d", "sab.d.3.d"];

/* Corta por punto o raya. El punto y coma NO separa: en espanol y en
   portugues la condicion suele ir en la primera mitad de la oracion. */
function oraciones(texto) {
  return String(texto).split(/(?:[.!?]+|\s—\s)/).map((f) => f.trim()).filter(Boolean);
}

for (const l of L) {
  const sueltas = [];
  for (const k of CLAVES_COMPANIA) {
    if (!D[l][k]) continue;
    for (const fr of oraciones(D[l][k])) {
      if (COMPANIA[l].promesa.test(fr) && !COMPANIA[l].matiz.test(fr)) {
        sueltas.push(k + ": " + fr.slice(0, 62));
      }
    }
  }
  ok(sueltas.length === 0, l + " · compania condicionada",
    sueltas.length ? sueltas.join(" | ") : CLAVES_COMPANIA.length + " claves");
}

/* near.lead0 es el texto que sale con FAM_NEAR vacio: no puede dar a
   entender que hay ciudades confirmadas, porque no hay ninguna. */
console.log();
const nearSrc = fs.readFileSync(path.join(ROOT, "js", "near.js"), "utf8");
const NEAR = new Function("window", "return (function(){" + nearSrc + "; return window.FAM_NEAR;})()")({}) || {};
ok(Object.keys(NEAR).length === 0, "js/near.js sigue vacio",
  "si deja de estarlo, revisa que near.lead0 vuelva a la version completa");

/* =========================================================
   2. El sexo de quien lee y de quien escribe
   ========================================================= */
console.log("\n=== Genero en los mensajes que manda el visitante ===\n");
console.log("   Las cadenas wa.* las escribe la persona hablando de si misma\n");

const MARCAS = {
  es: [/\bconvencido\b/i, /\blisto\b/i, /\bcansado\b/i, /\binteresado\b/i, /\bdispuesto\b/i],
  pt: [/\bconvencido\b/i, /\bpronto\b/i, /\bcansado\b/i, /\binteressado\b/i, /\bdisposto\b/i],
  fr: [/\bconvaincu\b/i, /\bpr[eê]t\b/i, /\bfatigu[eé]\b/i, /\bint[eé]ress[eé]\b/i],
  de: [/\bbereit\b/i, /\büberzeugt\b/i, /\binteressiert\b/i],
  /* Mismo aviso: \b no ve el cirilico, asi que /\bготов\b/ NO encuentra
     "готов" y la prueba pasaria siempre. Con \p{L} y la marca u si hay
     frontera de palabra de verdad, y ademas "готов" deja de tragarse
     "готовы", que es plural y no lleva genero. */
  ru: [/(?<!\p{L})(готов|хотел|решил|уверен|рад|должен)(?!\p{L})/u],
  uk: [/(?<!\p{L})(готовий|хотів|вирішив|впевнений|радий|повинен)(?!\p{L})/u],
};

for (const l of Object.keys(MARCAS)) {
  const claves = Object.keys(D[l]).filter((k) => k.indexOf("wa.") === 0);
  const malas = claves.filter((k) => MARCAS[l].some((r) => r.test(D[l][k])));
  ok(malas.length === 0, l + " · wa.* sin genero",
    malas.length ? malas.join(", ") : claves.length + " mensajes");
}

/* El mismo problema, pero en los textos que la pagina le dice a quien lee */
console.log();
const AL_LECTOR = ["mis.lead", "mis.lead0", "sab.e.3.d", "sab.d.3.d", "sab.d.7.d",
                   "contact.f.privacy", "prayer.f.privacyOnline", "near.lead0"];
const MARCAS_LECTOR = {
  de: [/\bAdventist sein\b/, /\bSie sind unser Gast\b/],
  ru: [/(?<!\p{L})(адвентистом|Вы наш гость)(?!\p{L})/u],
  uk: [/(?<!\p{L})(адвентистом|Ви наш гість)(?!\p{L})/u],
  fr: [/\bvous n'êtes inscrit\b/, /\bvous êtes inscrit\b/],
  nl: [/\bgeen adventist te zijn\b/],
};
for (const l of Object.keys(MARCAS_LECTOR)) {
  const malas = AL_LECTOR.filter((k) => D[l][k] && MARCAS_LECTOR[l].some((r) => r.test(D[l][k])));
  ok(malas.length === 0, l + " · sin genero al lector",
    malas.length ? malas.join(", ") : AL_LECTOR.length + " claves");
}

/* =========================================================
   3. Lo que la pagina promete tiene que tener un campo detras
   ========================================================= */
console.log("\n=== Promesas con su mecanismo detras ===\n");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

/* prayer.l4 dice "si quieres que alguien te visite o te llame, solo
   dinoslo". Sin un campo donde dejar el contacto, era imposible. */
ok(/id="pReply"/.test(html), "el formulario de oracion pide contacto",
  "prayer.l4 promete visita o llamada");
ok(/data-i18n="prayer\.f\.replyNote"/.test(html), "y dice que es opcional",
  "el anonimato tambien esta prometido");
const main = fs.readFileSync(path.join(ROOT, "js", "main.js"), "utf8");
ok(/ponerRespuesta\(campos, reply\)/.test(main), "y ese campo llega al correo");

/* Los marcadores tienen que estar en los nueve o el texto sale roto */
console.log();
for (const [clave, marca] of [["near.none", "{city}"], ["a11y.verseN", "{n}"],
                              ["mis.lead.stale", "{months}"], ["footer.rights", "{year}"]]) {
  const faltan = L.filter((l) => D[l][clave] && D[l][clave].indexOf(marca) === -1);
  ok(faltan.length === 0, clave + " lleva " + marca,
    faltan.length ? "falta en " + faltan.join(", ") : "en los nueve");
}

/* =========================================================
   4. Llamar al libro por su nombre, el mismo que el del enlace
   ========================================================= */
console.log("\n=== El libro se llama igual en el texto y en el enlace ===\n");
{
  const win = {};
  new Function("window", fs.readFileSync(path.join(ROOT, "js", "i18n.js"), "utf8"))(win);
  const LANGS = win.FAM_LANGS || [];

  for (const m of LANGS) {
    const d = D[m.code];
    const texto = Object.keys(d).map((k) => d[k]).join(" | ");
    const hay = texto.indexOf(m.book.title) !== -1;

    if (m.code === "ht") {
      /* Excepcion deliberada y explicada: el libro no existe en kreyol,
         asi que los botones llevan a la edicion francesa. El texto lo
         nombra en kreyol y el enlace en frances a proposito. Lo que NO
         puede faltar es el aviso que lo explica. */
      const aviso = d["book.legalHt"] || "";
      ok(aviso.length > 60, "ht: el aviso explica por que va al frances",
        aviso.slice(0, 52) + "...");
      continue;
    }
    ok(hay, m.code + ": el texto usa el titulo del enlace", m.book.title);
  }

  /* Y que ninguna ficha de la biblioteca contradiga ese titulo */
  const wl = {};
  new Function("window", fs.readFileSync(path.join(ROOT, "js", "library.js"), "utf8"))(wl);
  const steps = (wl.FAM_LIBRARY || []).filter((o) => o.slug === "steps-to-christ")[0];
  if (steps) {
    const chocan = LANGS
      .filter((m) => steps.ed[m.code] && steps.ed[m.code].t !== m.book.title)
      .map((m) => m.code + ": \"" + steps.ed[m.code].t + "\" vs \"" + m.book.title + "\"");
    ok(chocan.length === 0, "la biblioteca dice el mismo titulo",
      chocan.join(" · ") || LANGS.length + " idiomas de acuerdo");
  }
}

console.log(fallos === 0 ? "\nNo se promete nada que no se pueda cumplir.\n"
                         : "\n*** " + fallos + " problema(s) ***\n");
process.exit(fallos === 0 ? 0 : 1);
