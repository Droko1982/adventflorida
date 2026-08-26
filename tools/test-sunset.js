#!/usr/bin/env node
/* =========================================================
   test-sunset.js — comprueba js/sabbath.js
   Autor: Dr. Mauricio Rodriguez Herrera

   Uso:
     node tools/test-sunset.js            (comprueba contra valores fijos)
     node tools/test-sunset.js --usno     (ademas consulta al Observatorio
                                           Naval de EE. UU. en linea)

   Los valores de referencia salen de la API oficial del U.S. Naval
   Observatory: https://aa.usno.navy.mil/api/rstt/oneday
   ========================================================= */
"use strict";

global.window = global;
const path = require("path");
const S = require(path.join(__dirname, "..", "js", "sabbath.js"));

/* fecha, ciudad, hora de puesta segun la USNO (hora local del lugar) */
const REFERENCIA = [
  { city: "miami",     y: 2026, m:  8, d: 28, usno: "19:44" },
  { city: "miami",     y: 2026, m:  6, d: 21, usno: "20:15" },
  { city: "miami",     y: 2026, m: 12, d: 21, usno: "17:35" },
  { city: "delray",    y: 2026, m:  8, d: 28, usno: "19:44" },
  { city: "pensacola", y: 2026, m:  8, d: 28, usno: "19:16" },
];

function hhmm(date, tz) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false
  }).format(date);
}
function minutos(s) { return parseInt(s.slice(0, 2), 10) * 60 + parseInt(s.slice(3), 10); }

let fallos = 0;

console.log("1) Puesta de sol contra las tablas del Observatorio Naval\n");
for (const r of REFERENCIA) {
  const c = S.city(r.city);
  const t = S.sunsetInstant(r.y, r.m, r.d, c);
  const mio = hhmm(t, c.tz);
  const dif = minutos(mio) - minutos(r.usno);
  const ok = Math.abs(dif) <= 1;
  if (!ok) fallos++;
  console.log(
    `   ${ok ? "ok  " : "FALLA"} ${(c.name + "              ").slice(0, 15)}` +
    `${r.y}-${String(r.m).padStart(2, "0")}-${String(r.d).padStart(2, "0")}  ` +
    `calculado ${mio}  USNO ${r.usno}  (${dif >= 0 ? "+" : ""}${dif} min)`
  );
}

/* El sabado va de la puesta del viernes a la puesta del sabado.
   Se comprueba en varios momentos de la semana, en hora de Miami. */
console.log("\n2) Ventana del sabado a lo largo de la semana\n");
const c = S.city("miami");
const ESCENARIOS = [
  { nom: "miercoles mediodia",       ms: Date.UTC(2026, 7, 26, 16, 0), dia: 28, activo: false },
  { nom: "viernes antes del ocaso",  ms: Date.UTC(2026, 7, 28, 22, 0), dia: 28, activo: false },
  { nom: "viernes tras el ocaso",    ms: Date.UTC(2026, 7, 28, 23, 45), dia: 28, activo: true  },
  { nom: "sabado por la manana",     ms: Date.UTC(2026, 7, 29, 14, 0), dia: 28, activo: true  },
  { nom: "sabado antes del ocaso",   ms: Date.UTC(2026, 7, 29, 23, 42), dia: 28, activo: true  },
  { nom: "sabado tras el ocaso",     ms: Date.UTC(2026, 7, 29, 23, 50), dia: 4,  activo: false },
  { nom: "domingo mediodia",         ms: Date.UTC(2026, 7, 30, 16, 0), dia: 4,  activo: false },
];
for (const e of ESCENARIOS) {
  const r = S.currentOrNextSabbath(c, new Date(e.ms));
  const dia = parseInt(new Intl.DateTimeFormat("en-GB", { timeZone: c.tz, day: "2-digit" }).format(r.start), 10);
  const ok = dia === e.dia && r.active === e.activo;
  if (!ok) fallos++;
  console.log(
    `   ${ok ? "ok  " : "FALLA"} ${(e.nom + "                        ").slice(0, 26)}` +
    `empieza dia ${String(dia).padStart(2, "0")}  en curso: ${r.active ? "si" : "no"}`
  );
}

/* Florida usa hora del este salvo el Panhandle occidental */
console.log("\n3) Husos horarios y horario de verano\n");
const HUSOS = [
  { city: "orlando",   y: 2026, m: 10, d: 30, esperado: "EDT" },
  { city: "orlando",   y: 2026, m: 11, d:  6, esperado: "EST" },
  { city: "pensacola", y: 2026, m: 10, d: 30, esperado: "CDT" },
  { city: "pensacola", y: 2026, m: 11, d:  6, esperado: "CST" },
];
for (const h of HUSOS) {
  const cc = S.city(h.city);
  const t = S.sunsetInstant(h.y, h.m, h.d, cc);
  const z = new Intl.DateTimeFormat("en-US", { timeZone: cc.tz, timeZoneName: "short" })
    .format(t).split(", ").pop();
  const ok = z === h.esperado;
  if (!ok) fallos++;
  console.log(
    `   ${ok ? "ok  " : "FALLA"} ${(cc.name + "              ").slice(0, 15)}` +
    `${h.y}-${String(h.m).padStart(2, "0")}-${String(h.d).padStart(2, "0")}  ` +
    `${S.formatTime(t, cc.tz)} ${z}`
  );
}

/* Ninguna ciudad puede quedarse sin calculo */
console.log("\n4) Las " + S.cities.length + " ciudades responden\n");
let mudas = 0;
for (const ciudad of S.cities) {
  const r = S.currentOrNextSabbath(ciudad, new Date(Date.UTC(2026, 7, 26, 16, 0)));
  if (!r || !r.start || !r.end || r.end <= r.start) { mudas++; console.log("   FALLA " + ciudad.name); }
}
if (mudas === 0) console.log("   ok   las " + S.cities.length + " devuelven una ventana valida");
else fallos += mudas;

console.log(fallos === 0 ? "\nTodo correcto.\n" : `\n*** ${fallos} comprobacion(es) fallida(s) ***\n`);
process.exit(fallos === 0 ? 0 : 1);
