#!/usr/bin/env node
/* =========================================================
   test-seo.js — auditoria SEO y de estructura de index.html
   Autor: Dr. Mauricio Rodriguez Herrera

     npm install --no-save jsdom
     node tools/test-seo.js
   ========================================================= */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

let JSDOM;
try { ({ JSDOM } = require("jsdom")); }
catch (e) { console.error("Falta jsdom:  npm install --no-save jsdom"); process.exit(2); }

const ROOT = path.resolve(__dirname, "..");
const BASE = "https://droko1982.github.io/adventflorida/";
const IDIOMAS = ["en", "es", "fr", "ht", "pt", "de", "nl", "ru", "uk"];

const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const doc = new JSDOM(html).window.document;

let fallos = 0, avisos = 0;
function ok(cond, etiqueta, detalle) {
  if (!cond) fallos++;
  console.log("  " + (cond ? "ok   " : "FALLA") + " " + (etiqueta + " ".repeat(34)).slice(0, 34) + (detalle || ""));
}
function aviso(cond, etiqueta, detalle) {
  if (!cond) avisos++;
  console.log("  " + (cond ? "ok   " : "aviso") + " " + (etiqueta + " ".repeat(34)).slice(0, 34) + (detalle || ""));
}
const attr = (s, a) => { const e = doc.querySelector(s); return e ? e.getAttribute(a) : null; };

console.log("\n=== Basicos ===\n");
const title = doc.querySelector("title");
ok(!!title, "hay <title>", title ? title.textContent.length + " caracteres" : "");
aviso(title && title.textContent.length <= 60, "titulo <= 65 caracteres",
  title ? '"' + title.textContent.slice(0, 60) + '"' : "");
const desc = attr('meta[name="description"]', "content");
ok(!!desc, "hay meta description", desc ? desc.length + " caracteres" : "");
aviso(desc && desc.length >= 110 && desc.length <= 165, "description 110-165 caracteres", desc ? desc.length : "");
ok(!!attr('meta[name="viewport"]', "content"), "viewport");
ok(doc.documentElement.getAttribute("lang") === "en", "lang en <html>", doc.documentElement.getAttribute("lang"));
ok(!!doc.querySelector('meta[charset]'), "charset");
const robots = attr('meta[name="robots"]', "content") || "";
ok(!/noindex/.test(robots), "no hay noindex", robots || "(sin meta robots, se indexa)");

console.log("\n=== Canonical y hreflang ===\n");
const canon = attr('link[rel="canonical"]', "href");
ok(canon === BASE, "canonical apunta a la raiz", canon);
const alts = [...doc.querySelectorAll('link[rel="alternate"][hreflang]')];
const codes = alts.map(a => a.getAttribute("hreflang"));
ok(IDIOMAS.every(c => codes.includes(c)), "hreflang de los 9 idiomas", codes.length + " enlaces");
ok(codes.includes("x-default"), "hreflang x-default");
const dupes = codes.filter((c, i) => codes.indexOf(c) !== i);
ok(dupes.length === 0, "sin hreflang duplicados", dupes.join(", "));
const malos = alts.filter(a => !a.getAttribute("href").startsWith(BASE));
ok(malos.length === 0, "hreflang absolutos y del dominio", malos.length ? malos[0].getAttribute("href") : "");
/* El canonical estatico anularia las variantes ?lang: debe corregirlo el JS */
const cabecera = html.split("</head>")[0];
const mainJs = fs.readFileSync(path.join(ROOT, "js", "main.js"), "utf8");
ok(cabecera.includes('canon.setAttribute("href", url)'),
  "canonical se ajusta por idioma", "en el head, antes de pintar");
ok(cabecera.includes('ogUrl.setAttribute("content", url)'), "og:url se ajusta por idioma");
ok(mainJs.includes('canon.setAttribute("href", url)'), "y tambien al cambiar sin recargar");

console.log("\n=== Redes sociales ===\n");
for (const p of ["og:title", "og:description", "og:type", "og:url", "og:image", "og:site_name"]) {
  ok(!!attr('meta[property="' + p + '"]', "content"), p);
}
const ogImg = attr('meta[property="og:image"]', "content");
const ogPath = ogImg ? path.join(ROOT, ogImg.replace(BASE, "")) : null;
ok(ogPath && fs.existsSync(ogPath), "la imagen og existe",
  ogPath && fs.existsSync(ogPath) ? Math.round(fs.statSync(ogPath).size / 1024) + " KB" : ogImg);
ok(attr('meta[property="og:image:width"]', "content") === "1200" &&
   attr('meta[property="og:image:height"]', "content") === "630", "og:image 1200x630");
ok(!!attr('meta[name="twitter:card"]', "content"), "twitter:card");

console.log("\n=== Datos estructurados ===\n");
const blocks = [...doc.querySelectorAll('script[type="application/ld+json"]')];
ok(blocks.length >= 4, "bloques JSON-LD", blocks.length);
const tipos = [];
for (const b of blocks) {
  try { const j = JSON.parse(b.textContent); tipos.push(j["@type"]); }
  catch (e) { ok(false, "JSON-LD valido", e.message); }
}
if (tipos.length === blocks.length) ok(true, "todos los JSON-LD parsean", tipos.join(", "));
for (const t of ["Organization", "FAQPage", "WebSite"]) ok(tipos.includes(t), "hay " + t);

console.log("\n=== Estructura de encabezados ===\n");
const h1 = doc.querySelectorAll("h1");
const partes = [...doc.querySelectorAll(".part")];
/* Un h1 por parte, no uno en todo el documento: solo se pinta una
   parte cada vez, asi que quien lee la pagina sigue viendo un solo
   h1. Sin esto, quien entra por #sabado veia un h2 como encabezado
   de nivel mas alto. */
const malH1 = partes.filter(p => p.querySelectorAll("h1").length !== 1);
ok(malH1.length === 0, "cada parte con un solo h1",
  malH1.length ? malH1.map(p => p.id).join(", ") : "las " + partes.length + " partes");
ok(h1.length === partes.length, "sin h1 fuera de las partes", h1.length + " h1");
const niveles = [...doc.querySelectorAll("h1,h2,h3,h4")].map(h => +h.tagName[1]);
let saltos = 0;
for (let i = 1; i < niveles.length; i++) if (niveles[i] - niveles[i - 1] > 1) saltos++;
aviso(saltos === 0, "sin saltos de nivel", saltos ? saltos + " saltos" : "");
ok(doc.querySelectorAll("h2").length >= 8, "h2 por seccion", doc.querySelectorAll("h2").length + " h2");

console.log("\n=== Accesibilidad e imagenes ===\n");
const imgs = [...doc.querySelectorAll("img")];
ok(imgs.every(i => i.hasAttribute("alt")), "toda img con alt", imgs.length + " imagenes");
const svgs = [...doc.querySelectorAll("svg")];
const oculto = (el) => { for (var n = el; n; n = n.parentElement) { if (n.getAttribute && n.getAttribute("aria-hidden") === "true") return true; } return false; };
const svgMal = svgs.filter(s => !oculto(s) && !s.hasAttribute("role") && !s.hasAttribute("aria-label"));
ok(svgMal.length === 0, "svg decorativos ocultos al lector", svgMal.length ? svgMal.length + " sin marcar" : svgs.length + " svg");
const links = [...doc.querySelectorAll("a[href]")];
const vacios = links.filter(a => !a.textContent.trim() && !a.getAttribute("aria-label"));
ok(vacios.length === 0, "sin enlaces sin texto ni aria-label", vacios.length);
const externos = links.filter(a => /^https?:/.test(a.getAttribute("href")) && !a.getAttribute("href").startsWith(BASE));
const sinRel = externos.filter(a => a.getAttribute("target") === "_blank" && !/noopener/.test(a.getAttribute("rel") || ""));
ok(sinRel.length === 0, "target=_blank con noopener", sinRel.length ? sinRel.length + " sin rel" : externos.length + " externos");
ok(!!doc.querySelector(".skip-link"), "enlace para saltar al contenido");

console.log("\n=== Archivos de SEO ===\n");
for (const f of ["robots.txt", "sitemap.xml", "manifest.json", "404.html"]) {
  ok(fs.existsSync(path.join(ROOT, f)), f);
}
const sm = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
ok(IDIOMAS.every(c => sm.includes('hreflang="' + c + '"')), "sitemap con los 9 hreflang");
ok(sm.includes("x-default"), "sitemap con x-default");
const rb = fs.readFileSync(path.join(ROOT, "robots.txt"), "utf8");
ok(rb.includes("Sitemap:"), "robots.txt enlaza el sitemap");
ok(!/Disallow: \/\s*$/m.test(rb), "robots.txt no bloquea el sitio");

console.log("\n=== Peso ===\n");
const kb = (p) => Math.round(fs.statSync(path.join(ROOT, p)).size / 1024);
const lang = fs.readdirSync(path.join(ROOT, "js", "lang"))
  .map(f => fs.statSync(path.join(ROOT, "js", "lang", f)).size);
const porVisita = kb("index.html") + kb("css/styles.css") + kb("js/i18n.js") +
  kb("js/sabbath.js") + kb("js/events.js") + kb("js/main.js") + Math.round(Math.max(...lang) / 1024);
aviso(porVisita < 300, "peso por visita (peor caso)", porVisita + " KB");
aviso(kb("index.html") < 120, "html", kb("index.html") + " KB");

/* ---------- La biblioteca en el HTML servido ----------
   Los titulos de los libros son los terminos con busqueda mundial de
   verdad: "El camino a Cristo PDF gratis" se busca en todo el mundo
   hispanohablante, "Florida Advent Missionaries" no se busca en ninguna
   parte. Si esos titulos viven solo en js/library.js, un rastreador que
   no ejecute JavaScript no ve ni uno. Van tambien como datos
   estructurados, y esto vigila que no se queden atras. */
console.log("\n=== La biblioteca en los datos estructurados ===\n");
{
  const win = {};
  new Function("window", fs.readFileSync(path.join(ROOT, "js", "library.js"), "utf8"))(win);
  const LIB = win.FAM_LIBRARY || [];
  const bloques = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => { try { return JSON.parse(m[1]); } catch (e) { return null; } });
  const lista = bloques.find((b) => b && b["@type"] === "ItemList");

  ok(!!lista, "hay un ItemList de la biblioteca");
  if (lista) {
    ok(lista.itemListElement.length === LIB.length,
      "declara todas las obras", lista.itemListElement.length + " de " + LIB.length);

    /* Cada titulo de cada idioma tiene que aparecer en los bytes servidos */
    const titulos = new Set();
    LIB.forEach((o) => Object.keys(o.ed).forEach((l) => titulos.add(o.ed[l].t)));
    const fuera = [...titulos].filter((t) => html.indexOf(t) === -1);
    ok(fuera.length === 0, "los titulos estan en el HTML",
      fuera.length ? fuera.slice(0, 3).join(" | ") : titulos.size + " titulos de 9 idiomas");

    /* Y que no declare una obra que ya no exista */
    const inventadas = lista.itemListElement
      .filter((x) => !titulos.has(x.name)).map((x) => x.name);
    ok(inventadas.length === 0, "no declara obras que no estan",
      inventadas.join(", ") || "ninguna de mas");
  }
}

console.log(fallos === 0 ? "\nSin errores." + (avisos ? "  (" + avisos + " aviso[s])" : "") + "\n"
                         : "\n*** " + fallos + " error(es), " + avisos + " aviso(s) ***\n");
process.exit(fallos === 0 ? 0 : 1);
