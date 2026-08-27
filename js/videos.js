/* =========================================================
   Florida Advent Missionaries · Testimonios en video

   Los videos salen del canal oficial de YouTube:
   youtube.com/@FloridaAdventMissionaries
   Canal: UCpCGMRH8Oj0ES7hg0W2Zc_g

   NO se descarga ni se re-publica ningun video ni ninguna
   foto. La pagina enlaza la miniatura de YouTube y solo
   carga el reproductor cuando alguien pulsa play, con el
   dominio sin cookies (youtube-nocookie.com). Es la forma
   que YouTube ofrece para esto y no expone a nadie.

   ---------------------------------------------------------
   COMO ANADIR UN VIDEO
   ---------------------------------------------------------
   1. Sube el video al canal de YouTube.
   2. Copia el id: en youtube.com/watch?v=ABC123 el id es ABC123.
   3. Copia uno de los bloques de abajo, pegalo al principio
      de la lista (el primero es el que sale destacado) y
      cambia los datos.
   4. Guarda. Se puede hacer desde el navegador:
      github.com/Droko1982/adventflorida -> js/videos.js
      -> el lapiz de "Edit" -> "Commit changes".

   ---------------------------------------------------------
   LOS CAMPOS
   ---------------------------------------------------------
   id       OBLIGATORIO. El id de YouTube, once caracteres.
   title    OBLIGATORIO. El titulo, tal como esta en YouTube.
   person   Opcional. Quien cuenta la historia. Es lo que mas
            mira la gente: un nombre real vale mas que el titulo.
   role     Opcional. Su papel, si lo tiene: "Presidente".
   hook     Opcional. Una o dos frases que den ganas de verlo.
            No cuentes el final.
   lang     Opcional. Idioma en que esta el video y el texto,
            por defecto "en". La pagina lo marca para que un
            lector de pantalla lo pronuncie bien.

   Los titulos y los textos NO hace falta traducirlos a los
   nueve idiomas: son de YouTube y se muestran tal cual.
   ========================================================= */

window.FAM_VIDEOS = [

  {
    id:     "kLoPVmV4sK0",
    title:  "What the Florida Advent Missionaries is all about",
    person: "Pr. Carl James",
    role:   "President",
    hook:   "“If the opportunity ever is given to you to be a missionary, take full advantage of it — your life will never be the same.”",
    lang:   "en"
  },

  {
    id:     "5WG38r5rdb4",
    title:  "An Appetite for Mission",
    person: "Derick Morgan",
    role:   "Vice President",
    hook:   "He grew up on mission stories and longed to travel to far-away countries. He never guessed where that appetite would take him.",
    lang:   "en"
  },

  {
    id:     "Ke_8lT98KAE",
    title:  "From the Abyss of Depression to Mission",
    person: "Sandra Rodríguez",
    hook:   "She had sunk into depression and could find no meaning in life. Then a friend called and said: “No my sister, you have to get up and serve.”",
    lang:   "en"
  },

  {
    id:     "Tb0zuES8LxQ",
    title:  "From Dog Sitting to Mission",
    person: "Alexandra Castillo",
    hook:   "Her boss asked her to look after two Yorkies for the weekend. She drove to another city with no idea what she was driving into.",
    lang:   "en"
  },

  {
    id:     "65mXm3E4oas",
    title:  "From a Motorcycle Accident to the Mission",
    person: "Daniel López",
    hook:   "A successful traveller and content creator who kept ignoring a quiet voice telling him to stop. It took an accident to make him listen.",
    lang:   "en"
  }

];
