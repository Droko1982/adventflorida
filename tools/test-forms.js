#!/usr/bin/env node
/* =========================================================
   test-forms.js — prueba los dos formularios (oracion y
   contacto) en sus dos modos: sin correo configurado, que
   entregan por WhatsApp, y con correo, que envian desde la
   propia pagina sin que el visitante salga de ella.
   Tambien comprueba lo que se esconde solo cuando no hay
   datos detras: misiones vacia y la entradilla de "cerca".
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
const HTML = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const MAIN = fs.readFileSync(path.join(ROOT, "js", "main.js"), "utf8");

let fallos = 0;
function comprobar(cond, etiqueta, detalle) {
  if (!cond) fallos++;
  console.log("  " + (cond ? "ok   " : "FALLA") + " " + (etiqueta + " ".repeat(34)).slice(0, 34) + (detalle || ""));
}

/* Monta la pagina entera con el CONTACT que se le pida, sea cual sea
   el que este puesto de verdad en main.js: asi la prueba vale igual
   antes y despues de configurarlo. correo="" fuerza el modo WhatsApp.
   respuesta: lo que debe contestar el servidor simulado. */
const BLOQUE_CONTACT = /var CONTACT = \{[\s\S]*?\};/;

function montar(correo, respuesta, token) {
  const errores = [];
  const enviados = [];
  const abiertos = [];

  const dom = new JSDOM(HTML, {
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
  window.open = (url) => { abiertos.push(String(url)); return null; };
  /* El servidor simulado imita a FormSubmit de verdad, que contesta
     200 con {"success":"false"} cuando rechaza el envio. */
  const CUERPOS = {
    true:  '{"success":"true"}',
    sinActivar: '{"success":"false","message":"This form needs Activation. We\'ve sent you an email..."}',
    vacio: "",
  };
  window.fetch = (url, opciones) => {
    enviados.push({ url: String(url), opciones });
    if (respuesta === "red") return Promise.reject(new Error("sin red"));
    if (respuesta === false) return Promise.resolve({ ok: false, status: 400, text: () => Promise.resolve("") });
    const txt = CUERPOS[respuesta] !== undefined ? CUERPOS[respuesta] : CUERPOS.true;
    return Promise.resolve({ ok: true, status: 200, text: () => Promise.resolve(txt) });
  };

  if (!BLOQUE_CONTACT.test(MAIN)) errores.push("no se encontro el bloque CONTACT en main.js");
  const codigo = MAIN.replace(BLOQUE_CONTACT,
    "var CONTACT = { email: " + JSON.stringify(correo) +
    ", token: " + JSON.stringify(token || "") + " };");

  const langs = fs.readdirSync(path.join(ROOT, "js", "lang")).map((f) => "js/lang/" + f);
  for (const f of [...langs, "js/i18n.js", "js/sabbath.js", "js/videos.js", "js/near.js", "js/events.js"]) {
    try { window.eval(fs.readFileSync(path.join(ROOT, f), "utf8")); }
    catch (e) { errores.push(f + ": " + e.message); }
  }
  try { window.eval(codigo); } catch (e) { errores.push("js/main.js: " + e.message); }
  window.document.dispatchEvent(new window.Event("DOMContentLoaded"));

  const sel = (s) => window.document.querySelector(s);
  const enviar = (form) => sel(form).dispatchEvent(
    new window.Event("submit", { bubbles: true, cancelable: true })
  );
  const escribir = (campos) => Object.keys(campos).forEach((k) => { sel(k).value = campos[k]; });
  /* La promesa del envio se resuelve en microtareas; un turno del bucle
     de eventos basta para que el .then haya corrido. */
  const esperar = () => new Promise((r) => setTimeout(r, 20));

  return { window, sel, enviar, escribir, esperar, errores, enviados, abiertos };
}

const cuerpo = (e) => JSON.parse(e.opciones.body);

/* =========================================================
   1. Sin correo configurado: nada roto, todo por WhatsApp
   ========================================================= */
console.log("\n=== Sin correo: el modo WhatsApp de siempre ===\n");
{
  const p = montar("", true);
  comprobar(p.errores.length === 0, "carga sin errores", p.errores.join(" · "));
  comprobar(!!p.sel("#contactForm"), "el formulario de contacto existe");
  comprobar(p.sel("#pAlt").hidden, "sin enlace alterno de WhatsApp", "sobra: el boton ya es de WhatsApp");
  comprobar(p.sel("#pSend").classList.contains("btn-wa"), "el boton de oracion es de WhatsApp");
  comprobar(/WhatsApp/i.test(p.sel("#pPrivacy").textContent), "el aviso dice que abre WhatsApp");
  comprobar(/WhatsApp/i.test(p.sel("#cPrivacy").textContent), "y el de contacto tambien");

  p.escribir({ "#pMsg": "Oren por mi madre" });
  p.enviar("#prayerForm");
  comprobar(p.abiertos.length === 1 && /wa\.me\/17862392331/.test(p.abiertos[0]),
    "oracion abre wa.me", p.abiertos[0] ? p.abiertos[0].slice(0, 46) + "..." : "no abrio nada");
  comprobar(/Oren%20por%20mi%20madre/.test(p.abiertos[0] || ""), "con el texto dentro");
  comprobar(p.enviados.length === 0, "no se envia nada a ningun servidor");

  p.escribir({ "#cMsg": "Quiero un estudio biblico" });
  p.enviar("#contactForm");
  comprobar(p.abiertos.length === 2 && /wa\.me/.test(p.abiertos[1]), "contacto abre wa.me");
  comprobar(p.enviados.length === 0, "tampoco aqui sale nada a la red");

  /* Sin correo no se exige un modo de respuesta: WhatsApp ya lo es */
  comprobar(p.sel("#cStatus").textContent === "", "sin exigir correo ni telefono", "el propio WhatsApp responde");
}

/* =========================================================
   2. Con correo: el mensaje sale desde la pagina
   ========================================================= */
console.log("\n=== Con correo: contacto en linea ===\n");
{
  const p = montar("hola@ejemplo.org", true);
  comprobar(p.errores.length === 0, "carga sin errores", p.errores.join(" · "));
  comprobar(!p.sel("#pAlt").hidden, "aparece el enlace a WhatsApp", "para quien lo prefiera");
  comprobar(p.sel("#pSend").classList.contains("btn-primary"), "el boton de oracion deja de ser de WhatsApp");
  comprobar(!/WhatsApp/i.test(p.sel("#pPrivacy").textContent), "el aviso ya no menciona WhatsApp",
    p.sel("#pPrivacy").textContent.slice(0, 40) + "...");

  p.escribir({ "#pName": "Maria", "#pCity": "Orlando", "#pMsg": "Oren por mi madre" });
  p.enviar("#prayerForm");
  comprobar(p.enviados.length === 1, "sale una peticion");
  comprobar(/formsubmit\.co\/ajax\/hola%40ejemplo\.org$/.test(p.enviados[0].url),
    "al endpoint correcto", p.enviados[0].url);
  comprobar(p.enviados[0].opciones.method === "POST", "por POST");
  comprobar(p.abiertos.length === 0, "sin abrir WhatsApp ni salir de la pagina");

  const b = cuerpo(p.enviados[0]);
  comprobar(b._captcha === "false" && !!b._subject, "asunto y sin captcha", b._subject);
  comprobar(JSON.stringify(b).indexOf("Oren por mi madre") > -1, "el mensaje viaja entero");
  comprobar(b.Language === "en", "se manda en que idioma escribio", b.Language);
  comprobar(b._honey === undefined, "la trampa no viaja vacia");
  /* Los rotulos que lee el ministerio van en ingles fijo. Traducirlos
     mandaba claves en cirilico a FormSubmit y dejaba el buzon ilegible
     para quien no lea ese idioma. */
  const ascii = Object.keys(b).every((k) => !/[^\x20-\x7E]/.test(k));
  comprobar(ascii, "las claves del correo van en ASCII", Object.keys(b).join(", "));
  comprobar(b.Request === "Oren por mi madre", "el contenido si va en su idioma");
}

/* =========================================================
   3. Respuestas: exito, fallo del servidor y caida de red
   ========================================================= */
console.log("\n=== Que ve el visitante despues de enviar ===\n");

(async function () {
  {
    const p = montar("hola@ejemplo.org", true);
    p.escribir({ "#cReply": "maria@correo.com", "#cMsg": "Quiero el libro" });
    p.enviar("#contactForm");
    comprobar(p.sel("#cSend").disabled, "el boton se bloquea al enviar", "no se envia dos veces");
    await p.esperar();
    comprobar(p.sel("#cStatus").classList.contains("is-ok"),
      "avisa de que llego", p.sel("#cStatus").textContent.slice(0, 44) + "...");
    comprobar(p.sel("#cMsg").value === "", "el formulario se limpia");
    comprobar(p.sel("#cStatus").getAttribute("aria-live") === "polite",
      "el lector de pantalla lo anuncia", 'role="status" aria-live="polite"');
    /* El texto se escribe DESPUES de quitar hidden. Un aria-live que nace
       con contenido dentro no se anuncia: hay que darle una mutacion. */
    comprobar(p.sel("#cStatus").textContent.length > 20, "y el aviso tiene texto de verdad");

    /* Con el formulario ya vacio, volver a pulsar mandaria un mensaje en
       blanco y el "ya llego" se convertiria en un error. */
    comprobar(p.sel("#cSend").disabled, "sigue bloqueado tras el exito",
      "reenviar en vacio convertiria el aviso en un error");
    p.sel("#cMsg").value = "otra cosa";
    p.sel("#cMsg").dispatchEvent(new p.window.Event("input", { bubbles: true }));
    comprobar(!p.sel("#cSend").disabled, "y se suelta en cuanto vuelve a escribir");
  }
  {
    const p = montar("hola@ejemplo.org", false);      /* el servidor rechaza */
    p.escribir({ "#cReply": "maria@correo.com", "#cMsg": "Quiero el libro" });
    p.enviar("#contactForm");
    await p.esperar();
    comprobar(p.sel("#cStatus").classList.contains("is-err"), "si falla, lo dice");
    comprobar(/WhatsApp/i.test(p.sel("#cStatus").textContent), "y ofrece WhatsApp como salida");
    comprobar(p.sel("#cMsg").value === "Quiero el libro", "sin borrar lo que ya escribio");
  }
  {
    const p = montar("hola@ejemplo.org", "red");      /* se cae la conexion */
    p.escribir({ "#cReply": "maria@correo.com", "#cMsg": "Quiero el libro" });
    p.enviar("#contactForm");
    await p.esperar();
    comprobar(p.sel("#cStatus").classList.contains("is-err"), "sin conexion tampoco se queda colgado");
    comprobar(!p.sel("#cSend").disabled, "el boton vuelve a funcionar");
  }
  {
    /* FormSubmit contesta 200 con success:false mientras el formulario
       no esta activado. Decir "enviado" ahi seria mentir. */
    const p = montar("hola@ejemplo.org", "sinActivar");
    p.escribir({ "#cReply": "maria@correo.com", "#cMsg": "Quiero el libro" });
    p.enviar("#contactForm");
    await p.esperar();
    comprobar(p.sel("#cStatus").classList.contains("is-err"),
      "200 con success:false NO es enviado", "el fallo mas facil de tragarse");
    comprobar(p.sel("#cMsg").value === "Quiero el libro", "y no le borra el mensaje");
  }
  {
    /* Si el cuerpo no dice nada, el 200 vale: no inventamos un fallo */
    const p = montar("hola@ejemplo.org", "vacio");
    p.escribir({ "#cReply": "maria@correo.com", "#cMsg": "Quiero el libro" });
    p.enviar("#contactForm");
    await p.esperar();
    comprobar(p.sel("#cStatus").classList.contains("is-ok"), "200 sin cuerpo si cuenta como enviado");
  }

  /* =========================================================
     4. Lo que no se debe poder enviar
     ========================================================= */
  console.log("\n=== Validacion y robots ===\n");
  {
    const p = montar("hola@ejemplo.org", true);
    p.enviar("#contactForm");
    comprobar(p.enviados.length === 0 && p.sel("#cStatus").classList.contains("is-err"),
      "mensaje vacio no sale", p.sel("#cStatus").textContent.slice(0, 40) + "...");

    p.escribir({ "#cMsg": "Hola" });
    p.enviar("#contactForm");
    comprobar(p.enviados.length === 0, "sin correo ni telefono tampoco",
      p.sel("#cStatus").textContent.slice(0, 40) + "...");

    p.escribir({ "#cReply": "maria@correo.com", "#cHoney": "soy un robot" });
    p.enviar("#contactForm");
    comprobar(p.enviados.length === 0, "la trampa detiene al robot");

    p.escribir({ "#cHoney": "" });
    p.enviar("#contactForm");
    comprobar(p.enviados.length === 1, "y la persona si pasa");
  }

  /* La oracion no exige contacto: el anonimato es parte de la promesa */
  {
    const p = montar("hola@ejemplo.org", true);
    p.escribir({ "#pMsg": "Estoy pasando por algo dificil" });
    p.enviar("#prayerForm");
    comprobar(p.enviados.length === 1, "se puede pedir oracion en anonimo",
      "sin nombre, sin ciudad, sin correo");
  }

  /* =========================================================
     5. Nada que prometa lo que no tiene
     ========================================================= */
  console.log("\n=== Secciones sin datos detras ===\n");
  {
    const p = montar("", true);
    const hayEventos = p.window.FAM_EVENTS && p.window.FAM_EVENTS.length > 0;
    const mis = p.sel("#misiones");
    comprobar(mis.hidden === !hayEventos, "misiones se esconde si esta vacia",
      hayEventos ? "hay eventos: se ve" : "sin eventos: oculta");
    const enlaces = [...p.window.document.querySelectorAll('a[href="#misiones"]')];
    comprobar(enlaces.length > 0 && enlaces.every((a) => (a.closest("li") || a).hidden === !hayEventos),
      "y con ella sus enlaces del menu", enlaces.length + " enlaces");

    const hayCiudades = Object.keys(p.window.FAM_NEAR || {}).length > 0;
    const lead = p.sel("#cerca .section-lead").textContent;
    comprobar(lead.length > 0, "la entradilla de cerca no queda vacia");
    comprobar(hayCiudades || !/name of (the )?(person|someone)/i.test(lead),
      "sin ciudades no promete un nombre", hayCiudades ? "hay ciudades" : "promete solo la hora del ocaso");
  }

  /* =========================================================
     6. Los nueve idiomas traducen los dos formularios
     ========================================================= */
  console.log("\n=== Los formularios en los nueve idiomas ===\n");
  {
    const p = montar("hola@ejemplo.org", true);
    for (const code of ["en", "es", "fr", "ht", "pt", "de", "nl", "ru", "uk"]) {
      const boton = [...p.window.document.querySelectorAll("#langMenu button")]
        .find((b) => b.getAttribute("data-lang") === code);
      boton.dispatchEvent(new p.window.Event("click"));
      const envia = p.sel("#cSend span").textContent.trim();
      const priv  = p.sel("#cPrivacy").textContent.trim();
      const etiq  = p.sel('label[for="cReply"]').textContent.trim();
      const crudo = [envia, priv, etiq].some((s) => /^(contact|form|prayer)\./.test(s) || !s);
      comprobar(!crudo, code, envia + " · " + etiq.slice(0, 32));
    }
  }

  /* =========================================================
     7. El token oculta la direccion del codigo publico
     ========================================================= */
  console.log("\n=== Con token de FormSubmit ===\n");
  {
    const p = montar("fladventmissionaries@gmail.com", true, "abc123token");
    p.escribir({ "#cReply": "maria@correo.com", "#cMsg": "Quiero el libro" });
    p.enviar("#contactForm");
    comprobar(p.enviados.length === 1 && /\/ajax\/abc123token$/.test(p.enviados[0].url),
      "el token manda sobre el correo", p.enviados[0].url);
    comprobar(p.enviados[0].url.indexOf("gmail") === -1,
      "la direccion no viaja en la URL", "es lo que la esconde de los robots");
  }

  /* =========================================================
     8. Lo que hay puesto de verdad en main.js ahora mismo
     ========================================================= */
  console.log("\n=== Configuracion real del sitio ===\n");
  {
    const bloque = (MAIN.match(BLOQUE_CONTACT) || [""])[0];
    const correo = (bloque.match(/email:\s*"([^"]*)"/) || [, ""])[1];
    const token  = (bloque.match(/token:\s*"([^"]*)"/) || [, ""])[1];
    const destino = token || correo;

    comprobar(!!destino, "hay un destino configurado", destino || "vacio: entrega por WhatsApp");
    if (correo) {
      comprobar(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo), "el correo tiene forma valida", correo);
      comprobar(correo.indexOf("ejemplo") === -1 && correo.indexOf("example") === -1,
        "no es un correo de muestra");
    }

    /* Con destino puesto, la pagina cargada tal cual debe estar en linea */
    const p = montar(correo, true, token);
    comprobar(p.errores.length === 0, "carga sin errores", p.errores.join(" · "));
    if (destino) {
      comprobar(!p.sel("#pAlt").hidden, "el enlace alterno de WhatsApp se ve");
      comprobar(!/WhatsApp/i.test(p.sel("#cPrivacy").textContent),
        "el aviso ya dice que llega directo", p.sel("#cPrivacy").textContent.slice(0, 40) + "...");
      p.escribir({ "#cReply": "maria@correo.com", "#cMsg": "Prueba" });
      p.enviar("#contactForm");
      comprobar(p.enviados.length === 1 && p.abiertos.length === 0,
        "el visitante no sale de la pagina", p.enviados[0].url);
    }
  }

  console.log(fallos === 0 ? "\nLos dos formularios responden bien en los dos modos.\n"
                           : "\n*** " + fallos + " problema(s) ***\n");
  process.exit(fallos === 0 ? 0 : 1);
})();
