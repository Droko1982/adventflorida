#!/usr/bin/env node
/* =========================================================
   test-browser.js — abre la pagina en un Chrome de verdad y
   pulsa todo lo que se puede pulsar. Las otras suites leen
   archivos o montan un DOM de mentira: ninguna hace scroll,
   ni reproduce un video, ni sabe que behavior:"auto" no es
   instantaneo. Los dos fallos que reporto el usuario solo se
   veian aqui.
   Autor: Dr. Mauricio Rodriguez Herrera

   Necesita puppeteer-core y un Chrome instalado; ninguno de
   los dos es dependencia del sitio:
     npm install --no-save puppeteer-core
     node tools/test-browser.js
   ========================================================= */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

let puppeteer;
try { puppeteer = require("puppeteer-core"); }
catch (e) {
  console.error("Falta puppeteer-core:  npm install --no-save puppeteer-core");
  process.exit(2);
}

const CANDIDATOS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
const CHROME = CANDIDATOS.find((p) => fs.existsSync(p));
if (!CHROME) { console.error("No encuentro Chrome ni Edge."); process.exit(2); }

const ROOT = path.resolve(__dirname, "..");

/* ENVIVO se usaba en el filtro de la consola pero no se declaraba en ninguna
   parte. Como el archivo va en modo estricto, leerlo lanzaba un
   ReferenceError DENTRO del manejador de page.on("console"), asi que el
   error se perdia por el camino y no llegaba a contarse nunca: la
   comprobacion "sin errores de JavaScript" solo pillaba las excepciones no
   atrapadas, y ni un solo console.error en toda la suite. Comprobado
   inyectando uno a mano: cero capturados.

   Ya que estaba, la variable pasa a significar lo que decia querer decir:
   se puede apuntar la suite a una direccion de verdad y probar lo que hay
   desplegado, no solo el arbol de trabajo.

     node tools/test-browser.js
     node tools/test-browser.js https://droko1982.github.io/adventflorida/ */
const DESTINO = process.argv[2];
const URL = DESTINO || "file:///" + path.join(ROOT, "index.html").replace(/\\/g, "/");
const ENVIVO = /^https?:/i.test(URL);
const IDIOMAS = ["en", "es", "fr", "ht", "pt", "de", "nl", "ru", "uk"];

let fallos = 0;
function ok(cond, etiqueta, detalle) {
  if (!cond) fallos++;
  console.log("  " + (cond ? "ok   " : "FALLA") + " " + (etiqueta + " ".repeat(36)).slice(0, 36) + (detalle || ""));
}
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--allow-file-access-from-files", "--no-sandbox", "--disable-dev-shm-usage"],
  });

  async function abrir(vista) {
    const page = await browser.newPage();
    /* Sin esto, al probar por http la suite podia estar mirando una copia
       vieja del sitio guardada por Chrome de una vuelta anterior, y darla
       por buena. Costo un rato: un arreglo del index.html ya aplicado
       seguia fallando aqui porque el navegador servia el HTML de antes.
       Importa el doble cuando se apunta al sitio desplegado, que es
       precisamente cuando hay que estar seguro de que se mira lo nuevo. */
    await page.setCacheEnabled(false);
    await page.setViewport(vista);
    const errores = [];
    page.on("pageerror", (e) => errores.push(String(e).slice(0, 120)));
    page.on("console", (m) => {
      if (m.type() !== "error") return;
      const t = m.text();
      /* Un file:// sin red no puede traer las miniaturas de YouTube ni
         las fuentes de Google: eso no es un fallo de la pagina. */
      if (!ENVIVO && /ytimg|fonts\.g|ERR_(NAME|INTERNET|CONNECTION)|Failed to load resource/i.test(t)) return;
      if (ENVIVO && /youtube|ytimg|doubleclick|googleads/i.test(t)) return;
      errores.push("consola: " + t.slice(0, 120));
    });
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await esperar(900);
    return { page, errores };
  }

  /* La pagina va en cuatro partes y solo una esta en pantalla. Casi todo
     lo que se prueba aqui abajo vive en una parte que no es la primera,
     asi que antes hay que abrirla. Se pone el atributo a mano en vez de
     pulsar el menu para que un fallo del menu no se lleve por delante la
     prueba del formulario, que no tiene nada que ver: el menu se prueba
     por su cuenta en su propio apartado. */
  async function verParte(page, parte) {
    await page.evaluate((p) => {
      document.documentElement.setAttribute("data-parte", p);
      document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible"));
    }, parte);
    await esperar(250);
  }

  /* =======================================================
     1. Que no reviente al cargar, en los nueve idiomas
     ======================================================= */
  console.log("\n=== Carga limpia en los nueve idiomas ===\n");
  {
    const { page, errores } = await abrir({ width: 1280, height: 900 });
    for (const code of IDIOMAS) {
      errores.length = 0;
      await page.evaluate((c) => {
        const b = [...document.querySelectorAll("#langMenu button")]
          .find((x) => x.getAttribute("data-lang") === c);
        if (b) b.click();
      }, code);
      await esperar(450);
      const d = await page.evaluate(() => ({
        lang: document.documentElement.lang,
        titulo: document.title,
        /* Ninguna clave de traduccion puede quedar a la vista */
        crudas: (document.body.innerText.match(/\b[a-z]+\.[a-z]+\.[a-zA-Z0-9.]+\b/g) || [])
          .filter((x) => !/\.(com|org|net|gov|edu|co|io)\b/.test(x)).slice(0, 3),
      }));
      ok(d.lang === code && errores.length === 0 && d.crudas.length === 0, code,
        d.titulo.slice(0, 40) + (errores.length ? " · " + errores[0] : "") +
        (d.crudas.length ? " · CLAVES A LA VISTA: " + d.crudas.join(",") : ""));
    }
    await page.close();
  }

  /* =======================================================
     2. Cada cosa que se puede pulsar
     ======================================================= */
  console.log("\n=== Los mandos de la pagina ===\n");
  {
    const { page, errores } = await abrir({ width: 1280, height: 900 });

    /* Tema */
    const t0 = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    await page.click("#themeBtn"); await esperar(300);
    const t1 = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    ok(t0 !== t1, "el boton de tema cambia el tema", t0 + " -> " + t1);
    await page.click("#themeBtn"); await esperar(250);

    /* Selector de idioma */
    await page.click("#langBtn"); await esperar(250);
    const abierto = await page.evaluate(() =>
      document.querySelector("#langWrap").classList.contains("is-open"));
    ok(abierto, "el selector de idioma se abre");
    const nEnMenu = await page.evaluate(() => document.querySelectorAll("#langMenu button").length);
    ok(nEnMenu === 9, "con los nueve idiomas", nEnMenu + " botones");
    await page.keyboard.press("Escape"); await esperar(250);
    ok(!(await page.evaluate(() => document.querySelector("#langWrap").classList.contains("is-open"))),
      "y Escape lo cierra");

    /* Carrusel de versiculos */
    const v0 = await page.evaluate(() => document.querySelector("#verseText").textContent);
    await page.evaluate(() => document.querySelectorAll("#verseDots button")[2].click());
    await esperar(300);
    const v1 = await page.evaluate(() => document.querySelector("#verseText").textContent);
    ok(v0 !== v1, "los puntos cambian de versiculo", v1.slice(0, 42) + "...");
    const etiqueta = await page.evaluate(() =>
      document.querySelector("#verseDots button").getAttribute("aria-label"));
    ok(!!etiqueta && !/^a11y\./.test(etiqueta), "y llevan etiqueta traducida", etiqueta);

    /* Reloj del sabado */
    const s0 = await page.evaluate(() => document.querySelector("#sabStartTime").textContent);
    await page.select("#sabCity", "pensacola"); await esperar(400);
    const s1 = await page.evaluate(() => document.querySelector("#sabStartTime").textContent);
    ok(/\d/.test(s0) && /\d/.test(s1) && s0 !== s1, "el reloj del sabado responde",
      "Delray " + s0 + " · Pensacola " + s1);

    /* A donde ir */
    await page.select("#nearCity", "miami");
    await page.evaluate(() => document.querySelector("#nearCity")
      .dispatchEvent(new Event("change", { bubbles: true })));
    await esperar(450);
    const near = await page.evaluate(() => (document.querySelector("#nearOut").innerText || "").trim());
    ok(near.length > 40 && !/undefined|NaN|\[object/.test(near), "el buscador de ciudad contesta",
      near.replace(/\s+/g, " ").slice(0, 54) + "...");
    const cta = await page.evaluate(() => document.querySelector("#nearCta").getAttribute("href"));
    ok(/wa\.me\/\d/.test(cta), "y su boton lleva a un WhatsApp real", cta.slice(0, 46) + "...");

    /* Acordeones */
    const accs = await page.$$("details");
    if (accs.length) {
      await page.evaluate(() => { document.querySelector("details").open = true; });
      await esperar(200);
      const texto = await page.evaluate(() => document.querySelector("details").innerText.length);
      ok(texto > 60, "los acordeones abren con contenido", accs.length + " en la pagina");
    }

    /* Formularios: validar sin enviar nada a la red */
    await verParte(page, "contacto");
    await page.evaluate(() => { window.fetch = () => new Promise(() => {}); });
    await page.evaluate(() => { document.querySelector("#cMsg").value = ""; });
    await page.click("#cSend"); await esperar(300);
    const cErr = await page.evaluate(() => ({
      clase: document.querySelector("#cStatus").className,
      texto: document.querySelector("#cStatus").textContent.trim(),
    }));
    ok(/is-err/.test(cErr.clase) && cErr.texto.length > 10, "contacto: mensaje vacio se avisa",
      cErr.texto.slice(0, 44) + "...");

    ok(errores.length === 0, "sin errores de JavaScript", errores.join(" | "));
    await page.close();
  }

  /* =======================================================
     3. El reproductor de testimonios
     ======================================================= */
  console.log("\n=== Los testimonios ===\n");
  {
    const { page, errores } = await abrir({ width: 1280, height: 900 });
    await page.click("#stGrid .st-card .st-thumb"); await esperar(600);
    const p1 = await page.evaluate(() => {
      const c = document.querySelector("#stGrid .st-card.is-playing");
      return {
        suena: !!c, iframe: !!(c && c.querySelector("iframe")),
        oculto: !!(c && c.querySelector(".st-thumb") && c.querySelector(".st-thumb").hidden),
        mandos: [...(c ? c.querySelectorAll(".st-ctrl") : [])].map((x) => Math.round(x.getBoundingClientRect().width)),
        etiquetas: [...(c ? c.querySelectorAll(".st-ctrl") : [])].map((x) => x.getAttribute("aria-label")),
      };
    });
    ok(p1.suena && p1.iframe, "al pulsar, el video arranca");
    ok(p1.oculto, "la miniatura se esconde, no se destruye", "asi se puede volver a ella");
    ok(p1.mandos.length === 3, "trae tres mandos", "anterior, siguiente y cerrar");
    ok(p1.mandos.every((w) => w >= 24), "de tamano pulsable (WCAG 2.5.8)", p1.mandos.join("/") + "px");
    ok(p1.etiquetas.every((e) => e && !/^st\./.test(e)), "con etiquetas traducidas", p1.etiquetas.join(" · "));

    await page.click("#stGrid .st-card.is-playing .st-next"); await esperar(500);
    const p2 = await page.evaluate(() => ({
      cuantos: document.querySelectorAll("#stGrid .st-card.is-playing").length,
      indice: [...document.querySelectorAll("#stGrid .st-card")]
        .indexOf(document.querySelector("#stGrid .st-card.is-playing")),
    }));
    ok(p2.indice === 1, "pasar lleva al siguiente", "tarjeta " + p2.indice);
    ok(p2.cuantos === 1, "y solo suena uno a la vez", p2.cuantos + " sonando");

    await page.click("#stGrid .st-card.is-playing .st-close"); await esperar(400);
    const p3 = await page.evaluate(() => ({
      sonando: document.querySelectorAll("#stGrid .st-card.is-playing").length,
      iframes: document.querySelectorAll("#stGrid iframe").length,
      foco: document.activeElement.className,
    }));
    ok(p3.sonando === 0 && p3.iframes === 0, "cerrar quita el video del todo");
    ok(/st-thumb/.test(p3.foco), "y devuelve el foco a la miniatura", p3.foco);

    await page.click("#stGrid .st-card .st-thumb"); await esperar(400);
    await page.keyboard.press("Escape"); await esperar(300);
    ok((await page.evaluate(() => document.querySelectorAll("#stGrid .st-card.is-playing").length)) === 0,
      "Escape tambien cierra");

    ok(errores.length === 0, "sin errores de JavaScript", errores.join(" | "));
    await page.close();
  }

  /* =======================================================
     3 bis. Las cuatro partes
     ======================================================= */
  console.log("\n=== La pagina en cuatro partes ===\n");
  {
    const { page, errores } = await abrir({ width: 1280, height: 900 });

    const partes = await page.evaluate(() =>
      [...document.querySelectorAll(".part")].map((p) => p.id.replace("parte-", "")));
    ok(partes.length >= 3 && partes.length <= 4, "la pagina va en 3 o 4 partes", partes.join(", "));

    const alCargar = await page.evaluate(() => ({
      abierta: document.documentElement.getAttribute("data-parte"),
      aLaVista: [...document.querySelectorAll(".part")]
        .filter((p) => getComputedStyle(p).display !== "none").map((p) => p.id),
    }));
    ok(alCargar.abierta === partes[0], "al entrar se abre la primera", alCargar.abierta);
    ok(alCargar.aLaVista.length === 1, "y solo se ve una a la vez", alCargar.aLaVista.join(", "));

    /* El emblema devuelve al principio del todo. Estuvo un tiempo llevando
       a la seccion "Quienes somos", y quien reviso el sitio se quejo de que
       le bajaba: un emblema es el boton de volver a casa, y la casa es
       arriba. */
    await page.evaluate(() => {
      document.documentElement.setAttribute("data-parte", "contacto");
      window.scrollTo(0, 2000);
    });
    await esperar(200);
    await page.click(".site-header .brand"); await esperar(600);
    const trasLogo = await page.evaluate(() => ({
      abierta: document.documentElement.getAttribute("data-parte"),
      top: Math.round(document.querySelector("#inicio").getBoundingClientRect().top),
      y: Math.round(window.pageYOffset),
      hash: location.hash,
    }));
    ok(trasLogo.abierta === "quienes", "el emblema devuelve a la primera parte", trasLogo.abierta);
    ok(trasLogo.y <= 120, "y sube al principio, no a media pagina", "scroll " + trasLogo.y + "px");
    ok(trasLogo.hash === "#inicio", "dejando la direccion compartible", trasLogo.hash);

    /* Una direccion con ancla tiene que abrir SU parte, no la primera:
       es la mitad de los enlaces que circulan por WhatsApp. */
    for (const [ancla, parte] of [["#sabado", "fe"], ["#libro", "recursos"], ["#donar", "contacto"]]) {
      const p2 = await browser.newPage();
      await p2.setCacheEnabled(false);
      await p2.setViewport({ width: 1280, height: 900 });
      await p2.goto(URL + ancla, { waitUntil: "domcontentloaded" });
      await esperar(900);
      const d = await p2.evaluate((a) => ({
        abierta: document.documentElement.getAttribute("data-parte"),
        seVe: document.querySelector(a).getBoundingClientRect().height > 0,
        top: Math.round(document.querySelector(a).getBoundingClientRect().top),
      }), ancla);
      ok(d.abierta === parte && d.seVe && Math.abs(d.top - 92) <= 14,
        "entrar por " + ancla + " abre su parte",
        d.abierta + " · a " + d.top + "px");
      await p2.close();
    }

    /* Cada salto deja un estado en el historial: atras tiene que
       devolver la parte, no solo la direccion. */
    await page.click('.main-nav a[data-parte="fe"]'); await esperar(500);
    const enFe = await page.evaluate(() => document.documentElement.getAttribute("data-parte"));
    await page.goBack(); await esperar(600);
    const atras = await page.evaluate(() => document.documentElement.getAttribute("data-parte"));
    ok(enFe === "fe" && atras === "quienes", "el boton de atras devuelve la parte",
      enFe + " -> atras -> " + atras);

    /* Ninguna seccion puede quedar sin puerta: si a una parte no se
       llega desde el menu, su contenido deja de existir para todos. */
    const huerfanas = await page.evaluate(() => {
      const enMenu = new Set([...document.querySelectorAll("#mobileNav a[href^='#'], .main-nav a[href^='#']")]
        .map((a) => a.getAttribute("href").slice(1)));
      return [...document.querySelectorAll(".part section")]
        .filter((s) => !s.hidden && !enMenu.has(s.id) && s.id !== "inicio")
        .map((s) => s.id);
    });
    ok(huerfanas.length === 0, "toda seccion tiene su enlace en el menu",
      huerfanas.length ? "sin enlace: " + huerfanas.join(", ") : "ninguna huerfana");

    ok(errores.length === 0, "sin errores de JavaScript", errores.join(" | "));
    await page.close();
  }

  /* =======================================================
     3 ter. Si js/main.js no llega
     =======================================================
     El script de la cabecera esconde tres cuartas partes del sitio. Si lo
     unico capaz de volver a ensenarlas fuera main.js —que es el ultimo
     archivo del cuerpo— bastaria con que no cargara, o con que la persona
     pulsara antes de que termine, para que diez secciones dejaran de
     existir. Medido a 400 kbps: el hero se puede pulsar a los 7,5 s y
     main.js no acaba hasta los 10,5.

     Por eso el reparto tiene que funcionar con SOLO el script de la
     cabecera. Esto es lo que lo vigila; si alguien quita el hashchange de
     ahi, esta prueba se cae. */
  console.log("\n=== Sin js/main.js la pagina sigue siendo navegable ===\n");
  {
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setRequestInterception(true);
    page.on("request", (r) => (/\/js\/main\.js(\?|$)/.test(r.url()) ? r.abort() : r.continue()));
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await esperar(1200);

    const aLaVista = () => {
      const secs = [...document.querySelectorAll("section")];
      return secs.filter((x) => x.getBoundingClientRect().height > 0).map((x) => x.id);
    };
    const alcanzadas = new Set(await page.evaluate(aLaVista));
    const partes = await page.evaluate(() =>
      [...document.querySelectorAll(".main-nav a[data-parte]")].map((a) => a.getAttribute("data-parte")));

    for (const parte of partes) {
      await page.evaluate((k) => document.querySelector('.main-nav a[data-parte="' + k + '"]').click(), parte);
      await esperar(600);
      (await page.evaluate(aLaVista)).forEach((x) => alcanzadas.add(x));
    }
    const totales = await page.evaluate(() =>
      [...document.querySelectorAll("section")].filter((x) => !x.hidden).length);
    ok(alcanzadas.size >= totales, "las cuatro partes se abren sin main.js",
      alcanzadas.size + " de " + totales + " secciones alcanzables");

    /* Y el boton del hero, que apunta a otra parte, tiene que llevar */
    await page.evaluate(() => document.querySelector('.hero-actions a[href="#estudios"]').click());
    await esperar(700);
    const est = await page.evaluate(() => {
      const r = document.querySelector("#estudios").getBoundingClientRect();
      return { alto: Math.round(r.height), top: Math.round(r.top),
               parte: document.documentElement.getAttribute("data-parte") };
    });
    ok(est.alto > 0 && Math.abs(est.top - 92) <= 14,
      "el boton del hero lleva de verdad sin main.js",
      "parte " + est.parte + ", #estudios a " + est.top + "px");
    await page.close();
  }

  /* =======================================================
     4. Navegar a una seccion
     ======================================================= */
  console.log("\n=== Ir a una seccion desde el menu ===\n");
  for (const vista of [{ n: "escritorio", width: 1280, height: 900 },
                       { n: "movil", width: 390, height: 844, isMobile: true, hasTouch: true }]) {
    const { page } = await abrir(vista);
    const movil = vista.width < 900;
    if (movil) { await page.click("#menuBtn"); await esperar(450); }
    const enlaces = await page.evaluate((m) =>
      [...document.querySelectorAll((m ? "#mobileNav" : ".main-nav") + " a[href^='#']")]
        .filter((a) => { const li = a.closest("li"); return !(li && li.hidden); })
        .map((a) => a.getAttribute("href")), movil);

    let mal = [];
    for (const href of enlaces) {
      await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, window.pageYOffset);
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = "";
      });
      await esperar(200);
      if (movil) {
        await page.evaluate(() => {
          const n = document.querySelector("#mobileNav");
          if (!n.classList.contains("is-open")) document.querySelector("#menuBtn").click();
        });
        await esperar(400);
      }
      await page.click((movil ? "#mobileNav" : ".main-nav") + " a[href='" + href + "']");
      await esperar(350);        /* si tarda mas que esto, es demasiado */
      const top = await page.evaluate((h) =>
        Math.round(document.querySelector(h).getBoundingClientRect().top), href);
      if (Math.abs(top - 92) > 12) mal.push(href + " (" + top + "px)");
    }
    ok(mal.length === 0, vista.n + ": el menu lleva a la seccion",
      mal.length ? "no llega: " + mal.join(", ") : enlaces.length + " enlaces, todos en 350 ms");
    await page.close();
  }

  /* =======================================================
     5. Nada que se salga de la pantalla
     ======================================================= */
  console.log("\n=== Sin desbordar, de 320 px a 1440 ===\n");
  for (const w of [320, 360, 390, 768, 1024, 1440]) {
    const { page } = await abrir({ width: w, height: 800 });
    await page.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible")));
    await esperar(300);
    /* Sin esto solo se medía la primera parte: lo que esta en
       display:none mide cero y pasaba por bueno sin haberse mirado. */
    const partes = await page.evaluate(() =>
      [...document.querySelectorAll(".part")].map((p) => p.id.replace("parte-", "")));
    const culpablesDeTodas = [];
    let anchoMax = 0;
    for (const parte of partes) {
      await verParte(page, parte);
      const dp = await page.evaluate((ancho) => {
      const culpables = [];
      document.querySelectorAll("body *").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        if (r.right > ancho + 1 || r.left < -1) {
          const cs = getComputedStyle(el);
          if (cs.position === "fixed" || cs.visibility === "hidden" || cs.display === "none") return;
          if (el.closest(".mobile-nav") || el.closest(".hp")) return;
          if (el.closest(".skip-link") || el.closest(".sr-only")) return;
          culpables.push((el.id ? "#" + el.id : el.className || el.tagName).toString().slice(0, 26));
        }
      });
      return { ancho: document.documentElement.scrollWidth, culpables: [...new Set(culpables)].slice(0, 4) };
      }, w);
      anchoMax = Math.max(anchoMax, dp.ancho);
      dp.culpables.forEach((c) => culpablesDeTodas.push(parte + ":" + c));
    }
    const d = { ancho: anchoMax, culpables: [...new Set(culpablesDeTodas)].slice(0, 4) };
    ok(d.ancho <= w && d.culpables.length === 0, w + " px",
      d.culpables.length ? "se salen: " + d.culpables.join(", ")
                         : "documento " + d.ancho + " px, las " + partes.length + " partes");
    await page.close();
  }

  /* =======================================================
     6. Enlaces rotos o que no llevan a ninguna parte
     ======================================================= */
  console.log("\n=== Enlaces ===\n");
  {
    const { page } = await abrir({ width: 1280, height: 900 });
    const d = await page.evaluate(() => {
      const a = [...document.querySelectorAll("a[href]")];
      const seVe = (x) => { const r = x.getBoundingClientRect();
        return getComputedStyle(x).display !== "none" && (r.width > 0 || x.offsetParent !== null); };
      const vacios = a.filter(seVe)
        .filter((x) => x.getAttribute("href") === "#" || !x.getAttribute("href").trim());
      const rotos = a.filter((x) => {
        const h = x.getAttribute("href");
        return h.startsWith("#") && h.length > 1 && !document.getElementById(h.slice(1));
      });
      const nuevaPestana = a.filter((x) => x.target === "_blank");
      const sinRel = nuevaPestana.filter((x) => !/noopener/.test(x.rel || ""));
      const mudos = a.filter((x) => !x.textContent.trim() && !x.getAttribute("aria-label") && !x.querySelector("img[alt]:not([alt=''])"));
      return {
        total: a.length,
        vacios: vacios.map((x) => x.className || x.textContent.trim().slice(0, 18)).slice(0, 4),
        rotos: rotos.map((x) => x.getAttribute("href")).slice(0, 4),
        sinRel: sinRel.map((x) => x.href.slice(0, 34)).slice(0, 4),
        mudos: mudos.map((x) => x.getAttribute("href").slice(0, 30)).slice(0, 4),
        externos: [...new Set(a.filter((x) => /^https?:/.test(x.getAttribute("href")))
          .map((x) => new URL(x.href).hostname))],
      };
    });
    ok(d.vacios.length === 0, 'sin enlaces href="#"', d.vacios.join(", ") || d.total + " enlaces");
    ok(d.rotos.length === 0, "sin anclas que no existen", d.rotos.join(", ") || "todas resuelven");
    ok(d.sinRel.length === 0, "target=_blank siempre con noopener", d.sinRel.join(", ") || "correcto");
    ok(d.mudos.length === 0, "ningun enlace sin nombre accesible", d.mudos.join(", ") || "todos nombrados");
    console.log("       dominios externos: " + d.externos.join(", "));
    await page.close();
  }

  await browser.close();
  console.log(fallos === 0 ? "\nTodo responde en un navegador de verdad.\n"
                           : "\n*** " + fallos + " problema(s) ***\n");
  process.exit(fallos === 0 ? 0 : 1);
})();
