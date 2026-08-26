/* =========================================================
   Florida Advent Missionaries · Horas del sabado
   Calcula la puesta de sol (algoritmo NOAA) para saber cuando
   empieza y termina el sabado: de puesta a puesta de sol.
   Sin API, sin red: todo se calcula en el navegador.
   Autor: Dr. Mauricio Rodriguez Herrera
   ========================================================= */
(function () {
  "use strict";

  /* Florida esta en dos husos horarios. El Panhandle occidental
     (Escambia, Santa Rosa, Okaloosa, Walton, Holmes, Washington, Bay,
     Jackson y parte de Gulf y Calhoun) va en hora central; el resto,
     en hora del este. Intl resuelve solo el horario de verano. */
  var CITIES = [
    { id: "delray",     name: "Delray Beach",     lat: 26.4615, lon: -80.0728, tz: "America/New_York" },
    { id: "miami",      name: "Miami",            lat: 25.7617, lon: -80.1918, tz: "America/New_York" },
    { id: "hialeah",    name: "Hialeah",          lat: 25.8576, lon: -80.2781, tz: "America/New_York" },
    { id: "lauderdale", name: "Fort Lauderdale",  lat: 26.1224, lon: -80.1373, tz: "America/New_York" },
    { id: "wpb",        name: "West Palm Beach",  lat: 26.7153, lon: -80.0534, tz: "America/New_York" },
    { id: "naples",     name: "Naples",           lat: 26.1420, lon: -81.7948, tz: "America/New_York" },
    { id: "myers",      name: "Fort Myers",       lat: 26.6406, lon: -81.8723, tz: "America/New_York" },
    { id: "keywest",    name: "Key West",         lat: 24.5551, lon: -81.7800, tz: "America/New_York" },
    { id: "orlando",    name: "Orlando",          lat: 28.5383, lon: -81.3792, tz: "America/New_York" },
    { id: "kissimmee",  name: "Kissimmee",        lat: 28.2920, lon: -81.4076, tz: "America/New_York" },
    { id: "lakeland",   name: "Lakeland",         lat: 28.0395, lon: -81.9498, tz: "America/New_York" },
    { id: "tampa",      name: "Tampa",            lat: 27.9506, lon: -82.4572, tz: "America/New_York" },
    { id: "stpete",     name: "St. Petersburg",   lat: 27.7676, lon: -82.6403, tz: "America/New_York" },
    { id: "sarasota",   name: "Sarasota",         lat: 27.3364, lon: -82.5307, tz: "America/New_York" },
    { id: "daytona",    name: "Daytona Beach",    lat: 29.2108, lon: -81.0228, tz: "America/New_York" },
    { id: "ocala",      name: "Ocala",            lat: 29.1872, lon: -82.1401, tz: "America/New_York" },
    { id: "gainesville",name: "Gainesville",      lat: 29.6516, lon: -82.3248, tz: "America/New_York" },
    { id: "jax",        name: "Jacksonville",     lat: 30.3322, lon: -81.6557, tz: "America/New_York" },
    { id: "tallahassee",name: "Tallahassee",      lat: 30.4383, lon: -84.2807, tz: "America/New_York" },
    { id: "panama",     name: "Panama City",      lat: 30.1588, lon: -85.6602, tz: "America/Chicago"  },
    { id: "fwb",        name: "Fort Walton Beach",lat: 30.4058, lon: -86.6187, tz: "America/Chicago"  },
    { id: "pensacola",  name: "Pensacola",        lat: 30.4213, lon: -87.2169, tz: "America/Chicago"  }
  ];

  var RAD = Math.PI / 180;
  function rad(d) { return d * RAD; }
  function deg(r) { return r / RAD; }

  /* Dia juliano a las 0h UT de una fecha civil */
  function julianDay(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100);
    var B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }

  /* Minutos UTC desde medianoche en que se pone el sol.
     Devuelve null si ese dia el sol no se pone (no ocurre en Florida).

     El calculo se hace dos veces: la primera con los elementos solares
     a las 0h UT y la segunda con los del instante estimado. Esa segunda
     pasada corrige el desfase de hasta un minuto que deja el metodo
     directo, y deja el resultado a segundos de las tablas del
     Observatorio Naval de EE. UU. */
  function sunsetMinutesUTC(jd, lat, lonEast) {
    var first = sunsetPass(jd, lat, lonEast);
    if (first === null) return null;
    var refined = sunsetPass(jd + first / 1440, lat, lonEast);
    return refined === null ? first : refined;
  }

  function sunsetPass(jd, lat, lonEast) {
    var t = (jd - 2451545.0) / 36525.0;

    var L0 = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
    if (L0 < 0) L0 += 360;

    var M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
    var e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
    var Mr = rad(M);

    var C = Math.sin(Mr) * (1.914602 - t * (0.004817 + 0.000014 * t))
          + Math.sin(2 * Mr) * (0.019993 - 0.000101 * t)
          + Math.sin(3 * Mr) * 0.000289;

    var trueLong = L0 + C;
    var omega    = 125.04 - 1934.136 * t;
    var lambda   = trueLong - 0.00569 - 0.00478 * Math.sin(rad(omega));

    var secs    = 21.448 - t * (46.8150 + t * (0.00059 - t * 0.001813));
    var e0      = 23 + (26 + secs / 60) / 60;
    var oblCorr = e0 + 0.00256 * Math.cos(rad(omega));

    var decl = Math.asin(Math.sin(rad(oblCorr)) * Math.sin(rad(lambda)));

    /* Ecuacion del tiempo, en minutos */
    var y = Math.tan(rad(oblCorr / 2)); y = y * y;
    var eqTime = 4 * deg(
        y * Math.sin(2 * rad(L0))
      - 2 * e * Math.sin(Mr)
      + 4 * e * y * Math.sin(Mr) * Math.cos(2 * rad(L0))
      - 0.5 * y * y * Math.sin(4 * rad(L0))
      - 1.25 * e * e * Math.sin(2 * Mr)
    );

    /* 90.833 grados: borde superior del disco solar mas refraccion
       atmosferica estandar. Es la definicion de orto y ocaso del
       Observatorio Naval de EE. UU. */
    var zenith = rad(90.833);
    var latR = rad(lat);
    var cosH = (Math.cos(zenith) - Math.sin(latR) * Math.sin(decl)) /
               (Math.cos(latR) * Math.cos(decl));
    if (cosH > 1 || cosH < -1) return null;

    var H = deg(Math.acos(cosH));            /* angulo horario, en grados */
    var solarNoon = 720 - 4 * lonEast - eqTime;
    return solarNoon + 4 * H;
  }

  /* Partes de fecha (ano, mes, dia) de un instante, en un huso dado */
  function partsInTZ(date, tz) {
    var f = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(date);
    var o = {};
    f.forEach(function (p) { if (p.type !== "literal") o[p.type] = parseInt(p.value, 10); });
    if (o.hour === 24) o.hour = 0;
    return o;
  }

  /* Instante UTC de la puesta de sol del dia civil (y,m,d) en ese lugar */
  function sunsetInstant(y, m, d, city) {
    var min = sunsetMinutesUTC(julianDay(y, m, d), city.lat, city.lon);
    if (min === null) return null;
    /* Al minuto mas cercano, como publican las tablas oficiales */
    var ms = Date.UTC(y, m - 1, d) + min * 60000;
    return new Date(Math.round(ms / 60000) * 60000);
  }

  /* Formatea una hora local del lugar, p. ej. "7:42 PM" o "19:42" */
  function formatTime(date, tz, locale) {
    return new Intl.DateTimeFormat(locale || "en-US", {
      timeZone: tz, hour: "numeric", minute: "2-digit"
    }).format(date);
  }

  function formatDate(date, tz, locale) {
    return new Intl.DateTimeFormat(locale || "en-US", {
      timeZone: tz, weekday: "long", month: "long", day: "numeric"
    }).format(date);
  }

  /* Devuelve el sabado que corresponde a "ahora" en esa ciudad:
     el que esta en curso, o el proximo que viene.
     El sabado va de la puesta del viernes a la puesta del sabado. */
  function currentOrNextSabbath(city, now) {
    now = now || new Date();
    var p = partsInTZ(now, city.tz);

    /* Dia de la semana local: 0 domingo ... 5 viernes, 6 sabado */
    var dow = new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay();

    /* Distancia al proximo viernes segun el calendario */
    var deltaToFriday = (5 - dow + 7) % 7;

    /* Se prueba primero el viernes anterior: si su sabado todavia no ha
       terminado, es el sabado en curso y ese es el que hay que devolver.
       Sin esto, un sabado por la manana devolveria el de la semana que viene. */
    for (var back = 1; back >= 0; back--) {
      var offset = deltaToFriday - back * 7;
      var base = new Date(Date.UTC(p.year, p.month - 1, p.day) + offset * 86400000);
      var by = base.getUTCFullYear(), bm = base.getUTCMonth() + 1, bd = base.getUTCDate();

      var start = sunsetInstant(by, bm, bd, city);
      var satD  = new Date(Date.UTC(by, bm - 1, bd) + 86400000);
      var end   = sunsetInstant(satD.getUTCFullYear(), satD.getUTCMonth() + 1, satD.getUTCDate(), city);
      if (!start || !end) continue;

      if (now < end) return { start: start, end: end, active: now >= start };
    }
    return null;
  }

  window.FAM_SUNSET = {
    cities: CITIES,
    city: function (id) {
      for (var i = 0; i < CITIES.length; i++) if (CITIES[i].id === id) return CITIES[i];
      return CITIES[0];
    },
    sunsetInstant: sunsetInstant,
    currentOrNextSabbath: currentOrNextSabbath,
    formatTime: formatTime,
    formatDate: formatDate
  };

  /* Permite probar el calculo con node */
  if (typeof module !== "undefined" && module.exports) module.exports = window.FAM_SUNSET;
})();
