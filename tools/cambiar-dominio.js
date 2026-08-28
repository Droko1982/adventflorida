#!/usr/bin/env node
/* =========================================================
   cambiar-dominio.js — cambia el sitio entero de direccion.
   Autor: Dr. Mauricio Rodriguez Herrera

   El dia que se compre el dominio, esto es lo unico que hay
   que ejecutar. Son 132 direcciones repartidas en 12 archivos,
   y el sitemap solo se lleva 99 de ellas: a mano se olvida una
   y el canonical o el hreflang se quedan apuntando al sitio
   viejo, que es peor que no haber cambiado nada.

     node tools/cambiar-dominio.js floridaadventmissionaries.org
     node tools/cambiar-dominio.js ejemplo.org --prueba

   --prueba enseña lo que haria sin tocar ni un archivo.

   Despues del cambio quedan DOS cosas por hacer a mano, y las
   recuerda al terminar: crear el archivo CNAME y apuntar el DNS.
   ========================================================= */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const VIEJO_BASE = "https://droko1982.github.io/adventflorida";
const VIEJA_RUTA = "/adventflorida/";     /* rutas absolutas de 404.html */

const arg = process.argv.slice(2).filter((a) => a !== "--prueba");
const PRUEBA = process.argv.includes("--prueba");
const dominio = (arg[0] || "").trim().replace(/^https?:\/\//, "").replace(/\/+$/, "");

if (!dominio || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(dominio)) {
  console.error("\nUso:  node tools/cambiar-dominio.js  midominio.org  [--prueba]\n");
  process.exit(2);
}
const NUEVO_BASE = "https://" + dominio;

/* Los archivos que llevan la direccion escrita. tools/research/ son notas
   de investigacion, no codigo: se dejan como testimonio de lo que se
   miro y cuando. */
const ARCHIVOS = [
  "index.html", "404.html", "js/main.js", "sitemap.xml", "robots.txt",
  "manifest.json", "README.md", "PENDIENTES.md",
  "tools/test-seo.js", "tools/test-loader.js", "tools/test-page.js",
  "tools/test-forms.js", "tools/test-gospel.js", "tools/test-browser.js",
];

let tocados = 0, cambios = 0;
const detalle = [];

for (const rel of ARCHIVOS) {
  const f = path.join(ROOT, rel);
  if (!fs.existsSync(f)) continue;
  const antes = fs.readFileSync(f, "utf8");
  let d = antes;

  /* 1. La direccion completa del sitio publicado */
  d = d.split(VIEJO_BASE + "/").join(NUEVO_BASE + "/");
  d = d.split(VIEJO_BASE).join(NUEVO_BASE);

  /* 2. Las rutas absolutas de 404.html, que en un dominio propio cuelgan
        de la raiz y no de /adventflorida/ */
  d = d.split('href="' + VIEJA_RUTA).join('href="/');
  d = d.split('src="' + VIEJA_RUTA).join('src="/');

  if (d === antes) continue;
  /* Contar de verdad lo que se sustituyo, no sumar patrones que se
     solapan: VIEJO_BASE + "/" ya contiene VIEJO_BASE. */
  const n = (antes.split(VIEJO_BASE).length - 1) +
            (antes.split('href="' + VIEJA_RUTA).length - 1) +
            (antes.split('src="' + VIEJA_RUTA).length - 1);
  detalle.push("  " + rel.padEnd(26) + String(n).padStart(4) + " cambios");
  cambios += n;
  tocados++;
  if (!PRUEBA) fs.writeFileSync(f, d, "utf8");
}

/* El sitemap tiene que decir que cambio, o Google no vuelve a mirar */
const sm = path.join(ROOT, "sitemap.xml");
if (fs.existsSync(sm) && !PRUEBA) {
  const hoy = new Date().toISOString().slice(0, 10);
  const antes = fs.readFileSync(sm, "utf8");
  const d = antes.replace(/<lastmod>[^<]*<\/lastmod>/g, "<lastmod>" + hoy + "</lastmod>");
  if (d !== antes) {
    fs.writeFileSync(sm, d, "utf8");
    detalle.push("  sitemap.xml               lastmod -> " + hoy);
  }
}

/* CNAME: es lo que le dice a GitHub Pages que sirva el dominio propio */
const cname = path.join(ROOT, "CNAME");
if (!PRUEBA) fs.writeFileSync(cname, dominio + "\n", "utf8");

console.log("\n" + (PRUEBA ? "PRUEBA (no se ha tocado nada)" : "Hecho") + "\n");
console.log("  " + VIEJO_BASE + "\n    -> " + NUEVO_BASE + "\n");
console.log(detalle.join("\n"));
console.log("\n  " + cambios + " cambios en " + tocados + " archivos" +
  (PRUEBA ? "" : ", mas el archivo CNAME") + "\n");

if (PRUEBA) {
  console.log("  Quita --prueba para aplicarlo.\n");
  process.exit(0);
}

console.log(`  AHORA, EN ESTE ORDEN:

  1. Comprueba que nada se ha roto:
       node tools/test-seo.js
       node tools/test-loader.js
       node tools/test-page.js
     Si alguna falla, NO subas nada y avisa.

  2. Sube los cambios:
       git add -A
       git commit -m "Cambia el sitio a ${dominio}"
       git push

  3. En el panel del dominio (donde lo compraste), crea estos registros:

       Tipo   Nombre   Valor
       ----   ------   -----------------
       A      @        185.199.108.153
       A      @        185.199.109.153
       A      @        185.199.110.153
       A      @        185.199.111.153
       CNAME  www      droko1982.github.io

     Son los cuatro servidores de GitHub Pages. Los cuatro, no uno.

  4. En GitHub: Settings -> Pages -> Custom domain -> escribe ${dominio}
     y guarda. Cuando aparezca la marca verde, activa "Enforce HTTPS".
     El certificado tarda de unos minutos a 24 horas. Es normal.

  5. Cuando ya cargue en https://${dominio}, da de alta el sitio NUEVO en
     Google Search Console y envia https://${dominio}/sitemap.xml

  LO QUE HAY QUE SABER:

  - La direccion vieja de GitHub Pages redirige sola a la nueva en cuanto
    el CNAME esta puesto. Los enlaces ya compartidos por WhatsApp siguen
    funcionando: no hay que reenviar nada a nadie.
  - El posicionamiento acumulado se traslada, pero tarda semanas. Es
    normal ver una bajada al principio.
  - Cuanto antes se haga, menos hay que trasladar. Si el dominio ya esta
    comprado, este es el momento.
`);
