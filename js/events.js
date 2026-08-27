/* =========================================================
   Florida Advent Missionaries · Misiones y eventos

   ESTE ES EL UNICO ARCHIVO QUE HAY QUE TOCAR PARA ANADIR,
   CAMBIAR O QUITAR UN EVENTO. No hace falta saber programar.

   ---------------------------------------------------------
   COMO ANADIR UN EVENTO
   ---------------------------------------------------------
   1. Copia uno de los ejemplos comentados de mas abajo.
   2. Pegalo dentro de los corchetes [ ], antes del ultimo ].
   3. Cambia los datos. Cada evento termina con una coma.
   4. Guarda. La pagina lo coloca sola en "proximos" o en
      "ya realizados" comparando la fecha con el dia de hoy.

   Se puede hacer desde el navegador, sin instalar nada:
   github.com/Droko1982/adventflorida  ->  js/events.js
   -> el lapiz de "Edit"  ->  "Commit changes".
   En dos o tres minutos aparece en la web.

   ---------------------------------------------------------
   LOS CAMPOS
   ---------------------------------------------------------
   start   OBLIGATORIO. Fecha de inicio, "AAAA-MM-DD".
           Ejemplo: "2026-11-14" es el 14 de noviembre de 2026.
   end     Opcional. Solo si dura varios dias. Mismo formato.
           Mientras no pase la fecha de "end", sigue en proximos.
   time    Opcional. Hora local, "10:00" o "19:30". 24 horas.
   type    Opcional. Elige UNA de estas palabras:
             "evangelism"  campana, serie de conferencias, predicacion
             "health"      feria de salud, tomas de presion, cocina
             "community"   comida, ropa, ayuda tras un huracan
             "youth"       jovenes, conquistadores, escuela biblica
             "literature"  reparto de libros, El Camino a Cristo
             "prayer"      semana de oracion, vigilia
             "visit"       visita a una iglesia, a un barrio, a un hogar
           Si no pones nada, sale sin etiqueta.
   city    Opcional pero muy recomendable. "Orlando", "Miami"...
   place   Opcional. Nombre del sitio: "Parque Bicentenario".
   title   OBLIGATORIO. El titulo del evento. Ver mas abajo.
   desc    Opcional. Dos o tres frases contando que paso o que va
           a pasar. En los eventos ya realizados es lo que mas se
           lee: cuenta a cuanta gente se llego, no solo el nombre.
   photo   Opcional. Ruta de una foto, por ejemplo
           "assets/eventos/feria-orlando.jpg".
           Sube la foto a assets/eventos/ primero.
           Pide permiso antes de publicar caras de menores.
   link    Opcional. Un enlace para saber mas o inscribirse.

   ---------------------------------------------------------
   LOS IDIOMAS
   ---------------------------------------------------------
   El sitio esta en nueve idiomas, pero NO hace falta escribir
   cada evento nueve veces. Hay dos formas:

   a) Escribe el texto una sola vez, en el idioma que quieras,
      y di cual es con "lang":

        lang:  "es",
        title: "Feria de salud en Orlando",

      La pagina lo muestra tal cual a todo el mundo y avisa con
      una linea pequena en que idioma esta. Es honesto y es lo
      normal: nadie espera que un voluntario traduzca nueve veces.

   b) Si tienes la traduccion de algun idioma, ponla asi:

        title: { es: "Feria de salud", en: "Health expo" },

      Quien lea en espanol vera la espanola, quien lea en ingles
      la inglesa, y el resto vera la del idioma de "lang".

   Los codigos son: en ingles · es espanol · fr frances
   ht criollo haitiano · pt portugues · de aleman · nl neerlandes
   ru ruso · uk ucraniano.

   ---------------------------------------------------------
   EJEMPLOS (copia, pega dentro de los corchetes y edita)
   ---------------------------------------------------------

   {
     start: "2026-11-14",
     time:  "10:00",
     type:  "health",
     city:  "Orlando",
     place: "Barnett Park",
     lang:  "es",
     title: "Feria de salud gratuita",
     desc:  "Toma de presion, azucar y peso sin costo, una clase de cocina sencilla y oracion para quien la pida."
   },

   {
     start: "2026-10-03",
     end:   "2026-10-10",
     type:  "evangelism",
     city:  "Miami",
     lang:  "es",
     title: { es: "Semana de conferencias: la esperanza que queda", en: "Evening series: the hope that is left" },
     desc:  { es: "Ocho noches sobre lo que la Biblia promete cuando todo lo demas falla. Entrada libre.",
              en: "Eight evenings on what the Bible promises when everything else fails. Free entry." }
   },

   {
     start: "2026-06-20",
     type:  "community",
     city:  "Delray Beach",
     lang:  "es",
     title: "Entrega de alimentos",
     desc:  "Repartimos mercados a cuarenta familias del barrio junto con dos iglesias vecinas.",
     photo: "assets/eventos/entrega-delray.jpg"
   },

   ========================================================= */

window.FAM_EVENTS = [

  /* Todavia no hay eventos publicados.
     Borra esta linea y pega aqui el primero. */

];
