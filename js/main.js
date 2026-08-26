/* =========================================================
   Florida Advent Missionaries · Interacciones
   Tema claro/oscuro · 9 idiomas · WhatsApp · versiculos · video
   Autor: Dr. Mauricio Rodriguez Herrera
   ========================================================= */
(function () {
  "use strict";

  var WA_NUMBER  = "17862392331";           /* +1 786 239 2331 */
  var VIDEO_ID   = "kLoPVmV4sK0";
  var LS_THEME   = "fam-theme";
  var LS_LANG    = "fam-lang";
  var DEFAULT_LANG = "en";

  var LANGS   = window.FAM_LANGS   || [];
  var I18N    = window.FAM_I18N    || {};
  var VERSES  = window.FAM_VERSES  || {};
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
    if (!I18N[code]) code = DEFAULT_LANG;
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

    /* Libro: enlaces e idioma */
    var bTitle = $("#bookTitleLocal");
    var bPdf   = $("#bookPdf");
    var bRead  = $("#bookRead");
    var bLegal = $("#bookLegal");
    if (bTitle && meta.book) bTitle.textContent = meta.book.title;
    if (bPdf && meta.book)   bPdf.setAttribute("href", meta.book.pdf);
    if (bRead && meta.book)  bRead.setAttribute("href", meta.book.read);
    if (bLegal) bLegal.textContent = NO_PDF.indexOf(code) !== -1 ? t("book.legalAlt") : t("book.legal");

    /* Boton de idioma */
    var flag = $("#langFlag"), lcode = $("#langCode");
    if (flag)  flag.textContent  = meta.flag;
    if (lcode) lcode.textContent = meta.label;
    $$("#langMenu button").forEach(function (b) {
      b.setAttribute("aria-current", b.getAttribute("data-lang") === code ? "true" : "false");
    });

    renderVerse(0);
    store(LS_LANG, code);
  }

  function detectLang() {
    var q = new URLSearchParams(window.location.search).get("lang");
    if (q && I18N[q]) return q;
    var saved = store(LS_LANG);
    if (saved && I18N[saved]) return saved;
    var navs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < navs.length; i++) {
      var base = String(navs[i]).toLowerCase().split("-")[0];
      if (I18N[base]) return base;
    }
    return DEFAULT_LANG;
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
      b.setAttribute("role", "menuitem");
      b.innerHTML = '<span class="lang-flag">' + l.flag + '</span>' +
                    '<span class="lang-native"></span>' +
                    '<span class="lang-code">' + l.label + '</span>';
      $(".lang-native", b).textContent = l.native;
      b.addEventListener("click", function () {
        applyLang(l.code);
        closeLangMenu();
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

  /* ---------------- Video (carga diferida) ---------------- */
  function wireVideo() {
    var facade = $("#videoFacade");
    if (!facade) return;
    facade.addEventListener("click", function () {
      var frame = document.createElement("iframe");
      frame.setAttribute("src", "https://www.youtube-nocookie.com/embed/" + VIDEO_ID + "?autoplay=1&rel=0");
      frame.setAttribute("title", t("video.title"));
      frame.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
      frame.setAttribute("allowfullscreen", "");
      frame.setAttribute("loading", "lazy");
      facade.parentNode.replaceChild(frame, facade);
    });
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
    applyLang(detectLang());
    restartVerses();

    wireNav();
    wireWhatsApp();
    wirePrayerForm();
    wireVideo();
    wireReveal();
  });
})();
