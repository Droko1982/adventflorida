#!/usr/bin/env node
/* =========================================================
   test-listo.js — que falta para publicar de verdad.
   Autor: Dr. Mauricio Rodriguez Herrera

     node tools/test-listo.js

   Las otras trece pruebas miran si el sitio esta BIEN HECHO.
   Esta mira si esta LLENO, que no es lo mismo: el codigo puede
   estar impecable y la pagina seguir sin decir a donde ir un
   sabado, sin manera de donar y con el correo sin activar.

   Todo lo de aqui sale de PENDIENTES.md. La diferencia es que
   PENDIENTES hay que leerlo entero y esto se ejecuta.

   No comprueba lo que una maquina no puede saber: si el EIN es
   el vigente, si ese WhatsApp lo atiende alguien, o si el
   correo de FormSubmit se llego a pulsar. Eso se dice al final,
   por su nombre, para que no parezca que esta comprobado.
   ========================================================= */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "..");

const leer = (rel) => {
  try { return fs.readFileSync(path.join(ROOT, rel), "utf8"); }
  catch (e) { return null; }
};

/* Ejecuta un js/*.js que solo asigna a window y devuelve lo asignado.
   near.js y events.js son datos, no logica: se pueden correr en seco. */
function datosDe(rel, clave) {
  const src = leer(rel);
  if (src === null) return { error: "no existe " + rel };
  const window = {};
  try { new Function("window", src)(window); }
  catch (e) { return { error: e.message }; }
  return { valor: window[clave] };
}

/* GIVE y CONTACT viven dentro del IIFE de main.js, que necesita un DOM
   entero para correr. No hace falta: se leen tal cual estan escritos. */
function campoDe(src, objeto, campo) {
  if (!src) return null;
  const bloque = new RegExp("var\\s+" + objeto + "\\s*=\\s*\\{([\\s\\S]*?)\\}", "m").exec(src);
  if (!bloque) return null;
  const m = new RegExp(campo + '\\s*:\\s*"([^"]*)"').exec(bloque[1]);
  return m ? m[1] : null;
}

let faltan = 0, avisos = 0;
const ancho = 30;
function falta(cond, etiqueta, detalle) {
  if (!cond) faltan++;
  console.log("  " + (cond ? "ok    " : "FALTA ") + (etiqueta + " ".repeat(ancho)).slice(0, ancho) + (detalle || ""));
}
function aviso(cond, etiqueta, detalle) {
  if (!cond) avisos++;
  console.log("  " + (cond ? "ok    " : "aviso ") + (etiqueta + " ".repeat(ancho)).slice(0, ancho) + (detalle || ""));
}

const main = leer("js/main.js");

/* ---------------------------------------------------------
   1. El correo. Es lo unico de esta lista que PIERDE GENTE:
      quien escribe cree que ha escrito.
   --------------------------------------------------------- */
console.log("\n=== 1. Que el correo llegue ===\n");
const email = campoDe(main, "CONTACT", "email");
const token = campoDe(main, "CONTACT", "token");
falta(!!email, "hay una direccion de correo", email || "CONTACT.email vacio");
aviso(!!token, "token de FormSubmit puesto",
  token ? "la direccion ya no viaja en el codigo"
        : "sin el, fladventmissionaries@gmail.com queda a la vista de los robots de spam");
console.log("\n  Lo que NINGUNA prueba puede saber: si alguien pulso \"Activate Form\"");
console.log("  en el correo que mando FormSubmit. Mientras no se pulse, los envios");
console.log("  se rechazan. Compruebalo a mano UNA vez: entra en la pagina, mandate");
console.log("  un mensaje desde el formulario y mira que llega al buzon.");

/* ---------------------------------------------------------
   2. Donaciones
   --------------------------------------------------------- */
console.log("\n=== 2. Donaciones ===\n");
const online = campoDe(main, "GIVE", "online");
const zelle = campoDe(main, "GIVE", "zelle");
aviso(!!online, "GIVE.online", online || "sin enlace de PayPal/Givelify/Tithe.ly: no sale el boton");
aviso(!!zelle, "GIVE.zelle", zelle || "sin correo o telefono de Zelle: no sale el boton");
if (!online && !zelle) {
  console.log("\n  Hoy solo se puede donar por cheque o preguntando por WhatsApp.");
  console.log("  Rellena uno de los dos y su boton aparece solo; no hay que tocar nada mas.");
  console.log("  Ojo con el de Zelle: confirmalo antes de publicarlo. Un error ahi manda");
  console.log("  el dinero a un desconocido.");
}

/* ---------------------------------------------------------
   3. A donde ir el sabado — el bloque principal de la pagina
   --------------------------------------------------------- */
console.log("\n=== 3. A donde ir (js/near.js) ===\n");
const near = datosDe("js/near.js", "FAM_NEAR");
if (near.error) {
  falta(false, "js/near.js se puede leer", near.error);
} else {
  const ciudades = Object.keys(near.valor || {});
  aviso(ciudades.length >= 3, "ciudades con congregacion",
    ciudades.length ? ciudades.length + ": " + ciudades.join(", ")
                    : "ninguna — el bloque solo da la hora del ocaso");
  if (ciudades.length && ciudades.length < 3) {
    console.log("\n  Con tres ya funciona. No hacen falta las veintidos.");
  }
  if (!ciudades.length) {
    console.log("\n  Es el bloque de debajo del hero, la accion principal del sitio.");
    console.log("  Mientras este vacio NO promete compania a nadie, que es lo correcto,");
    console.log("  pero tampoco lleva a ninguna iglesia. Al poner la primera ciudad el");
    console.log("  texto completo vuelve solo.");
  }
}

/* ---------------------------------------------------------
   4. Misiones
   --------------------------------------------------------- */
console.log("\n=== 4. Misiones (js/events.js) ===\n");
const ev = datosDe("js/events.js", "FAM_EVENTS");
if (ev.error) {
  falta(false, "js/events.js se puede leer", ev.error);
} else {
  const n = (ev.valor || []).length;
  aviso(n > 0, "eventos publicados",
    n ? n + " evento(s)" : "ninguno — la seccion #misiones no se muestra");
}

/* ---------------------------------------------------------
   5. El dominio
   --------------------------------------------------------- */
console.log("\n=== 5. El dominio ===\n");
const cname = leer("CNAME");
const viejo = (leer("index.html") || "").indexOf("droko1982.github.io") > -1;
if (cname) {
  falta(!viejo, "dominio propio",
    cname.trim() + (viejo ? "  PERO queda el dominio viejo en index.html" : "  sin rastro del anterior"));
} else {
  aviso(false, "todavia en GitHub Pages", "cuando compres el dominio: node tools/cambiar-dominio.js tudominio.org");
}

/* ---------------------------------------------------------
   Lo que hay que mirar con ojos, no con una prueba
   --------------------------------------------------------- */
console.log("\n=== Y esto no lo puede comprobar una maquina ===\n");
for (const l of [
  "Que el EIN, la direccion y el nombre legal sean los vigentes y quieran mostrarse.",
  "Que el WhatsApp +1 786 239 2331 lo atienda alguien y tenga WhatsApp activo.",
  "Que la promesa de responder en menos de 24 horas sea verdad.",
  "Que \"Quienes somos\" y los seis ministerios sean los suyos, no una descripcion generica.",
  "El logotipo: hoy es el emblema sacado del avatar de YouTube, sin el rotulo.",
]) console.log("  - " + l);

/* --------------------------------------------------------- */
const total = faltan + avisos;
console.log("");
if (faltan) {
  console.log("*** " + faltan + " cosa(s) rotas y " + avisos + " sin rellenar ***\n");
  process.exit(1);
}
if (avisos) {
  console.log("Nada roto. " + avisos + " cosa(s) por rellenar, todas con datos que\n" +
              "solo tiene la organizacion. El sitio funciona sin ellas: se esconde\n" +
              "lo que no puede cumplir en vez de enseñar un boton que no lleva a\n" +
              "ninguna parte.\n");
  process.exit(0);
}
console.log("Listo para publicar.\n");
