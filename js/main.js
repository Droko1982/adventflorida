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
    return fb[key] !== undefined ? fb[key] : key;
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

    /* Titulo y descripcion */
    document.title = "Florida Advent Missionaries · " + t("value.1.t");
    var desc = $("#metaDescription");
    if (desc) desc.setAttribute("content", t("meta.description"));
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
    if (bTitle && meta.book) bTitle.textContent = meta.book.title;
    if (bPdf && meta.book)   bPdf.setAttribute("href", meta.book.pdf);
    if (bRead && meta.book)  bRead.setAttribute("href", meta.book.read);
    /* El criollo haitiano necesita un aviso propio: el libro no existe
       en kreyol, asi que los botones llevan a la edicion francesa. */
    if (bLegal) {
      bLegal.textContent = code === "ht" ? t("book.legalHt")
        : NO_PDF.indexOf(code) !== -1 ? t("book.legalAlt")
        : t("book.legal");
    }

    /* Boton de idioma */
    var flag = $("#langFlag"), lcode = $("#langCode");
    if (flag)  flag.textContent  = meta.flag;
    if (lcode) lcode.textContent = meta.label;
    $$("#langMenu button").forEach(function (b) {
      b.setAttribute("aria-current", b.getAttribute("data-lang") === code ? "true" : "false");
    });

    renderVerse(0);
    renderSabbath();
    renderStories();
    nearRender();
    renderMissions();
    store(LS_LANG, code);
  }

  function known(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return true;
    return false;
  }

  function detectLang() {
    var q = new URLSearchParams(window.location.search).get("lang");
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
      b.innerHTML = '<span class="lang-flag">' + l.flag + '</span>' +
                    '<span class="lang-native"></span>' +
                    '<span class="lang-code">' + l.label + '</span>';
      $(".lang-native", b).textContent = l.native;
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

  function renderVerse(i) {
    var list = verseList();
    if (!list.length) return;
    verseIndex = ((i % list.length) + list.length) % list.length;
    var txt = $("#verseText"), ref = $("#verseRef"), dots = $("#verseDots");
    if (txt) txt.textContent = list[verseIndex].t;
    if (ref) ref.textContent = list[verseIndex].r;

    if (dots) {
      if (dots.children.length !== list.length) {
        dots.innerHTML = "";
        list.forEach(function (_, n) {
          var d = document.createElement("button");
          d.type = "button";
          d.setAttribute("aria-label", "Verse " + (n + 1));
          d.addEventListener("click", function () { renderVerse(n); restartVerses(); });
          dots.appendChild(d);
        });
      }
      Array.prototype.forEach.call(dots.children, function (d, n) {
        d.setAttribute("aria-current", n === verseIndex ? "true" : "false");
      });
    }
  }

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

  function wirePrayerForm() {
    var form = $("#prayerForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#pName").value.trim();
      var city = $("#pCity").value.trim();
      var sel  = $("#pTopic");
      var topic = sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].textContent.trim() : "";
      var msg  = $("#pMsg").value.trim();

      if (!msg) {
        $("#pMsg").focus();
        alert(t("prayer.f.needMsg"));
        return;
      }

      var lines = ["*" + t("wa.prayerIntro") + "*"];
      if (name) lines.push(t("wa.name") + ": " + name);
      if (city) lines.push(t("wa.city") + ": " + city);
      if (topic) lines.push(t("wa.topic") + ": " + topic);
      lines.push(t("wa.request") + ": " + msg);

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
  function playVideo(btn) {
    var wrap = document.createElement("div");
    wrap.className = "st-thumb is-playing";
    var frame = document.createElement("iframe");
    frame.setAttribute("src", "https://www.youtube-nocookie.com/embed/" +
      btn.getAttribute("data-video") + "?autoplay=1&rel=0");
    frame.setAttribute("title", btn.getAttribute("data-title"));
    frame.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    frame.setAttribute("allowfullscreen", "");
    wrap.appendChild(frame);
    btn.parentNode.replaceChild(wrap, btn);
  }

  function renderStories() {
    var grid = $("#stGrid");
    if (!grid || !VIDEOS.length) return;

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
  }

  /* ---------------- Alguien cerca de ti ---------------- */
  var NEAR = window.FAM_NEAR || {};
  var LS_NEAR_LANG = "fam-near-lang";

  function nearRender() {
    var out = $("#nearOut"), selC = $("#nearCity"), selL = $("#nearLang");
    if (!out || !selC || !selL || !window.FAM_SUNSET) return;

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
      selL.appendChild(o);
    });
    selL.value = store(LS_NEAR_LANG) || currentLang;
    if (!selL.value) selL.value = currentLang;

    selC.addEventListener("change", function () { store(LS_CITY, selC.value); nearRender(); });
    selL.addEventListener("change", function () { store(LS_NEAR_LANG, selL.value); nearRender(); });

    nearRender();
  }

  /* ---------------- Misiones y eventos ---------------- */
  var EVENTS = window.FAM_EVENTS || [];
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
    if (ev.type) h += '<span class="ev-type">' + esc(t("ev.type." + ev.type)) + "</span>";
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

  function wireMissions() {
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
      if (e.key === "Escape") { closeLangMenu(); closeMenu(); }
    });

    /* Enlace activo en el menu */
    var links = $$(".main-nav a");
    var sections = links.map(function (a) { return $(a.getAttribute("href")); }).filter(Boolean);
    if ("IntersectionObserver" in window && sections.length) {
      var navObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id);
          });
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach(function (s) { navObs.observe(s); });
    }
  }

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
    wireGiving();
    wireSabbath();
    renderStories();
    wireNear();
    wireMissions();
    wireReveal();
  });
})();
