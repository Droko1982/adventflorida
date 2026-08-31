/* =========================================================
   Florida Advent Missionaries · Interacciones
   Tema claro/oscuro · 9 idiomas · WhatsApp · versiculos · testimonios
   Autor: Dr. Mauricio Rodriguez Herrera
   ========================================================= */
(function () {
  "use strict";

  var WA_NUMBER  = "17862392331";           /* +1 786 239 2331 */

  /* ---------------------------------------------------------
     DONACIONES — unico sitio que hay que tocar.
     Rellena un valor y su boton aparece solo. Mientras esten
     vacios, la pagina solo ofrece WhatsApp y cheque por correo,
     asi que nunca se muestra un boton que no lleva a ninguna parte.

       online : enlace de PayPal, Givelify, Tithe.ly o Stripe.
                Ej. "https://www.paypal.com/donate?hosted_button_id=XXXXXXXX"
                    "https://paypal.me/floridaadvent"
       zelle  : correo o telefono registrado en Zelle. Zelle no tiene
                enlace web: solo se muestra para copiarlo en el banco.
                Ej. "give@floridaadventmissionaries.org"
     --------------------------------------------------------- */
  var GIVE = {
    online: "",
    zelle:  ""
  };

  /* ---------------------------------------------------------
     CONTACTO EN LINEA — el otro unico sitio que hay que tocar.

     Con un correo aqui, el formulario de contacto y el de peticiones
     de oracion se envian desde la propia pagina, sin abrir WhatsApp
     y sin que el visitante tenga que salir del sitio.

     No hace falta servidor ni cuenta de pago: usamos FormSubmit.

       email : buzon del ministerio al que llegan los mensajes.
               La PRIMERA vez que alguien envie algo, FormSubmit manda
               a ese correo un enlace de activacion. Hay que pulsarlo
               una sola vez; despues todo llega solo.

       token : la cadena que da FormSubmit despues de activar
               ("Your form endpoint"). Si esta puesta, se usa en lugar
               del correo y ASI LA DIRECCION DEJA DE APARECER EN EL
               CODIGO PUBLICO. Recomendado: este archivo lo puede leer
               cualquiera, y los robots de spam rastrean GitHub Pages
               buscando justo esto. Funciona igual con las dos.

     Mientras el correo este vacio no se promete nada que no se cumpla:
     los formularios siguen funcionando, pero preparan el mensaje y lo
     entregan por WhatsApp, que es el canal que si esta comprobado.
     El aviso de privacidad debajo de cada formulario cambia solo para
     decir en cada caso lo que de verdad pasa.

     Ojo: por aqui entran peticiones de oracion con nombres, enfermedades
     y problemas de familia. Que sea un buzon del ministerio al que tenga
     acceso quien ora, no el personal de nadie.
     --------------------------------------------------------- */
  var CONTACT = {
    email: "fladventmissionaries@gmail.com",
    token: ""
  };

  /* Sin Promise no hay envio asincrono: se cae a WhatsApp, que siempre va. */
  function online() { return !!(CONTACT.token || CONTACT.email) && !!window.Promise; }
  function endpoint() {
    return "https://formsubmit.co/ajax/" + encodeURIComponent(CONTACT.token || CONTACT.email);
  }

  var LS_THEME   = "fam-theme";
  var LS_LANG    = "fam-lang";
  var DEFAULT_LANG = "en";

  var LANGS   = window.FAM_LANGS   || [];
  var I18N    = window.FAM_I18N = window.FAM_I18N || {};
  var VERSES  = window.FAM_VERSES = window.FAM_VERSES || {};
  var NO_PDF  = window.FAM_NO_DIRECT_PDF || [];

  var currentLang = DEFAULT_LANG;

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  function langMeta(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i];
    return LANGS[0];
  }

  /* ---------------- Traduccion ---------------- */
  function t(key) {
    var dict = I18N[currentLang] || I18N[DEFAULT_LANG] || {};
    if (dict[key] !== undefined) return dict[key];
    var fb = I18N[DEFAULT_LANG] || {};
    if (fb[key] !== undefined) return fb[key];
    /* Ni en su idioma ni en ingles: pasa si js/lang/<cod>.js no llego a
       cargar. Devolver la clave pintaria "prayer.f.ok" en mitad de la
       pagina; un hueco se nota menos y no confunde a nadie. */
    if (window.console && console.warn) console.warn("i18n sin traducir:", key);
    return "";
  }

  function applyLang(code) {
    if (!I18N[code]) return;
    currentLang = code;
    var meta = langMeta(code);

    document.documentElement.setAttribute("lang", code);

    $$("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    $$("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    $$("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    $$("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });

    /* Ano en el pie */
    var rights = $("[data-i18n='footer.rights']");
    if (rights) rights.textContent = t("footer.rights").replace("{year}", new Date().getFullYear());

    /* Titulo y descripcion. El titulo del libro va delante: es lo que
       se busca desde fuera de Florida. La marca la pone Google aparte,
       desde los datos estructurados. */
    var tit = (meta && meta.book && meta.book.title ? meta.book.title + " · " : "") + t("value.1.t");
    document.title = tit;
    var poner = function (id, v) { var e = $("#" + id); if (e && v) e.setAttribute("content", v); };
    poner("metaDescription", t("meta.description"));
    poner("metaOgTitle", tit);
    poner("metaTwTitle", tit);
    poner("metaOgDesc", t("meta.description"));
    poner("metaTwDesc", t("meta.description"));
    var ogLocale = $("meta[property='og:locale']");
    if (ogLocale && meta.locale) ogLocale.setAttribute("content", meta.locale);

    /* El canonical sigue al idioma tambien al cambiarlo sin recargar,
       para que nunca declare que la version inglesa es la buena. */
    var url = "https://droko1982.github.io/adventflorida/" + (code === "en" ? "" : "?lang=" + code);
    var canon = $("link[rel='canonical']");
    if (canon) canon.setAttribute("href", url);
    var ogUrl = $("meta[property='og:url']");
    if (ogUrl) ogUrl.setAttribute("content", url);

    /* Libro: enlaces e idioma */
    var bTitle = $("#bookTitleLocal");
    var bPdf   = $("#bookPdf");
    var bRead  = $("#bookRead");
    var bLegal = $("#bookLegal");
    if (bTitle && meta.book) {
      bTitle.textContent = meta.book.title;
      /* El titulo esta en el idioma del libro. En kreyol los botones
         llevan a la edicion francesa, asi que el titulo es frances. */
      bTitle.setAttribute("lang", code === "ht" ? "fr" : code);
    }
    if (bPdf && meta.book)   bPdf.setAttribute("href", meta.book.pdf);
    var sinPdf = NO_PDF.indexOf(code) !== -1;
    var bPdfL = $("#bookPdfLabel"), bPdfI = $("#bookPdfIcon");
    if (bPdfL) bPdfL.textContent = sinPdf ? t("book.library") : t("book.download");
    if (bPdfI) bPdfI.style.display = sinPdf ? "none" : "";
    if (bRead && meta.book)  bRead.setAttribute("href", meta.book.read);
    /* El criollo haitiano necesita un aviso propio: el libro no existe
       en kreyol, asi que los botones llevan a la edicion francesa. */
    if (bLegal) {
      bLegal.textContent = code === "ht" ? t("book.legalHt")
        : NO_PDF.indexOf(code) !== -1 ? t("book.legalAlt")
        : t("book.legal");
    }

    /* Boton de idioma */
    var lcode = $("#langCode");
    if (lcode) lcode.textContent = meta.label;
    $$("#langMenu button").forEach(function (b) {
      b.setAttribute("aria-current", b.getAttribute("data-lang") === code ? "true" : "false");
    });

    renderVerse(0);
    renderSabbath();
    renderStories();
    nearRender();
    renderMissions();
    renderFormNotes();
    renderFormStatus();
    renderLibrary();
    store(LS_LANG, code);
  }

  function known(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return true;
    return false;
  }

  function detectLang() {
    /* Igual que en el cargador del head: si el navegador no tiene
       URLSearchParams, esto no puede tumbar la deteccion entera. */
    var q = null;
    try { q = new URLSearchParams(window.location.search).get("lang"); } catch (e) {}
    if (q && known(q)) return q;
    var saved = store(LS_LANG);
    if (saved && known(saved)) return saved;
    var navs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < navs.length; i++) {
      var base = String(navs[i]).toLowerCase().split("-")[0];
      if (known(base)) return base;
    }
    return DEFAULT_LANG;
  }

  /* Trae el archivo de un idioma si aun no esta en memoria */
  function loadLang(code, done) {
    if (I18N[code]) return done(true);
    var s = document.createElement("script");
    s.src = "js/lang/" + code + ".js";
    s.onload  = function () { done(!!I18N[code]); };
    s.onerror = function () { done(false); };
    document.head.appendChild(s);
  }

  function buildLangMenu() {
    var menu = $("#langMenu");
    if (!menu) return;
    menu.innerHTML = "";
    LANGS.forEach(function (l) {
      var li = document.createElement("li");
      var b  = document.createElement("button");
      b.type = "button";
      b.setAttribute("data-lang", l.code);
      b.innerHTML = '<span class="lang-native"></span>' +
                    '<span class="lang-code">' + l.label + '</span>';
      var nat = $(".lang-native", b);
      nat.textContent = l.native;
      nat.setAttribute("lang", l.code);
      b.addEventListener("click", function () {
        closeLangMenu();
        loadLang(l.code, function (ok) { if (ok) applyLang(l.code); });
      });
      li.appendChild(b);
      menu.appendChild(li);
    });
  }

  function closeLangMenu() {
    var wrap = $("#langWrap"), btn = $("#langBtn");
    if (wrap) wrap.classList.remove("is-open");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  /* ---------------- Tema ---------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var sun = $("#iconSun"), moon = $("#iconMoon");
    if (sun)  sun.style.display  = theme === "dark" ? "none" : "";
    if (moon) moon.style.display = theme === "dark" ? "" : "none";
    store(LS_THEME, theme);
  }

  /* ---------------- Versiculos ---------------- */
  var verseIndex = 0, verseTimer = null;

  function verseList() {
    return VERSES[currentLang] || VERSES[DEFAULT_LANG] || [];
  }

  /* La tarjeta del versiculo cambiaba de alto en cada vuelta. Entre el mas
     corto y el mas largo hay 56 px en un movil de 390, y 37 en escritorio:
     dos lineas. Cada ocho segundos, sin tocar nada, todo lo que quedaba
     debajo pegaba ese salto bajo el dedo de quien estaba leyendo.

     Y de rebote se llevaba por delante los saltos del menu: al pulsar
     "Unete", la pagina aterrizaba bien y el versiculo rotaba justo despues,
     empujando la seccion 55 px hacia abajo. Salia el mismo "le doy y no me
     lleva" de siempre, pero por un camino distinto. Medido: uno de cada
     tres saltos del menu movil.

     No vale poner un numero en la hoja de estilo: el alto depende del
     idioma (el ucraniano no ocupa lo que el criollo) y del ancho. Hay que
     medir los versiculos que de verdad se van a mostrar. */
  var altoVersoPara = "";
  function reservarAltoVerso() {
    var txt = $("#verseText"), list = verseList();
    if (!txt || !list.length) return;
    var ancho = txt.clientWidth;
    /* Ancho cero = su parte esta cerrada. No se puede medir todavia, y
       sobre todo no se puede dar por medido: se reintenta al abrirla. */
    if (!ancho) return;
    var firma = currentLang + "|" + Math.round(ancho);
    if (firma === altoVersoPara) return;

    var guardado = txt.textContent;
    txt.style.minHeight = "";
    var max = 0;
    list.forEach(function (v) {
      txt.textContent = v.t;
      if (txt.offsetHeight > max) max = txt.offsetHeight;
    });
    txt.textContent = guardado;
    txt.style.minHeight = max + "px";
    altoVersoPara = firma;
  }

  function renderVerse(i) {
    var list = verseList();
    if (!list.length) return;
    verseIndex = ((i % list.length) + list.length) % list.length;
    var txt = $("#verseText"), ref = $("#verseRef"), dots = $("#verseDots");
    if (txt) txt.textContent = list[verseIndex].t;
    if (ref) ref.textContent = list[verseIndex].r;
    reservarAltoVerso();

    if (dots) {
      if (dots.children.length !== list.length) {
        dots.innerHTML = "";
        list.forEach(function (_, n) {
          var d = document.createElement("button");
          d.type = "button";
          d.setAttribute("aria-label", t("a11y.verseN").replace("{n}", String(n + 1)));
          d.addEventListener("click", function () { renderVerse(n); restartVerses(); });
          dots.appendChild(d);
        });
      }
      /* La etiqueta se reescribe siempre, no solo al crear los puntos:
         si no, al cambiar de idioma se quedaria en el anterior. */
      Array.prototype.forEach.call(dots.children, function (d, n) {
        d.setAttribute("aria-label", t("a11y.verseN").replace("{n}", String(n + 1)));
        d.setAttribute("aria-current", n === verseIndex ? "true" : "false");
      });
    }
  }

  /* Al girar el telefono o cambiar el ancho de la ventana, el versiculo
     mas largo ya no ocupa lo mismo. Se vuelve a medir, sin prisa. */
  var relojAncho = null;
  window.addEventListener("resize", function () {
    if (relojAncho) clearTimeout(relojAncho);
    relojAncho = setTimeout(function () { altoVersoPara = ""; reservarAltoVerso(); }, 200);
  });

  function restartVerses() {
    if (verseTimer) clearInterval(verseTimer);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    verseTimer = setInterval(function () { renderVerse(verseIndex + 1); }, 8000);
  }

  /* ---------------- WhatsApp ---------------- */
  function waLink(message) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
  }

  function wireWhatsApp() {
    $$("[data-wa]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var key = el.getAttribute("data-wa");
        window.open(waLink(t("wa." + key)), "_blank", "noopener");
      });
    });
  }

  /* ---------------- Formularios ----------------
     Un solo motor para los dos: el de oracion y el de contacto.
     Si hay correo configurado, el mensaje sale desde la pagina y
     el visitante no tiene que irse a ninguna parte. Si no lo hay,
     se entrega por WhatsApp igual que antes. */

  /* Mensaje bajo el boton. tono: "ok" o "err".
     Se guarda la CLAVE, no el texto, para que al cambiar de idioma el
     aviso se reescriba en vez de quedarse congelado en el anterior.
     El orden importa: un aria-live que nace con texto dentro no se
     anuncia. Hay que mostrar el nodo vacio primero y escribirlo despues,
     para que el lector de pantalla vea una mutacion de verdad. */
  function estado(el, clave, tono) {
    if (!el) return;
    if (!clave) {
      el.textContent = "";
      el.className = "form-status";
      el.removeAttribute("data-i18n-status");
      return;
    }
    el.className = "form-status is-" + tono;
    el.setAttribute("data-i18n-status", clave);
    el.textContent = t(clave);
  }

  /* Igual con el boton: se guarda la clave de su etiqueta, no la cadena,
     porque si se cambia de idioma mientras esta enviando volveria al
     texto viejo. */
  function ocupado(btn, si) {
    if (!btn) return;
    btn.disabled = si;
    var span = btn.querySelector("span");
    if (!span) return;
    if (si) {
      span.textContent = t("form.sending");
    } else {
      var clave = span.getAttribute("data-i18n");
      if (clave) span.textContent = t(clave);
    }
  }

  /* Reescribe en el idioma nuevo lo que ya estaba en pantalla */
  function renderFormStatus() {
    $$("[data-i18n-status]").forEach(function (el) {
      if (!el.hidden) el.textContent = t(el.getAttribute("data-i18n-status"));
    });
    $$("button[disabled] span[data-i18n]").forEach(function (span) {
      span.textContent = t("form.sending");
    });
  }

  /* FormSubmit contesta 200 aunque haya rechazado el envio: el motivo
     va dentro, en "success". Pasa, por ejemplo, mientras el formulario
     no esta activado. Mirar solo el codigo HTTP diria "enviado" a
     alguien cuyo mensaje no ha salido, que es la peor mentira posible
     en una pagina donde la gente cuenta lo que le pasa. */
  function aceptado(texto) {
    if (!texto) return true;
    try {
      var r = JSON.parse(texto);
      if (r && r.success !== undefined) return String(r.success) === "true";
    } catch (e) {}
    return true;
  }

  /* Envia por FormSubmit. Devuelve una promesa que resuelve a true/false.
     Se usa fetch cuando el navegador lo tiene; si no, XMLHttpRequest,
     para no dejar fuera a nadie con un telefono viejo. */
  var ESPERA_MAX = 15000;   /* en una red mala, mejor decirlo que colgarse */

  function enviar(asunto, campos) {
    var cuerpo = { _subject: asunto, _captcha: "false", _template: "table" };
    Object.keys(campos).forEach(function (k) { if (campos[k]) cuerpo[k] = campos[k]; });
    var json = JSON.stringify(cuerpo);

    return new Promise(function (resolve) {
      /* Sin corte, una red que no contesta nunca deja el boton en
         "Enviando..." para siempre y la persona no sabe que hacer. */
      var cerrado = false;
      var abortar = null;
      var reloj = setTimeout(function () {
        cerrado = true;
        if (abortar) { try { abortar(); } catch (e) {} }
        resolve(false);
      }, ESPERA_MAX);
      var terminar = function (ok) {
        if (cerrado) return;
        cerrado = true;
        clearTimeout(reloj);
        resolve(ok);
      };

      if (window.fetch) {
        var opciones = {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: json
        };
        if (window.AbortController) {
          var ctrl = new AbortController();
          opciones.signal = ctrl.signal;
          abortar = function () { ctrl.abort(); };
        }
        fetch(endpoint(), opciones).then(function (r) {
          if (!r.ok) return terminar(false);
          r.text().then(function (txt) { terminar(aceptado(txt)); },
                        function () { terminar(true); });
        }, function () { terminar(false); });
        return;
      }
      try {
        var x = new XMLHttpRequest();
        x.open("POST", endpoint(), true);
        x.setRequestHeader("Content-Type", "application/json");
        abortar = function () { x.abort(); };
        x.onreadystatechange = function () {
          if (x.readyState === 4) {
            terminar(x.status >= 200 && x.status < 300 && aceptado(x.responseText));
          }
        };
        x.send(json);
      } catch (e) { terminar(false); }
    });
  }

  /* Los avisos de privacidad dicen lo que de verdad ocurre en cada
     modo, asi que los escribe el JS y no llevan data-i18n. */
  function renderFormNotes() {
    var pp = $("#pPrivacy"), cp = $("#cPrivacy"), alt = $("#pAlt");
    if (pp) pp.textContent = online() ? t("prayer.f.privacyOnline") : t("prayer.f.privacy");
    if (cp) cp.textContent = online() ? t("contact.f.privacy") : t("prayer.f.privacy");
    if (alt) alt.hidden = !online();
    /* Sin correo, el boton de oracion es de WhatsApp y lo dice su icono */
    var pb = $("#pSend"), icon = pb ? pb.querySelector("[data-wa-icon]") : null;
    if (pb) {
      pb.classList.toggle("btn-wa", !online());
      pb.classList.toggle("btn-primary", online());
    }
    if (icon) icon.style.display = online() ? "none" : "";
  }

  /* Un correo o un telefono. FormSubmit usa el campo "email" como
     Reply-To: meterle ahi un telefono deja el correo sin remitente al
     que responder, asi que cada cosa va a su sitio. */
  function esCorreo(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }

  function ponerRespuesta(campos, valor) {
    if (!valor) return;
    if (esCorreo(valor)) campos.email = valor;
    else campos.Phone = valor;
  }

  /* Tras un envio correcto, el formulario queda limpio. Volver a pulsar
     enviaria un mensaje vacio y convertiria el "ya llego" en un error,
     que es justo lo contrario de lo que acaba de pasar. Se bloquea hasta
     que la persona vuelva a escribir. */
  function bloquearHastaEscribir(form, btn, campo) {
    if (!btn || !campo) return;
    btn.disabled = true;
    var soltar = function () {
      btn.disabled = false;
      campo.removeEventListener("input", soltar);
    };
    campo.addEventListener("input", soltar);
  }

  function wirePrayerForm() {
    var form = $("#prayerForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if ($("#pHoney") && $("#pHoney").value) return;   /* trampa para robots */
      var name = $("#pName").value.trim();
      var city = $("#pCity").value.trim();
      var sel  = $("#pTopic");
      var topic = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].textContent.trim() : "";
      var msg  = $("#pMsg").value.trim();
      var reply = $("#pReply") ? $("#pReply").value.trim() : "";
      var box  = $("#pStatus"), btn = $("#pSend");

      if (!msg) {
        $("#pMsg").focus();
        estado(box, "prayer.f.needMsg", "err");
        return;
      }

      /* Las claves del correo van en ingles fijo: son los rotulos que lee
         el ministerio, y ademas FormSubmit no tiene por que digerir una
         clave en cirilico. Lo que se traduce es el contenido. */
      var campos = {
        Name: name,
        City: city,
        Topic: topic,
        Request: msg,
        Language: currentLang
      };
      ponerRespuesta(campos, reply);

      if (online()) {
        estado(box, "", "ok");
        ocupado(btn, true);
        enviar("Peticion de oracion - " + (name || "anonimo"), campos).then(function (ok) {
          ocupado(btn, false);
          estado(box, ok ? "prayer.f.ok" : "form.err", ok ? "ok" : "err");
          if (ok) { form.reset(); bloquearHastaEscribir(form, btn, $("#pMsg")); }
        });
        return;
      }

      var lines = ["*" + t("wa.prayerIntro") + "*"];
      if (name) lines.push(t("wa.name") + ": " + name);
      if (city) lines.push(t("wa.city") + ": " + city);
      if (topic) lines.push(t("wa.topic") + ": " + topic);
      if (reply) lines.push(reply);
      lines.push(t("wa.request") + ": " + msg);

      window.open(waLink(lines.join("\n")), "_blank", "noopener");
    });
  }

  function wireContactForm() {
    var form = $("#contactForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if ($("#cHoney") && $("#cHoney").value) return;
      var name  = $("#cName").value.trim();
      var reply = $("#cReply").value.trim();
      var city  = $("#cCity").value.trim();
      var sel   = $("#cTopic");
      var topic = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].textContent.trim() : "";
      var msg   = $("#cMsg").value.trim();
      var box   = $("#cStatus"), btn = $("#cSend");

      if (!msg) { $("#cMsg").focus(); estado(box, "contact.f.needMsg", "err"); return; }
      /* Sin forma de contestar, el mensaje no sirve de nada */
      if (online() && !reply) { $("#cReply").focus(); estado(box, "contact.f.needReply", "err"); return; }

      var campos = {
        Name: name,
        City: city,
        Topic: topic,
        Message: msg,
        Language: currentLang
      };
      ponerRespuesta(campos, reply);

      if (online()) {
        estado(box, "", "ok");
        ocupado(btn, true);
        enviar("Mensaje de la web - " + (topic || "contacto"), campos).then(function (ok) {
          ocupado(btn, false);
          estado(box, ok ? "contact.f.ok" : "form.err", ok ? "ok" : "err");
          if (ok) { form.reset(); bloquearHastaEscribir(form, btn, $("#cMsg")); }
        });
        return;
      }

      var lines = ["*" + t("wa.general") + "*"];
      if (name) lines.push(t("wa.name") + ": " + name);
      if (reply) lines.push(reply);
      if (city) lines.push(t("wa.city") + ": " + city);
      if (topic) lines.push(t("wa.topic") + ": " + topic);
      lines.push(t("wa.need") + ": " + msg);

      window.open(waLink(lines.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------------- Horas del sabado ---------------- */
  var LS_CITY = "fam-city";
  var sabbathTimer = null;

  /* Locale para Intl. Si el idioma no tiene datos (puede pasar con el
     creol), Intl lanza; en ese caso se cae al ingles. */
  function intlLocale() {
    var meta = langMeta(currentLang);
    var tag = meta && meta.locale ? meta.locale.replace("_", "-") : "en-US";
    try {
      new Intl.DateTimeFormat(tag, { hour: "numeric" }).format(new Date());
      return tag;
    } catch (e) {
      return "en-US";
    }
  }

  function selectedCity() {
    if (!window.FAM_SUNSET) return null;
    return window.FAM_SUNSET.city(store(LS_CITY) || "delray");
  }

  function renderSabbath() {
    var S = window.FAM_SUNSET;
    if (!S) return;
    var city = selectedCity();
    var win = S.currentOrNextSabbath(city);
    if (!win) return;

    var loc = intlLocale();
    var startT = $("#sabStartTime"), startD = $("#sabStartDay");
    var endT   = $("#sabEndTime"),   endD   = $("#sabEndDay");
    if (startT) startT.textContent = S.formatTime(win.start, city.tz, loc);
    if (startD) startD.textContent = S.formatDate(win.start, city.tz, loc);
    if (endT)   endT.textContent   = S.formatTime(win.end, city.tz, loc);
    if (endD)   endD.textContent   = S.formatDate(win.end, city.tz, loc);

    var status = $("#sabStatus"), label = $("#sabStatusText");
    if (status && label) {
      status.classList.toggle("is-active", win.active);
      label.textContent = win.active ? t("sab.now") : t("sab.next");
    }
  }

  function wireSabbath() {
    var S = window.FAM_SUNSET;
    var sel = $("#sabCity");
    if (!S || !sel) return;

    sel.innerHTML = "";
    S.cities.forEach(function (c) {
      var o = document.createElement("option");
      o.value = c.id;
      o.textContent = c.name;
      sel.appendChild(o);
    });
    sel.value = (store(LS_CITY) || "delray");
    if (!sel.value) sel.value = "delray";

    sel.addEventListener("change", function () {
      store(LS_CITY, sel.value);
      /* Que el otro bloque siga la misma ciudad: los dos leen LS_CITY */
      var otro = $("#nearCity");
      if (otro && otro.value !== sel.value) { otro.value = sel.value; nearRender(); }
      renderSabbath();
    });

    renderSabbath();
    /* Se refresca cada minuto: el estado cambia solo al ponerse el sol */
    if (sabbathTimer) clearInterval(sabbathTimer);
    sabbathTimer = setInterval(renderSabbath, 60000);
  }

  /* ---------------- Testimonios en video ---------------- */
  var VIDEOS = window.FAM_VIDEOS || [];

  /* Se enlaza la miniatura de YouTube y solo se carga el
     reproductor al pulsar, con el dominio sin cookies. Nada
     se descarga ni se re-publica. */
  /* Antes esto reemplazaba el boton por el iframe y lo destruia: una vez
     empezado un testimonio no habia forma de salir de el, ni de pasar al
     siguiente, ni de volver a la miniatura. Ahora el boton se queda
     escondido al lado y el reproductor trae sus mandos. */

  function cerrarVideo(card) {
    if (!card) return;
    var caja = $(".st-player", card), btn = $(".st-thumb", card);
    if (caja) caja.parentNode.removeChild(caja);
    if (btn) btn.hidden = false;
    card.classList.remove("is-playing");
    return btn;
  }

  function cerrarTodos(menos) {
    $$("#stGrid .st-card.is-playing").forEach(function (c) {
      if (c !== menos) cerrarVideo(c);
    });
  }

  function tarjetas() { return $$("#stGrid .st-card"); }

  /* Salta al siguiente testimonio, o al anterior con paso -1 */
  function pasarVideo(card, paso) {
    var todas = tarjetas();
    var i = todas.indexOf(card);
    if (i === -1) return;
    var siguiente = todas[(i + paso + todas.length) % todas.length];
    cerrarVideo(card);
    var btn = $(".st-thumb", siguiente);
    if (btn) playVideo(btn);
  }

  function mando(clase, etiqueta, svg, alPulsar) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "st-ctrl " + clase;
    b.setAttribute("aria-label", etiqueta);
    b.title = etiqueta;
    b.innerHTML = svg;
    b.addEventListener("click", alPulsar);
    return b;
  }

  var SVG_CERRAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var SVG_ANT    = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  var SVG_SIG    = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

  function playVideo(btn) {
    var card = btn.closest ? btn.closest(".st-card") : btn.parentNode;
    if (!card) return;
    cerrarTodos(card);                 /* uno a la vez, no cuatro sonando */

    var caja = document.createElement("div");
    caja.className = "st-player";

    var frame = document.createElement("iframe");
    frame.setAttribute("src", "https://www.youtube-nocookie.com/embed/" +
      btn.getAttribute("data-video") + "?autoplay=1&rel=0");
    frame.setAttribute("title", btn.getAttribute("data-title"));
    frame.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    frame.setAttribute("allowfullscreen", "");
    caja.appendChild(frame);

    var barra = document.createElement("div");
    barra.className = "st-ctrls";
    var varias = tarjetas().length > 1;
    if (varias) barra.appendChild(mando("st-prev", t("st.prev"), SVG_ANT,
      function () { pasarVideo(card, -1); }));
    if (varias) barra.appendChild(mando("st-next", t("st.next"), SVG_SIG,
      function () { pasarVideo(card, 1); }));
    barra.appendChild(mando("st-close", t("st.close"), SVG_CERRAR, function () {
      var v = cerrarVideo(card);
      if (v) v.focus();               /* el foco vuelve de donde salio */
    }));
    caja.appendChild(barra);

    btn.hidden = true;
    card.classList.add("is-playing");
    card.insertBefore(caja, btn);
  }

  function renderStories() {
    var grid = $("#stGrid");
    if (!grid || !VIDEOS.length) return;

    /* Cambiar de idioma reconstruye la rejilla entera. Si habia un
       testimonio sonando, se cortaba a media frase: se anota cual era
       para volver a ponerlo al terminar. */
    var sonando = grid.querySelector(".st-card.is-playing .st-thumb");
    var seguir = sonando ? sonando.getAttribute("data-video") : null;

    grid.innerHTML = VIDEOS.map(function (v, i) {
      var lang = v.lang || "en";
      var otro = lang !== currentLang ? ' lang="' + esc(lang) + '"' : "";
      var quien = [v.person, v.role].filter(Boolean).join(" · ");

      var h = '<article class="st-card' + (i === 0 ? " is-lead" : "") + '">' +
        '<button class="st-thumb" type="button" data-video="' + esc(v.id) + '" ' +
          'data-title="' + esc(v.title) + '" aria-label="' + esc(t("st.play") + ": " + v.title) + '">' +
          '<img src="https://i.ytimg.com/vi/' + esc(v.id) + '/hqdefault.jpg" alt="" ' +
               'loading="lazy" decoding="async" width="480" height="360">' +
          '<span class="st-play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
          '<path d="M7 4.8v14.4c0 .8.9 1.3 1.6.9l11.2-7.2a1 1 0 000-1.8L8.6 3.9A1 1 0 007 4.8z"/></svg></span>' +
        "</button>" +
        '<div class="st-body">';

      if (quien) h += '<div class="st-who">' + esc(quien) + "</div>";
      h += "<h3" + otro + ">" + esc(v.title) + "</h3>";
      if (v.hook) h += '<p class="st-hook"' + otro + ">" + esc(v.hook) + "</p>";
      if (lang !== currentLang) {
        h += '<p class="st-note">' + icon(ICON_GLOBE) +
             esc(t("st.langNote").replace("{lang}", langName(lang))) + "</p>";
      }
      return h + "</div></article>";
    }).join("");

    $$("#stGrid button.st-thumb").forEach(function (b) {
      b.addEventListener("click", function () { playVideo(b); });
    });

    if (seguir) {
      var vuelve = grid.querySelector('.st-thumb[data-video="' + seguir + '"]');
      if (vuelve) playVideo(vuelve);
    }
  }

  /* ---------------- La biblioteca ----------------
     Solo se pinta lo que existe en el idioma que se esta leyendo. Una
     obra que no tiene edicion en ese idioma no aparece: preferimos una
     lista mas corta y verdadera que una larga llena de enlaces que
     llevan a otra lengua sin avisar. */
  var LIBROS = window.FAM_LIBRARY || [];
  var LIB_GRUPOS = ["start", "jesus", "story", "daily", "other"];

  function libFicha(o, ed) {
    var h = '<article class="lib-card">' +
      '<h4 class="lib-t">' + esc(ed.t) + "</h4>";

    var etiquetas = [];
    /* Si por lo que sea no hay texto, no se pinta una pastilla vacia */
    var cuanto = o.largo ? t("lib." + o.largo) : "";
    if (cuanto) etiquetas.push('<span class="lib-pill">' + esc(cuanto) + "</span>");
    if (o.egw) etiquetas.push('<span class="lib-pill lib-egw">Ellen G. White</span>');
    if (etiquetas.length) h += '<p class="lib-tags">' + etiquetas.join("") + "</p>";

    h += '<div class="lib-links">';
    if (ed.pdf) {
      h += '<a class="btn btn-sm btn-ghost" href="' + esc(ed.pdf) + '" target="_blank" rel="noopener">' +
        esc(t("lib.pdf")) + (ed.mb ? ' <span class="lib-mb">' + ed.mb + ' MB</span>' : "") + "</a>";
    }
    if (ed.leer) {
      h += '<a class="btn btn-sm btn-ghost" href="' + esc(ed.leer) + '" target="_blank" rel="noopener">' +
        esc(t(o.audio ? "lib.listen" : "lib.read")) + "</a>";
    }
    h += "</div>";
    /* Un aviso donde de verdad hace falta: 10 MB con datos contados duele */
    if (ed.mb && ed.mb >= 4) h += '<p class="lib-warn">' + esc(t("lib.heavy")) + "</p>";
    return h + "</article>";
  }

  function renderLibrary() {
    var caja = $("#libGrid");
    if (!caja || !LIBROS.length) return;

    var hay = LIBROS.filter(function (o) { return !!o.ed[currentLang]; });
    var html = "";
    LIB_GRUPOS.forEach(function (g) {
      var enGrupo = hay.filter(function (o) { return o.grupo === g; });
      if (!enGrupo.length) return;
      html += '<div class="lib-group"><h4 class="lib-g">' + esc(t("lib.g." + g)) + "</h4>" +
        '<div class="lib-grid">' +
        enGrupo.map(function (o) { return libFicha(o, o.ed[currentLang]); }).join("") +
        "</div></div>";
    });
    caja.innerHTML = html;

    var cuenta = $("#libCount");
    if (cuenta) {
      cuenta.textContent = t("lib.count")
        .replace("{n}", String(hay.length))
        .replace("{lang}", langName(currentLang));
    }
  }

  /* ---------------- Alguien cerca de ti ---------------- */
  var NEAR = window.FAM_NEAR || {};
  var LS_NEAR_LANG = "fam-near-lang";

  function nearRender() {
    var out = $("#nearOut"), selC = $("#nearCity"), selL = $("#nearLang");
    if (!out || !selC || !selL || !window.FAM_SUNSET) return;

    /* La entradilla no puede prometer "el nombre de quien te espera"
       mientras no haya ni una ciudad confirmada. La hora del ocaso si
       es real desde el primer dia, porque se calcula. */
    var lead = $("#cerca .section-lead");
    if (lead) lead.textContent = Object.keys(NEAR).length ? t("near.lead") : t("near.lead0");

    var city = window.FAM_SUNSET.city(selC.value);
    var lang = selL.value;
    var loc = intlLocale();
    var win = window.FAM_SUNSET.currentOrNextSabbath(city);
    var datos = NEAR[city.id];
    var html = "";

    /* La hora del ocaso siempre es real: se calcula, no se promete */
    if (win) {
      html += '<p class="near-line">' +
        icon(ICON_CLOCK) + "<span>" +
        esc(t("near.sunsetLine")
          .replace("{city}", city.name)
          .replace("{start}", window.FAM_SUNSET.formatTime(win.start, city.tz, loc))
          .replace("{end}", window.FAM_SUNSET.formatTime(win.end, city.tz, loc))) +
        "</span></p>";
    }

    if (datos && datos.church) {
      html += '<div class="near-where"><h3>' + esc(t("near.church")) + "</h3>" +
              "<p><strong>" + esc(datos.church) + "</strong></p>";
      if (datos.address) html += '<p class="muted">' + esc(datos.address) + "</p>";
      if (datos.time)    html += '<p class="muted">' + esc(t("near.time").replace("{time}", datos.time)) + "</p>";
      if (datos.map)     html += '<a href="' + esc(datos.map) + '" target="_blank" rel="noopener">' +
                                 esc(t("near.mapLink")) + "</a>";
      html += "</div>";

      if (datos.person) {
        var idiomas = (datos.langs || []).map(langName).join(", ");
        html += '<p class="near-line">' + icon(ICON_PERSON) + "<span>" +
          esc(t("near.person").replace("{name}", datos.person)
                              .replace("{city}", city.name)
                              .replace("{langs}", idiomas)) + "</span></p>";
      }
    } else {
      html += '<p class="near-line"><span class="muted">' +
        esc(t("near.none").replace("{city}", city.name)) + "</span></p>";
    }

    out.innerHTML = html;

    var cta = $("#nearCta");
    if (cta) {
      cta.setAttribute("href", waLink(
        t("wa.near").replace("{city}", city.name).replace("{lang}", langName(lang))
      ));
    }
  }

  function wireNear() {
    var selC = $("#nearCity"), selL = $("#nearLang");
    if (!selC || !selL || !window.FAM_SUNSET) return;

    selC.innerHTML = "";
    window.FAM_SUNSET.cities.forEach(function (c) {
      var o = document.createElement("option");
      o.value = c.id; o.textContent = c.name;
      selC.appendChild(o);
    });
    selC.value = store(LS_CITY) || "delray";
    if (!selC.value) selC.value = "delray";

    selL.innerHTML = "";
    LANGS.forEach(function (l) {
      var o = document.createElement("option");
      o.value = l.code; o.textContent = l.native;
      o.setAttribute("lang", l.code);
      selL.appendChild(o);
    });
    selL.value = store(LS_NEAR_LANG) || currentLang;
    if (!selL.value) selL.value = currentLang;

    selC.addEventListener("change", function () {
      store(LS_CITY, selC.value);
      nearRender();
      var otro = $("#sabCity");
      if (otro && otro.value !== selC.value) { otro.value = selC.value; renderSabbath(); }
    });
    selL.addEventListener("change", function () { store(LS_NEAR_LANG, selL.value); nearRender(); });

    nearRender();
  }

  /* ---------------- Misiones y eventos ---------------- */
  var EVENTS = window.FAM_EVENTS || [];

  /* Los unicos valores de "type" que tienen traduccion en los nueve
     idiomas. Cualquier otro se ignora en vez de pintar la clave cruda. */
  var EV_TYPES = ["evangelism", "health", "community", "youth",
                  "literature", "prayer", "visit"];
  var pastExpanded = false;
  var PAST_VISIBLE = 3;

  /* Fecha civil de hoy en Florida. Se usa la hora del este, donde
     vive la inmensa mayoria del estado; una hora de diferencia con
     el Panhandle no cambia en que lista cae un evento. */
  function floridaToday() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit"
    }).format(new Date());
  }

  /* Texto del evento en el idioma actual, con reserva honesta:
     idioma actual -> idioma original del evento -> ingles -> el que haya. */
  function evText(field, ev) {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (field[currentLang]) return field[currentLang];
    if (ev.lang && field[ev.lang]) return field[ev.lang];
    if (field.en) return field.en;
    var k = Object.keys(field);
    return k.length ? field[k[0]] : "";
  }

  /* True si el titulo NO existe en el idioma que esta leyendo la persona */
  function evNeedsNote(ev) {
    if (typeof ev.title === "string") return (ev.lang || "en") !== currentLang;
    return ev.title && ev.title[currentLang] === undefined;
  }

  function evShownLang(ev) {
    if (typeof ev.title === "string") return ev.lang || "en";
    if (ev.title && ev.title[currentLang]) return currentLang;
    if (ev.lang && ev.title && ev.title[ev.lang]) return ev.lang;
    if (ev.title && ev.title.en) return "en";
    /* evText, si no hay ni el idioma actual ni ingles, cae a la primera
       clave que haya. Este tiene que caer a la misma o el aviso mentiria. */
    if (ev.title && typeof ev.title === "object") {
      var k = Object.keys(ev.title);
      if (k.length) return k[0];
    }
    return ev.lang || "en";
  }

  function langName(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i].native;
    return code;
  }

  function splitEvents() {
    var today = floridaToday(), up = [], past = [];
    EVENTS.forEach(function (e) {
      if (!e || !e.start) return;
      ((e.end || e.start) >= today ? up : past).push(e);
    });
    up.sort(function (a, b) { return a.start < b.start ? -1 : a.start > b.start ? 1 : 0; });
    past.sort(function (a, b) { return a.start > b.start ? -1 : a.start < b.start ? 1 : 0; });
    return { up: up, past: past };
  }

  function icon(path) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
  }
  var ICON_PIN   = '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="2.8"/>';
  var ICON_CLOCK = '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>';
  var ICON_GLOBE = '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18 15 15 0 010-18z"/>';
  var ICON_PERSON = '<path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function eventCard(ev, isPast, isNext) {
    var loc = intlLocale();
    /* Se anade T12:00 para que la fecha no se corra un dia por el huso */
    var d = new Date(ev.start + "T12:00:00");
    var dia = new Intl.DateTimeFormat(loc, { day: "numeric" }).format(d);
    var mes = new Intl.DateTimeFormat(loc, { month: "short" }).format(d);
    var ano = new Intl.DateTimeFormat(loc, { year: "numeric" }).format(d);

    var h = '<article class="ev-card' + (isPast ? " is-past" : "") + (isNext ? " is-next" : "") + '">';

    if (ev.photo) {
      h += '<img class="ev-photo" src="' + esc(ev.photo) + '" alt="" loading="lazy" decoding="async">';
    }

    /* Si el texto no esta en el idioma que se esta leyendo, hay que
       marcarlo con lang= o el lector de pantalla lo pronuncia con la
       voz equivocada: criollo leido como si fuera ingles. */
    var otro = evNeedsNote(ev) ? ' lang="' + esc(evShownLang(ev)) + '"' : "";

    h += '<div class="ev-body"><div class="ev-top">' +
         '<div class="ev-date"><span class="d">' + esc(dia) + '</span>' +
         '<span class="m">' + esc(mes) + '</span><span class="y">' + esc(ano) + '</span></div>' +
         '<div class="ev-head">';
    /* Lo edita un voluntario desde la web de GitHub: un type mal escrito
       es cuestion de tiempo, y antes pintaba "ev.type.evangelismo" dentro
       de la tarjeta. Si no esta en la lista, no se pinta la etiqueta. */
    if (ev.type && EV_TYPES.indexOf(ev.type) !== -1) {
      h += '<span class="ev-type">' + esc(t("ev.type." + ev.type)) + "</span>";
    }
    h += "<h3" + otro + ">" + esc(evText(ev.title, ev)) + "</h3></div></div>";

    var desc = evText(ev.desc, ev);
    if (desc) h += '<p class="ev-desc"' + otro + ">" + esc(desc) + "</p>";

    var meta = [];
    if (ev.city)  meta.push("<span>" + icon(ICON_PIN) + esc(ev.city + (ev.place ? " · " + ev.place : "")) + "</span>");
    if (ev.time && !isPast) meta.push("<span>" + icon(ICON_CLOCK) + esc(ev.time) + "</span>");
    if (meta.length) h += '<div class="ev-meta">' + meta.join("") + "</div>";

    if (evNeedsNote(ev)) {
      h += '<p class="ev-lang-note">' + icon(ICON_GLOBE) +
           esc(t("mis.langNote").replace("{lang}", langName(evShownLang(ev)))) + "</p>";
    }

    if (!isPast) {
      var msg = t("wa.event").replace("{title}", evText(ev.title, ev));
      h += '<a class="btn btn-wa btn-sm" href="' + esc(waLink(msg)) + '" target="_blank" rel="noopener">' +
           esc(t("mis.join")) + "</a>";
    } else if (ev.link) {
      h += '<a class="btn btn-ghost btn-sm" href="' + esc(ev.link) + '" target="_blank" rel="noopener">' +
           esc(t("mis.moreInfo")) + "</a>";
    }

    return h + "</div></article>";
  }

  function emptyState(titleKey, textKey, withCta) {
    var h = '<div class="mis-empty">' +
      icon('<path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/>') +
      "<h3>" + esc(t(titleKey)) + "</h3><p>" + esc(t(textKey)) + "</p>";
    if (withCta) {
      h += '<a class="btn btn-wa" href="' + esc(waLink(t("wa.eventNews"))) + '" target="_blank" rel="noopener">' +
           esc(t("mis.emptyUp.cta")) + "</a>";
    }
    return h + "</div>";
  }

  /* Datos estructurados: solo los eventos que aun no han pasado */
  function eventSchema(upcoming) {
    var old = $("#eventSchema");
    if (old) old.parentNode.removeChild(old);
    if (!upcoming.length) return;
    var data = upcoming.slice(0, 12).map(function (ev) {
      var o = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: evText(ev.title, ev),
        startDate: ev.time ? ev.start + "T" + ev.time : ev.start,
        endDate: ev.end || ev.start,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        organizer: { "@type": "Organization", name: "Florida Advent Missionaries" },
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD",
                  availability: "https://schema.org/InStock", url: location.href }
      };
      var desc = evText(ev.desc, ev);
      if (desc) o.description = desc;
      o.location = ev.city
        ? { "@type": "Place", name: ev.place || ev.city,
            address: { "@type": "PostalAddress", addressLocality: ev.city,
                       addressRegion: "FL", addressCountry: "US" } }
        : { "@type": "Place", name: "Florida",
            address: { "@type": "PostalAddress", addressRegion: "FL", addressCountry: "US" } };
      return o;
    });
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.id = "eventSchema";
    s.textContent = JSON.stringify(data.length === 1 ? data[0] : data);
    document.head.appendChild(s);
  }

  function renderMissions() {
    var up = $("#misUpcoming"), past = $("#misPast");
    if (!up || !past) return;
    var s = splitEvents();

    up.innerHTML = s.up.length
      ? s.up.map(function (e, i) { return eventCard(e, false, i === 0); }).join("")
      : emptyState("mis.emptyUp.t", "mis.emptyUp.d", true);

    var shown = pastExpanded ? s.past : s.past.slice(0, PAST_VISIBLE);
    past.innerHTML = s.past.length
      ? shown.map(function (e) { return eventCard(e, true, false); }).join("")
      : emptyState("mis.emptyPast.t", "mis.emptyPast.d", false);

    var more = $("#misMore");
    if (more) {
      var hay = s.past.length > PAST_VISIBLE;
      more.hidden = !hay || past.hidden;
      var b = $("#misMoreBtn");
      if (b) b.textContent = pastExpanded ? t("mis.less") : t("mis.more");
    }

    /* El cero se muestra. Una pestana sin numero no dice si esta
       vacia o si simplemente no la has abierto. */
    var cUp = $("#tabUpCount"), cPast = $("#tabPastCount");
    if (cUp)   cUp.textContent   = String(s.up.length);
    if (cPast) cPast.textContent = String(s.past.length);

    /* El encabezado tiene que decir la verdad en los tres estados.
       El titulo prometia "y a donde vamos" ocho lineas encima de
       "todavia no hay nada en el calendario". Y el estado mas
       probable a la larga no es el vacio sino el desactualizado:
       un calendario que llevan voluntarios se queda quieto. */
    var head = $("#misiones .section-title"), lead = $("#misiones .section-lead");
    var vacio = !s.up.length && !s.past.length;
    var ultimo = s.past.length ? s.past[0].start : null;
    var dias = ultimo ? Math.round((Date.now() - new Date(ultimo + "T12:00:00").getTime()) / 86400000) : 0;

    /* El titulo no puede prometer "y a donde vamos" encima de un
       registro parado hace medio ano. */
    if (head) head.textContent = t(vacio ? "mis.title0" : (s.up.length ? "mis.title" : "mis.titlePast"));
    if (lead) {
      if (vacio) lead.textContent = t("mis.lead0");
      else if (!s.up.length && dias > 90)
        lead.textContent = t("mis.lead.stale").replace("{months}", String(Math.round(dias / 30)));
      else lead.textContent = t("mis.lead");
    }

    eventSchema(s.up);
  }

  /* Una seccion que promete algo y no lo tiene frena la pagina entera.
     Misiones se esconde sola mientras no haya ni un evento, y con ella
     sus enlaces del menu, para no dejar anclas que no llevan a nada.
     En cuanto se anada el primer evento a js/events.js, vuelve sola. */
  function toggleMissions() {
    var sec = $("#misiones");
    if (!sec) return;
    var hay = EVENTS.length > 0;
    sec.hidden = !hay;
    $$('a[href="#misiones"]').forEach(function (a) {
      var li = a.closest ? a.closest("li") : a.parentNode;
      (li || a).hidden = !hay;
    });
  }

  function wireMissions() {
    toggleMissions();
    var tabUp = $("#tabUp"), tabPast = $("#tabPast");
    if (!tabUp || !tabPast) return;

    function show(which) {
      var esUp = which === "up";
      tabUp.setAttribute("aria-selected", esUp ? "true" : "false");
      tabPast.setAttribute("aria-selected", esUp ? "false" : "true");
      $("#misUpcoming").hidden = !esUp;
      $("#misPast").hidden = esUp;
      renderMissions();
    }
    tabUp.addEventListener("click", function () { show("up"); });
    tabPast.addEventListener("click", function () { show("past"); });

    var b = $("#misMoreBtn");
    if (b) b.addEventListener("click", function () { pastExpanded = !pastExpanded; renderMissions(); });

    /* Si no hay nada proximo pero si hay historial, se abre en el historial:
       una seccion que arranca vacia parece rota. */
    var s = splitEvents();
    show(!s.up.length && s.past.length ? "past" : "up");
  }

  /* ---------------- Donaciones ---------------- */
  function wireGiving() {
    var online = $("#giveOnline");
    if (online && GIVE.online) {
      online.setAttribute("href", GIVE.online);
      online.hidden = false;
    }
    var zelle = $("#giveZelle"), value = $("#giveZelleValue");
    if (zelle && value && GIVE.zelle) {
      value.textContent = GIVE.zelle;
      zelle.hidden = false;
    }
  }

  /* ---------------- Navegacion ---------------- */
  function wireNav() {
    var header = $("#siteHeader");
    var mobile = $("#mobileNav");
    var openBtn = $("#menuBtn"), closeBtn = $("#menuClose");

    function openMenu() {
      mobile.classList.add("is-open");
      mobile.setAttribute("aria-hidden", "false");
      openBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeMenu() {
      mobile.classList.remove("is-open");
      mobile.setAttribute("aria-hidden", "true");
      openBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    if (openBtn)  openBtn.addEventListener("click", openMenu);
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    $$("#mobileNav a").forEach(function (a) { a.addEventListener("click", closeMenu); });

    /* ---- Ir a una seccion ----
       La pagina mide 15.000 px en el movil. Con scroll-behavior: smooth,
       pulsar "Sabado" desde arriba era mas de dos segundos de vuelo por
       delante de quince pantallas, y cualquier roce o segundo toque
       cancelaba la animacion y dejaba a la persona tirada a medio camino:
       exactamente la sensacion de "le doy y no me lleva".

       Ahora: los saltos cortos siguen deslizandose, que se agradece y
       ayuda a situarse; los largos van directos.

       El umbral bajo de 2,5 pantallas a 0,5 al partir la pagina en cuatro.
       Aquel numero se penso para un desplazamiento de 15.000 px y dentro
       de una parte no se cruzaba nunca.

       Con 1 pantalla quedaba una incoherencia rara: de los 19 enlaces del
       menu movil, 18 saltaban en seco y solo "Cerca de ti" se deslizaba,
       porque era el unico salto mas corto que la pantalla. Y encima
       llegaba tarde: medido, 100 px a los 350 ms y los 92 buenos a los
       1.200. Que un enlace de cada diecinueve se comporte distinto y
       ademas sea el lento no es una atencion, es un despiste.

       A 0,5 se desliza solo lo que de verdad esta a un palmo, que es
       cuando el movimiento ayuda a situarse en vez de hacerse esperar. */
    var SALTO_LARGO = 0.5;          /* en pantallas de alto */

    function suave() {
      try {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      } catch (e) {}
      return true;
    }

    /* Al aterrizar de golpe, lo que hay debajo no puede estar en blanco:
       el observador tarda un fotograma en revelarlo. Se revela la seccion
       de destino entera —es donde caen los ojos— y ademas lo que asome
       por debajo de ella en esa misma pantalla, que si no aparece
       tarde. Mas abajo ya no: de eso se encarga el observador.

       Las medidas se toman antes del salto, pero se comparan unas con
       otras, asi que la distancia entre bloques es la misma antes y
       despues de desplazarse. */
    function revelar(sec) {
      if (sec.classList.contains("reveal")) sec.classList.add("is-visible");
      $$(".reveal", sec).forEach(function (el) { el.classList.add("is-visible"); });
      var caja = sec.closest ? sec.closest(".part") : null;
      if (!caja || caja === sec) return;
      var alto = window.innerHeight || 800;
      var top  = sec.getBoundingClientRect().top;
      $$(".reveal", caja).forEach(function (el) {
        var y = el.getBoundingClientRect().top;
        if (y >= top && y < top + alto) el.classList.add("is-visible");
      });
    }

    /* Abrir una parte no es aterrizar en mitad de ella: se entra por
       arriba. Revelarla entera marcaba de una vez los 41 bloques de la
       parte "fe", 39 de ellos a pantallas de distancia, y con eso la
       aparicion suave al ir bajando dejaba de existir en tres cuartas
       partes del sitio. Lo que hacia falta era que no se viera el
       primer fotograma en blanco, y para eso basta la primera pantalla. */
    function revelarPortada(caja) {
      if (caja.classList.contains("reveal")) caja.classList.add("is-visible");
      var alto = window.innerHeight || 800;
      var top  = caja.getBoundingClientRect().top;
      $$(".reveal", caja).forEach(function (el) {
        if (el.getBoundingClientRect().top < top + alto) el.classList.add("is-visible");
      });
    }

    /* ---- Las cuatro partes ----
       El reparto lo declara el script de la cabecera, que es quien tiene
       que conocerlo antes del primer fotograma. Aqui no se repite: si
       hubiera dos listas acabarian diciendo cosas distintas. */
    var PARTES = window.FAM_PARTES || [];
    var parteDe = window.FAM_PARTE_DE || function () { return null; };

    function parteAbierta() {
      return document.documentElement.getAttribute("data-parte") ||
             (PARTES[0] && PARTES[0].id) || null;
    }

    function abrirParte(p) {
      /* Sin parte no se toca nada. Hay anclas que no son de ninguna, como
         el #main del enlace de saltar al contenido, y apagar por su culpa
         la marca del menu dejaba la cabecera sin decir donde esta uno. */
      if (!p) return false;
      if (p === parteAbierta()) { marcarParte(p); return false; }
      document.documentElement.setAttribute("data-parte", p);
      marcarParte(p);
      /* La parte acaba de pasar de display:none a visible. El observador
         del reveal se entera, pero un fotograma tarde, y ese fotograma
         es justo el que la persona ve al llegar: en blanco. */
      var caja = document.getElementById("parte-" + p);
      if (caja) revelarPortada(caja);
      /* El versiculo no se puede medir con su parte cerrada. En cuanto se
         abre si, y hay que hacerlo ahora: esperar a la siguiente vuelta del
         carrusel serian ocho segundos con la reserva sin poner, y el primer
         cambio de versiculo daria el salto que acabamos de quitar. */
      reservarAltoVerso();
      return true;
    }

    function marcarParte(p) {
      $$("a[data-parte]").forEach(function (a) {
        var suya = a.getAttribute("data-parte") === p;
        a.classList.toggle("is-active", suya);
        if (suya) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }

    /* Salta de golpe y comprueba que ha aterrizado donde tocaba, hasta
       cuatro veces. Hacen falta las dos cosas:
         - si habia un desplazamiento suave en vuelo (porque la persona
           pulso dos veces, o venia de otro enlace), ese sigue corriendo
           despues del salto y arrastra la pagina a medio camino;
         - y si algo de arriba cambia de alto al cargarse, el destino se
           mueve unos pixeles justo despues de llegar.
       Cortar la animacion y volver a medir arregla las dos. */
    function aterrizar(destino, intentos) {
      var y = Math.max(0, destino.getBoundingClientRect().top + window.pageYOffset - 92);
      /* behavior:"auto" NO es instantaneo: quiere decir "lo que mande el
         CSS", y el CSS dice smooth. Hay que apagar la propiedad. */
      var antes = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, window.pageYOffset);   /* corta lo que estuviera en vuelo */
      window.scrollTo(0, y);
      document.documentElement.style.scrollBehavior = antes;
      if (intentos <= 0) return;

      /* La comprobacion se pedia SOLO por requestAnimationFrame, y solo se
         caia al temporizador si el navegador no conocia esa funcion. Pero
         el riesgo nunca fue que no existiera: es que un navegador que no
         esta pintando —pestana de fondo, movil ahorrando bateria, o
         simplemente ocupado— la retrasa todo lo que quiera, y entonces la
         correccion no llega nunca y la persona se queda a medio camino.

         Aviso al que lea esto: NO es lo que causaba el desvio de 55 px que
         perseguimos en agosto de 2026. Aquello era la tarjeta del
         versiculo cambiando de alto sola, y se arreglo arriba, en
         reservarAltoVerso(). Esto de aqui es solo cinturon: la unica via
         de aviso dependia de que el navegador estuviera pintando, y no
         tenia por que.

         Se piden las dos a la vez y vale la que llegue antes; la otra se
         encuentra el trabajo hecho y no hace nada. */
      var yaMirado = false;
      var otra = function () {
        if (yaMirado) return;
        yaMirado = true;
        if (Math.abs(destino.getBoundingClientRect().top - 92) > 2) {
          aterrizar(destino, intentos - 1);
        }
      };
      if (window.requestAnimationFrame) window.requestAnimationFrame(otra);
      setTimeout(otra, 32);
    }

    function irA(destino, id) {
      /* Si el destino vive en otra parte, primero se abre esa parte: de
         lo contrario el enlace apunta a algo que esta en display:none y
         no lleva a ningun sitio. */
      var cambio = abrirParte(parteDe(id));
      revelar(destino);
      var alto = window.innerHeight || 800;
      var lejos = Math.abs(destino.getBoundingClientRect().top) > alto * SALTO_LARGO;

      /* Cambiar de parte no es desplazarse por la pagina, es llegar a
         otra: deslizarse hasta alli seria un vuelo por encima de un
         contenido que ya no esta. Va de golpe. */
      if (cambio || lejos || !suave()) {
        aterrizar(destino, 4);
      } else {
        var y = Math.max(0, destino.getBoundingClientRect().top + window.pageYOffset - 92);
        try { window.scrollTo({ top: y, behavior: "smooth" }); }
        catch (e) { window.scrollTo(0, y); }
      }

      /* pushState y no location.hash: cambiar el hash provocaria un
         segundo salto del navegador encima del que acabamos de hacer. */
      try { history.pushState(null, "", "#" + id); } catch (e) {}

      /* Sin esto, quien navega con teclado sigue con el foco en el menu
         y el siguiente tabulador le devuelve al principio de la pagina. */
      if (!destino.hasAttribute("tabindex")) destino.setAttribute("tabindex", "-1");
      try { destino.focus({ preventScroll: true }); } catch (e) { destino.focus(); }
    }

    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var href = a.getAttribute("href");
      if (!href || href === "#" || a.hasAttribute("data-wa")) return;
      var id = href.slice(1);
      var destino = document.getElementById(id);
      if (!destino || destino.hidden) return;
      e.preventDefault();
      closeMenu();
      irA(destino, id);
    });

    /* El boton de atras del navegador. Cada salto deja un estado en el
       historial, asi que sin esto atras cambiaba la direccion pero
       dejaba en pantalla la parte anterior. */
    window.addEventListener("popstate", function () {
      var id = (window.location.hash || "").replace(/^#/, "");
      var p = parteDe(id) || (PARTES[0] && PARTES[0].id);
      abrirParte(p);
      var destino = id && document.getElementById(id);
      if (destino && !destino.hidden) { revelar(destino); aterrizar(destino, 2); }
      else window.scrollTo(0, 0);
    });

    /* Al cargar: la parte ya la eligio la cabecera, aqui solo se marca
       en el menu. Y si la direccion traia un ancla, el salto que hizo el
       navegador solo se quedo debajo de la cabecera pegajosa. */
    marcarParte(parteAbierta());
    var anclaInicial = (window.location.hash || "").replace(/^#/, "");
    if (anclaInicial) {
      var alLlegar = document.getElementById(anclaInicial);
      if (alLlegar && !alLlegar.hidden) { revelar(alLlegar); aterrizar(alLlegar, 3); }
    }

    window.addEventListener("scroll", function () {
      if (header) header.classList.toggle("is-stuck", window.scrollY > 8);
    }, { passive: true });

    /* Idioma: abrir / cerrar */
    var langBtn = $("#langBtn"), langWrap = $("#langWrap");
    if (langBtn) {
      langBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = langWrap.classList.toggle("is-open");
        langBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    document.addEventListener("click", function (e) {
      if (langWrap && !langWrap.contains(e.target)) closeLangMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeLangMenu();
        closeMenu();
        var sonando = document.querySelector("#stGrid .st-card.is-playing");
        if (sonando) { var v = cerrarVideo(sonando); if (v) v.focus(); }
      }
    });

    /* El menu ya no persigue la seccion visible con un observador: sus
       cuatro enlaces son las cuatro partes, y cual esta abierta se sabe
       con certeza, sin tener que adivinarlo por donde va el scroll. */
  }

  /* Aqui vivia wireFloat(), que retiraba la burbuja de WhatsApp mientras
     el hero estaba a la vista. Quien reviso el sitio lo leyo como que el
     boton se le escapaba —"aparece y desaparece"— y pidio que este
     siempre. Tenia razon: un atajo que va y viene no se aprende, y quien
     no entiende por que desaparecio no vuelve a buscarlo.

     El motivo por el que se escondia era real y esta medido: la burbuja
     se comia el toque del boton "Pide un estudio biblico". Eso no se
     arregla escondiendola, se arregla apartandola; la hoja de estilo le
     deja ahora sitio propio debajo de los botones del hero en las
     pantallas estrechas. tools/test-browser.js comprueba que no se pisan. */

  /* ---------------- Reveal ---------------- */
  function wireReveal() {
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { obs.observe(el); });
  }

  /* ---------------- Arranque ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var theme = store(LS_THEME) ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(theme);

    var themeBtn = $("#themeBtn");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
      });
    }

    buildLangMenu();
    var inicial = detectLang();
    loadLang(inicial, function (ok) {
      applyLang(ok ? inicial : DEFAULT_LANG);
      restartVerses();
    });

    wireNav();
    wireWhatsApp();
    wirePrayerForm();
    wireContactForm();
    renderFormNotes();
    wireGiving();
    wireSabbath();
    renderStories();
    wireNear();
    wireMissions();
    wireReveal();
  });
})();
