/* =========================================================
   Florida Advent Missionaries · A donde ir, ciudad por ciudad

   Este archivo responde las dos preguntas con las que llega
   una persona desconocida: CUANDO y DONDE. La hora del ocaso
   la calcula sola la pagina; lo demas hay que ponerlo aqui.

   Mientras una ciudad no tenga datos, la pagina lo dice con
   franqueza en lugar de inventarse una direccion. Eso es
   mejor que mandar a alguien a un sitio equivocado un sabado
   por la manana.

   ---------------------------------------------------------
   COMO ANADIR UNA CIUDAD
   ---------------------------------------------------------
   Copia el ejemplo, quita las barras de comentario y cambia
   los datos. La clave (la palabra antes de los dos puntos)
   tiene que ser una de las 22 que salen en la lista de abajo.

   Se puede hacer desde el navegador, sin instalar nada:
   github.com/Droko1982/adventflorida  ->  js/near.js
   -> el lapiz de "Edit"  ->  "Commit changes".

   ---------------------------------------------------------
   LOS CAMPOS
   ---------------------------------------------------------
   church   Nombre de la congregacion, tal como esta en la puerta.
   address  Direccion completa, como la escribiria un cartero.
   map      Enlace a Google Maps o Apple Maps. Busca el sitio,
            pulsa "Compartir" y pega el enlace.
   time     Hora a la que empieza el culto principal, "11:00".
            NO la copies de otra iglesia: confirmala.
   langs    Idiomas en los que se predica ahi, como codigos:
            ["es"] o ["en","ht"]. Codigos validos: en es fr ht
            pt de nl ru uk.
   person   Nombre de quien va a esperar fuera a esa persona.
            Solo pon un nombre si esa persona ya dijo que si.
            Si no hay nadie, deja el campo fuera: la pagina
            ensena la direccion igual, sin prometer compania.

   ---------------------------------------------------------
   LAS 22 CLAVES DE CIUDAD
   ---------------------------------------------------------
   delray · miami · hialeah · lauderdale · wpb · naples · myers
   keywest · orlando · kissimmee · lakeland · tampa · stpete
   sarasota · daytona · ocala · gainesville · jax · tallahassee
   panama · fwb · pensacola

   ---------------------------------------------------------
   EJEMPLO (copia, quita las barras y edita)
   ---------------------------------------------------------

   delray: {
     church:  "Delray Beach Seventh-day Adventist Church",
     address: "700 NE 8th Ave, Delray Beach, FL 33483",
     map:     "https://maps.google.com/?q=700+NE+8th+Ave+Delray+Beach+FL",
     time:    "11:00",
     langs:   ["en", "ht"],
     person:  "Marie"
   },

   ========================================================= */

window.FAM_NEAR = {

  /* Todavia no hay ninguna ciudad confirmada.
     Mientras esto siga vacio, la pagina da la hora del ocaso
     (que si es real) y ofrece buscar la iglesia por WhatsApp. */

};
