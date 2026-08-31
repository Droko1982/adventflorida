/* =========================================================
   Florida Advent Missionaries · Idiomas disponibles

   Este archivo es pequeno a proposito: lo descarga todo el
   mundo. Los textos de cada idioma viven en js/lang/<codigo>.js
   y solo se descarga el que la persona esta leyendo.

   book.pdf  enlace directo al PDF de El Camino a Cristo,
             verificado. Si un idioma no lo tiene, se apunta
             a la biblioteca en ese idioma y se anade el
             codigo a FAM_NO_DIRECT_PDF para que la pagina
             lo advierta.
   ========================================================= */
(function () {
  "use strict";

  /* 'flag' ya NO se pinta en ningun sitio. Windows no trae glifo para
     los pares de indicadores regionales: en vez de la bandera escribe
     sus dos letras, y el boton de idioma salia "ES ES", "FR FR",
     "US EN". Se conserva el dato porque guarda que pais se eligio para
     cada lengua (pt->BR, en->US); el dia que se pongan banderas de
     verdad tienen que ser SVG, que no dependen de la tipografia. */
  window.FAM_LANGS = [
    { code: "en", native: "English", label: "EN", flag: "🇺🇸", locale: "en_US",
      book: { title: "Steps to Christ", pdf: "https://media4.egwwritings.org/pdf/en_SC.pdf", read: "https://text.egwwritings.org/book/b108" } },
    { code: "es", native: "Español", label: "ES", flag: "🇪🇸", locale: "es_ES",
      book: { title: "El Camino a Cristo", pdf: "https://media4.egwwritings.org/pdf/es_CC(SC).pdf", read: "https://text.egwwritings.org/book/b1749" } },
    { code: "fr", native: "Français", label: "FR", flag: "🇫🇷", locale: "fr_FR",
      book: { title: "Vers Jésus", pdf: "https://media4.egwwritings.org/pdf/fr_VJ(SC).pdf", read: "https://text.egwwritings.org/book/b235" } },
    { code: "ht", native: "Kreyòl Ayisyen", label: "HT", flag: "🇭🇹", locale: "ht_HT",
      book: { title: "Vers Jésus", pdf: "https://media4.egwwritings.org/pdf/fr_VJ(SC).pdf", read: "https://text.egwwritings.org/book/b235" } },
    { code: "pt", native: "Português", label: "PT", flag: "🇧🇷", locale: "pt_BR",
      book: { title: "Caminho a Cristo", pdf: "https://media4.egwwritings.org/pdf/pt_CC(SC).pdf", read: "https://text.egwwritings.org/book/b11121" } },
    { code: "de", native: "Deutsch", label: "DE", flag: "🇩🇪", locale: "de_DE",
      book: { title: "Der bessere Weg", pdf: "https://media4.egwwritings.org/pdf/de_BW(SC).pdf", read: "https://text.egwwritings.org/book/b801" } },
    { code: "nl", native: "Nederlands", label: "NL", flag: "🇳🇱", locale: "nl_NL",
      book: { title: "Schreden naar Christus", pdf: "https://media4.egwwritings.org/pdf/nl_SC(SC).pdf", read: "https://text.egwwritings.org/book/b11389" } },
    { code: "ru", native: "Русский", label: "RU", flag: "🇷🇺", locale: "ru_RU",
      book: { title: "Путь ко Христу", pdf: "https://media4.egwwritings.org/pdf/ru_%D0%9F%D0%A5(SC).pdf", read: "https://text.egwwritings.org/book/b1718" } },
    { code: "uk", native: "Українська", label: "UK", flag: "🇺🇦", locale: "uk_UA",
      book: { title: "Дорога до Христа", pdf: "https://media4.egwwritings.org/pdf/uk_%D0%94%D0%A5(SC).pdf", read: "https://text.egwwritings.org/book/b11257" } }
  ];

  /* Idiomas sin PDF directo del libro: la pagina lo dice con franqueza */
  /* Ya no queda ninguno: ruso y ucraniano tienen su PDF directo. Se deja
     la lista porque el codigo la sigue usando si algun dia una edicion
     desaparece de egwwritings. */
  window.FAM_NO_DIRECT_PDF = [];

})();
