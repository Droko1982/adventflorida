/* Mete las 16 obras de la biblioteca en el HTML que sirve el servidor.

   Hoy la biblioteca la pinta el JS desde js/library.js, asi que de las
   124 ediciones solo 2 aparecen en los bytes servidos. Los terminos con
   busqueda mundial de verdad son justo esos titulos: "El camino a Cristo
   PDF gratis" se busca en todo el mundo hispanohablante; "Florida Advent
   Missionaries" no se busca en ninguna parte.

   Se declara lo que se BUSCA -- los titulos en los nueve idiomas -- y no
   las 124 direcciones: eso engordaba el HTML en 65 KB, mas de lo que
   pesa media pagina, y las direcciones ya estan en js/library.js, que
   Google descarga y ejecuta igual. Aqui manda la ligereza: quien lee
   esto lo hace muchas veces con datos contados. */
"use strict";
const fs = require("node:fs");

const REPO = "C:/Users/asus/adventflorida";
const IDIOMAS = ["en", "es", "fr", "ht", "pt", "de", "nl", "ru", "uk"];

const win = {};
new Function("window", fs.readFileSync(REPO + "/js/library.js", "utf8"))(win);
const LIB = win.FAM_LIBRARY;

const obras = LIB.map((o, i) => {
  const ed = o.ed;
  const base = ed.en || ed[Object.keys(ed)[0]];
  const idiomas = IDIOMAS.filter((l) => ed[l]);
  const otros = [...new Set(idiomas.map((l) => ed[l].t))].filter((t) => t !== base.t);
  const libro = {
    "@type": "Book",
    "position": i + 1,
    "name": base.t,
    "inLanguage": idiomas,
    "isAccessibleForFree": true,
    "bookFormat": "https://schema.org/EBook",
  };
  if (o.egw) libro.author = { "@type": "Person", "name": "Ellen G. White" };
  if (otros.length) libro.alternateName = otros;
  /* Una sola direccion por obra, la de leer en el idioma base */
  if (base.leer) libro.url = base.leer;
  return libro;
});

const lista = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Free Christian library — Ellen G. White and more",
  "description":
    "Sixteen works free of charge, most of them by Ellen G. White, in up to nine languages: " +
    "PDF download and online reading, no payment and no sign-up.",
  "numberOfItems": obras.length,
  "itemListOrder": "https://schema.org/ItemListOrderAscending",
  "itemListElement": obras,
};

let s = fs.readFileSync(REPO + "/index.html", "utf8");

/* Quitar el que hubiera, para poder regenerar sin duplicar */
s = s.replace(
  /<script type="application\/ld\+json">[\r\n\s]*\{[\r\n\s]*"@context": "https:\/\/schema\.org",[\r\n\s]*"@type": "ItemList"[\s\S]*?<\/script>[\r\n]*/,
  "");

/* Anclar por el bloque WebSite y retroceder a su etiqueta de apertura.
   No vale buscar una cadena con saltos de linea dentro: el archivo los
   lleva al estilo Windows. */
const donde = s.indexOf('"@type": "WebSite"');
if (donde === -1) { console.error("no encontre el bloque WebSite"); process.exit(1); }
const i = s.lastIndexOf('<script type="application/ld+json">', donde);
if (i === -1) { console.error("no encontre su etiqueta de apertura"); process.exit(1); }

const bloque = '<script type="application/ld+json">\n' + JSON.stringify(lista, null, 1) + "\n</script>\n\n";
s = s.slice(0, i) + bloque + s.slice(i);
fs.writeFileSync(REPO + "/index.html", s, "utf8");

console.log("obras: " + obras.length +
  " · titulos declarados: " + obras.reduce((n, o) => n + 1 + (o.alternateName || []).length, 0) +
  " · el bloque pesa " + Math.round(bloque.length / 1024) + " KB");
